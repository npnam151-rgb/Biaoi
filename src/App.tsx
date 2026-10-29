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
} from './types';

// Components
import { HomePage } from './components/HomePage';
import { ImageExportModal } from './components/ImageExportModal';
import { WebhookSettingsModal } from './components/WebhookSettingsModal';

// 1. VẬN HÀNH (ORIGINAL VH)
import { ReportForm as VHReportForm } from './reports/van_hanh/ReportForm';
import { ReportPreview as VHReportPreview } from './reports/van_hanh/ReportPreview';
import { CHECKLIST_ITEMS as VH_CHECKLIST_ITEMS, ReportData as VHReportData } from './reports/van_hanh/types';

// 2. BẾP (ORIGINAL CS-Bep)
import { ReportForm as BepReportForm } from './reports/bep/ReportForm';
import { ReportPreview as BepReportPreview } from './reports/bep/ReportPreview';
import { CHECKLIST_ITEMS as BEP_CHECKLIST_ITEMS, ReportData as BepReportData } from './reports/bep/types';

// 3. BAR (ORIGINAL CS-BC-Bar)
import { ReportForm as BarReportForm } from './reports/bar/ReportForm';
import { ReportPreview as BarReportPreview } from './reports/bar/ReportPreview';
import { CHECKLIST_ITEMS as BAR_CHECKLIST_ITEMS, ReportData as BarReportData } from './reports/bar/types';

// 4. CX (ORIGINAL CS)
import { ReportForm as CXReportForm } from './reports/cx/ReportForm';
import { ReportPreview as CXReportPreview } from './reports/cx/ReportPreview';
import { CHECKLIST_ITEMS as CX_CHECKLIST_ITEMS, ReportData as CXReportData } from './reports/cx/types';

// 5. SALE SỈ (ORIGINAL CS-BC-Sale-s-)
import { ReportForm as SaleSiReportForm } from './reports/sale_si/ReportForm';
import { ReportPreview as SaleSiReportPreview } from './reports/sale_si/ReportPreview';
import { SingleVisitReportData, createDefaultVisitReport } from './reports/sale_si/types';

// 6. QL KÊNH (ORIGINAL BC-Qu-n-l-k-nh)
import { ChannelManagerReportForm as QLKenhReportForm } from './reports/ql_kenh/ReportForm';
import { ChannelManagerReportPreview as QLKenhReportPreview } from './reports/ql_kenh/ReportPreview';
import { ChannelManagerReportData, createDefaultChannelReport } from './reports/ql_kenh/types';

