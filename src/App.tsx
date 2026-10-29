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
  CHECKLIST_ITEMS,
  BepReportData,
  BEP_CHECKLIST_ITEMS,
  BarReportData,
  BAR_CHECKLIST_ITEMS,
  CXReportData,
  CX_DEFAULT_ITEMS,
  TQLReportData,
  TQL_STORE_CODES,
  SaleSiReportData,
  QLKenhReportData,
} from './types';

// Components
import { HomePage } from './components/HomePage';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { BepReportForm, BepReportPreview } from './components/reports/BepReport';
import { BarReportForm, BarReportPreview } from './components/reports/BarReport';
import { CXReportForm, CXReportPreview } from './components/reports/CXReport';
import { TQLReportForm, TQLReportPreview } from './components/reports/TQLReport';
import { SaleSiReportForm, SaleSiReportPreview } from './components/reports/SaleSiReport';
import { QLKenhReportForm, QLKenhReportPreview } from './components/reports/QLKenhReport';
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

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<{ view: 'home' | 'report'; reportId?: ReportType }>(
    getRouteFromLocation
  );

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_WEBHOOK_URL;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // ==========================================
  // ROUTING HANDLERS
  // ==========================================
  const navigateTo = useCallback((targetPath: string) => {
    window.history.pushState({}, '', targetPath);
    const resolved = getRouteFromLocation();
    setCurrentRoute(resolved);
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

  // ==========================================
  // STATE CỦA TỪNG BÁO CÁO
  // ==========================================
  const [vanHanhData, setVanHanhData] = useState<ReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: CHECKLIST_ITEMS.map((item) => ({ id: item.id, value: '' })),
  });

  const [bepData, setBepData] = useState<BepReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: BEP_CHECKLIST_ITEMS.map((item) => ({ id: item.id, value: '' })),
  });

  const [barData, setBarData] = useState<BarReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: BAR_CHECKLIST_ITEMS.map((item) => ({ id: item.id, value: '' })),
  });

  const [cxData, setCxData] = useState<CXReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    totalScore: 70,
    items: CX_DEFAULT_ITEMS.map((item) => ({
      ...item,
      score: 10,
      notes: '',
    })),
  });

  const [tqlData, setTqlData] = useState<TQLReportData>({
    date: todayStr,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    reporter: '',
    systemEvaluation: {
      dt_toan_he_thong: '',
      muc_tieu_ngay: '',
      tang_giam_hom_truoc: '',
      tong_luot_khach: '',
      so_ban_phuc_vu: '',
      dt_tb_khach: '',
      xep_hang_dt: '',
      y_kien_khac: '',
    },
    stores: TQL_STORE_CODES.reduce((acc, code) => {
      acc[code] = {
        hong_hoc_can_sua: '',
        hang_muc_sua_trong_ngay: '',
        xep_ban: '',
        order_tu_van: '',
        cham_soc_upsell: '',
        toc_do_ra_do: '',
        chuong_trinh_km: '',
        ve_sinh: '',
        vd_phat_sinh_pv: '',
        cach_giai_quyet_pv: '',
        tong_ns_di_lam: '',
        ns_nghi_dot_xuat: '',
        ns_nghi_han: '',
        ns_moi: '',
        ns_ho_tro: '',
        phan_hoi_khach_bia: '',
        vd_phat_sinh_bia: '',
        cach_giai_quyet_bia: '',
        xuat_ban_tiec: '',
        mon_day: '',
        mon_ban_chay: '',
        phan_hoi_khach_mon: '',
        vd_phat_sinh_mon: '',
        cach_giai_quyet_mon: '',
        dao_tao: '',
        doi_ngoai: '',
      };
      return acc;
    }, {} as Record<string, any>),
  });

  const [saleSiData, setSaleSiData] = useState<SaleSiReportData>({
    date: todayStr,
    reporter: '',
    restaurantName: '',
    address: '',
    outletType: 'Điểm cũ',
    visitOrder: '1',
    stockBom30L: '',
    stockBom50L: '',
    stockKeg1L: '',
    orderBom30L: '',
    orderBom50L: '',
    orderKeg1L: '',
    evaluationOrProposal: '',
  });

  const [qlKenhData, setQlKenhData] = useState<QLKenhReportData>({
    date: todayStr,
    reporter: '',
    potentialCustomers: '',
    decliningRiskCustomers: '',
    marketIssues: '',
    proposal: '',
    sales: [
      { salesRepName: 'Sale 1', visitedCount: '', newCustomers: '', ordersCount: '', volume: '', situation: '' },
      { salesRepName: 'Sale 2', visitedCount: '', newCustomers: '', ordersCount: '', volume: '', situation: '' },
      { salesRepName: 'Sale 3', visitedCount: '', newCustomers: '', ordersCount: '', volume: '', situation: '' },
    ],
  });

  // Export & sync states
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportImageUrl, setExportImageUrl] = useState('');
  const [exportFileName, setExportFileName] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const activeReportId = currentRoute.reportId || 'van_hanh';
  const activeMeta = REPORT_TABS.find((tab) => tab.id === activeReportId) || REPORT_TABS[0];

  const handleSaveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem(STORAGE_KEY_WEBHOOK, url);
  };

  // Google Sheets Payload Builder
  const buildSheetPayload = (tabId: ReportType) => {
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

    switch (tabId) {
      case 'van_hanh': {
        const mappedLoc = locationMap[vanHanhData.location] || vanHanhData.location;
        return {
          sheetName: 'BC Vận hành',
          location: String(mappedLoc || ''),
          date: String(vanHanhData.date || ''),
          reporter: String(vanHanhData.reporter || ''),
          items: vanHanhData.items.map((item) => {
            const def = CHECKLIST_ITEMS.find((d) => d.id === item.id);
            return {
              id: item.id,
              title: String(def?.title || `Hạng mục ${item.id}`),
              category: String(def?.category || ''),
              value: String(item.value || ''),
            };
          }),
        };
      }

      case 'bep': {
        const mappedLoc = locationMap[bepData.location] || bepData.location;
        return {
          sheetName: 'BC Bếp',
          location: String(mappedLoc || ''),
          date: String(bepData.date || ''),
          reporter: String(bepData.reporter || ''),
          items: bepData.items.map((item) => {
            const def = BEP_CHECKLIST_ITEMS.find((d) => d.id === item.id);
            return {
              id: item.id,
              title: String(def?.title || `Hạng mục ${item.id}`),
              category: String(def?.category || ''),
              value: String(item.value || ''),
            };
          }),
        };
      }

      case 'bar': {
        const mappedLoc = locationMap[barData.location] || barData.location;
        return {
          sheetName: 'BC Bar',
          location: String(mappedLoc || ''),
          date: String(barData.date || ''),
          reporter: String(barData.reporter || ''),
          items: barData.items.map((item) => {
            const def = BAR_CHECKLIST_ITEMS.find((d) => d.id === item.id);
            return {
              id: item.id,
              title: String(def?.title || `Hạng mục ${item.id}`),
              category: String(def?.category || ''),
              value: String(item.value || ''),
            };
          }),
        };
      }

      case 'cx': {
        const mappedLoc = locationMap[cxData.location] || cxData.location;
        return {
          sheetName: 'BC CX',
          location: String(mappedLoc || ''),
          date: String(cxData.date || ''),
          reporter: String(cxData.reporter || ''),
          totalScore: cxData.totalScore,
          items: cxData.items.map((item) => ({
            id: item.id,
            title: item.title,
            value: `${item.score}/10`,
            notes: item.notes || '',
          })),
        };
      }

      case 'tql': {
        return {
          sheetName: 'BC TQL',
          date: String(tqlData.date || ''),
          time: String(tqlData.time || ''),
          reporter: String(tqlData.reporter || ''),
          systemEvaluation: tqlData.systemEvaluation,
          stores: tqlData.stores,
        };
      }

      case 'sale_si': {
        return {
          sheetName: 'BC sale sỉ',
          date: String(saleSiData.date || ''),
          reporter: String(saleSiData.reporter || ''),
          restaurantName: String(saleSiData.restaurantName || ''),
          address: String(saleSiData.address || ''),
          outletType: saleSiData.outletType,
          visitOrder: String(saleSiData.visitOrder || '1'),
          stockBom30L: String(saleSiData.stockBom30L || ''),
          stockBom50L: String(saleSiData.stockBom50L || ''),
          stockKeg1L: String(saleSiData.stockKeg1L || ''),
          orderBom30L: String(saleSiData.orderBom30L || ''),
          orderBom50L: String(saleSiData.orderBom50L || ''),
          orderKeg1L: String(saleSiData.orderKeg1L || ''),
          evaluationOrProposal: String(saleSiData.evaluationOrProposal || ''),
        };
      }

      case 'ql_kenh': {
        return {
          sheetName: 'BC QL kênh',
          date: String(qlKenhData.date || ''),
          reporter: String(qlKenhData.reporter || ''),
          potentialCustomers: String(qlKenhData.potentialCustomers || ''),
          decliningRiskCustomers: String(qlKenhData.decliningRiskCustomers || ''),
          marketIssues: String(qlKenhData.marketIssues || ''),
          proposal: String(qlKenhData.proposal || ''),
          sales: qlKenhData.sales.map((s, idx) => ({
            salesRepName: s.salesRepName || `Sale ${idx + 1}`,
            visitedCount: s.visitedCount || '',
            newCustomers: s.newCustomers || '',
            ordersCount: s.ordersCount || '',
            volume: s.volume || '',
            situation: s.situation || '',
          })),
        };
      }

      default:
        return null;
    }
  };

  const saveToGoogleSheets = async (tabId: ReportType) => {
    if (!webhookUrl) {
      console.log('Chưa cấu hình Google Sheets Webhook URL. Bỏ qua bước lưu.');
      return false;
    }

    const payload = buildSheetPayload(tabId);
    if (!payload) return false;

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
      console.log('Đã gửi payload lên Google Sheets:', payload);
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
      await saveToGoogleSheets(activeReportId);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      let locationOrTarget = 'CoSo';
      if (activeReportId === 'van_hanh') locationOrTarget = vanHanhData.location || 'CoSo';
      else if (activeReportId === 'bep') locationOrTarget = bepData.location || 'CoSo';
      else if (activeReportId === 'bar') locationOrTarget = barData.location || 'CoSo';
      else if (activeReportId === 'cx') locationOrTarget = cxData.location || 'CoSo';
      else if (activeReportId === 'sale_si') locationOrTarget = saleSiData.restaurantName || 'DiemBan';
      else if (activeReportId === 'tql') locationOrTarget = 'ToanChuoi';
      else if (activeReportId === 'ql_kenh') locationOrTarget = 'QLKenh';

      const fileName = `BaoCao_${activeMeta.shortName}_${locationOrTarget}_${todayStr}.png`.replace(/\s+/g, '_');
      setExportImageUrl(dataUrl);
      setExportFileName(fileName);
      setIsModalOpen(true);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 6000);
    } catch (err) {
      console.error('Export image failed:', err);
      try {
        const dataUrl = await toPng(previewRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });
        const fileName = `BaoCao_${activeMeta.shortName}_${todayStr}.png`.replace(/\s+/g, '_');
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

  // Render Homepage
  if (currentRoute.view === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        {/* Home Header */}
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

        {/* Home Main Content */}
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

  // Render Individual Report View: GIỮ NGUYÊN 100% GIAO DIỆN GỐC (Không có nút về trang chủ hay báo cáo khác)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header chuẩn y hệt bản gốc */}
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
                  ? `Đã tạo ảnh, nhưng không thể kết nối lưu dữ liệu lên Google Sheets!`
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
          {/* Cột trái: Form nhập liệu của báo cáo */}
          <div className="space-y-6">
            {activeReportId === 'van_hanh' && (
              <ReportForm data={vanHanhData} onChange={setVanHanhData} />
            )}
            {activeReportId === 'bep' && (
              <BepReportForm data={bepData} onChange={setBepData} />
            )}
            {activeReportId === 'bar' && (
              <BarReportForm data={barData} onChange={setBarData} />
            )}
            {activeReportId === 'cx' && (
              <CXReportForm data={cxData} onChange={setCxData} />
            )}
            {activeReportId === 'tql' && (
              <TQLReportForm data={tqlData} onChange={setTqlData} />
            )}
            {activeReportId === 'sale_si' && (
              <SaleSiReportForm data={saleSiData} onChange={setSaleSiData} />
            )}
            {activeReportId === 'ql_kenh' && (
              <QLKenhReportForm data={qlKenhData} onChange={setQlKenhData} />
            )}
          </div>

          {/* Cột phải: Bản xem trước */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Bản xem trước</h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg">
                Tự động cập nhật
              </span>
            </div>

            <div className="bg-slate-200 p-2 sm:p-4 rounded-2xl overflow-x-auto shadow-inner border border-slate-300">
              <div className="w-[800px] min-w-[800px] mx-auto">
                {activeReportId === 'van_hanh' && (
                  <ReportPreview data={vanHanhData} ref={previewRef} />
                )}
                {activeReportId === 'bep' && (
                  <BepReportPreview data={bepData} ref={previewRef} />
                )}
                {activeReportId === 'bar' && (
                  <BarReportPreview data={barData} ref={previewRef} />
                )}
                {activeReportId === 'cx' && (
                  <CXReportPreview data={cxData} ref={previewRef} />
                )}
                {activeReportId === 'tql' && (
                  <TQLReportPreview data={tqlData} ref={previewRef} />
                )}
                {activeReportId === 'sale_si' && (
                  <SaleSiReportPreview data={saleSiData} ref={previewRef} />
                )}
                {activeReportId === 'ql_kenh' && (
                  <QLKenhReportPreview data={qlKenhData} ref={previewRef} />
                )}
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
