import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import {
  Download,
  Camera,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Settings,
  Sparkles,
} from 'lucide-react';

import {
  ReportType,
  REPORT_TABS,
  ReportData,
  REPORT_CHECKLIST_MAP,
} from './types';

// Components
import { HomePage } from './components/HomePage';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { ImageExportModal } from './components/ImageExportModal';
import { WebhookSettingsModal } from './components/WebhookSettingsModal';

const DEFAULT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxWKIm74psex5-61MTbeSZKTyA5_K8GBE2MzZ3iOcn7bu1ekM7NqvGXDOJLmz88iDGQ/exec';

const STORAGE_KEY_WEBHOOK = 'bcoi_reports_webhook_url';

// Helper: Phân tích URL hiện tại sang view ('home' hoặc ReportType)
function getRouteFromLocation(): { view: 'home' | 'report'; reportId?: ReportType } {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');

  for (const report of REPORT_TABS) {
    if (
      path === report.path ||
      path === `${report.path}/` ||
      hash === report.path ||
      hash === report.path.replace('/', '') ||
      hash === `/${report.path.replace('/', '')}`
    ) {
      return { view: 'report', reportId: report.id };
    }
  }

  return { view: 'home' };
}

// Khởi tạo state dữ liệu chuẩn cho tất cả các báo cáo
function createInitialReportsState(): Record<ReportType, ReportData> {
  const today = new Date().toISOString().split('T')[0];
  const state: Partial<Record<ReportType, ReportData>> = {};

  REPORT_TABS.forEach((tab) => {
    const checklist = REPORT_CHECKLIST_MAP[tab.id];
    state[tab.id] = {
      location: '',
      date: today,
      reporter: '',
      items: checklist.map((item) => ({
        id: item.id,
        value: '',
      })),
    };
  });

  return state as Record<ReportType, ReportData>;
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<{ view: 'home' | 'report'; reportId?: ReportType }>(
    getRouteFromLocation
  );

  const [reportsData, setReportsData] = useState<Record<ReportType, ReportData>>(
    createInitialReportsState
  );

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_WEBHOOK_URL;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportImageUrl, setExportImageUrl] = useState('');
  const [exportFileName, setExportFileName] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Routing
  const navigateTo = useCallback((targetPath: string) => {
    window.history.pushState({}, '', targetPath);
    setCurrentRoute(getRouteFromLocation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleSelectReport = (id: ReportType) => {
    const meta = REPORT_TABS.find((t) => t.id === id);
    if (meta) {
      navigateTo(meta.path);
    }
  };

  const handleSaveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem(STORAGE_KEY_WEBHOOK, url);
  };

  const activeReportId = currentRoute.reportId || 'van_hanh';
  const activeMeta = REPORT_TABS.find((tab) => tab.id === activeReportId) || REPORT_TABS[0];
  const currentData = reportsData[activeReportId];
  const currentChecklist = REPORT_CHECKLIST_MAP[activeReportId];

  const handleDataChange = (newData: ReportData) => {
    setReportsData((prev) => ({
      ...prev,
      [activeReportId]: newData,
    }));
  };

  // Google Sheets Save
  const saveToGoogleSheets = async (data: ReportData) => {
    if (!webhookUrl) {
      console.log('Chưa cấu hình Google Sheets Webhook URL. Bỏ qua bước lưu.');
      return false;
    }

    const locationMap: Record<string, string> = {
      '94 Lò Đúc': '94LĐ',
      '96 Hồng Tiến': '96HT',
      '98 Vũ Trọng Phụng': '98VTP',
      '01 Đặng Dung': '01 ĐD',
      '3D Nguyễn Văn Huyên': '3D NVH',
      '12 Đào Tấn': '12BĐT',
      '12B Đào Tấn': '12BĐT',
      '12ĐT': '12BĐT',
      '12BĐT': '12BĐT',
    };
    const mappedLocation = locationMap[data.location] || data.location;

    const payload = {
      sheetName: activeMeta.sheetName,
      location: String(mappedLocation || ''),
      date: String(data.date || ''),
      reporter: String(data.reporter || ''),
      items: data.items.map((item) => {
        const def = currentChecklist.find((d) => d.id === item.id);
        return {
          id: item.id,
          title: String(def?.title || `Hạng mục ${item.id}`),
          category: String(def?.category || ''),
          value: String(item.value || ''),
        };
      }),
    };

    try {
      setSheetStatus('saving');

      const fetchPromise = fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 8000)
      );

      await Promise.race([fetchPromise, timeoutPromise]);
      console.log('Đã gửi dữ liệu lên Google Sheets:', payload);
      setSheetStatus('success');
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu vào Google Sheets:', error);
      setSheetStatus('error');
      return false;
    }
  };

  const handleExportImage = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    setExportSuccess(false);
    setExportError(null);
    setSheetStatus('idle');

    try {
      // 1. Lưu dữ liệu lên Google Sheets tương ứng với sheet đích
      await saveToGoogleSheets(currentData);

      await new Promise((resolve) => setTimeout(resolve, 500));

      // 2. Xuất ảnh
      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const fileName = `BaoCao_${activeMeta.shortName}_${currentData.location || 'CoSo'}_${currentData.date}.png`.replace(/\s+/g, '_');
      setExportImageUrl(dataUrl);
      setExportFileName(fileName);
      setIsModalOpen(true);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to export image', err);
      try {
        const dataUrl = await toPng(previewRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });
        const fileName = `BaoCao_${activeMeta.shortName}_${currentData.location || 'CoSo'}_${currentData.date}.png`.replace(/\s+/g, '_');
        setExportImageUrl(dataUrl);
        setExportFileName(fileName);
        setIsModalOpen(true);
        setExportSuccess(true);
      } catch (innerErr) {
        console.error('Inner export error:', innerErr);
        setExportError('Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.');
        setTimeout(() => setExportError(null), 5000);
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Trang chủ
  if (currentRoute.view === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        {/* Header Trang Chủ */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                    Hệ Thống Báo Cáo Chuỗi Quán Bia Ơi
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Cổng điều hướng báo cáo • Tự động đồng bộ Google Sheets
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Cấu hình Google Sheets Webhook"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung danh sách tất cả các báo cáo */}
        <div className="flex-1">
          <HomePage onSelectReport={handleSelectReport} />
        </div>

        {/* Modal cấu hình Google Sheets Webhook */}
        <WebhookSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentUrl={webhookUrl}
          onSave={handleSaveWebhookUrl}
          defaultUrl={DEFAULT_WEBHOOK_URL}
        />
      </div>
    );
  }

  // Trang Báo Cáo Riêng Biệt: GIỮ NGUYÊN 100% GIAO DIỆN & FORM GỐC
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header chuẩn giống hệt bản gốc */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                  {activeMeta.name}
                </h1>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Sheet đích: <strong className="text-slate-700">{activeMeta.sheetName}</strong> (BÁO CÁO TH)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">
                    {sheetStatus === 'saving' ? 'Đang lưu vào Sheet...' : 'Đang tạo ảnh...'}
                  </span>
                  <span className="sm:hidden">Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh báo cáo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-8">
        {exportError && (
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-xs animate-in fade-in slide-in-from-top-4 bg-red-50 border-red-200 text-red-900">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-sm font-semibold">{exportError}</div>
          </div>
        )}

        {exportSuccess && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-xs animate-in fade-in slide-in-from-top-4 ${
              sheetStatus === 'error'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {sheetStatus === 'error' ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <div className="text-sm">
              <p className="font-semibold">
                {sheetStatus === 'error'
                  ? 'Đã tạo ảnh, nhưng không thể kết nối lưu dữ liệu lên Google Sheets!'
                  : `Đã tạo ảnh & lưu dữ liệu vào sheet "${activeMeta.sheetName}" thành công!`}
              </p>
              {sheetStatus === 'error' && (
                <p className="text-xs text-amber-700 mt-0.5">
                  Vui lòng kiểm tra lại kết nối mạng hoặc quyền truy cập của Web App Google Sheets.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Cột trái: Form nhập liệu giống hệt bản gốc */}
          <div className="space-y-6">
            <ReportForm
              data={currentData}
              onChange={handleDataChange}
              itemsDef={currentChecklist}
              reporterLabel={activeMeta.reporterLabel}
              reporterPlaceholder={activeMeta.reporterPlaceholder}
            />
          </div>

          {/* Cột phải: Bản xem trước giống hệt bản gốc */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Bản xem trước</h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg">
                Tự động cập nhật
              </span>
            </div>

            <div className="bg-slate-200 p-2 sm:p-4 rounded-2xl overflow-x-auto shadow-inner border border-slate-300">
              <div className="w-[800px] min-w-[800px] mx-auto">
                <ReportPreview
                  data={currentData}
                  itemsDef={currentChecklist}
                  reportTitle={activeMeta.reportTitle}
                  reporterLabel={activeMeta.reporterLabel}
                  ref={previewRef}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-xs border-t border-slate-200 shadow-lg z-40">
        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className="w-full flex justify-center items-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang lưu & tạo ảnh...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Tải ảnh báo cáo</span>
            </>
          )}
        </button>
      </div>

      {/* Modal hiển thị ảnh hoàn chỉnh cho phép copy hoặc tải */}
      <ImageExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={exportImageUrl}
        fileName={exportFileName}
      />

      {/* Modal cấu hình Google Sheets Webhook */}
      <WebhookSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={webhookUrl}
        onSave={handleSaveWebhookUrl}
        defaultUrl={DEFAULT_WEBHOOK_URL}
      />
    </div>
  );
}
