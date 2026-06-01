"use client"; 

import { useState } from "react";
import { uploadDataset } from "@/src/lib/api";

interface UploadZoneProps {
    onUploadSuccess: (datasetId: string) => void; 
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; //50MB
 
function validate(file: File): string | null  {
    const ext = file.name.split(".").pop()?.toLowerCase(); 

    // extension validation 
    if (ext !== "csv" && ext !== "xlsx") {
        return "Only .csv and .xlsx files are supported."
    }
    // size validation 
    if (file.size > MAX_FILE_SIZE) {
        return "File size must be under 50MB";
    }

    return null;
}

export default function UploadZone({
    onUploadSuccess, 
}: UploadZoneProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [isUploading, setIsUploading] = useState(false) 
    const [error, setError] = useState<string | null>(null); 
    const [isDragging, setIsDragging] = useState(false);

    function applyFile(file: File) {
        const validationError = validate(file); 
        if (validationError) {
            setError(validationError); 
            setSelectedFile(null); 
            return; 
        }
        setError(null); 
        setSelectedFile(file); 
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault(); 
        setIsDragging(true); 
    }

    function handleDragLeave() {
        setIsDragging(false); 
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault() 
        setIsDragging(false); 
        const file = e.dataTransfer.files?.[0]; 
        if (file) {
            applyFile(file); 
        }
    }
    
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];  
        if (!file) return; 
        applyFile(file); 
    }

    async function handleUpload() {
        if (!selectedFile) {
            setError("No file selected"); 
            return;
        }

        try {
            setIsUploading(true); 
            setError(null); 

            const result = await uploadDataset(selectedFile);  
            console.log(result); 
            onUploadSuccess(result.dataset_id); 
        } catch (error) {
            console.error(error); 
            setError("Failed to upload the file"); 
        } finally {
            setIsUploading(false); 
        }
    }

    return (
        <div className="p-6 border rounded-lg">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={[
                    "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition",
                    isDragging 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-zinc-700",
                ].join(" ")}
            >
                <p className="font-medium">Drag and drop a CSV or XLSX here</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                    or click to browse
                </p>
                <label htmlFor="upload-input" className="mt-4 inline-flex cursor-pointer items-center rounded bg-black px-4 py-2 text-white">
                    Choose File 
                </label>
                <input 
                    type="file" 
                    id="upload-input"
                    accept=".csv,.xlsx"
                    disabled={isUploading}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            {selectedFile && (
                <div className="mt-4">
                    <p className="font-medium">Selected: {selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="mt-3 rounded bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            )}
        </div>
    );
}