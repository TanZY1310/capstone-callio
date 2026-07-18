import { useState, useEffect } from 'react';
import { UploadCloud, File, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

function RagUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get('/rag/files');
        if (response.data && response.data.files) {
          setUploadedFiles(response.data.files);
        }
      } catch (error) {
        console.error('Failed to fetch uploaded files:', error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== e.target.files.length) {
        toast.error('Only PDF files are allowed');
      }
      
      // Prevent duplicates by checking name and size
      const uniqueNewFiles = newFiles.filter(newFile => 
        !selectedFiles.some(existingFile => 
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
      );
      
      setSelectedFiles(prev => [...prev, ...uniqueNewFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      await api.post('/rag/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFiles(prev => [...prev, ...selectedFiles.map(f => ({ name: f.name }))]);
      setSelectedFiles([]);
      document.getElementById('rag-upload-modal').close();
      toast.success(`${selectedFiles.length} document(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploaded = async (fileName) => {
    try {
      await api.delete(`/rag/delete/${encodeURIComponent(fileName)}`);
      setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document. Please try again.');
    }
  };

  const openModal = () => {
    document.getElementById('rag-upload-modal').showModal();
  };

  const closeModal = () => {
    document.getElementById('rag-upload-modal').close();
    setSelectedFiles([]);
  };

  return (
    <div className="card bg-base-100 w-full shadow-sm border border-base-200 h-full backdrop-blur-md flex flex-col">
      <div className="card-body p-6 flex flex-col h-full justify-between">
        <div>
          <h2 className="card-title text-lg font-bold text-base-content">
            Property Brochure
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Upload property brochures to enhance the AI auto-responder's knowledge base.
          </p>
        </div>
        
        {/* Uploaded Files Table or Placeholder */}
        <div className="mt-4 flex-1 flex flex-col overflow-hidden">
          {uploadedFiles.length > 0 ? (
            <div className="overflow-x-auto border border-base-200 rounded-xl max-h-48 overflow-y-auto">
              <table className="table table-sm table-pin-rows">
                <thead className="bg-base-200/50">
                  <tr>
                    <th>File Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, idx) => (
                    <tr key={idx} className="hover:bg-base-200/30">
                      <td>
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-primary shrink-0" />
                          <div className="tooltip tooltip-right z-50 before:max-w-[250px] before:content-[attr(data-tip)]" data-tip={file.name}>
                            <span className="text-xs truncate max-w-[120px] sm:max-w-[150px] block cursor-pointer">{file.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="badge bg-success-icon text-white badge-sm border-none">Active</span>
                          <button 
                            className="btn btn-ghost btn-xs btn-circle text-error-icon/70 hover:text-error-icon hover:bg-error-icon/10"
                            onClick={() => handleDeleteUploaded(file.name)}
                            title="Delete Document"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl bg-base-100/50 p-6">
              <UploadCloud className="mb-3 h-10 w-10 text-base-content/20" />
              <p className="text-sm font-medium text-base-content/50 text-center">
                Click the button below to upload documents
              </p>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <button 
            onClick={openModal}
            className="btn bg-base-content text-base-100 hover:bg-base-content/80 border-none normal-case font-medium shadow-sm w-full lg:w-auto"
          >
            Upload Document
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <dialog id="rag-upload-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box p-6">
          <h3 className="font-bold text-lg mb-4 text-base-content">Upload PDFs</h3>
          
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="modal-dropzone-file"
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-100/50 hover:bg-base-200/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <UploadCloud className="mb-2 h-8 w-8 text-primary/70" />
                <p className="mb-1 text-sm text-base-content/70">
                  <span className="font-semibold text-primary">Click to upload</span> multiple files
                </p>
                <p className="text-xs text-base-content/50">PDF files only</p>
              </div>
              <input
                id="modal-dropzone-file"
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* File List */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto pr-1">
              <h4 className="text-xs font-semibold text-base-content/70 uppercase mb-2">Selected Files</h4>
              <ul className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-base-200/50 p-2 rounded-lg border border-base-300">
                    <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
                      <File className="h-4 w-4 text-primary shrink-0" />
                      <div className="tooltip tooltip-right z-50 truncate before:max-w-[250px] before:content-[attr(data-tip)]" data-tip={file.name}>
                        <span className="text-xs text-base-content cursor-pointer">{file.name}</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-error-icon shrink-0"
                      onClick={() => removeFile(idx)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-action mt-6 gap-2">
            <button 
              className="btn btn-ghost" 
              onClick={closeModal}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedFiles([])}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default RagUpload;
