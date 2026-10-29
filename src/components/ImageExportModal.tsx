import React, { useState } from 'react';
import { X, Copy, Download, Check, AlertCircle } from 'lucide-react';

interface ImageExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName: string;
}

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function ImageExportModal({
  isOpen,
  onClose,
  imageUrl,
  fileName,
}: ImageExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  if (!isOpen || !imageUrl) return null;

  const handleCopyImage = async () => {
    try {
      setCopyNotice(null);
      const blob = dataURLtoBlob(imageUrl);
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type || 'image/png']: blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        throw new Error('ClipboardItem not supported');
      }
    } catch (err) {
      console.warn('Copy image error:', err);
      setCopyNotice(
        'Trình duyệt chưa hỗ trợ tự động copy vào bộ nhớ tạm. Hãy chạm giữ vào ảnh bên dưới rồi chọn "Sao chép" hoặc bấm nút "Tải ảnh"!'
      );
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.download = fileName || 'BaoCao_VanHanh.png';
      link.href = imageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Ảnh Báo Cáo Hoàn Chỉnh
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Bấm copy hoặc chạm giữ vào ảnh để lưu/gửi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors -mr-1"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tip / Mẹo gửi nhanh Banner */}
        <div className="bg-[#fef9ee] border-y border-amber-200/70 p-4 flex gap-3 text-amber-950 text-sm leading-relaxed shrink-0">
          <div className="text-amber-600 mt-0.5 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-amber-950 text-base">Mẹo gửi nhanh:</p>
            <p className="text-slate-800 text-[13.5px] leading-snug">
              Bấm nút <strong className="font-bold text-indigo-700">"Copy ảnh"</strong> để dán trực tiếp vào Zalo/Tin nhắn, hoặc chạm và giữ ngón tay vào ảnh bên dưới trong 1-2 giây rồi chọn <strong className="font-bold text-slate-950">"Sao chép" (Copy)</strong> / <strong className="font-bold text-slate-950">"Lưu vào Ảnh"</strong>.
            </p>
          </div>
        </div>

        {copyNotice && (
          <div className="bg-amber-100 border-b border-amber-300 p-3 text-amber-900 text-xs font-medium flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{copyNotice}</span>
          </div>
        )}

        {/* Image Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/90 flex justify-center items-start min-h-[180px]">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden w-full max-w-full">
            <img
              src={imageUrl}
              alt="Báo cáo hoàn chỉnh"
              className="w-full h-auto block select-auto"
              style={{
                WebkitTouchCallout: 'default',
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-3 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            {/* Copy Button */}
            <button
              onClick={handleCopyImage}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 font-semibold rounded-2xl shadow-sm transition-all active:scale-[0.98] ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Đã copy ảnh!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy ảnh</span>
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl border border-slate-300 shadow-sm transition-all active:scale-[0.98]"
            >
              {downloaded ? (
                <>
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Đã tải ảnh!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Tải ảnh</span>
                </>
              )}
            </button>
          </div>

          {/* Close text button */}
          <button
            onClick={onClose}
            className="w-full py-2 text-center text-slate-600 hover:text-slate-900 font-semibold text-base transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
