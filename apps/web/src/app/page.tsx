"use client"
import { useState } from "react";
import { getDatasetProfile } from "../lib/api";
import UploadZone from "../components/dataset/UploadZone";
import { DatasetProfile } from "../lib/types";
import DatasetSummary from "../components/dataset/DatasetSummary";
import PreviewTable from "../components/dataset/PreviewTable";
import ColumnTable from "../components/dataset/ColumnTable";
import ColumnInsightCard from "../components/dataset/ColumnInsightCard";

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
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
                {/* Upload Section */}
                {view === "upload" && (
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                        <h2 className="text-2xl font-semibold">Upload Dataset</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Upload a CSV or XLSX file to profile and explore your dataset. 
                        </p>
                        <div className="mt-6">
                            <UploadZone onUploadSuccess={handleUploadSuccess} />
                        </div>
                    </section>
                )}

                {view === "loading" && (
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                        <h2 className="text-2xl font-semibold">Analyzing Dataset</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Profiling in progress. This may take a few seconds.
                        </p>
                    </section>
                )}

                {view === "profile" && profile && (
                    <div className="space-y-10">
                        {/* Dataset Overview */}
                        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                            <h2 className="text-2xl font-semibold">Dataset Overview</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Quick summary of rows, columns, and dataset metadata. 
                            </p>
                            <div className="mt-6">
                                <DatasetSummary 
                                    datasetId={profile.dataset_id}
                                    rowCount={profile.row_count}
                                    columnCount={profile.column_count}
                                />
                            </div>
                        </section>

                        {/* Column Profiling Table */}
                        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                            <h2 className="text-2xl font-semibold">Column Profiling</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Column types, missing values, uniqueness, and key stats. 
                            </p>
                            <div className="mt-6">
                                <ColumnTable columns={profile.columns} /> 
                            </div>
                        </section>

                        {/* Column Insights Cards */}
                        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                            <h2 className="text-2xl font-semibold">Column Insights</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Detailed stats and top values for each feature. 
                            </p>
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {profile.columns.map((col) => (
                                    <ColumnInsightCard key={col.name} column={col} /> 
                                ))}
                            </div>
                        </section>

                        {/* Dataset Preview */} 
                        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                            
                            <h2 className="text-2xl font-semibold">Dataset Preview</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Raw rows preview for quick inspection. 
                            </p>
                            <div className="mt-6">
                                <PreviewTable previewRows={profile.preview_rows} /> 
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    )
}