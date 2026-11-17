import React from 'react';
import {
  TON_DAT_STORES,
  TonDatStoreCode,
  PRODUCT_GROUPS,
  TonDatBarReportData,
  createEmptyBranchEntry,
  countBranchFilledFields,
} from './types';
import {
  Calendar,
  RefreshCw,
  User,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ReportFormProps {
  data: TonDatBarReportData;
  onChange: (data: TonDatBarReportData) => void;
  activeBranch: TonDatStoreCode;
  onActiveBranchChange: (code: TonDatStoreCode) => void;
  syncStatus: 'idle' | 'loading' | 'synced' | 'error';
  syncMessage: string | null;
  onDateChange: (newDate: string) => void;
  onRefreshDate: () => void;
}

const CATEGORIES: Array<(typeof PRODUCT_GROUPS)[number]['category']> = [
  'Bia Bom & Keg',
  'Bia Craft & Rượu',
  'Bia Chai & Lon',
  'Nước Ngọt & Nước Suối',
];

export function ReportForm({
  data,
  onChange,
  activeBranch,
  onActiveBranchChange,
  syncStatus,
  syncMessage,
  onDateChange,
  onRefreshDate,
}: ReportFormProps) {
  const branchEntry = data.branches[activeBranch] || createEmptyBranchEntry();
  const activeStoreInfo = TON_DAT_STORES.find((s) => s.code === activeBranch);

  const handleStaffChange = (staffName: string) => {
    try {
      localStorage.setItem(`ton_dat_staff_${activeBranch}`, staffName);
    } catch {
      // Ignore storage error
    }
    onChange({
      ...data,
      branches: {
        ...data.branches,
        [activeBranch]: {
          ...branchEntry,
          staffName,
        },
      },
    });
  };

  const handleCellChange = (kind: 'ton' | 'dat', unitKey: string, val: string) => {
    onChange({
      ...data,
      branches: {
        ...data.branches,
        [activeBranch]: {
          ...branchEntry,
          [kind]: {
            ...(branchEntry[kind] || {}),
            [unitKey]: val,
          },
        },
      },
    });
  };

  const handleClearBranch = () => {
    onChange({
      ...data,
      branches: {
        ...data.branches,
        [activeBranch]: createEmptyBranchEntry(branchEntry.staffName),
      },
    });
  };

  return (
    <div className="space-y-5 notranslate" translate="no">
      {/* 1. Ngày báo cáo & Tên người nhập */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Thông tin báo cáo &amp; Đồng bộ dữ liệu</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đổi ngày để tự động tải số liệu đã lưu của cả 6 chi nhánh từ sheet{' '}
              <strong className="text-slate-700">BC Tồn Đặt Bar</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefreshDate}
            disabled={syncStatus === 'loading'}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'loading' ? 'animate-spin' : ''}`} />
            <span>{syncStatus === 'loading' ? 'Đang tải...' : 'Đồng bộ lại ngày này'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ngày báo cáo</span>
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tên người nhập ({activeBranch} - {activeStoreInfo?.name})</span>
            </label>
            <input
              type="text"
              value={branchEntry.staffName || ''}
              onChange={(e) => handleStaffChange(e.target.value)}
              placeholder="VD: Kiên, Thắng, Quyết, Phong..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Trạng thái đồng bộ rõ ràng bằng text + icon */}
        <div
          className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
            syncStatus === 'loading'
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : syncStatus === 'synced'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : syncStatus === 'error'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          {syncStatus === 'loading' && <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0 mt-0.5" />}
          {syncStatus === 'synced' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
          {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
          <div className="space-y-1">
            <p className="font-semibold">
              {syncStatus === 'loading' && `Đang tải dữ liệu ngày ${data.date} từ Google Sheets...`}
              {syncStatus === 'synced' && (syncMessage || `Đã đồng bộ dữ liệu ngày ${data.date}.`)}
              {syncStatus === 'error' && (syncMessage || 'Chưa đọc được dữ liệu từ Apps Script.')}
              {syncStatus === 'idle' && 'Sẵn sàng nhập dữ liệu theo ngày.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Chọn Chi Nhánh Để Nhập Nhanh */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Chọn chi nhánh báo cáo</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bản xem trước và ảnh tải về hiển thị riêng cho chi nhánh đang chọn; bảng <strong className="text-slate-700">TH Bar</strong> trên Google Sheets tự động tổng hợp cả 6 quán.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TON_DAT_STORES.map((store) => {
            const isActive = activeBranch === store.code;
            const branchVal = data.branches[store.code];
            const filledCount = countBranchFilledFields(branchVal);

            return (
              <button
                key={store.code}
                type="button"
                onClick={() => onActiveBranchChange(store.code)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-extrabold text-sm whitespace-nowrap">{store.code}</span>
                  <span
                    className={`text-[11px] font-semibold tabular-nums whitespace-nowrap ${
                      isActive
                        ? 'text-amber-300'
                        : filledCount > 0
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                    }`}
                  >
                    {filledCount > 0 ? `${filledCount}/44` : 'Trống'}
                  </span>
                </div>
                <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {store.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Công cụ nhanh cho chi nhánh đang chọn */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            {branchEntry.updatedAt
              ? `Cập nhật gần nhất: ${branchEntry.updatedAt}`
              : 'Chưa có bản ghi đồng bộ từ Sheet cho chi nhánh này'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearBranch}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa {activeBranch}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bảng nhập Tồn & Đặt cho 12 nhóm hàng của chi nhánh đang chọn */}
      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const products = PRODUCT_GROUPS.filter((p) => p.category === category);
          return (
            <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  {category}
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  Nhập số nguyên hoặc thập phân (VD: 5 hoặc 5,5)
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {products.map((product) => (
                  <div key={product.id} className="p-4 space-y-2.5">
                    <div className="font-bold text-sm text-slate-900">{product.name}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.units.map((unit) => {
                        const tonVal = branchEntry.ton?.[unit.key] || '';
                        const datVal = branchEntry.dat?.[unit.key] || '';
                        return (
                          <div
                            key={unit.key}
                            className="bg-slate-50/70 border border-slate-200 rounded-lg p-2.5 space-y-2"
                          >
                            <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                              <span>
                                ĐVT: <strong className="text-slate-900 italic">{unit.label}</strong>
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  TỒN
                                </label>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={tonVal}
                                  onChange={(e) => handleCellChange('ton', unit.key, e.target.value)}
                                  placeholder="0"
                                  className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center tabular-nums"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-amber-800 mb-1">
                                  ĐẶT
                                </label>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={datVal}
                                  onChange={(e) => handleCellChange('dat', unit.key, e.target.value)}
                                  placeholder="0"
                                  className="w-full px-2.5 py-2 border border-amber-300 rounded-md text-sm font-bold text-slate-900 bg-amber-50/40 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-center tabular-nums"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
