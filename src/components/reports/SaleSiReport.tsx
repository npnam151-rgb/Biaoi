import React, { forwardRef } from 'react';
import { SaleSiReportData } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Truck, Package, ShoppingCart } from 'lucide-react';

interface SaleSiReportProps {
  data: SaleSiReportData;
  onChange: (data: SaleSiReportData) => void;
}

export function SaleSiReportForm({ data, onChange }: SaleSiReportProps) {
  return (
    <div className="space-y-6">
      {/* Thông tin chuyến thăm điểm bán */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span>Thông tin Ghé Thăm Điểm Bán (Sale Sỉ)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Ngày ghé điểm
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Nhân viên Sale phụ trách
            </label>
            <input
              type="text"
              value={data.reporter}
              onChange={(e) => onChange({ ...data, reporter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
              placeholder="VD: Nguyễn Văn Nam"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Thứ tự điểm ghé trong ngày
            </label>
            <input
              type="text"
              value={data.visitOrder}
              onChange={(e) => onChange({ ...data, visitOrder: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
              placeholder="VD: 1 hoặc Điểm thứ 1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Tên điểm bán / Quán / Nhà hàng
            </label>
            <input
              type="text"
              value={data.restaurantName}
              onChange={(e) => onChange({ ...data, restaurantName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
              placeholder="VD: Quán Lẩu Nướng Gió Biển"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Phân loại điểm bán
            </label>
            <select
              value={data.outletType}
              onChange={(e) => onChange({ ...data, outletType: e.target.value as 'Điểm cũ' | 'Điểm mới' })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
            >
              <option value="Điểm cũ">Điểm cũ (Đang lấy bia)</option>
              <option value="Điểm mới">Điểm mới (Mới mở / Tiếp cận)</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Địa chỉ điểm bán
            </label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
              placeholder="VD: Số 45 Nguyễn Tuân, Thanh Xuân, Hà Nội"
            />
          </div>
        </div>
      </div>

      {/* Tồn kho & Đặt hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tồn kho */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
            <Package className="w-4 h-4 text-amber-600" />
            <span>TỒN KHO TẠI ĐIỂM BÁN</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bom 30L (Tồn)</label>
              <input
                type="text"
                value={data.stockBom30L}
                onChange={(e) => onChange({ ...data, stockBom30L: e.target.value })}
                placeholder="VD: 2 bom"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bom 50L (Tồn)</label>
              <input
                type="text"
                value={data.stockBom50L}
                onChange={(e) => onChange({ ...data, stockBom50L: e.target.value })}
                placeholder="VD: 1 bom"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Keg 1L (Tồn)</label>
              <input
                type="text"
                value={data.stockKeg1L}
                onChange={(e) => onChange({ ...data, stockKeg1L: e.target.value })}
                placeholder="VD: 10 chai"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Đặt hàng */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>ĐẶT HÀNG MỚI (LÊN ĐƠN)</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bom 30L (Đặt)</label>
              <input
                type="text"
                value={data.orderBom30L}
                onChange={(e) => onChange({ ...data, orderBom30L: e.target.value })}
                placeholder="VD: 4 bom (giao 16h)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bom 50L (Đặt)</label>
              <input
                type="text"
                value={data.orderBom50L}
                onChange={(e) => onChange({ ...data, orderBom50L: e.target.value })}
                placeholder="VD: 2 bom"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Keg 1L (Đặt)</label>
              <input
                type="text"
                value={data.orderKeg1L}
                onChange={(e) => onChange({ ...data, orderKeg1L: e.target.value })}
                placeholder="VD: 20 chai"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Đánh giá / đề xuất */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Đánh giá tình hình điểm bán & Đề xuất hỗ trợ
        </label>
        <textarea
          value={data.evaluationOrProposal}
          onChange={(e) => onChange({ ...data, evaluationOrProposal: e.target.value })}
          placeholder="Nêu tình hình bán hàng, cạnh tranh đối thủ, khách phản hồi về chất lượng bia, đề xuất cấp biển hiệu/cốc ly..."
          rows={3}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-y min-h-[80px]"
        />
      </div>
    </div>
  );
}

export const SaleSiReportPreview = forwardRef<HTMLDivElement, { data: SaleSiReportData }>(
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
        <div className="text-center mb-6 border-b-2 border-emerald-700 pb-5">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Khối Kinh Doanh & Sale Sỉ
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900 mb-1.5">
            Báo Cáo Ghé Thăm Điểm Bán
          </h1>
          <div className="text-base font-semibold text-slate-800">
            Điểm bán: <span className="text-emerald-700 font-bold">{data.restaurantName || '...'}</span> ({data.outletType})
          </div>
          <div className="text-xs text-slate-500 mt-1 italic">
            {formattedDate || '...'} | Điểm thứ: <strong className="text-slate-800">{data.visitOrder || '1'}</strong> | NV Sale: <span className="font-semibold text-slate-700">{data.reporter || '...'}</span>
          </div>
          {data.address && (
            <div className="text-xs text-slate-600 mt-1">
              📍 Địa chỉ: {data.address}
            </div>
          )}
        </div>

        {/* Bảng tồn kho & đặt hàng */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-amber-100 px-4 py-2 font-bold text-amber-900 text-xs uppercase tracking-wider border-b border-slate-300 text-center">
              📦 Tồn kho tại điểm
            </div>
            <div className="p-3 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Bom 30L:</span>
                <span className="font-bold text-slate-800">{data.stockBom30L || '0'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Bom 50L:</span>
                <span className="font-bold text-slate-800">{data.stockBom50L || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Keg 1L:</span>
                <span className="font-bold text-slate-800">{data.stockKeg1L || '0'}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-emerald-100 px-4 py-2 font-bold text-emerald-900 text-xs uppercase tracking-wider border-b border-slate-300 text-center">
              🛒 Đặt hàng mới
            </div>
            <div className="p-3 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Bom 30L:</span>
                <span className="font-bold text-emerald-700">{data.orderBom30L || '0'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Bom 50L:</span>
                <span className="font-bold text-emerald-700">{data.orderBom50L || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Keg 1L:</span>
                <span className="font-bold text-emerald-700">{data.orderKeg1L || '0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Đánh giá / đề xuất */}
        <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-300">
            📝 Đánh giá tình hình & Đề xuất hỗ trợ
          </div>
          <div className="p-4 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[80px]">
            {data.evaluationOrProposal || 'Không có đề xuất thêm.'}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 pt-4">
          <div>
            <p>Báo cáo tự động tạo từ ứng dụng Sale Sỉ.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Lưu đồng bộ Google Sheets: Sheet BC sale sỉ</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-600">NV Sale báo cáo</p>
            <p className="mt-8 font-bold text-slate-900 text-sm">
              {data.reporter ? data.reporter : '(Ký và ghi rõ họ tên)'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SaleSiReportPreview.displayName = 'SaleSiReportPreview';
