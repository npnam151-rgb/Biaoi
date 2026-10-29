import React, { forwardRef, useState } from 'react';
import { TQLReportData, TQL_STORE_CODES, TQLStoreValues } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Briefcase, Building, Layers, DollarSign, Users } from 'lucide-react';

interface TQLReportProps {
  data: TQLReportData;
  onChange: (data: TQLReportData) => void;
}

export function TQLReportForm({ data, onChange }: TQLReportProps) {
  const [selectedStoreCode, setSelectedStoreCode] = useState<string>('01 DD');

  const handleSystemChange = (field: keyof typeof data.systemEvaluation, val: string) => {
    onChange({
      ...data,
      systemEvaluation: {
        ...data.systemEvaluation,
        [field]: val,
      },
    });
  };

  const handleStoreFieldChange = (storeCode: string, field: keyof TQLStoreValues, val: string) => {
    const currentStore = data.stores[storeCode] || {} as TQLStoreValues;
    onChange({
      ...data,
      stores: {
        ...data.stores,
        [storeCode]: {
          ...currentStore,
          [field]: val,
        },
      },
    });
  };

  const activeStoreData = data.stores[selectedStoreCode] || ({} as TQLStoreValues);

  return (
    <div className="space-y-6">
      {/* Thông tin chung */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <span>Thông tin Báo Cáo Tổng Quản Lý Chuỗi (TQL)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Ngày báo cáo
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Giờ lập
            </label>
            <input
              type="text"
              value={data.time}
              onChange={(e) => onChange({ ...data, time: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all"
              placeholder="VD: 23:30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Tổng Quản Lý / Người báo cáo
            </label>
            <input
              type="text"
              value={data.reporter}
              onChange={(e) => onChange({ ...data, reporter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all"
              placeholder="VD: Nguyễn Văn Nam (TQL)"
            />
          </div>
        </div>
      </div>

      {/* Đánh giá chung toàn hệ thống */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900 border-l-4 border-purple-600 pl-3">
          1. Đánh giá chung toàn hệ thống (Cả chuỗi)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              DT toàn hệ thống
            </label>
            <input
              type="text"
              value={data.systemEvaluation.dt_toan_he_thong}
              onChange={(e) => handleSystemChange('dt_toan_he_thong', e.target.value)}
              placeholder="VD: 125.000.000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Mục tiêu ngày
            </label>
            <input
              type="text"
              value={data.systemEvaluation.muc_tieu_ngay}
              onChange={(e) => handleSystemChange('muc_tieu_ngay', e.target.value)}
              placeholder="VD: 140.000.000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tăng/giảm so hôm trước
            </label>
            <input
              type="text"
              value={data.systemEvaluation.tang_giam_hom_truoc}
              onChange={(e) => handleSystemChange('tang_giam_hom_truoc', e.target.value)}
              placeholder="VD: +15%"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tổng lượt khách
            </label>
            <input
              type="text"
              value={data.systemEvaluation.tong_luot_khach}
              onChange={(e) => handleSystemChange('tong_luot_khach', e.target.value)}
              placeholder="VD: 480 khách"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Số bàn phục vụ
            </label>
            <input
              type="text"
              value={data.systemEvaluation.so_ban_phuc_vu}
              onChange={(e) => handleSystemChange('so_ban_phuc_vu', e.target.value)}
              placeholder="VD: 120 bàn"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              DT TB/khách
            </label>
            <input
              type="text"
              value={data.systemEvaluation.dt_tb_khach}
              onChange={(e) => handleSystemChange('dt_tb_khach', e.target.value)}
              placeholder="VD: 260.000đ"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Xếp hạng DT các cơ sở
            </label>
            <input
              type="text"
              value={data.systemEvaluation.xep_hang_dt}
              onChange={(e) => handleSystemChange('xep_hang_dt', e.target.value)}
              placeholder="VD: 12 ĐT > 94 LĐ > 01 DD..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div className="col-span-2 sm:col-span-3 md:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Ý kiến khác / Chỉ đạo của TQL
            </label>
            <textarea
              value={data.systemEvaluation.y_kien_khac}
              onChange={(e) => handleSystemChange('y_kien_khac', e.target.value)}
              placeholder="Ý kiến chỉ đạo chung toàn chuỗi, công việc trọng tâm ngày mai..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Chi tiết theo từng cơ sở */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900 border-l-4 border-purple-600 pl-3">
            2. Nghiệp vụ chi tiết theo cơ sở
          </h3>
          <span className="text-xs text-slate-500">Chọn cơ sở để nhập:</span>
        </div>

        {/* Tab 6 cơ sở */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
          {TQL_STORE_CODES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelectedStoreCode(code)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedStoreCode === code
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Các mục theo nhóm cho cơ sở đang chọn */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 bg-purple-50 text-purple-950 p-2.5 rounded-xl border border-purple-200 text-xs font-semibold">
            <Building className="w-4 h-4 text-purple-600" />
            <span>Đang nhập dữ liệu cho cơ sở: <strong>{selectedStoreCode}</strong></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nhóm Nhân sự */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase">👥 Nhân sự ({selectedStoreCode})</span>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Tổng NS bàn đi làm</label>
                <input
                  type="text"
                  value={activeStoreData.tong_ns_di_lam || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'tong_ns_di_lam', e.target.value)}
                  placeholder="VD: 8 người"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Nghỉ đột xuất</label>
                  <input
                    type="text"
                    value={activeStoreData.ns_nghi_dot_xuat || ''}
                    onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'ns_nghi_dot_xuat', e.target.value)}
                    placeholder="VD: 0"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Nghỉ hẳn / Mới</label>
                  <input
                    type="text"
                    value={activeStoreData.ns_moi || ''}
                    onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'ns_moi', e.target.value)}
                    placeholder="VD: 1 mới"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Nhóm Sửa chữa */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase">🔧 Sửa chữa ({selectedStoreCode})</span>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Hỏng hóc cần sửa</label>
                <input
                  type="text"
                  value={activeStoreData.hong_hoc_can_sua || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'hong_hoc_can_sua', e.target.value)}
                  placeholder="VD: Đèn rọi quầy bar"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Hạng mục đã sửa trong ngày</label>
                <input
                  type="text"
                  value={activeStoreData.hang_muc_sua_trong_ngay || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'hang_muc_sua_trong_ngay', e.target.value)}
                  placeholder="VD: Đã sửa bản lề cửa"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Nhóm Phục vụ & Vận hành */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase">🍽️ Phục vụ ({selectedStoreCode})</span>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Xếp bàn & đón tiếp</label>
                <input
                  type="text"
                  value={activeStoreData.xep_ban || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'xep_ban', e.target.value)}
                  placeholder="Tốt, chủ động"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Tốc độ ra đồ / Vấn đề phát sinh</label>
                <input
                  type="text"
                  value={activeStoreData.vd_phat_sinh_pv || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'vd_phat_sinh_pv', e.target.value)}
                  placeholder="Không phát sinh / Giờ cao điểm chậm 10p"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Nhóm Bia & Món ăn */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase">🍺 Bia & Món ăn ({selectedStoreCode})</span>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Món bán chạy</label>
                <input
                  type="text"
                  value={activeStoreData.mon_ban_chay || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'mon_ban_chay', e.target.value)}
                  placeholder="VD: Má đào, Lẩu riêu"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Phản hồi của khách về bia / món</label>
                <input
                  type="text"
                  value={activeStoreData.phan_hoi_khach_bia || ''}
                  onChange={(e) => handleStoreFieldChange(selectedStoreCode, 'phan_hoi_khach_bia', e.target.value)}
                  placeholder="Bia lạnh ngon, khách khen"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TQLReportPreview = forwardRef<HTMLDivElement, { data: TQLReportData }>(
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
        <div className="text-center mb-6 border-b-2 border-purple-800 pb-5">
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Ban Quản Trị Hệ Thống Bia Ơi
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900 mb-1.5">
            Báo Cáo Tổng Quản Lý Chuỗi (TQL)
          </h1>
          <div className="text-xs text-slate-500 mt-1 italic">
            {formattedDate || '...'} {data.time ? `(${data.time})` : ''} | Tổng quản lý: <span className="font-semibold text-slate-700">{data.reporter || '...'}</span>
          </div>
        </div>

        {/* Bảng đánh giá chung toàn chuỗi */}
        <div className="mb-6 border border-slate-300 rounded-xl overflow-hidden">
          <div className="bg-purple-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
            📊 Tổng quan toàn hệ thống (Cả chuỗi)
          </div>
          <div className="grid grid-cols-3 divide-x divide-y divide-slate-200 text-xs">
            <div className="p-3">
              <span className="text-slate-500 block">DT Toàn hệ thống:</span>
              <span className="font-bold text-purple-800 text-sm">{data.systemEvaluation.dt_toan_he_thong || '-'}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-500 block">Mục tiêu ngày:</span>
              <span className="font-bold text-slate-800 text-sm">{data.systemEvaluation.muc_tieu_ngay || '-'}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-500 block">Tăng/giảm hôm trước:</span>
              <span className="font-bold text-emerald-700 text-sm">{data.systemEvaluation.tang_giam_hom_truoc || '-'}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-500 block">Tổng khách / Số bàn:</span>
              <span className="font-semibold text-slate-800">{data.systemEvaluation.tong_luot_khach || '-'} / {data.systemEvaluation.so_ban_phuc_vu || '-'}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-500 block">DT TB / Khách:</span>
              <span className="font-semibold text-slate-800">{data.systemEvaluation.dt_tb_khach || '-'}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-500 block">Xếp hạng DT:</span>
              <span className="font-semibold text-slate-800">{data.systemEvaluation.xep_hang_dt || '-'}</span>
            </div>
          </div>
        </div>

        {/* Bảng so sánh 6 cơ sở */}
        <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
          <div className="bg-slate-100 text-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b border-slate-300">
            🏢 Tình hình vận hành 6 cơ sở
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                <th className="p-2 border-r border-slate-200 w-16 text-center">Cơ sở</th>
                <th className="p-2 border-r border-slate-200 w-24">Nhân sự</th>
                <th className="p-2 border-r border-slate-200">Phục vụ & Vận hành</th>
                <th className="p-2 border-r border-slate-200">Bia & Món chạy</th>
                <th className="p-2">Sửa chữa</th>
              </tr>
            </thead>
            <tbody>
              {TQL_STORE_CODES.map((code) => {
                const st = data.stores[code] || {} as TQLStoreValues;
                return (
                  <tr key={code} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50">
                    <td className="p-2 text-center font-bold text-purple-900 border-r border-slate-200 bg-purple-50/30">
                      {code}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <div>Đi làm: <strong>{st.tong_ns_di_lam || '-'}</strong></div>
                      {st.ns_moi && <div className="text-[11px] text-slate-500">Mới: {st.ns_moi}</div>}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <div>{st.xep_ban || 'Bình thường'}</div>
                      {st.vd_phat_sinh_pv && <div className="text-[11px] text-amber-700">PS: {st.vd_phat_sinh_pv}</div>}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <div>Món: {st.mon_ban_chay || '-'}</div>
                      <div className="text-[11px] text-slate-500">Bia: {st.phan_hoi_khach_bia || 'Đạt'}</div>
                    </td>
                    <td className="p-2 text-slate-700">
                      {st.hong_hoc_can_sua ? (
                        <span className="text-rose-700 font-medium">{st.hong_hoc_can_sua}</span>
                      ) : (
                        <span className="text-slate-400 italic">Không</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ý kiến khác */}
        {data.systemEvaluation.y_kien_khac && (
          <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl text-xs mb-6">
            <span className="font-bold text-purple-900 block mb-0.5">📌 Ý kiến chỉ đạo của TQL:</span>
            <p className="text-slate-800 whitespace-pre-wrap">{data.systemEvaluation.y_kien_khac}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 pt-4">
          <div>
            <p>Báo cáo tự động tạo từ ứng dụng Tổng Quản Lý Chuỗi.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Lưu đồng bộ Google Sheets: Sheet BC TQL</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-600">Tổng Quản Lý duyệt</p>
            <p className="mt-8 font-bold text-slate-900 text-sm">
              {data.reporter ? data.reporter : '(Ký và ghi rõ họ tên)'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

TQLReportPreview.displayName = 'TQLReportPreview';
