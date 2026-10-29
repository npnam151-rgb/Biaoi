export type ReportType =
  | 'van_hanh'
  | 'bep'
  | 'bar'
  | 'cx'
  | 'tql'
  | 'sale_si'
  | 'ql_kenh';

export interface ReportTabMeta {
  id: ReportType;
  path: string;
  sheetName: string;
  name: string;
  shortName: string;
  desc: string;
  iconName: string;
  color: string;
  category: 'Cơ sở & Vận hành' | 'Khối Bán hàng & Quản lý';
  highlights: string[];
}

export const REPORT_TABS: ReportTabMeta[] = [
  {
    id: 'van_hanh',
    path: '/van-hanh',
    sheetName: 'BC Vận hành',
    name: 'Báo Cáo Vận Hành Cơ Sở',
    shortName: 'BC Vận Hành',
    desc: 'Nhân sự, sửa chữa, kinh doanh & hỗ trợ tại từng cơ sở',
    iconName: 'Building2',
    color: 'indigo',
    category: 'Cơ sở & Vận hành',
    highlights: ['20 chỉ tiêu vận hành cơ sở', 'Nhân sự, Sửa chữa & Kinh doanh', 'Thời gian hỗ trợ CX & Tổng Bar'],
  },
  {
    id: 'bep',
    path: '/bep',
    sheetName: 'BC Bếp',
    name: 'Báo Cáo Vận Hành Bếp',
    shortName: 'BC Bếp',
    desc: 'Nhân sự bếp, thực phẩm, sự cố ra món & trang thiết bị bếp',
    iconName: 'ChefHat',
    color: 'amber',
    category: 'Cơ sở & Vận hành',
    highlights: ['9 chỉ tiêu vận hành bếp', 'Hàng đặt, món chạy, sự cố ra món', 'CCDC & trang thiết bị hỏng/sửa'],
  },
  {
    id: 'bar',
    path: '/bar',
    sheetName: 'BC Bar',
    name: 'Báo Cáo Quầy Bar & Bia',
    shortName: 'BC Bar',
    desc: 'Nhiệt độ bia, máy rót, tồn kho bom bia & vệ sinh quầy',
    iconName: 'Beer',
    color: 'cyan',
    category: 'Cơ sở & Vận hành',
    highlights: ['Nhiệt độ bảo quản bia & máy rót', 'Tồn kho bom 30L / 50L / Keg 1L', 'Vệ sinh đường ống & vòi rót'],
  },
  {
    id: 'cx',
    path: '/cx',
    sheetName: 'BC CX',
    name: 'Báo Cáo Trải Nghiệm Khách Hàng (CX)',
    shortName: 'BC CX',
    desc: 'Chất lượng phục vụ, đón tiếp, vệ sinh & điểm số đánh giá',
    iconName: 'Star',
    color: 'rose',
    category: 'Cơ sở & Vận hành',
    highlights: ['7 tiêu chuẩn dịch vụ khách hàng', 'Thang điểm 1-10 & tổng điểm tự động', 'Ghi chú thực tế & lỗi phát sinh'],
  },
  {
    id: 'tql',
    path: '/tql',
    sheetName: 'BC TQL',
    name: 'Báo Cáo Tổng Quản Lý Chuỗi',
    shortName: 'BC Tổng QL',
    desc: 'Đánh giá toàn chuỗi & nghiệp vụ 6 cơ sở vận hành',
    iconName: 'Briefcase',
    color: 'purple',
    category: 'Khối Bán hàng & Quản lý',
    highlights: ['Đánh giá doanh thu toàn chuỗi', 'Chi tiết 6 cơ sở vận hành', 'Ý kiến chỉ đạo của Tổng Quản Lý'],
  },
  {
    id: 'sale_si',
    path: '/sale-si',
    sheetName: 'BC sale sỉ',
    name: 'Báo Cáo Sale Sỉ & Điểm Bán',
    shortName: 'BC Sale Sỉ',
    desc: 'Ghé điểm bán, tồn kho & đặt hàng Bom 30L, 50L, Keg 1L',
    iconName: 'Truck',
    color: 'emerald',
    category: 'Khối Bán hàng & Quản lý',
    highlights: ['Chăm sóc điểm bán cũ & mở mới', 'Bảng tồn kho & đặt hàng nhanh', 'Đánh giá thị trường & đối thủ'],
  },
  {
    id: 'ql_kenh',
    path: '/ql-kenh',
    sheetName: 'BC QL kênh',
    name: 'Báo Cáo Quản Lý Kênh Phân Phối',
    shortName: 'BC QL Kênh',
    desc: 'Kết quả 5 NV Sale, khách tiềm năng, nguy cơ & thị trường',
    iconName: 'TrendingUp',
    color: 'blue',
    category: 'Khối Bán hàng & Quản lý',
    highlights: ['Bảng kết quả các nhân viên Sale', 'Khách tiềm năng & nguy cơ mất', 'Vấn đề thị trường & đề xuất'],
  },
];

