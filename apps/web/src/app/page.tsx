"use client"
import { useState } from "react";
import { getDatasetProfile } from "../lib/api";
import UploadZone from "../components/dataset/UploadZone";
import { DatasetProfile } from "../lib/types";
import DatasetSummary from "../components/dataset/DatasetSummary";
import PreviewTable from "../components/dataset/PreviewTable";
import ColumnTable from "../components/dataset/ColumnTable";

export default function Page() {
    type PageView = "upload" | "loading" | "profile";
    const [view, setView] = useState<PageView>("upload")
    const [profile, setProfile] = useState<DatasetProfile | null>(null); 
    const [isFetchingProfile, setIsFetchingProfile] = useState(false); 


    async function handleUploadSuccess(datasetId: string) {
        if (!datasetId) return; 
        setIsFetchingProfile(true);
        setView("loading");
        try {
            const profile = await getDatasetProfile(datasetId); 
            console.log(profile.columns[0]);
            setProfile(profile); 
            setView("profile");
        } catch (error) {
            console.error("Failed to fetch the profile:", error); 
            setView("upload");
        } finally {
            setIsFetchingProfile(false);
        }
        
    }
    return (
        <main className="p-8">
            {view === "upload" && <UploadZone onUploadSuccess={handleUploadSuccess} />} 
            {view === "loading" && <p>Analyzing dataset...</p>}
            {view === "profile" && profile && (
                <>
                    <DatasetSummary
                        datasetId={profile.dataset_id}
                        rowCount={profile.row_count}
                        columnCount={profile.column_count}
                    />
                    <PreviewTable previewRows={profile.preview_rows} /> 
                    <ColumnTable columns={profile.columns} />
                </>
            )}
        </main>
    );
}