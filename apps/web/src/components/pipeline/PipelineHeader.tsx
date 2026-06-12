"use client"; 

type PipelineHeaderProps = {
    pipelineName: string; 
    datasetId: string; 
    operationCount: number; 
    status: string; 
    isRunning: boolean; 
    onRun: () => void;  
}; 

export default function PipelineHeader({
    pipelineName, 
    datasetId, 
    operationCount, 
    status, 
    isRunning, 
    onRun, 
}: PipelineHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h2 className="text-2xl font-semibold">{pipelineName}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                    Dataset: <span className="font-mono text-zinc-300">{datasetId}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                    {operationCount} operation{operationCount === 1 ? "" : "s"} . Status: {" "}
                    <span className="capitalize text-zinc-300">{status}</span>
                </p>
            </div>

            <button
                type="button" 
                onClick={onRun} 
                disabled={isRunning || operationCount === 0}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isRunning ? "Running..." : "Run Pipeline"}
            </button>
        </div>
    );
}