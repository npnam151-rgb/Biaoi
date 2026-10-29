import React, { useState } from 'react';
import { X, Check, Save, RotateCcw, ExternalLink } from 'lucide-react';

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (newUrl: string) => void;
  defaultUrl: string;
}

export function WebhookSettingsModal({
  isOpen,
  onClose,
  currentUrl,
  onSave,
  defaultUrl,
}: WebhookSettingsModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setUrl(defaultUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cấu hình Google Sheets Webhook</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              URL Web App của Google Apps Script nhận dữ liệu các loại báo cáo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Các sheet tự động tương ứng theo báo cáo:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
              <li>BC Vận Hành ➔ Sheet <strong className="text-indigo-700">BC Vận hành</strong></li>
              <li>BC Bếp ➔ Sheet <strong className="text-amber-700">BC Bếp</strong></li>
              <li>BC Bar ➔ Sheet <strong className="text-cyan-700">BC Bar</strong></li>
              <li>BC CX ➔ Sheet <strong className="text-rose-700">BC CX</strong></li>
              <li>BC Tổng Quản Lý ➔ Sheet <strong className="text-purple-700">BC TQL</strong></li>
              <li>BC Sale Sỉ ➔ Sheet <strong className="text-emerald-700">BC sale sỉ</strong></li>
              <li>BC Quản Lý Kênh ➔ Sheet <strong className="text-indigo-700">BC QL kênh</strong></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs transition-colors ${
                saved ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã lưu!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu cấu hình</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