export const SYSTEM_LOCATIONS = [
  { code: '94LĐ', name: '94 Lò Đúc' },
  { code: '96HT', name: '96 Hồng Tiến' },
  { code: '98VTP', name: '98 Vũ Trọng Phụng' },
  { code: '01 ĐD', name: '01 Đặng Dung' },
  { code: '3D NVH', name: '3D Nguyễn Văn Huyên' },
  { code: '12BĐT', name: '12B Đào Tấn' },
];

export const TQL_STORE_CODES = ['01 DD', '03 NVH', '12 ĐT', '94 LĐ', '96 HT', '98 VTP'];

// ==========================================
// 1. BC VẬN HÀNH
// ==========================================
export interface ChecklistItemDef {
  id: number;
  title: string;
  category: string;
  placeholder: string;
  example: string;
}

export interface ReportItem {
  id: number;
  value: string;
}

export interface ReportData {
  location: string;
  date: string;
  reporter: string;
  items: ReportItem[];
}

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  // NHÂN SỰ
  { id: 1, category: 'NHÂN SỰ', title: 'Nhân viên mới', placeholder: 'Ghi số lượng và tên NV, vị trí', example: 'SL: 2. Phương CS PT, Hồng boy FT' },
  { id: 2, category: 'NHÂN SỰ', title: 'Nhân viên nghỉ việc (đột xuất/nghỉ hẳn/cho nghỉ)', placeholder: 'Ghi rõ tên người và lý do', example: 'Hồng Cs nghỉ đột suất có phép từ 1/4. Hùng boy đuổi việc không lương' },
  { id: 3, category: 'NHÂN SỰ', title: 'Số lượng nhân viên làm trong ngày', placeholder: 'Ghi SL bàn và bếp', example: 'SL bàn: 10ng. SL bếp: 8ng' },
  { id: 4, category: 'NHÂN SỰ', title: 'Nhân viên vi phạm quy định', placeholder: 'Ghi tên và lỗi cụ thể', example: 'Hồng không mặc đồng phục' },
  { id: 5, category: 'NHÂN SỰ', title: 'Số lượng nv ngủ tại CH', placeholder: 'Ghi SL và tên cụ thể', example: '1ng: Nhất' },
  { id: 6, category: 'NHÂN SỰ', title: 'Đào tạo nhân viên', placeholder: 'Ghi tên và nội dung đào tạo', example: 'Đào tạo nội qui làm việc: Hồng. Đào tạo cách giới thiệu menu: Đức' },
  
  // SỬA CHỮA
  { id: 7, category: 'SỬA CHỮA', title: 'Thiết bị, hạng mục cần sửa chữa', placeholder: 'Ghi các hạng mục hỏng', example: 'Biển Bia Ơi bị cháy. Toilet nam bị hỏng nút giật nước' },
  { id: 8, category: 'SỬA CHỮA', title: 'Thiết bị đã sửa trong ngày', placeholder: 'Ghi các hạng mục đã sửa', example: 'Thông cống bếp. Màn led tầng 3' },
  
  // KINH DOANH
  { id: 9, category: 'KINH DOANH', title: 'Món ăn bán chạy trong ngày', placeholder: 'Ghi SL và tên món bán được nhiều nhất trong ngày', example: 'Má đào thanh đao: 10 suất. Gà nướng mật ong: 8 suất' },
  { id: 10, category: 'KINH DOANH', title: 'Món lên chậm nhất', placeholder: 'Ghi tên món và thời gian ra đồ', example: 'Giò heo giòn da: 30ph' },
  { id: 11, category: 'KINH DOANH', title: 'Phản hồi không tốt của KH', placeholder: 'Ghi ý kiến không hài lòng của KH', example: 'Toilet có mùi. Tính phí mang đồ vào đắt' },
  { id: 12, category: 'KINH DOANH', title: 'Số bill chênh lệch tạm tính và thanh toán', placeholder: 'Ghi số lượng và nguyên nhân', example: '2 bill. Do Cs ko check kỹ đồ' },
  { id: 13, category: 'KINH DOANH', title: 'CTKM áp dụng trong ngày', placeholder: 'Ghi tên CTKM', example: 'Đặt bàn off 5%. Ngày hội Bia Ơi' },
  { id: 14, category: 'KINH DOANH', title: 'Hoạt động offline trong ngày', placeholder: 'Nêu các HĐ offline, event diễn ra tại địa điểm', example: 'Có band nhạc acoustic, Giao lưu fan club' },
  { id: 15, category: 'KINH DOANH', title: 'Xuất bán đơn khách tiệc', placeholder: 'Ghi đơn bán khách tiệc phát sinh trong ngày VD: 2 bom 50l', example: '2 bom 50l' },
  { id: 16, category: 'KINH DOANH', title: 'Số lượng Thành viên tích điểm/ tổng bill', placeholder: 'Ghi số lượng thành viên tích điểm trong ngày / tổng số bill bán trong ngày', example: '15/50 bill' },
  { id: 17, category: 'KINH DOANH', title: 'Phát sinh bất thường trong ngày', placeholder: 'Ghi các bất thường trong ngày', example: 'Công an đến thu biển. KH say ngã ở toilet... Đông khách đột biến nên thiếu nhân sự bếp nên đồ ra lâu' },
  { id: 18, category: 'KINH DOANH', title: 'Đề xuất', placeholder: 'Nêu ý kiến cải tiến, đề xuất, hiện trạng', example: 'Bổ sung thêm 8 ghế và 5 bàn' },

  // THEO DÕI HỖ TRỢ
  { id: 19, category: 'THEO DÕI HỖ TRỢ', title: 'Thời gian CX làm việc đến lv và về', placeholder: 'Ghi tên nhân viên CX và thời gian đến làm việc, thời gian về', example: 'Ly: đến 17h00 - về 21h30' },
  { id: 20, category: 'THEO DÕI HỖ TRỢ', title: 'Thời gian Tổng bar đến lv và về', placeholder: 'Ghi tên Tổng bar và thời gian đến làm việc, thời gian về', example: 'Lâm: đến 17h00 - về 21h30' },
];

