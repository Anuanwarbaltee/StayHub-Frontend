import React, { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import { showAlert } from '@/app/redux/reducers/alertSlice';
import { useAppDispatch } from '@/app/redux/hook/hooks';
// import axios from 'axios'; // You'll need this for the upload call

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  onRemove: (url: string) => void;
  value: string[]; // These are the URLs stored in the parent state
}

const ImageUpload = ({ onUploadComplete, onRemove, value }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // 1. Prepare FormData for the upload API
      const uploadData = new FormData();
      files.forEach(file => uploadData.append('images', file));
      let response: any = await apiFetch("hotel/upload-files", {
        method: "POST",
        auth: true,
        body: uploadData,
        isformdata: true,
      });

      if (response?.success) {
        dispatch(showAlert({
          type: 'success',
          message: response?.message || "Successfuly Uploaded."
        }));
        onUploadComplete(response?.data); // Assuming the API returns { urls: string[] }
      } else {
        dispatch(showAlert({
          type: 'error',
          message: response?.Error || "Failed to upload images. Please try again."
        }));
      }

    } catch (error) {
      console.error("Upload failed:", error);
      dispatch(showAlert({
        type: 'error',
        message: "Failed to upload images. Please try again."
      }));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2 text-blue-600">
        <UploadCloud size={20} />
        <h2 className="font-semibold text-slate-900">Hotel Images</h2>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Trigger / Dropzone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group 
          ${isUploading ? 'bg-slate-100 border-slate-300 cursor-not-allowed' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="text-blue-600 animate-spin mb-2" size={32} />
            <p className="text-sm font-medium text-slate-600">Uploading to server...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="text-blue-600" size={24} />
            </div>
            <p className="text-sm font-medium text-slate-900">Click to upload images</p>
            <p className="text-xs text-slate-500 mt-1">Images will be hosted immediately</p>
          </>
        )}
      </div>

      {/* Gallery of Hosted URLs */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {value.map((url, index) => (
            <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border border-slate-200">
              <img src={url} alt="Hotel" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageUpload;