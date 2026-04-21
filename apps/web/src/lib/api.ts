import { DatasetUploadResponse, DatasetProfile } from "./types";

const BASE_URL = "http://127.0.0.1:8000";

export async function uploadDataset(file: File): Promise<DatasetUploadResponse> {
    const formData = new FormData(); 
    formData.append("dataset", file); 

    const response = await fetch(`${BASE_URL}/datasets/upload`, {
        method: "POST",
        body: formData, 
    });

    if (!response.ok) {
        throw new Error("Failed to upload the dataset!");
    }
    return response.json(); 
}

export async function getDatasetProfile(datasetId: string): Promise<DatasetProfile> {
    const response = await fetch (`${BASE_URL}/datasets/${datasetId}/profile`)

    if (!response.ok) {
        throw new Error("Failed to fetch dataset profile")
    }

    return response.json();
}