import React, { forwardRef } from 'react';
import {
  TON_DAT_STORES,
  TonDatStoreCode,
  PRODUCT_GROUPS,
  TonDatBarReportData,
  parseFlexibleNumber,
  formatVietnameseNumber,
  createEmptyBranchEntry,
} from './types';

interface ReportPreviewProps {
  data: TonDatBarReportData;
  activeBranch: TonDatStoreCode;
}

function formatDisplayCell(raw: string | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const parsed = parseFlexibleNumber(trimmed);
  if (parsed !== null) {
    return formatVietnameseNumber(parsed);
  }
  return trimmed;
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '...';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

const CATEGORIES: Array<{
  key: (typeof PRODUCT_GROUPS)[number]['category'];
  label: string;
  headerBg: string;
  badgeBg: string;
}> = [
  {
    key: 'Bia Bom & Keg',
    label: '1. BIA BOM & KEG',
    headerBg: 'bg-amber-100/90 text-amber-950 border-amber-300',
    badgeBg: 'bg-amber-600',
  },
  {
    key: 'Bia Craft & Rượu',
    label: '2. BIA CRAFT & RƯỢU',
    headerBg: 'bg-violet-100/80 text-violet-950 border-violet-300',
    badgeBg: 'bg-violet-600',
  },
  {
    key: 'Bia Chai & Lon',
    label: '3. BIA CHAI & LON',
    headerBg: 'bg-sky-100/85 text-sky-950 border-sky-300',
    badgeBg: 'bg-sky-600',
  },
  {
    key: 'Nước Ngọt & Nước Suối',
    label: '4. NƯỚC NGỌT & NƯỚC SUỐI',
    headerBg: 'bg-emerald-100/80 text-emerald-950 border-emerald-300',
    badgeBg: 'bg-emerald-600',
  },
];

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(
  ({ data, activeBranch }, ref) => {
    const storeInfo = TON_DAT_STORES.find((s) => s.code === activeBranch);
    const branch = data.branches[activeBranch] || createEmptyBranchEntry();
    const fullDate = formatFullDate(data.date);
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    let sttCounter = 0;

    return (
      <div
        ref={ref}
        id="ton-dat-bar-preview-sheet"
        translate="no"
        className="notranslate bg-white text-slate-900 p-7 shadow-lg select-text border border-slate-300 w-[800px] min-w-[800px] mx-auto box-border"
        style={{
          fontFamily:
            '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}
      >
        {/* Header theo từng cơ sở */}
        <div className="mb-5 pb-4 border-b-2 border-slate-900 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
              BÁO CÁO TỒN &amp; ĐẶT HÀNG CUỐI NGÀY - BAR
            </h1>
            <div className="mt-1.5 flex items-center gap-2 text-base font-bold text-slate-800">
              <span>Cơ sở:</span>
              <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-black tracking-tight">
                {activeBranch}
              </span>
              <span className="text-slate-600 font-semibold text-sm">
                ({storeInfo?.name || activeBranch})
              </span>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-300 text-xs space-y-1 shrink-0 tabular-nums min-w-[220px]">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 font-medium">Ngày báo cáo:</span>
              <span className="font-extrabold text-slate-950">{fullDate}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 font-medium">NV Bar báo cáo:</span>
              <span className="font-extrabold text-indigo-900">
                {branch.staffName?.trim() || 'Chưa nhập'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 font-medium">Giờ xuất ảnh:</span>
              <span className="font-semibold text-slate-700">{nowTime}</span>
            </div>
          </div>
        </div>

        {/* Bảng chi tiết 5 cột cho cơ sở */}
        <div className="border border-slate-400 rounded-lg overflow-hidden bg-white">
          <table className="w-full table-fixed border-collapse text-[13px] tabular-nums">
            <colgroup>
              <col className="w-[52px]" />
              <col className="w-[218px]" />
              <col className="w-[110px]" />
              <col className="w-[190px]" />
              <col className="w-[190px]" />
            </colgroup>

            <thead>
              <tr className="bg-slate-900 text-white divide-x divide-slate-700 text-xs uppercase tracking-wider">
                <th className="py-3 px-2 text-center font-extrabold">STT</th>
                <th className="py-3 px-3 text-left font-extrabold">Tên hàng</th>
                <th className="py-3 px-2 text-center font-extrabold">ĐVT</th>
                <th className="py-3 px-3 text-center font-extrabold bg-slate-800">
                  Tồn cuối ngày
                </th>
                <th className="py-3 px-3 text-center font-extrabold bg-[#facc15] text-slate-950">
                  Đặt hàng
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-300">
              {CATEGORIES.map((cat) => {
                const products = PRODUCT_GROUPS.filter((p) => p.category === cat.key);
                return (
                  <React.Fragment key={cat.key}>
                    <tr className={`${cat.headerBg} border-t-2 border-b font-bold`}>
                      <td colSpan={5} className="px-3 py-1.5 text-[11.5px] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${cat.badgeBg}`} />
                          <span>{cat.label}</span>
                        </div>
                      </td>
                    </tr>

                    {products.map((product) => {
                      sttCounter += 1;
                      const currentStt = sttCounter;

                      return product.units.map((unit, unitIdx) => {
                        const tonDisplay = formatDisplayCell(branch.ton?.[unit.key]);
                        const datDisplay = formatDisplayCell(branch.dat?.[unit.key]);
                        const datNum = parseFlexibleNumber(datDisplay);
                        const hasOrder = datNum !== null && datNum > 0;

                        return (
                          <tr
                            key={unit.key}
                            className={`divide-x divide-slate-300 ${
                              currentStt % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
                            }`}
                          >
                            {unitIdx === 0 && (
                              <td
                                rowSpan={product.units.length}
                                className="py-2.5 px-2 text-center font-bold text-slate-500 align-middle"
                              >
                                {currentStt}
                              </td>
                            )}

                            {unitIdx === 0 && (
                              <td
                                rowSpan={product.units.length}
                                className="py-2.5 px-3 font-extrabold text-slate-900 align-middle bg-slate-50/70"
                              >
                                {product.name}
                              </td>
                            )}

                            <td className="py-2 px-2 text-center font-bold italic text-slate-700 align-middle">
                              {unit.label}
                            </td>

                            <td className="py-2 px-3 text-center align-middle">
                              {tonDisplay !== '' ? (
                                <span className="font-extrabold text-slate-950 text-[15px]">
                                  {tonDisplay}
                                </span>
                              ) : (
                                <span className="text-slate-300 font-normal">—</span>
                              )}
                            </td>

                            <td
                              className={`py-2 px-3 text-center align-middle ${
                                hasOrder ? 'bg-amber-100/90' : ''
                              }`}
                            >
                              {datDisplay !== '' ? (
                                <span
                                  className={
                                    hasOrder
                                      ? 'font-black text-amber-950 text-[15px]'
                                      : 'font-semibold text-slate-600 text-[14px]'
                                  }
                                >
                                  {datDisplay}
                                </span>
                              ) : (
                                <span className="text-slate-300 font-normal">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11.5px] text-slate-500">
          <span>
            * Lưu record vào sheet <strong className="text-slate-700">BC Tồn Đặt Bar</strong> · Tổng hợp tự động tại sheet <strong className="text-slate-700">TH Bar</strong>.
          </span>
          <span className="font-semibold text-slate-700">
            {activeBranch} · {fullDate}
          </span>
        </div>
      </div>
    );
  }
);

ReportPreview.displayName = 'TongBarTonDatReportPreview';
