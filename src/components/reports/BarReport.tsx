import React, { forwardRef } from 'react';
import { BAR_CHECKLIST_ITEMS, BarReportData, SYSTEM_LOCATIONS } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BarReportProps {
  data: BarReportData;
  onChange: (data: BarReportData) => void;
}

export function BarReportForm({ data, onChange }: BarReportProps) {
  const handleItemChange = (id: number, value: string) => {
    const newItems = data.items.map((item) =>
      item.id === id ? { ...item, value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const categories = Array.from(new Set(BAR_CHECKLIST_ITEMS.map((item) => item.category)));

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
          Thông tin Báo Cáo Bar & Bia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Cơ sở
            </label>
            <select
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm transition-all"
            >
              <option value="">-- Chọn cơ sở --</option>
              {SYSTEM_LOCATIONS.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Ngày
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Bar trưởng / Người báo cáo
            </label>
            <input
              type="text"
              value={data.reporter}
              onChange={(e) => onChange({ ...data, reporter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm transition-all"
              placeholder="VD: Bar Trưởng Trần Văn C"
            />
          </div>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-900 bg-cyan-50 px-3.5 py-2 rounded-xl border border-cyan-200 inline-block">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-3.5">
            {BAR_CHECKLIST_ITEMS.filter((item) => item.category === category).map((def) => {
              const item = data.items.find((i) => i.id === def.id);
              return (
                <div
                  key={def.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-cyan-300 transition-colors"
                >
                  <div className="mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                        #{def.id}
                      </span>
                      <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                        {def.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 italic pl-8">
                      Gợi ý: {def.example}
                    </p>
                  </div>
                  <textarea
                    value={item?.value || ''}
                    onChange={(e) => handleItemChange(def.id, e.target.value)}
                    placeholder={def.placeholder}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-y min-h-[70px]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export const BarReportPreview = forwardRef<HTMLDivElement, { data: BarReportData }>(
  ({ data }, ref) => {
    let formattedDate = '';
    if (data.date) {
      const d = new Date(data.date);
      formattedDate = `${format(d, 'EEEE', { locale: vi })}, ngày ${format(d, 'dd')} tháng ${format(d, 'MM')} năm ${format(d, 'yyyy')}`;
    }

    const categories = Array.from(new Set(BAR_CHECKLIST_ITEMS.map((item) => item.category)));

    return (
      <div
        ref={ref}
        className="bg-white text-slate-900 w-[800px] mx-auto p-8 shadow-sm border border-slate-200"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-cyan-700 pb-5">
          <div className="inline-block px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Hệ thống Quán Bia Ơi
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900 mb-1.5">
            Báo Cáo Quầy Bar & Bia Hàng Ngày
          </h1>
          <div className="text-base font-semibold text-slate-800">
            Cơ sở: <span className="text-cyan-700 font-bold">{data.location || '...'}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 italic">
            {formattedDate || '...'} | Người phụ trách Bar: <span className="font-semibold text-slate-700">{data.reporter || '...'}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cyan-700 text-white text-xs uppercase tracking-wider font-bold">
                <th className="py-2.5 px-3 border-b border-cyan-800 w-12 text-center">STT</th>
                <th className="py-2.5 px-4 border-b border-cyan-800 w-2/5">Hạng mục Bar & Bia</th>
                <th className="py-2.5 px-4 border-b border-cyan-800">Nội dung chi tiết / Thông số</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {categories.map((category) => (
                <React.Fragment key={category}>
                  <tr className="bg-cyan-50/80">
                    <td
                      colSpan={3}
                      className="py-1.5 px-4 font-bold text-cyan-900 uppercase tracking-tight text-xs border-y border-cyan-200"
                    >
                      {category}
                    </td>
                  </tr>
                  {BAR_CHECKLIST_ITEMS.filter((item) => item.category === category).map((def) => {
                    const item = data.items.find((i) => i.id === def.id);
                    return (
                      <tr
                        key={def.id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-200 last:border-b-0"
                      >
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-500 text-xs align-top">
                          {def.id}
                        </td>
                        <td className="py-2.5 px-4 align-top">
                          <div className="font-semibold text-slate-800 text-xs sm:text-sm">{def.title}</div>
                        </td>
                        <td className="py-2.5 px-4 align-top text-xs sm:text-sm">
                          {item?.value ? (
                            <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                              {item.value}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Đạt chuẩn / Không có phát sinh</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 pt-4">
          <div>
            <p>Báo cáo tự động tạo từ ứng dụng Quầy Bar.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Lưu đồng bộ Google Sheets: Sheet BC Bar</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-600">Phụ trách Bar ký xác nhận</p>
            <p className="mt-8 font-bold text-slate-900 text-sm">
              {data.reporter ? data.reporter : '(Ký và ghi rõ họ tên)'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

BarReportPreview.displayName = 'BarReportPreview';