// ==========================================
// 2. BC BẾP
// ==========================================
export const BEP_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 201, category: 'NHÂN SỰ', title: 'Có đủ nv làm việc trong ngày?', placeholder: 'Ghi đủ hoặc thiếu bao nhiêu nhân sự, ca làm', example: 'Đủ 6 nhân sự ca sáng, thiếu 1 phụ bếp ca tối' },
  { id: 202, category: 'NHÂN SỰ', title: 'Có nv xin nghỉ hẳn không?', placeholder: 'Ghi tên nhân viên, vị trí và lý do', example: 'Không có / Bạn Huy phụ thớt xin nghỉ hẳn từ 30/10' },
  { id: 203, category: 'NHÂN SỰ', title: 'NV mới đi làm', placeholder: 'Ghi tên nhân viên mới và vị trí đào tạo', example: '1 bạn mới: Tuấn học việc đứng chảo' },
  { id: 204, category: 'VẬN HÀNH BẾP', title: 'Hàng đặt có về đủ không?', placeholder: 'Ghi rõ tình hình nhận hàng thực phẩm, nhà cung cấp', example: 'Hàng về đủ 100%, rau củ tươi ngon' },
  { id: 205, category: 'VẬN HÀNH BẾP', title: 'Sự cố xảy ra trong ngày không? Nếu có xl ntn?', placeholder: 'Ghi sự cố món ăn, đồ nguội/mặn và hướng xử lý', example: 'Có 1 đĩa dồi sụn bị cháy cạnh, đã đổi mới và xin lỗi khách' },
  { id: 206, category: 'VẬN HÀNH BẾP', title: 'Món bán chạy trong ngày', placeholder: 'Ghi các món bếp chế biến nhiều nhất', example: 'Chân gà quái thú 15 đĩa, Lẩu bò ba toa 8 nồi' },
  { id: 207, category: 'TRANG THIẾT BỊ', title: 'CCDC, thiết bị hỏng trong ngày', placeholder: 'Ghi thiết bị bếp bị hỏng hóc cần sửa', example: 'Bếp khè số 2 bị nghẹt ga, quạt hút mùi kêu to' },
  { id: 208, category: 'TRANG THIẾT BỊ', title: 'CCDC, thiết bị được sửa trong ngày', placeholder: 'Ghi thiết bị đã sửa xong', example: 'Đã thay van cấp nước máy rửa bát' },
  { id: 209, category: 'ĐỀ XUẤT', title: 'Đề xuất', placeholder: 'Ghi ý kiến cải tiến quy trình bếp, dụng cụ cần mua', example: 'Đề xuất mua thêm 2 chảo gang chống dính và 5 dao thái' },
];

