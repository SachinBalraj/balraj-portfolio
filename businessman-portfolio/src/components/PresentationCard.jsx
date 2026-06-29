import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || '';

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getFileTypeLabel = (mimeType) => {
  if (!mimeType) return 'File';
  const map = {
    'application/pdf': 'PDF',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'text/plain': 'TXT',
    'application/zip': 'ZIP',
    'application/x-rar-compressed': 'RAR',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WEBP',
    'video/mp4': 'MP4',
    'video/quicktime': 'MOV',
    'audio/mpeg': 'MP3',
  };
  return map[mimeType] || mimeType.split('/').pop().toUpperCase();
};

const PresentationCard = ({ presentation, index }) => {
  const fileUrl = presentation.fileUrl ? `${API_BASE}${presentation.fileUrl}` : null;
  const ext = getFileTypeLabel(presentation.fileType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-green-500/[0.04] hover:border-green-500/20 transition-all duration-500 p-5 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center">
          <FileText size={18} className="text-green-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-white font-semibold text-sm truncate">{presentation.title}</h4>
          {presentation.createdAt && (
            <span className="text-zinc-500 text-[10px]">{formatDate(presentation.createdAt)}</span>
          )}
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase tracking-wider">
          {ext}
        </span>
      </div>

      {presentation.description && (
        <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
          {presentation.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-2">
        {presentation.fileSize > 0 && (
          <span className="text-zinc-500 text-[10px]">{formatSize(presentation.fileSize)}</span>
        )}
        {presentation.fileName && (
          <span className="text-zinc-500 text-[10px] truncate ml-1">{presentation.fileName}</span>
        )}
      </div>

      {fileUrl ? (
        <a
          href={fileUrl}
          download={presentation.fileName}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-xs w-fit"
        >
          <Download size={12} />
          Download / Open
        </a>
      ) : (
        <span className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] text-zinc-500 rounded-xl border border-white/[0.04] text-xs w-fit cursor-default">
          Unavailable
        </span>
      )}
    </motion.div>
  );
};

export default PresentationCard;
