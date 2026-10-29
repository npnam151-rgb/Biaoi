import React, { forwardRef } from 'react';
import { CXReportData, SYSTEM_LOCATIONS } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface CXReportProps {
  data: CXReportData;
  onChange: (data: CXReportData) => void;
}

export function CXReportForm({ data, onChange }: CXReportProps) {
  const handleScoreChange = (id: number, score: number) => {
    const newItems = data.items.map((item) =>
      item.id === id ? { ...item, score } : item
    );
    const total = newItems.reduce((acc, curr) => acc + (curr.score || 0), 0);
    onChange({ ...data, items: newItems, totalScore: total });
  };

  const handleNotesChange = (id: number, notes: string) => {
    const newItems = data.items.map((item) =>
      item.id === id ? { ...item, notes } : item
    );
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Thông tin Báo Cáo Trải Nghiệm Khách Hàng (CX)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-bold text-sm">
            <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Tổng: {data.totalScore}/70đ</span>
          </div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Cơ sở
            </label>
            <select
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm transition-all"
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
              Ngày kiểm tra
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Chuyên viên CX / Người đánh giá
            </label>
            <input
              type="text"
              value={data.reporter}
              onChange={(e) => onChange({ ...data, reporter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm transition-all"
              placeholder="VD: Hoàng Thanh Huyền (CX)"
            />
          </div>
        </div>
      </div>

      {/* Danh sách 7 tiêu chí CX */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 inline-block">
          Tiêu chuẩn dịch vụ & Đánh giá trải nghiệm
        </h3>
        <div className="grid grid-cols-1 gap-3.5">
          {data.items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-rose-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    Tiêu chí {index + 1}
                  </span>
                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                    {item.title}
                  </h4>
                </div>
                
                {/* Score Selector (1-10) */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-xs text-slate-500 font-medium mr-1">Điểm:</span>
                  <div className="flex gap-1">
                    {[6, 7, 8, 9, 10].map((scoreVal) => (
                      <button
                        key={scoreVal}
                        type="button"
                        onClick={() => handleScoreChange(item.id, scoreVal)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          item.score === scoreVal
                            ? 'bg-rose-600 text-white shadow-xs scale-105'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {scoreVal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                value={item.notes}
                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                placeholder="Ghi chú chi tiết hiện trạng, trường hợp phục vụ tốt hoặc lỗi cần khắc phục..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-y min-h-[60px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const CXReportPreview = forwardRef<HTMLDivElement, { data: CXReportData }>(
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
        <div className="text-center mb-6 border-b-2 border-rose-600 pb-5">
          <div className="inline-block px-3 py-1 bg-rose-100 text-rose-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Khối Dịch Vụ & Trải Nghiệm Khách Hàng
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900 mb-1.5">
            Báo Cáo Đánh Giá Trải Nghiệm (CX)
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm font-semibold text-slate-800">
            <span>Cơ sở: <strong className="text-rose-700">{data.location || '...'}</strong></span>
            <span>•</span>
            <span>Tổng điểm: <strong className="text-rose-700 text-base">{data.totalScore}/70</strong></span>
          </div>
          <div className="text-xs text-slate-500 mt-1 italic">
            {formattedDate || '...'} | Chuyên viên CX: <span className="font-semibold text-slate-700">{data.reporter || '...'}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-600 text-white text-xs uppercase tracking-wider font-bold">
                <th className="py-2.5 px-3 border-b border-rose-700 w-12 text-center">STT</th>
                <th className="py-2.5 px-4 border-b border-rose-700 w-1/3">Tiêu chí dịch vụ</th>
                <th className="py-2.5 px-3 border-b border-rose-700 w-20 text-center">Điểm</th>
                <th className="py-2.5 px-4 border-b border-rose-700">Chi tiết hiện trạng & Ghi chú</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.items.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors border-b border-slate-200 last:border-b-0"
                >
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-500 text-xs align-top">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-4 align-top">
                    <div className="font-semibold text-slate-800 text-xs sm:text-sm">{item.title}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center align-top">
                    <span className="inline-block px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg text-xs border border-rose-200">
                      {item.score}/10
                    </span>
                  </td>
                  <td className="py-2.5 px-4 align-top text-xs sm:text-sm">
                    {item.notes ? (
                      <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                        {item.notes}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Đạt chuẩn / Không có vi phạm</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 pt-4">
          <div>
            <p>Báo cáo tự động tạo từ ứng dụng CX.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Lưu đồng bộ Google Sheets: Sheet BC CX</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-600">Chuyên viên CX ký nhận</p>
            <p className="mt-8 font-bold text-slate-900 text-sm">
              {data.reporter ? data.reporter : '(Ký và ghi rõ họ tên)'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CXReportPreview.displayName = 'CXReportPreview';
