from sqlalchemy.dialects.postgresql.base import ReflectedDomain
import numpy as np 
import pandas as pd 
from typing import Dict, Any, List 
from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression, LogisticRegression 
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score 
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix 

from app.schemas.model import ModelTrainRequest 

class ModelService: 
    def train_model(self, df: pd.DataFrame, req: ModelTrainRequest) -> Dict[str, Any]: 
        if req.target_column not in df.columns: 
            raise ValueError(f"Target column '{req.target_column}' does not exist in dataset.")

        # Preprocessing and cleaning 
        # Drop rows where target is missing 
        df_clean = df.dropna(subset=[req.target_column]) 
        if len(df_clean) < 10: 
            raise ValueError("Dataset has too few samples for training (less than 10).") 

        y = df_clean[req.target_column] 
        X = df_clean.drop(columns=[req.target_column]) 

        # Exclude non-numeric columns for feature set 
        X = X.select_dtypes(include=[np.number]) 
        if X.empty: 
            raise ValueError("No numeric features available for training. Ensure you encode categorical variables.") 

        # Impute missing values in features with median 
        X = X.fillna(X.median()) 
        features_used = X.columns.tolist()  

        # Train test split 
        X_train, X_test, y_train, y_test = train_test_split(
            X,y, train_size=req.train_split, random_state=42
        )

        # Model Selection 
        model = None 
        if req.task_type == "regression": 
            if req.algorithm == "linear_regression": 
                model = LinearRegression()  
            elif req.algorithm == "random_forest": 
                model = RandomForestRegressor(n_estimators=100, random_state=42) 
            elif req.algorithm == "gradient_boosting": 
                model = GradientBoostingRegressor(random_state=42) 
            else: 
                raise ValueError(f"Unsupported regression algorithm: {req.algorithm}") 

        elif req.task_type == "classification": 
            if y_train.nunique() > 20: 
                raise ValueError("Target column has too many unique values for a classification task.")           
            
            if req.algorithm == "logistic_regression": 
                model = LogisticRegression(max_iter=1000, random_state=42) 
            elif req.algorithm == "random_forest": 
                model = RandomForestClassifier(n_estimators=100, random_state=42) 
            elif req.algorithm == "gradient_boosting": 
                model = GradientBoostingClassifier(random_state=42) 
            else: 
                raise ValueError(f"Unsupported classification algorithm: {req.algorithm}") 

        else: 
            raise ValueError(f"Unsupported task type: {req.task_type}") 

        # Training 
        model.fit(X_train, y_train) 

        # Inference & Evaluation 
        preds = model.predict(X_test) 
        metrics = {} 
        if req.task_type == "regression": 
            metrics = {
                "rmse": float(np.sqrt(mean_squared_error(y_test, preds))), 
                "mae": float(mean_absolute_error(y_test, preds)), 
                "r2": float(r2_score(y_test, preds)) 
            }
        else: 
            cm = confusion_matrix(y_test, preds) 
            # Find unique class labels for sorting confusion matrix 
            classes = sorted(y_train.unique().tolist()) 

            metrics = {
                "accuracy": float(accuracy_score(y_test, preds)),
                "precision": float(precision_score(y_test, preds, average="macro", zero_division=0)), 
                "recall": float(recall_score(y_test, preds, average="macro", zero_division=0)), 
                "f1": float(f1_score(y_test, preds, average="macro", zero_division=0)), 
                "confusion_matrix": cm.tolist(), 
                "classes": [str(c) for c in classes]
            }

        # Extract feature importance / Weights 
        importances = [] 
        if hasattr(model, "feature_importances_"): 
            weights = model.feature_importances_ 
        elif hasattr(model, "coef_"): 
            # Linear model: take abs weigt coefficients as importances 
            if req.task_type == "classification" and len(model.coef_) > 1: 
                # Multi-class coefficients: average abs weight across classes 
                weights = np.mean(np.abs(model.coef_), axis=0) 
            else: 
                weights = np.abs(model.coef_.flatten()) 
            
        else: 
            weights = np.zeros(len(features_used)) 

        # Normalize weights to sum up to 1 for clean relative metrics 
        total_weight = np.sum(weights) 
        if total_weight > 0: 
            weights = weights / total_weight 

        for col, weight in zip(features_used, weights): 
            importances.append({
                "feature": col, 
                "importance": float(weight) 
            })

        # Sort in descending order of weight 
        importances = sorted(importances, key=lambda x: x["importance"], reverse=True) 

        return {
            "task_type": req.task_type, 
            "algorithm": req.algorithm, 
            "metrics": metrics, 
            "feature_importances": importances, 
            "target_column": req.target_column, 
            "features_used": features_used 
        }