export interface BepReportData {
  location: string;
  date: string;
  reporter: string;
  items: ReportItem[];
}

// ==========================================
// 3. BC BAR / TỔNG BAR
// ==========================================
export const BAR_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 301, category: 'BIA & RÓT BIA', title: 'Tình trạng máy rót & nhiệt độ bia', placeholder: 'Ghi nhiệt độ tủ bảo quản, áp suất CO2, tình trạng vòi', example: 'Nhiệt độ 2-4 độ C chuẩn, vòi rót êm, bọt mịn đạt chuẩn' },
  { id: 302, category: 'BIA & RÓT BIA', title: 'Sản lượng bia xuất bán trong ngày', placeholder: 'Ghi số lượng bom/keg và các dòng bia bán ra', example: 'Bia Hơi: 3 bom 50L. Craft IPA: 1 bom 30L' },
  { id: 303, category: 'TỒN KHO & CCDC', title: 'Tồn kho bia tươi cuối ngày', placeholder: 'Ghi số bom còn lại trong kho lạnh', example: 'Còn 4 bom 50L bia hơi, 2 bom IPA' },
  { id: 304, category: 'VỆ SINH', title: 'Vệ sinh quầy bar & súc rửa đường ống bia', placeholder: 'Ghi tình trạng vệ sinh quầy, ngâm rửa vòi rót', example: 'Đã súc rửa đường dẫn bia bằng dung dịch chuyên dụng' },
  { id: 305, category: 'VẬN HÀNH', title: 'Món đồ uống bán chạy nhất trong ngày', placeholder: 'Ghi đồ uống pha chế hoặc loại bia chạy nhất', example: 'Bia hoa quả chanh leo 20 ly, Trà đào cam sả 15 ly' },
  { id: 306, category: 'TRANG THIẾT BỊ', title: 'Thiết bị hỏng hóc hoặc đã sửa tại Bar', placeholder: 'Ghi máy xay, máy làm đá, tủ làm lạnh ly...', example: 'Máy làm đá hoạt động tốt, ly làm lạnh sẵn sàng' },
  { id: 307, category: 'NHÂN SỰ', title: 'Nhân sự quầy Bar', placeholder: 'Ghi số lượng nhân sự bar đi làm, hỗ trợ', example: '2 nhân viên FT đầy đủ, hỗ trợ bàn giờ cao điểm' },
  { id: 308, category: 'ĐỀ XUẤT', title: 'Đề xuất của bộ phận Bar', placeholder: 'Ghi nhu cầu nguyên liệu, syrup, ly cốc...', example: 'Cần cấp thêm 30 ly quai thủy tinh 330ml' },
];