// 7. TQL (ORIGINAL BC-TQL-2)
import { ReportForm as TQLReportForm } from './reports/tql/ReportForm';
import { ReportPreview as TQLReportPreview } from './reports/tql/ReportPreview';
import { TQLReportData, createInitialReportData, STORES, SYSTEM_COLUMNS, STORE_COLUMNS, getSystemTime } from './reports/tql/types';

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
  // DỮ LIỆU CỦA TỪNG BÁO CÁO (NGUYÊN BẢN GỐC)
  // ==========================================
  // 1. VH
  const [vanHanhData, setVanHanhData] = useState<VHReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: VH_CHECKLIST_ITEMS.map((item) => ({ id: item.id, value: '' })),
  });

  // 2. Bếp
  const [bepData, setBepData] = useState<BepReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: BEP_CHECKLIST_ITEMS.map((item) => ({ id: item.id, value: '' })),
  });

  // 3. Bar
  const [barData, setBarData] = useState<BarReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: BAR_CHECKLIST_ITEMS.map((item) => ({ id: item.id, value: '' })),
  });

  // 4. CX (Thang điểm và check)
  const [cxData, setCxData] = useState<CXReportData>({
    location: '',
    date: todayStr,
    reporter: '',
    items: CX_CHECKLIST_ITEMS.map((item) => ({
      id: item.id,
      value: item.type === 'check' ? true : item.type === 'score' ? 10 : '',
      notes: '',
    })),
  });

  // 5. Sale Sỉ
  const [saleSiData, setSaleSiData] = useState<SingleVisitReportData>(() =>
    createDefaultVisitReport(localStorage.getItem('sale_si_reporter') || '', '1')
  );

  // 6. QL Kênh
  const [qlKenhData, setQlKenhData] = useState<ChannelManagerReportData>(() =>
    createDefaultChannelReport(
      typeof window !== 'undefined'
        ? localStorage.getItem('ql_kenh_manager_name') || localStorage.getItem('ql_kenh_sales_rep') || ''
        : ''
    )
  );

  // 7. TQL (6 cơ sở)
  const [tqlData, setTqlData] = useState<TQLReportData>(createInitialReportData);

  // Trạng thái xuất ảnh & lưu Sheet
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportImageUrl, setExportImageUrl] = useState('');
  const [exportFileName, setExportFileName] = useState('');

  // Refs xem trước chụp ảnh
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

  // Helper map location
  const mapLocation = (raw: string) => {
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
    return locationMap[raw] || raw;
  };

  // Google Sheets Save theo đúng định dạng nguyên bản của từng project
  const saveToGoogleSheets = async (): Promise<boolean> => {
    if (!webhookUrl) {
      console.log('Chưa cấu hình Google Sheets Webhook URL.');
      return false;
    }

    let payload: any = null;

    if (activeReportId === 'van_hanh') {
      payload = {
        sheetName: 'BC Vận hành',
        location: String(mapLocation(vanHanhData.location) || ''),
        date: String(vanHanhData.date || ''),
        reporter: String(vanHanhData.reporter || ''),
        items: vanHanhData.items.map((item) => {
          const def = VH_CHECKLIST_ITEMS.find((d) => d.id === item.id);
          return {
            id: item.id,
            title: String(def?.title || `Hạng mục ${item.id}`),
            category: String(def?.category || ''),
            value: String(item.value || ''),
          };
        }),
      };
    } else if (activeReportId === 'bep') {
      payload = {
        sheetName: 'BC Bếp',
        location: String(mapLocation(bepData.location) || ''),
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
    } else if (activeReportId === 'bar') {
      payload = {
        sheetName: 'BC Bar',
        location: String(mapLocation(barData.location) || ''),
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
    } else if (activeReportId === 'cx') {
      const totalScore = cxData.items
        .filter((item) => {
          const def = CX_CHECKLIST_ITEMS.find((d) => d.id === item.id);
          return def?.type === 'score';
        })
        .reduce((sum, item) => sum + (Number(item.value) || 0), 0);

      payload = {
        sheetName: 'BC CX',
        location: cxData.location,
        date: cxData.date,
        reporter: cxData.reporter,
        totalScore: totalScore,
        items: cxData.items.map((item) => {
          const def = CX_CHECKLIST_ITEMS.find((d) => d.id === item.id);
          let formattedValue = item.value;
          if (item.value === true) formattedValue = 'Thực hiện';
          if (item.value === false) formattedValue = 'Không thực hiện';
          return {
            id: item.id,
            title: def?.title || `Mục ${item.id}`,
            value: formattedValue,
            notes: item.notes || '',
          };
        }),
      };
    } else if (activeReportId === 'sale_si') {
      payload = {
        sheetName: 'BC sale sỉ',
        date: saleSiData.date,
        reporter: saleSiData.reporter,
        visitOrder: saleSiData.visitOrder ? String(saleSiData.visitOrder).trim() : '1',
        outletType: saleSiData.outletType || 'Điểm cũ',
        restaurantName: saleSiData.restaurantName ? saleSiData.restaurantName.trim() : '',
        address: saleSiData.address ? saleSiData.address.trim() : '',
        evaluationOrProposal: saleSiData.evaluationOrProposal ? saleSiData.evaluationOrProposal.trim() : '',
        stockBom30L: saleSiData.stockBom30L || '',
        stockBom50L: saleSiData.stockBom50L || '',
        stockKeg1L: saleSiData.stockKeg1L || '',
        orderBom30L: saleSiData.orderBom30L || '',
        orderBom50L: saleSiData.orderBom50L || '',
        orderKeg1L: saleSiData.orderKeg1L || '',
      };
    } else if (activeReportId === 'ql_kenh') {
      const activeSales = qlKenhData.sales.filter((s) => Boolean(s.salesRepName && s.salesRepName.trim() !== ''));
      payload = {
        sheetName: 'BC QL kênh',
        date: qlKenhData.date,
        managerName: qlKenhData.managerName ? qlKenhData.managerName.trim() : '',
        reporter: qlKenhData.managerName ? qlKenhData.managerName.trim() : '',
        potentialCustomers: qlKenhData.potentialCustomers ? qlKenhData.potentialCustomers.trim() : '',
        decliningRiskCustomers: qlKenhData.decliningRiskCustomers ? qlKenhData.decliningRiskCustomers.trim() : '',
        marketIssues: qlKenhData.marketIssues ? qlKenhData.marketIssues.trim() : '',
        proposal: qlKenhData.proposal ? qlKenhData.proposal.trim() : '',
        sales: activeSales.map((s, idx) => {
          const cleanName = s.salesRepName.trim();
          return {
            id: s.id || idx + 1,
            salesRepName: cleanName,
            name: cleanName,
            reporter: cleanName,
            visitedCount: s.visitedCount ? String(s.visitedCount).trim() : '',
            newCustomers: s.newCustomers ? s.newCustomers.trim() : '',
            ordersCount: s.ordersCount ? s.ordersCount.trim() : '',
            volume: s.volume ? s.volume.trim() : '',
            situation: s.situation ? s.situation.trim() : '',
          };
        }),
      };
    } else if (activeReportId === 'tql') {
      const systemValues = SYSTEM_COLUMNS.map((col) => tqlData.systemEvaluation[col.id] || '');
      const otherOpinionValue = tqlData.systemEvaluation.y_kien_khac || '';
      const storesList = STORES.map((s) => {
        const storeVals = tqlData.stores[s.code] || {};
        const storeValues = STORE_COLUMNS.map((col) => storeVals[col.id] || '');
        return {
          storeCode: s.code,
          storeName: s.name,
          systemValues,
          storeValues,
          otherOpinionValue,
          values: [...systemValues, ...storeValues, otherOpinionValue],
        };
      });

      payload = {
        sheetName: 'BC TQL',
        date: String(tqlData.date || ''),
        time: String(tqlData.sendTime || getSystemTime()),
        reporter: String(tqlData.reporter || ''),
        location: 'Toàn hệ thống (6 cơ sở)',
        systemEvaluation: tqlData.systemEvaluation,
        storesList: storesList,
        stores: tqlData.stores,
      };
    }

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
        setTimeout(() => reject(new Error('Timeout')), 10000)
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
      await saveToGoogleSheets();
      await new Promise((resolve) => setTimeout(resolve, 500));

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
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to export image', err);
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

  // Trang Báo Cáo Riêng Biệt: GIỮ NGUYÊN FORM GỐC 100% CỦA TỪNG PROJECT CŨ
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
          {/* Cột trái: Form nhập liệu của báo cáo gốc */}
          <div className="space-y-6">
            {activeReportId === 'van_hanh' && (
              <VHReportForm data={vanHanhData} onChange={setVanHanhData} />
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
            {activeReportId === 'sale_si' && (
              <SaleSiReportForm
                data={saleSiData}
                onChange={setSaleSiData}
                onReset={() => setSaleSiData(createDefaultVisitReport(saleSiData.reporter, '1'))}
              />
            )}
            {activeReportId === 'ql_kenh' && (
              <QLKenhReportForm
                data={qlKenhData}
                onChange={setQlKenhData}
                onReset={() => setQlKenhData(createDefaultChannelReport(qlKenhData.managerName))}
              />
            )}
            {activeReportId === 'tql' && (
              <TQLReportForm data={tqlData} onChange={setTqlData} />
            )}
          </div>

          {/* Cột phải: Bản xem trước của báo cáo gốc */}
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
                  <VHReportPreview data={vanHanhData} ref={previewRef} />
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
                {activeReportId === 'sale_si' && (
                  <SaleSiReportPreview data={saleSiData} ref={previewRef} />
                )}
                {activeReportId === 'ql_kenh' && (
                  <QLKenhReportPreview data={qlKenhData} ref={previewRef} />
                )}
                {activeReportId === 'tql' && (
                  <TQLReportPreview data={tqlData} ref={previewRef} />
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
