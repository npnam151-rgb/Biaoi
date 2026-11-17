import React, { useState, useEffect } from 'react';
import { X, Check, Save, RotateCcw, Copy, Code2, AlertTriangle } from 'lucide-react';
import { TONG_BAR_TON_DAT_APPS_SCRIPT } from '../reports/tong_bar_ton_dat/appsScriptTemplate';

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (newUrl: string) => void;
  defaultUrl: string;
  barTonDatUrl: string;
  onSaveBarTonDatUrl: (newUrl: string) => void;
  defaultBarTonDatUrl: string;
}

export function WebhookSettingsModal({
  isOpen,
  onClose,
  currentUrl,
  onSave,
  defaultUrl,
  barTonDatUrl,
  onSaveBarTonDatUrl,
  defaultBarTonDatUrl,
}: WebhookSettingsModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [tonDatUrl, setTonDatUrl] = useState(barTonDatUrl);
  const [saved, setSaved] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl);
      setTonDatUrl(barTonDatUrl);
    }
  }, [isOpen, currentUrl, barTonDatUrl]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url.trim());
    onSaveBarTonDatUrl(tonDatUrl.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    setUrl(defaultUrl);
    setTonDatUrl(defaultBarTonDatUrl);
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(TONG_BAR_TON_DAT_APPS_SCRIPT);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } catch {
      // Fallback
    }
  };

  const isDevEndpoint = tonDatUrl.trim().endsWith('/dev');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cấu hình Google Sheets Webhook</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              URL Web App Google Apps Script đồng bộ dữ liệu các loại báo cáo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* 1. URL cho Tổng Bar Tồn & Đặt (2 chiều) */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase text-amber-950">
                Apps Script riêng: BC Tồn Đặt Bar &amp; TH Bar (2 chiều)
              </label>
              <button
                type="button"
                onClick={() => setShowScript(!showScript)}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{showScript ? 'Ẩn mã Apps Script' : 'Xem mã Apps Script'}</span>
              </button>
            </div>

            <input
              type="text"
              value={tonDatUrl}
              onChange={(e) => setTonDatUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
            />

            {isDevEndpoint && (
              <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-100/80 p-2.5 rounded-xl border border-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  URL này đang kết thúc bằng <strong>/dev</strong> (link thử nghiệm). Để toàn bộ nhân viên 6 cơ sở đọc/ghi tự do khi đổi ngày, hãy bấm <strong>Triển khai → Triển khai mới → Ứng dụng web (Quyền: Bất kỳ ai)</strong> và dán link kết thúc bằng <strong>/exec</strong> vào ô trên.
                </p>
              </div>
            )}

            {showScript && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600">
                    Dán toàn bộ mã dưới đây vào Google Apps Script (gồm doGet + doPost):
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Đã copy mã!' : 'Copy mã Script'}</span>
                  </button>
                </div>
                <pre className="max-h-56 overflow-auto p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed">
                  {TONG_BAR_TON_DAT_APPS_SCRIPT}
                </pre>
              </div>
            )}
          </div>

          {/* 2. URL Webhook mặc định cho các báo cáo khác */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Google Apps Script Web App URL (8 báo cáo chung)
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
              <li>BC Tổng Bar Tồn &amp; Đặt ➔ Lưu lịch sử tại <strong className="text-amber-700">BC Tồn Đặt Bar</strong> &amp; tổng hợp bảng tại <strong className="text-amber-800">TH Bar</strong></li>
              <li>BC Vận Hành ➔ Sheet <strong className="text-indigo-700">BC Vận hành</strong></li>
              <li>BC Bếp ➔ Sheet <strong className="text-amber-700">BC Bếp</strong></li>
              <li>BC Bar ➔ Sheet <strong className="text-cyan-700">BC Bar</strong></li>
              <li>BC Tổng Bar ➔ Sheet <strong className="text-teal-700">BC Tổng Bar</strong></li>
              <li>BC CX ➔ Sheet <strong className="text-rose-700">BC CX</strong></li>
              <li>BC Tổng Quản Lý ➔ Sheet <strong className="text-purple-700">BC TQL</strong></li>
              <li>BC Sale Sỉ ➔ Sheet <strong className="text-emerald-700">BC sale sỉ</strong></li>
              <li>BC Quản Lý Kênh ➔ Sheet <strong className="text-indigo-700">BC QL kênh</strong></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 pt-3 border-t border-slate-100 shrink-0 bg-white">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs transition-colors cursor-pointer ${
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
