import React, { useState } from 'react';
import {
  REPORT_TABS,
  ReportTabMeta,
  ReportType,
} from '../types';
import {
  Building2,
  ChefHat,
  Beer,
  Wine,
  Star,
  Briefcase,
  Truck,
  TrendingUp,
  FileSpreadsheet,
  Search,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Image,
} from 'lucide-react';

interface HomePageProps {
  onSelectReport: (reportId: ReportType) => void;
}

export function HomePage({ onSelectReport }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Cơ sở & Vận hành' | 'Khối Bán hàng & Quản lý'>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

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

  const getReportIcon = (id: ReportType, color: string) => {
    const iconClass = `w-6 h-6`;
    switch (id) {
      case 'van_hanh':
        return <Building2 className={iconClass} />;
      case 'bep':
        return <ChefHat className={iconClass} />;
      case 'bar':
        return <Beer className={iconClass} />;
      case 'tong_bar':
        return <Wine className={iconClass} />;
      case 'cx':
        return <Star className={iconClass} />;
      case 'tql':
        return <Briefcase className={iconClass} />;
      case 'sale_si':
        return <Truck className={iconClass} />;
      case 'ql_kenh':
        return <TrendingUp className={iconClass} />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          bgIcon: 'bg-indigo-600 text-white',
          hoverBorder: 'hover:border-indigo-400',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700',
          glow: 'group-hover:shadow-indigo-100',
        };
      case 'teal':
        return {
          bgBadge: 'bg-teal-50 text-teal-800 border-teal-200',
          bgIcon: 'bg-teal-600 text-white',
          hoverBorder: 'hover:border-teal-400',
          btnBg: 'bg-teal-600 hover:bg-teal-700',
          glow: 'group-hover:shadow-teal-100',
        };
      case 'amber':
        return {
          bgBadge: 'bg-amber-50 text-amber-800 border-amber-200',
          bgIcon: 'bg-amber-600 text-white',
          hoverBorder: 'hover:border-amber-400',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
          glow: 'group-hover:shadow-amber-100',
        };
      case 'cyan':
        return {
          bgBadge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          bgIcon: 'bg-cyan-700 text-white',
          hoverBorder: 'hover:border-cyan-400',
          btnBg: 'bg-cyan-700 hover:bg-cyan-800',
          glow: 'group-hover:shadow-cyan-100',
        };
      case 'rose':
        return {
          bgBadge: 'bg-rose-50 text-rose-700 border-rose-200',
          bgIcon: 'bg-rose-600 text-white',
          hoverBorder: 'hover:border-rose-400',
          btnBg: 'bg-rose-600 hover:bg-rose-700',
          glow: 'group-hover:shadow-rose-100',
        };
      case 'purple':
        return {
          bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
          bgIcon: 'bg-purple-700 text-white',
          hoverBorder: 'hover:border-purple-400',
          btnBg: 'bg-purple-700 hover:bg-purple-800',
          glow: 'group-hover:shadow-purple-100',
        };
      case 'emerald':
        return {
          bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          bgIcon: 'bg-emerald-600 text-white',
          hoverBorder: 'hover:border-emerald-400',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700',
          glow: 'group-hover:shadow-emerald-100',
        };
      case 'blue':
      default:
        return {
          bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
          bgIcon: 'bg-blue-600 text-white',
          hoverBorder: 'hover:border-blue-400',
          btnBg: 'bg-blue-600 hover:bg-blue-700',
          glow: 'group-hover:shadow-blue-100',
        };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Cổng Thông Tin Báo Cáo Chuỗi Quán Bia Ơi
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Hệ Thống Báo Cáo Hàng Ngày & Vận Hành
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Chọn báo cáo để nhập dữ liệu, tự động đồng bộ Google Sheets và xuất ảnh độ phân giải cao gửi nhanh qua Zalo / Tin nhắn. Mỗi báo cáo có đường dẫn truy cập trực tiếp riêng biệt.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>8 Phân hệ chuẩn hóa</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Đồng bộ Webhook Google Sheets</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Image className="w-4 h-4 text-amber-400" />
              <span>Xuất ảnh HD & Copy 1 chạm</span>
            </div>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tất cả báo cáo (7)
          </button>
          <button
            onClick={() => setSelectedCategory('Cơ sở & Vận hành')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'Cơ sở & Vận hành'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🏪 Cơ sở & Vận hành (4)
          </button>
          <button
            onClick={() => setSelectedCategory('Khối Bán hàng & Quản lý')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'Khối Bán hàng & Quản lý'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📊 Khối Bán hàng & Quản lý (3)
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
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-2xs"
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

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const colorStyles = getColorClasses(report.color);
          const isCopied = copiedPath === report.path;

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className={`group bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer ${colorStyles.hoverBorder} ${colorStyles.glow}`}
            >
              {/* Top Card Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`p-3 rounded-2xl shadow-xs transition-transform group-hover:scale-105 duration-200 ${colorStyles.bgIcon}`}
                  >
                    {getReportIcon(report.id, report.color)}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border font-mono ${colorStyles.bgBadge}`}
                    >
                      Sheet: {report.sheetName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
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

                {/* Highlights */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
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
              <div className="pt-5 mt-4 border-t border-slate-100 space-y-3">
                {/* Direct Path Bar with Copy Button */}
                <div className="flex items-center justify-between bg-slate-100/80 rounded-xl px-2.5 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 overflow-hidden">
                    <span className="text-slate-400 text-[11px]">Đường dẫn:</span>
                    <code className="font-mono text-indigo-700 font-bold truncate">
                      {report.path}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(report.path, e)}
                    title="Sao chép link trực tiếp"
                    className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px] font-semibold shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Chép link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Enter Button */}
                <button
                  type="button"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98] ${colorStyles.btnBg}`}
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
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
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
  );
}
