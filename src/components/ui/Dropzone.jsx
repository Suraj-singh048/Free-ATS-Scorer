import React, { useState, useRef } from 'react';

const Dropzone = ({
  onDrop,
  accept = '.pdf,.docx,.txt',
  maxSize = 5 * 1024 * 1024,
  file = null,
  files = [],
  onRemove,
  multiple = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file) => {
    setError(null);

    if (file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
      return false;
    }

    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Only ${acceptedTypes.join(', ')} files are accepted`);
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const valid = droppedFiles.filter(validateFile);
      if (valid.length > 0) {
        if (multiple) {
          onDrop(valid);
        } else {
          onDrop(valid[0]);
        }
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const valid = selectedFiles.filter(validateFile);
      if (valid.length > 0) {
        if (multiple) {
          onDrop(valid);
        } else {
          onDrop(valid[0]);
        }
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
      return (
        <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (extension === 'docx' || extension === 'doc') {
      return (
        <svg className="w-8 h-8 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const activeFileList = multiple ? files : file ? [file] : [];

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {activeFileList.length === 0 ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8
            cursor-pointer transition-all duration-200 text-center
            ${
              isDragging
                ? 'border-brand-600 bg-brand-50/50 scale-[1.01]'
                : error
                ? 'border-rose-400 bg-rose-50/40'
                : 'border-slate-300 bg-slate-50/60 hover:border-brand-500 hover:bg-slate-100/80'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-white rounded-full shadow-xs border border-slate-200">
              <svg
                className={`w-10 h-10 ${isDragging ? 'text-brand-600' : error ? 'text-rose-600' : 'text-slate-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-base font-bold text-slate-900">
                {isDragging ? 'Release to upload resume(s)' : multiple ? 'Drop candidate resume files (up to 10) or click to browse' : 'Drop your resume file here or click to browse'}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Supported formats: <span className="font-bold text-slate-800">PDF, DOCX, TXT</span> (Max {(maxSize / (1024 * 1024)).toFixed(0)}MB per file)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {activeFileList.map((f, idx) => (
            <div key={idx} className="border border-slate-300 rounded-xl p-3 bg-slate-50 shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(f.name)}
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{f.name}</p>
                  <p className="text-xs font-semibold text-slate-600">{formatFileSize(f.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove && onRemove(idx)}
                className="text-slate-500 hover:text-rose-700 transition-colors p-1.5 rounded-full hover:bg-rose-100/80 focus:outline-none"
                aria-label="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {multiple && activeFileList.length < 10 && (
            <button
              type="button"
              onClick={handleClick}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              + Add More Resumes ({activeFileList.length}/10)
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-bold text-rose-700 flex items-center">
          <svg className="w-4 h-4 mr-1 text-rose-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropzone;