export interface BarReportData {
  location: string;
  date: string;
  reporter: string;
  items: ReportItem[];
}

// ==========================================
// 4. BC CX (TRẢI NGHIỆM KHÁCH HÀNG)
// ==========================================
export interface CXItem {
  id: number;
  title: string;
  score: number; // 1-10
  notes: string;
}

export interface CXReportData {
  location: string;
  date: string;
  reporter: string;
  totalScore: number;
  items: CXItem[];
}

export const CX_DEFAULT_ITEMS: Omit<CXItem, 'score' | 'notes'>[] = [
  { id: 401, title: 'Đón tiếp, chào hỏi & xếp bàn' },
  { id: 402, title: 'Thái độ, tư vấn món & upsell' },
  { id: 403, title: 'Tốc độ ra đồ ăn & chất lượng phục vụ' },
  { id: 404, title: 'Chất lượng bia (độ lạnh, bọt, hương vị)' },
  { id: 405, title: 'Vệ sinh không gian, bàn ghế & khu WC' },
  { id: 406, title: 'Quy trình thanh toán & tiễn khách' },
  { id: 407, title: 'Xử lý tình huống phát sinh & phản hồi của khách' },
];

// ==========================================
// 5. BC TQL (TỔNG QUẢN LÝ CHUỖI)
// ==========================================
export interface TQLSystemEvaluation {
  dt_toan_he_thong: string;
  muc_tieu_ngay: string;
  tang_giam_hom_truoc: string;
  tong_luot_khach: string;
  so_ban_phuc_vu: string;
  dt_tb_khach: string;
  xep_hang_dt: string;
  y_kien_khac: string;
}

export interface TQLStoreValues {
  // Sửa chữa
  hong_hoc_can_sua: string;
  hang_muc_sua_trong_ngay: string;
  // Phục vụ
  xep_ban: string;
  order_tu_van: string;
  cham_soc_upsell: string;
  toc_do_ra_do: string;
  chuong_trinh_km: string;
  ve_sinh: string;
  vd_phat_sinh_pv: string;
  cach_giai_quyet_pv: string;
  // Nhân sự
  tong_ns_di_lam: string;
  ns_nghi_dot_xuat: string;
  ns_nghi_han: string;
  ns_moi: string;
  ns_ho_tro: string;
  // Bia
  phan_hoi_khach_bia: string;
  vd_phat_sinh_bia: string;
  cach_giai_quyet_bia: string;
  xuat_ban_tiec: string;
  // Món ăn
  mon_day: string;
  mon_ban_chay: string;
  phan_hoi_khach_mon: string;
  vd_phat_sinh_mon: string;
  cach_giai_quyet_mon: string;
  // Đào tạo & Đối ngoại
  dao_tao: string;
  doi_ngoai: string;
}

export interface TQLReportData {
  time: string;
  date: string;
  reporter: string;
  systemEvaluation: TQLSystemEvaluation;
  stores: Record<string, TQLStoreValues>;
}

// ==========================================
// 6. BC SALE SỈ
// ==========================================
export interface SaleSiReportData {
  date: string;
  reporter: string;
  restaurantName: string;
  address: string;
  outletType: 'Điểm cũ' | 'Điểm mới';
  visitOrder: string;
  stockBom30L: string;
  stockBom50L: string;
  stockKeg1L: string;
  orderBom30L: string;
  orderBom50L: string;
  orderKeg1L: string;
  evaluationOrProposal: string;
}

// ==========================================
// 7. BC QL KÊNH
// ==========================================
export interface SaleRepRecord {
  salesRepName: string;
  visitedCount: string;
  newCustomers: string;
  ordersCount: string;
  volume: string;
  situation: string;
}

export interface QLKenhReportData {
  date: string;
  reporter: string;
  potentialCustomers: string;
  decliningRiskCustomers: string;
  marketIssues: string;
  proposal: string;
  sales: SaleRepRecord[];
}