import { useState, useRef, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config/api';

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const ACCEPTED_TYPES = '.ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf,.odt,.ods,.odp,.zip,.rar,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mp3,.wav';

const PresentationUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((selectedFile) => {
    setError(null);
    setStatus(null);
    setProgress(0);

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100 MB limit');
      return;
    }

    setFile(selectedFile);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleFile(selectedFile);
  }, [handleFile]);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setStatus(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('presentation', file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      const result = await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              reject(new Error(JSON.parse(xhr.responseText).message || 'Upload failed'));
            } catch {
              reject(new Error('Upload failed'));
            }
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', `${API_BASE_URL}/api/presentations/upload`);
        xhr.send(formData);
      });

      setStatus('success');
      setProgress(100);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setStatus('error');
    } finally {
      setUploading(false);
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setStatus(null);
    setError(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <div>
      <p className="text-zinc-300 text-sm mb-1 font-medium">
        Upload Your Presentation
      </p>
      <p className="text-muted-foreground text-xs mb-5">
        Upload your presentation for review or discussion. Multiple file formats are supported.
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
          dragging
            ? 'border-green-500/50 bg-green-500/[0.04]'
            : file
              ? 'border-green-500/20 bg-white/[0.02]'
              : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleInputChange}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center py-10 px-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <Upload size={22} className="text-green-400" />
            </div>
            <p className="text-white text-sm font-medium mb-1">
              Drag &amp; Drop your presentation here
            </p>
            <p className="text-muted-foreground text-xs">
              or <span className="text-green-400 underline underline-offset-2">Click to Browse</span>
            </p>
          </div>
        ) : (
          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  status === 'success'
                    ? 'bg-green-500/15 border border-green-500/25'
                    : status === 'error'
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-green-500/10 border border-green-500/15'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : status === 'error' ? (
                    <AlertCircle size={20} className="text-red-400" />
                  ) : (
                    <File size={20} className="text-green-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{formatSize(file.size)}</p>

                  {progress > 0 && progress < 100 && (
                    <div className="mt-3">
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                      </div>
                      <p className="text-green-400 text-[11px] mt-1 font-medium">{progress}% uploaded</p>
                    </div>
                  )}

                  {status === 'success' && (
                    <p className="text-green-400 text-[11px] mt-1 font-medium flex items-center gap-1">
                      <CheckCircle size={11} />
                      Uploaded successfully
                    </p>
                  )}
                  {error && (
                    <p className="text-red-400 text-[11px] mt-1 font-medium">{error}</p>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors duration-200"
              >
                <X size={14} className="text-zinc-500" />
              </button>
            </div>

            {!uploading && status !== 'success' && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={uploading}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={14} />
                Upload Presentation
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationUpload;
