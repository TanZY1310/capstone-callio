import { UploadCloud } from 'lucide-react';

function RagUpload() {
  return (
    <div className="card bg-base-100 w-full shadow-sm border border-base-200 h-full backdrop-blur-md">
      <div className="card-body p-6">
        <h2 className="card-title text-lg font-bold text-base-content">
          Property Brochure
        </h2>
        <p className="text-xs text-base-content/60">
          Upload property brochures to enhance the AI auto-responder's knowledge base.
        </p>
        
        <div className="mt-2 flex w-full items-center justify-center">
          <label
            htmlFor="rag-dropzone-file"
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-100/50 hover:bg-base-200/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <UploadCloud className="mb-3 h-10 w-10 text-base-content/40" />
              <p className="mb-1 text-sm text-base-content/70">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-base-content/50">PDF files only (Max: 10MB)</p>
            </div>
            <input
              id="rag-dropzone-file"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
            />
          </label>
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-neutral normal-case font-medium text-white shadow-sm w-full lg:w-auto">
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}

export default RagUpload;
