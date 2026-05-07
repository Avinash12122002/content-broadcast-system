"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileImage } from "lucide-react";
import { cn, formatFileSize } from "@/utils/helpers";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

export function DropzoneUpload({ onFileChange, error }) {
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const onDrop = useCallback(
    (accepted, rejected) => {
      if (rejected.length > 0) return;
      const file = accepted[0];
      if (!file) return;
      setFileInfo(file);
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/gif": [] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const removeFile = () => {
    setPreview(null);
    setFileInfo(null);
    onFileChange(null);
  };

  if (preview && fileInfo) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100">
          <FileImage className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-gray-600 truncate flex-1">
            {fileInfo.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatFileSize(fileInfo.size)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50",
          error && "border-red-300 bg-red-50",
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud
          className={cn(
            "w-10 h-10 mx-auto mb-3",
            isDragActive ? "text-indigo-500" : "text-gray-400",
          )}
        />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive ? "Drop it here!" : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 10MB</p>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
