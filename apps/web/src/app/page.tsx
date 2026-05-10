"use client"
import { useState } from "react";
import { getDatasetProfile } from "../lib/api";
import UploadZone from "../components/dataset/UploadZone";
import { DatasetProfile } from "../lib/types";
export default function Page() {
    const [profile, setProfile] = useState<DatasetProfile | null>(null); 

    async function handleUploadSuccess(datasetId: string) {
        if (!datasetId) return; 
        try {
            const profile = await getDatasetProfile(datasetId); 
            setProfile(profile); 
        } catch (error) {
            console.error("Failed to fetch the profile:", error); 
        }
        
    }
    return (
        <main className="p-8">
            <UploadZone onUploadSuccess={handleUploadSuccess}/> 
            {profile && (
                <div className="mt-6 p-4 border-l-4 border-green-500 bg-gray-50">
                    <h2 className="text-xl font-bold">Dataset Loaded</h2>
                    <p>Rows: <strong>{profile?.row_count}</strong></p>
                    <p>Columns: <strong>{profile?.column_count}</strong></p>
                </div>
            )}
        </main>
    );
}