import React, { useState } from 'react';
import {
  REPORT_TABS,
  ReportType,
} from '../types';
import {
  FileSpreadsheet,
  Search,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';

import iconVanHanh from '../assets/images/icon_van_hanh_1793262711841.jpg';
import iconBep from '../assets/images/icon_bep_1793262728394.jpg';
import iconBar from '../assets/images/icon_bar_1793262729179.jpg';
import iconTongBar from '../assets/images/icon_tong_bar_1793262729819.jpg';
import iconCx from '../assets/images/icon_cx_1793262745135.jpg';
import iconTql from '../assets/images/icon_tql_1793262745426.jpg';
import iconSaleSi from '../assets/images/icon_sale_si_1793262748009.jpg';
import iconQlKenh from '../assets/images/icon_ql_kenh_1793262746158.jpg';

export const REPORT_3D_ICONS: Record<ReportType, string> = {
  van_hanh: iconVanHanh,
  bep: iconBep,
  bar: iconBar,
  tong_bar: iconTongBar,
  cx: iconCx,
  tql: iconTql,
  sale_si: iconSaleSi,
  ql_kenh: iconQlKenh,
};

interface HomePageProps {
  onSelectReport: (reportId: ReportType) => void;
}

export function HomePage({ onSelectReport }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Cơ sở & Vận hành' | 'Khối Bán hàng & Quản lý'>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const countAll = REPORT_TABS.length;
  const countCoSo = REPORT_TABS.filter((r) => r.category === 'Cơ sở & Vận hành').length;
  const countKhoiQL = REPORT_TABS.filter((r) => r.category === 'Khối Bán hàng & Quản lý').length;

  const filteredReports = REPORT_TABS.filter((report) => {
    const matchesCategory =
      selectedCategory === 'all' || report.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      query === '' ||
      report.name.toLowerCase().includes(query) ||
      report.shortName.toLowerCase().includes(query) ||
      report.desc.toLowerCase().includes(query) ||
      report.sheetName.toLowerCase().includes(query) ||
      report.path.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const handleCopyLink = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = window.location.origin;
    const fullUrl = `${origin}${path}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2500);
    });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          bgBadge: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
          hoverBorder: 'hover:border-indigo-400/80',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
          glow: 'group-hover:shadow-indigo-500/10',
          accent: 'from-indigo-500/10 to-indigo-500/0',
        };
      case 'teal':
        return {
          bgBadge: 'bg-teal-50/80 text-teal-800 border-teal-200/60',
          hoverBorder: 'hover:border-teal-400/80',
          btnBg: 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20',
          glow: 'group-hover:shadow-teal-500/10',
          accent: 'from-teal-500/10 to-teal-500/0',
        };
      case 'amber':
        return {
          bgBadge: 'bg-amber-50/80 text-amber-800 border-amber-200/60',
          hoverBorder: 'hover:border-amber-400/80',
          btnBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20',
          glow: 'group-hover:shadow-amber-500/10',
          accent: 'from-amber-500/10 to-amber-500/0',
        };
      case 'cyan':
        return {
          bgBadge: 'bg-cyan-50/80 text-cyan-800 border-cyan-200/60',
          hoverBorder: 'hover:border-cyan-400/80',
          btnBg: 'bg-cyan-700 hover:bg-cyan-800 shadow-cyan-500/20',
          glow: 'group-hover:shadow-cyan-500/10',
          accent: 'from-cyan-500/10 to-cyan-500/0',
        };
      case 'rose':
        return {
          bgBadge: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
          hoverBorder: 'hover:border-rose-400/80',
          btnBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20',
          glow: 'group-hover:shadow-rose-500/10',
          accent: 'from-rose-500/10 to-rose-500/0',
        };
      case 'purple':
        return {
          bgBadge: 'bg-purple-50/80 text-purple-700 border-purple-200/60',
          hoverBorder: 'hover:border-purple-400/80',
          btnBg: 'bg-purple-700 hover:bg-purple-800 shadow-purple-500/20',
          glow: 'group-hover:shadow-purple-500/10',
          accent: 'from-purple-500/10 to-purple-500/0',
        };
      case 'emerald':
        return {
          bgBadge: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/60',
          hoverBorder: 'hover:border-emerald-400/80',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20',
          glow: 'group-hover:shadow-emerald-500/10',
          accent: 'from-emerald-500/10 to-emerald-500/0',
        };
      case 'blue':
      default:
        return {
          bgBadge: 'bg-blue-50/80 text-blue-700 border-blue-200/60',
          hoverBorder: 'hover:border-blue-400/80',
          btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
          glow: 'group-hover:shadow-blue-500/10',
          accent: 'from-blue-500/10 to-blue-500/0',
        };
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Ambient background light orbs for Glassmorphism refraction */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Glassmorphic Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-slate-900/95 text-white p-6 sm:p-10 shadow-2xl border border-white/15">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/10 text-indigo-200 border border-white/20 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Cổng Thông Tin Báo Cáo Chuỗi Quán Bia Ơi</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
              Hệ Thống Báo Cáo Hàng Ngày & Vận Hành
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Chọn báo cáo để nhập dữ liệu chuẩn xác, tự động đồng bộ Webhook Google Sheets và xuất ảnh chất lượng cao 1-chạm gửi nhanh qua Zalo. Mỗi báo cáo có đường dẫn riêng biệt.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">8 Phân hệ 3D trực quan</span>
              </div>
              <div className="flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 shadow-2xs">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">Đồng bộ Google Sheets</span>
              </div>
              <div className="flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="font-medium">Giao diện Glassmorphism HD</span>
              </div>
            </div>
          </div>

          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </div>

        {/* Filter & Search Bar with Glassmorphic styling */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all backdrop-blur-md ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md border border-slate-700'
                  : 'bg-white/70 hover:bg-white text-slate-700 border border-white/80 shadow-2xs'
              }`}
            >
              Tất cả báo cáo ({countAll})
            </button>
            <button
              onClick={() => setSelectedCategory('Cơ sở & Vận hành')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all backdrop-blur-md ${
                selectedCategory === 'Cơ sở & Vận hành'
                  ? 'bg-slate-900 text-white shadow-md border border-slate-700'
                  : 'bg-white/70 hover:bg-white text-slate-700 border border-white/80 shadow-2xs'
              }`}
            >
              🏪 Cơ sở & Vận hành ({countCoSo})
            </button>
            <button
              onClick={() => setSelectedCategory('Khối Bán hàng & Quản lý')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all backdrop-blur-md ${
                selectedCategory === 'Khối Bán hàng & Quản lý'
                  ? 'bg-slate-900 text-white shadow-md border border-slate-700'
                  : 'bg-white/70 hover:bg-white text-slate-700 border border-white/80 shadow-2xs'
              }`}
            >
              📊 Khối Bán hàng & Quản lý ({countKhoiQL})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên báo cáo, sheet..."
              className="w-full pl-9 pr-4 py-2 backdrop-blur-md bg-white/75 hover:bg-white/95 focus:bg-white border border-white/80 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Reports Grid with Glassmorphic Cards & 3D Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const colorStyles = getColorClasses(report.color);
            const isCopied = copiedPath === report.path;
            const icon3d = REPORT_3D_ICONS[report.id];

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report.id)}
                className={`group relative backdrop-blur-xl bg-white/75 hover:bg-white/95 rounded-3xl p-6 border border-white/80 shadow-lg shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${colorStyles.hoverBorder} ${colorStyles.glow}`}
              >
                {/* Specular glass reflection line at the top of the card */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
                
                {/* Subtle gradient accent in card corner */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${colorStyles.accent} rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60`} />

                {/* Top Card Info */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    {/* Glassmorphic 3D Icon Container */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 backdrop-blur-md bg-white/85 border border-white shadow-md shadow-slate-300/40 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={icon3d}
                        alt={report.name}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border font-mono backdrop-blur-md shadow-2xs ${colorStyles.bgBadge}`}
                      >
                        Sheet: {report.sheetName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {report.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {report.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {report.desc}
                    </p>
                  </div>

                  {/* Highlights with subtle glass background */}
                  <div className="backdrop-blur-md bg-slate-50/70 rounded-2xl p-3 border border-slate-200/60 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Nội dung báo cáo:
                    </span>
                    {report.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions & Path */}
                <div className="pt-5 mt-4 border-t border-slate-100/80 space-y-3 relative z-10">
                  {/* Direct Path Bar with Copy Button */}
                  <div className="flex items-center justify-between backdrop-blur-md bg-slate-100/70 hover:bg-slate-100/90 border border-white/60 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-600 overflow-hidden">
                      <span className="text-slate-400 text-[11px]">Đường dẫn:</span>
                      <code className="font-mono text-indigo-700 font-bold truncate">
                        {report.path}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(report.path, e)}
                      title="Copy link trực tiếp"
                      className="p-1 hover:bg-white/90 rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px] font-semibold shrink-0 shadow-2xs"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Đã copy</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Open Report Button with Glass Glow */}
                  <button
                    type="button"
                    className={`relative overflow-hidden w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] ${colorStyles.btnBg}`}
                  >
                    <span>Mở Báo Cáo</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-16 backdrop-blur-xl bg-white/75 rounded-3xl border border-white/80 p-8 shadow-sm">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy báo cáo phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng thử lại với từ khóa khác như "bếp", "bar", "vận hành", "sale"...
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl"
            >
              Hiện lại tất cả báo cáo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
