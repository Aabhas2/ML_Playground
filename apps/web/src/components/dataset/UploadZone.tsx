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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];  

        if (!file) return; 

        const validationError = validate(file); 

        // invalid file 
        if (validationError) {
            setError(validationError); 
            setSelectedFile(null);  
            return; 
        }

        // valid file 
        setError(null); 
        setSelectedFile(file); 
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
            <input 
                type="file"
                accept=".csv,.xlsx"
                disabled={isUploading}
                onChange={handleFileChange} 
            />

            {error && (
                <p className="mt-2 text-red-500 text-sm">
                    {error}
                </p>
            )}

            {selectedFile && (
                <div className="mt-4">
                    <p className="font-medium">
                        Selected: {selectedFile.name}
                    </p>

                    <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB 
                    </p>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="mt-3 px-4 py-2 bg-black text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            )} 
        </div>
    )
}