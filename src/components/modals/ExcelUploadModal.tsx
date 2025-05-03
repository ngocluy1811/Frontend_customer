import React, { useState } from 'react';
import { UploadIcon, XIcon, FileTextIcon } from 'lucide-react';
interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}
const ExcelUploadModal = ({
  isOpen,
  onClose,
  onUpload
}: ExcelUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  if (!isOpen) return null;
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(droppedFile);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-orange-500" />
            Tải lên file Excel
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`} onDragOver={e => {
        e.preventDefault();
        setIsDragging(true);
      }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
          <div className="flex flex-col items-center gap-4">
            <UploadIcon className={`h-12 w-12 ${isDragging ? 'text-orange-500' : 'text-gray-400'}`} />
            <div>
              <p className="font-medium">
                Kéo thả file Excel hoặc{' '}
                <label className="text-orange-500 cursor-pointer hover:underline">
                  chọn file
                  <input type="file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Chỉ chấp nhận file Excel (.xlsx)
              </p>
            </div>
          </div>
        </div>
        {file && <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
              <XIcon className="h-4 w-4" />
            </button>
          </div>}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Hủy
          </button>
          <button onClick={() => file && onUpload(file)} disabled={!file} className={`px-4 py-2 rounded-lg text-white ${file ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}>
            Tải lên
          </button>
        </div>
      </div>
    </div>;
};
export default ExcelUploadModal;