import React, { forwardRef } from 'react';
import { QLKenhReportData, SaleRepRecord } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface QLKenhReportProps {
  data: QLKenhReportData;
  onChange: (data: QLKenhReportData) => void;
}

export function QLKenhReportForm({ data, onChange }: QLKenhReportProps) {
  const handleSaleChange = (index: number, field: keyof SaleRepRecord, val: string) => {
    const newSales = [...data.sales];
    newSales[index] = { ...newSales[index], [field]: val };
    onChange({ ...data, sales: newSales });
  };

  const addSaleRow = () => {
    if (data.sales.length < 8) {
      onChange({
        ...data,
        sales: [
          ...data.sales,
          {
            salesRepName: `Sale ${data.sales.length + 1}`,
            visitedCount: '',
            newCustomers: '',
            ordersCount: '',
            volume: '',
            situation: '',
          },
        ],
      });
    }
  };

  const removeSaleRow = (index: number) => {
    if (data.sales.length > 1) {
      const newSales = data.sales.filter((_, i) => i !== index);
      onChange({ ...data, sales: newSales });
    }
  };

  return (
    <div className="space-y-6">
      {/* Thông tin chung */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Thông tin Báo Cáo Quản Lý Kênh</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Ngày báo cáo
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Quản lý kênh / Người lập báo cáo
            </label>
            <input
              type="text"
              value={data.reporter}
              onChange={(e) => onChange({ ...data, reporter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
              placeholder="VD: Quản lý kênh Nguyễn Văn C"
            />
          </div>
        </div>
      </div>

      {/* Kết quả chăm sóc điểm bán theo từng NV Sale */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Kết quả chăm sóc điểm bán của Sale ({data.sales.length} NV)</span>
          </div>
          {data.sales.length < 8 && (
            <button
              type="button"
              onClick={addSaleRow}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors"
            >
              + Thêm NV Sale
            </button>
          )}
        </div>

        <div className="space-y-4">
          {data.sales.map((sale, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800">
                  Sale #{idx + 1}
                </span>
                {data.sales.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSaleRow(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                  >
                    Xoá dòng
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                <div className="col-span-2 sm:col-span-1 md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Tên NV Sale
                  </label>
                  <input
                    type="text"
                    value={sale.salesRepName}
                    onChange={(e) => handleSaleChange(idx, 'salesRepName', e.target.value)}
                    placeholder="Tên sale"
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Số điểm ghé
                  </label>
                  <input
                    type="text"
                    value={sale.visitedCount}
                    onChange={(e) => handleSaleChange(idx, 'visitedCount', e.target.value)}
                    placeholder="VD: 8"
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Khách mới
                  </label>
                  <input
                    type="text"
                    value={sale.newCustomers}
                    onChange={(e) => handleSaleChange(idx, 'newCustomers', e.target.value)}
                    placeholder="VD: 1 quán"
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Đơn hàng
                  </label>
                  <input
                    type="text"
                    value={sale.ordersCount}
                    onChange={(e) => handleSaleChange(idx, 'ordersCount', e.target.value)}
                    placeholder="VD: 5 đơn"
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Sản lượng
                  </label>
                  <input
                    type="text"
                    value={sale.volume}
                    onChange={(e) => handleSaleChange(idx, 'volume', e.target.value)}
                    placeholder="VD: 12 bom"
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Tình hình điểm bán của Sale
                </label>
                <input
                  type="text"
                  value={sale.situation}
                  onChange={(e) => handleSaleChange(idx, 'situation', e.target.value)}
                  placeholder="Ghi nhận phản hồi, tốc độ bán bia, công nợ..."
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tổng kết chung của Quản lý kênh */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-l-4 border-indigo-600 pl-3">
          Tổng kết công việc & Đánh giá thị trường trong ngày
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Khách tiềm năng
            </label>
            <textarea
              value={data.potentialCustomers}
              onChange={(e) => onChange({ ...data, potentialCustomers: e.target.value })}
              placeholder="Các quán bia, nhà hàng đang tiếp cận có khả năng lấy hàng cao..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Khách giảm / Khách có nguy cơ mất</span>
            </label>
            <textarea
              value={data.decliningRiskCustomers}
              onChange={(e) => onChange({ ...data, decliningRiskCustomers: e.target.value })}
              placeholder="Điểm bán lấy ít lại, phàn nàn giá cả, đối thủ chào mời..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Vấn đề thị trường
            </label>
            <textarea
              value={data.marketIssues}
              onChange={(e) => onChange({ ...data, marketIssues: e.target.value })}
              placeholder="Giá thị trường, chính sách khuyến mãi của đối thủ, thời tiết..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Đề xuất của Quản lý kênh
            </label>
            <textarea
              value={data.proposal}
              onChange={(e) => onChange({ ...data, proposal: e.target.value })}
              placeholder="Đề xuất hỗ trợ POSM, vòi rót, chính sách giá hoặc điều phối nhân sự..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const QLKenhReportPreview = forwardRef<HTMLDivElement, { data: QLKenhReportData }>(
  ({ data }, ref) => {
    let formattedDate = '';
    if (data.date) {
      const d = new Date(data.date);
      formattedDate = `${format(d, 'EEEE', { locale: vi })}, ngày ${format(d, 'dd')} tháng ${format(d, 'MM')} năm ${format(d, 'yyyy')}`;
    }

    return (
      <div
        ref={ref}
        className="bg-white text-slate-900 w-[800px] mx-auto p-8 shadow-sm border border-slate-200"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-indigo-700 pb-5">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Khối Kinh Doanh & Phân Phối Kênh
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900 mb-1.5">
            Báo Cáo Quản Lý Kênh Bán Hàng
          </h1>
          <div className="text-xs text-slate-500 mt-1 italic">
            {formattedDate || '...'} | Quản lý kênh: <span className="font-semibold text-slate-700">{data.reporter || '...'}</span>
          </div>
        </div>

        {/* Table Sales */}
        <div className="overflow-hidden rounded-xl border border-slate-300 mb-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-indigo-700 text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2 px-2 border-b border-indigo-800 text-center w-8">STT</th>
                <th className="py-2 px-3 border-b border-indigo-800">Tên NV Sale</th>
                <th className="py-2 px-2 border-b border-indigo-800 text-center">Ghé</th>
                <th className="py-2 px-2 border-b border-indigo-800 text-center">Khách mới</th>
                <th className="py-2 px-2 border-b border-indigo-800 text-center">Đơn</th>
                <th className="py-2 px-2 border-b border-indigo-800 text-center">Sản lượng</th>
                <th className="py-2 px-3 border-b border-indigo-800">Tình hình</th>
              </tr>
            </thead>
            <tbody>
              {data.sales.map((sale, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2 px-2 text-center text-slate-500 font-semibold">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-slate-800">{sale.salesRepName || `Sale ${idx + 1}`}</td>
                  <td className="py-2 px-2 text-center font-medium text-slate-700">{sale.visitedCount || '-'}</td>
                  <td className="py-2 px-2 text-center font-medium text-slate-700">{sale.newCustomers || '-'}</td>
                  <td className="py-2 px-2 text-center font-bold text-emerald-700">{sale.ordersCount || '-'}</td>
                  <td className="py-2 px-2 text-center font-bold text-indigo-700">{sale.volume || '-'}</td>
                  <td className="py-2 px-3 text-slate-700">{sale.situation || 'Bình thường'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng kết 4 ô */}
        <div className="grid grid-cols-2 gap-3.5 mb-6 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="font-bold text-emerald-900 mb-1">🎯 Khách tiềm năng:</div>
            <div className="text-slate-800 whitespace-pre-wrap">{data.potentialCustomers || 'Chưa ghi nhận'}</div>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="font-bold text-rose-900 mb-1">⚠️ Khách giảm / Nguy cơ mất:</div>
            <div className="text-slate-800 whitespace-pre-wrap">{data.decliningRiskCustomers || 'Không có'}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="font-bold text-slate-800 mb-1">🌐 Vấn đề thị trường:</div>
            <div className="text-slate-700 whitespace-pre-wrap">{data.marketIssues || 'Ổn định'}</div>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div className="font-bold text-indigo-900 mb-1">💡 Đề xuất:</div>
            <div className="text-slate-800 whitespace-pre-wrap">{data.proposal || 'Không có đề xuất thêm'}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 pt-4">
          <div>
            <p>Báo cáo tự động tạo từ ứng dụng Quản Lý Kênh.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Lưu đồng bộ Google Sheets: Sheet BC QL kênh</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-600">Quản lý kênh ký xác nhận</p>
            <p className="mt-8 font-bold text-slate-900 text-sm">
              {data.reporter ? data.reporter : '(Ký và ghi rõ họ tên)'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

QLKenhReportPreview.displayName = 'QLKenhReportPreview';
