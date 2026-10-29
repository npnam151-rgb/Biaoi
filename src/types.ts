export type ReportType =
  | 'van_hanh'
  | 'bep'
  | 'bar'
  | 'tong_bar'
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
  reportTitle: string;
  desc: string;
  reporterLabel: string;
  reporterPlaceholder: string;
  color: string;
  category: 'Cơ sở & Vận hành' | 'Khối Bán hàng & Quản lý';
  highlights: string[];
}

export const REPORT_TABS: ReportTabMeta[] = [
  {
    id: 'van_hanh',
    path: '/van-hanh',
    sheetName: 'BC Vận hành',
    name: 'CS Báo Cáo Vận Hành',
    shortName: 'BC Vận Hành',
    reportTitle: 'BÁO CÁO VẬN HÀNH HÀNG NGÀY',
    desc: 'Nhân sự, sửa chữa, kinh doanh & hỗ trợ tại từng cơ sở',
    reporterLabel: 'Người báo cáo',
    reporterPlaceholder: 'VD: Nguyễn Văn A',
    color: 'indigo',
    category: 'Cơ sở & Vận hành',
    highlights: ['20 chỉ tiêu vận hành cơ sở', 'Nhân sự, Sửa chữa & Kinh doanh', 'Thời gian hỗ trợ CX & Tổng Bar'],
  },
  {
    id: 'bep',
    path: '/bep',
    sheetName: 'BC Bếp',
    name: 'CS Báo Cáo Bếp',
    shortName: 'BC Bếp',
    reportTitle: 'BÁO CÁO VẬN HÀNH BẾP HÀNG NGÀY',
    desc: 'Nhân sự bếp, thực phẩm, sự cố ra món & trang thiết bị bếp',
    reporterLabel: 'Bếp trưởng / Người báo cáo',
    reporterPlaceholder: 'VD: Bếp trưởng Nguyễn Văn B',
    color: 'amber',
    category: 'Cơ sở & Vận hành',
    highlights: ['9 chỉ tiêu vận hành bếp', 'Hàng đặt, món chạy, sự cố ra món', 'CCDC & trang thiết bị hỏng/sửa'],
  },
  {
    id: 'bar',
    path: '/bar',
    sheetName: 'BC Bar',
    name: 'CS Báo Cáo Quầy Bar',
    shortName: 'BC Bar',
    reportTitle: 'BÁO CÁO QUẦY BAR & BIA HÀNG NGÀY',
    desc: 'Nhiệt độ bia, máy rót, tồn kho bom bia & vệ sinh quầy',
    reporterLabel: 'Bar trưởng / Người báo cáo',
    reporterPlaceholder: 'VD: Bar trưởng Trần Văn C',
    color: 'cyan',
    category: 'Cơ sở & Vận hành',
    highlights: ['Nhiệt độ bảo quản bia & máy rót', 'Tồn kho bom 30L / 50L / Keg 1L', 'Vệ sinh đường ống & vòi rót'],
  },
  {
    id: 'tong_bar',
    path: '/tong-bar',
    sheetName: 'BC Tổng Bar',
    name: 'CS Báo Cáo Tổng Bar',
    shortName: 'BC Tổng Bar',
    reportTitle: 'BÁO CÁO TỔNG BAR',
    desc: 'Chất lượng bia, kho lạnh, tủ ủ, tủ rót, nhân sự & hỏng hóc toàn chuỗi',
    reporterLabel: 'Người báo cáo',
    reporterPlaceholder: 'VD: Lâm (Tổng Bar)',
    color: 'teal',
    category: 'Cơ sở & Vận hành',
    highlights: ['Thời gian đến & đi cơ sở', 'Nhiệt độ kho lạnh, tủ ủ, tủ rót', 'Công tác vận hành & trình độ rót bia', 'Hỏng hóc tồn đọng & sửa chữa trong ngày'],
  },
  {
    id: 'cx',
    path: '/cx',
    sheetName: 'BC CX',
    name: 'CS Báo Cáo Trải Nghiệm Khách Hàng (CX)',
    shortName: 'BC CX',
    reportTitle: 'BÁO CÁO ĐÁNH GIÁ TRẢI NGHIỆM KHÁCH HÀNG (CX)',
    desc: 'Chất lượng phục vụ, đón tiếp, vệ sinh & điểm số đánh giá',
    reporterLabel: 'Chuyên viên CX / Người báo cáo',
    reporterPlaceholder: 'VD: Hoàng Thanh Huyền (CX)',
    color: 'rose',
    category: 'Cơ sở & Vận hành',
    highlights: ['7 tiêu chuẩn dịch vụ khách hàng', 'Thang điểm 1-10 & tổng điểm tự động', 'Ghi chú thực tế & lỗi phát sinh'],
  },
  {
    id: 'tql',
    path: '/tql',
    sheetName: 'BC TQL',
    name: 'CS Báo Cáo Tổng Quản Lý Chuỗi',
    shortName: 'BC Tổng QL',
    reportTitle: 'BÁO CÁO TỔNG QUẢN LÝ CHUỖI (TQL)',
    desc: 'Đánh giá toàn chuỗi & nghiệp vụ 6 cơ sở vận hành',
    reporterLabel: 'Tổng Quản Lý / Người báo cáo',
    reporterPlaceholder: 'VD: Nguyễn Văn Nam (TQL)',
    color: 'purple',
    category: 'Khối Bán hàng & Quản lý',
    highlights: ['Đánh giá doanh thu toàn chuỗi', 'Chi tiết 6 cơ sở vận hành', 'Ý kiến chỉ đạo của Tổng Quản Lý'],
  },
  {
    id: 'sale_si',
    path: '/sale-si',
    sheetName: 'BC sale sỉ',
    name: 'CS Báo Cáo Sale Sỉ & Điểm Bán',
    shortName: 'BC Sale Sỉ',
    reportTitle: 'BÁO CÁO CHĂM SÓC ĐIỂM BÁN & SALE SỈ',
    desc: 'Ghé điểm bán, tồn kho & đặt hàng Bom 30L, 50L, Keg 1L',
    reporterLabel: 'NV Sale phụ trách',
    reporterPlaceholder: 'VD: Nguyễn Văn D (Sale)',
    color: 'emerald',
    category: 'Khối Bán hàng & Quản lý',
    highlights: ['Chăm sóc điểm bán cũ & mở mới', 'Bảng tồn kho & đặt hàng nhanh', 'Đánh giá thị trường & đối thủ'],
  },
  {
    id: 'ql_kenh',
    path: '/ql-kenh',
    sheetName: 'BC QL kênh',
    name: 'CS Báo Cáo Quản Lý Kênh',
    shortName: 'BC QL Kênh',
    reportTitle: 'BÁO CÁO QUẢN LÝ KÊNH PHÂN PHỐI',
    desc: 'Kết quả các NV Sale, khách tiềm năng, nguy cơ & thị trường',
    reporterLabel: 'Quản lý kênh / Người báo cáo',
    reporterPlaceholder: 'VD: Lê Văn E (QL Kênh)',
    color: 'blue',
    category: 'Khối Bán hàng & Quản lý',
    highlights: ['Bảng kết quả các nhân viên Sale', 'Khách tiềm năng & nguy cơ mất', 'Vấn đề thị trường & đề xuất'],
  },
];

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

// 1. CHECKLIST BÁO CÁO VẬN HÀNH (GỐC)
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

// 2. CHECKLIST BÁO CÁO BẾP
export const BEP_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, category: 'NHÂN SỰ', title: 'Có đủ nv làm việc trong ngày?', placeholder: 'Ghi số lượng nhân viên làm việc trong ngày, thiếu/đủ ca', example: 'Đủ 6 nhân sự ca sáng, thiếu 1 phụ bếp ca tối' },
  { id: 2, category: 'NHÂN SỰ', title: 'Có nv xin nghỉ hẳn không?', placeholder: 'Ghi rõ tên NV và lý do', example: 'Không có / Bạn Huy phụ thớt xin nghỉ hẳn từ 30/10' },
  { id: 3, category: 'NHÂN SỰ', title: 'NV mới đi làm', placeholder: 'Ghi số lượng và tên NV mới, vị trí bếp', example: '1 bạn mới: Tuấn học việc đứng chảo' },
  { id: 4, category: 'VẬN HÀNH BẾP', title: 'Hàng đặt có về đủ không?', placeholder: 'Tình hình hàng hóa, nguyên vật liệu thực phẩm', example: 'Hàng về đủ 100%, thực phẩm tươi ngon' },
  { id: 5, category: 'VẬN HÀNH BẾP', title: 'Sự cố xảy ra trong ngày không? Nếu có xl ntn?', placeholder: 'Ghi sự cố món ăn, đồ nguội/mặn và hướng xử lý', example: '1 đĩa dồi sụn bị cháy cạnh, đã đổi mới và xin lỗi khách' },
  { id: 6, category: 'VẬN HÀNH BẾP', title: 'Món bán chạy trong ngày', placeholder: 'Ghi SL và tên món bán nhiều nhất', example: 'Chân gà quái thú: 15 đĩa, Lẩu bò ba toa: 8 nồi' },
  { id: 7, category: 'TRANG THIẾT BỊ', title: 'CCDC, thiết bị hỏng trong ngày', placeholder: 'Ghi thiết bị bếp bị hỏng', example: 'Bếp khè số 2 bị nghẹt ga, quạt hút mùi kêu to' },
  { id: 8, category: 'TRANG THIẾT BỊ', title: 'CCDC, thiết bị được sửa trong ngày', placeholder: 'Ghi các thiết bị đã sửa xong', example: 'Đã thay van cấp nước máy rửa bát' },
  { id: 9, category: 'ĐỀ XUẤT', title: 'Đề xuất', placeholder: 'Nêu ý kiến cải tiến quy trình bếp, CCDC cần mua', example: 'Đề xuất mua thêm 2 chảo gang chống dính và 5 dao thái' },
];

// 3. CHECKLIST BÁO CÁO BAR
export const BAR_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, category: 'BIA & RÓT BIA', title: 'Tình trạng máy rót & nhiệt độ bia', placeholder: 'Ghi nhiệt độ tủ bảo quản, áp suất CO2, tình trạng vòi', example: 'Nhiệt độ 2-4 độ C chuẩn, vòi rót êm, bọt mịn đạt chuẩn' },
  { id: 2, category: 'BIA & RÓT BIA', title: 'Sản lượng bia xuất bán trong ngày', placeholder: 'Ghi số lượng bom/keg và các dòng bia bán ra', example: 'Bia Hơi: 3 bom 50L. Craft IPA: 1 bom 30L' },
  { id: 3, category: 'BIA & RÓT BIA', title: 'Tồn kho bia tươi cuối ngày', placeholder: 'Ghi số bom còn lại trong kho lạnh', example: 'Còn 4 bom 50L bia hơi, 2 bom IPA' },
  { id: 4, category: 'VỆ SINH', title: 'Vệ sinh quầy bar & súc rửa đường ống bia', placeholder: 'Ghi tình trạng vệ sinh quầy, ngâm rửa vòi rót', example: 'Đã súc rửa đường dẫn bia bằng dung dịch chuyên dụng' },
  { id: 5, category: 'VẬN HÀNH', title: 'Món đồ uống bán chạy nhất trong ngày', placeholder: 'Ghi đồ uống pha chế hoặc loại bia chạy nhất', example: 'Bia hoa quả chanh leo 20 ly, Trà đào cam sả 15 ly' },
  { id: 6, category: 'VẬN HÀNH', title: 'Thiết bị hỏng hóc hoặc đã sửa tại Bar', placeholder: 'Ghi máy xay, máy làm đá, tủ làm lạnh ly...', example: 'Máy làm đá hoạt động tốt, ly làm lạnh sẵn sàng' },
  { id: 7, category: 'NHÂN SỰ', title: 'Nhân sự quầy Bar', placeholder: 'Ghi số lượng nhân sự bar đi làm, hỗ trợ', example: '2 nhân viên FT đầy đủ, hỗ trợ bàn giờ cao điểm' },
  { id: 8, category: 'ĐỀ XUẤT', title: 'Đề xuất của bộ phận Bar', placeholder: 'Ghi nhu cầu nguyên liệu, syrup, ly cốc...', example: 'Cần cấp thêm 30 ly quai thủy tinh 330ml' },
];

// 4. CHECKLIST BÁO CÁO CX (TRẢI NGHIỆM KHÁCH HÀNG)
export const CX_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, category: 'ĐÓN TIẾP & PHỤC VỤ', title: 'Đón tiếp, chào hỏi & xếp bàn', placeholder: 'Đánh giá thái độ đón tiếp, tốc độ xếp bàn và phản hồi', example: 'Chào đón nhiệt tình, xếp bàn nhanh' },
  { id: 2, category: 'ĐÓN TIẾP & PHỤC VỤ', title: 'Thái độ, tư vấn món & upsell', placeholder: 'Đánh giá kỹ năng tư vấn món, giới thiệu CTKM của nhân viên', example: 'Nhân viên tư vấn tốt món má đào và bia mới' },
  { id: 3, category: 'ĐÓN TIẾP & PHỤC VỤ', title: 'Tốc độ ra đồ ăn & chất lượng phục vụ', placeholder: 'Thời gian ra món, đồ nguội hay nóng, phục vụ bàn chu đáo', example: 'Ra đồ đúng chuẩn dưới 15 phút' },
  { id: 4, category: 'CHẤT LƯỢNG BIA & MÔI TRƯỜNG', title: 'Chất lượng bia (độ lạnh, bọt, hương vị)', placeholder: 'Đánh giá độ lạnh, bọt tuyết, ly cốc sạch', example: 'Bia lạnh sâu, bọt mịn đạt chuẩn' },
  { id: 5, category: 'CHẤT LƯỢNG BIA & MÔI TRƯỜNG', title: 'Vệ sinh không gian, bàn ghế & khu WC', placeholder: 'Tình trạng vệ sinh sàn, bàn ghế, mùi toilet, giấy lau', example: 'Khu WC sạch sẽ khô ráo, thơm tho' },
  { id: 6, category: 'KẾT THÚC & PHẢN HỒI', title: 'Quy trình thanh toán & tiễn khách', placeholder: 'Tốc độ in bill, tính tiền, cảm ơn và dắt xe cho khách', example: 'Thanh toán nhanh gọn, dắt xe chào khách lễ phép' },
  { id: 7, category: 'KẾT THÚC & PHẢN HỒI', title: 'Tổng kết & phản hồi không hài lòng của khách', placeholder: 'Ghi các phản hồi chưa hài lòng và hướng xử lý', example: 'Không có phàn nàn / Khách góp ý mở nhạc nhẹ hơn' },
];

// 5. CHECKLIST BÁO CÁO TỔNG QUẢN LÝ (TQL)
export const TQL_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, category: 'ĐÁNH GIÁ CHUNG TOÀN HỆ THỐNG', title: 'Doanh thu toàn hệ thống & mục tiêu ngày', placeholder: 'Ghi DT đạt được / Mục tiêu ngày', example: 'DT: 135tr / MT: 150tr (Đạt 90%)' },
  { id: 2, category: 'ĐÁNH GIÁ CHUNG TOÀN HỆ THỐNG', title: 'Tăng/giảm so với hôm trước', placeholder: 'Tỷ lệ tăng giảm doanh thu', example: 'Tăng 12% so với thứ 4 tuần trước' },
  { id: 3, category: 'ĐÁNH GIÁ CHUNG TOÀN HỆ THỐNG', title: 'Tổng lượt khách & số bàn phục vụ', placeholder: 'Ghi tổng lượt khách và số bàn phục vụ toàn chuỗi', example: '520 lượt khách, 135 bàn' },
  { id: 4, category: 'ĐÁNH GIÁ CHUNG TOÀN HỆ THỐNG', title: 'DT TB/khách & Xếp hạng DT cơ sở', placeholder: 'Ghi DT TB trên khách và thứ hạng các cơ sở', example: '260k/khách. Hạng: 12 ĐT > 94 LĐ > 01 DD' },
  { id: 5, category: 'VẬN HÀNH CÁC CƠ SỞ', title: 'Nhân sự các cơ sở', placeholder: 'Tổng NS đi làm, nghỉ đột xuất, nghỉ hẳn, mới', example: '01 DD: 8ng, 94 LĐ: 10ng, 12 ĐT: 12ng. Đủ quân số' },
  { id: 6, category: 'VẬN HÀNH CÁC CƠ SỞ', title: 'Sửa chữa & CCDC', placeholder: 'Hỏng hóc cần sửa và đã sửa trong ngày', example: '94 LĐ hỏng biển, 12 ĐT sửa xong điều hòa' },
  { id: 7, category: 'VẬN HÀNH CÁC CƠ SỞ', title: 'Phục vụ & Sự cố phát sinh', placeholder: 'Tình hình phục vụ, tốc độ ra đồ, xử lý sự cố', example: 'Tất cả các cơ sở vận hành trơn tru' },
  { id: 8, category: 'VẬN HÀNH CÁC CƠ SỞ', title: 'Món ăn & Bia', placeholder: 'Món bán chạy, phản hồi của khách, xuất bán tiệc', example: 'Bia hơi bán chạy, khách khen bia 12 ĐT' },
  { id: 9, category: 'ĐÀO TẠO & ĐỐI NGOẠI', title: 'Đào tạo & Đối ngoại', placeholder: 'Nội dung đào tạo nhân sự và các việc đối ngoại', example: 'Đào tạo menu cho NV mới 96 HT' },
  { id: 10, category: 'ĐÀO TẠO & ĐỐI NGOẠI', title: 'Ý kiến chỉ đạo của Tổng Quản Lý', placeholder: 'Chỉ đạo chung cho toàn chuỗi ngày mai', example: 'Tập trung đẩy mạnh bán tiệc cuối tuần' },
];

// 6. CHECKLIST BÁO CÁO SALE SỈ & ĐIỂM BÁN
export const SALE_SI_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, category: 'THÔNG TIN ĐIỂM BÁN', title: 'Tên điểm bán & Địa chỉ', placeholder: 'Ghi tên quán, nhà hàng và địa chỉ cụ thể', example: 'Quán Bia Hơi Thu Hằng - 45 Nguyễn Tuân, Thanh Xuân' },
  { id: 2, category: 'THÔNG TIN ĐIỂM BÁN', title: 'Phân loại điểm bán', placeholder: 'Điểm cũ hay điểm mở mới', example: 'Điểm cũ lấy hàng đều đặn' },
  { id: 3, category: 'THÔNG TIN ĐIỂM BÁN', title: 'Thứ tự điểm ghé trong ngày', placeholder: 'Ghi điểm thứ mấy ghé trong ngày', example: 'Điểm thứ 2 trong ngày' },
  { id: 4, category: 'TỒN KHO TẠI ĐIỂM', title: 'Tồn kho Bom 30L & Bom 50L', placeholder: 'Ghi số lượng bom còn tồn tại quán', example: 'Tồn 1 bom 50L, 2 bom 30L' },
  { id: 5, category: 'TỒN KHO TẠI ĐIỂM', title: 'Tồn kho Keg 1L', placeholder: 'Ghi số lượng chai/keg 1L còn tồn', example: 'Tồn 12 chai Keg 1L' },
  { id: 6, category: 'ĐẶT HÀNG MỚI', title: 'Đặt hàng Bom 30L & Bom 50L', placeholder: 'Ghi số lượng bom quán đặt lấy thêm', example: 'Lấy 3 bom 50L, 2 bom 30L giao 16h' },
  { id: 7, category: 'ĐẶT HÀNG MỚI', title: 'Đặt hàng Keg 1L', placeholder: 'Ghi số lượng chai/keg 1L đặt thêm', example: 'Lấy thêm 20 chai Keg 1L' },
  { id: 8, category: 'ĐÁNH GIÁ & ĐỀ XUẤT', title: 'Đánh giá tình hình bán hàng của quán', placeholder: 'Tốc độ bán bia, khách đông hay vắng, cạnh tranh đối thủ', example: 'Quán đông khách buổi chiều tối, đối thủ đang chào giá' },
  { id: 9, category: 'ĐÁNH GIÁ & ĐỀ XUẤT', title: 'Đề xuất hỗ trợ điểm bán', placeholder: 'Đề xuất biển hiệu, cốc ly, bảo dưỡng vòi rót, chính sách...', example: 'Cấp thêm 20 cốc thủy tinh in logo Bia Ơi' },
];

// 7. CHECKLIST BÁO CÁO QUẢN LÝ KÊNH
export const QL_KENH_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, category: 'KẾT QUẢ CHĂM SÓC ĐIỂM BÁN', title: 'Kết quả Sale 1', placeholder: 'Tên Sale 1 - Số điểm ghé - Khách mới - Đơn - Sản lượng - Tình hình', example: 'Tuấn: ghé 8 điểm, 1 khách mới, 5 đơn, 12 bom. Bán tốt' },
  { id: 2, category: 'KẾT QUẢ CHĂM SÓC ĐIỂM BÁN', title: 'Kết quả Sale 2', placeholder: 'Tên Sale 2 - Số điểm ghé - Khách mới - Đơn - Sản lượng - Tình hình', example: 'Hải: ghé 7 điểm, 0 khách mới, 4 đơn, 8 bom. Ổn định' },
  { id: 3, category: 'KẾT QUẢ CHĂM SÓC ĐIỂM BÁN', title: 'Kết quả Sale 3', placeholder: 'Tên Sale 3 - Số điểm ghé - Khách mới - Đơn - Sản lượng - Tình hình', example: 'Nam: ghé 9 điểm, 2 khách mới, 6 đơn, 15 bom. Rất tốt' },
  { id: 4, category: 'KẾT QUẢ CHĂM SÓC ĐIỂM BÁN', title: 'Kết quả Sale 4 & 5', placeholder: 'Tên Sale - Số điểm ghé - Khách mới - Đơn - Sản lượng - Tình hình', example: 'Dương: ghé 6 điểm, 1 mới, 3 đơn, 6 bom' },
  { id: 5, category: 'TỔNG KẾT THỊ TRƯỜNG', title: 'Khách hàng tiềm năng', placeholder: 'Ghi các điểm bán tiềm năng đang tiếp cận', example: 'Nhà hàng Lẩu Nướng Gió Biển dự kiến lấy bia tuần tới' },
  { id: 6, category: 'TỔNG KẾT THỊ TRƯỜNG', title: 'Khách giảm / khách có nguy cơ mất', placeholder: 'Ghi các điểm bán giảm sản lượng hoặc có nguy cơ mất và nguyên nhân', example: 'Quán Cây Bàng giảm lấy hàng do đối thủ tài trợ biển' },
  { id: 7, category: 'TỔNG KẾT THỊ TRƯỜNG', title: 'Vấn đề thị trường', placeholder: 'Ghi nhận biến động thị trường, giá cả, thời tiết', example: 'Thời tiết mát mẻ lượng tiêu thụ bia tươi tăng' },
  { id: 8, category: 'TỔNG KẾT THỊ TRƯỜNG', title: 'Đề xuất của Quản lý kênh', placeholder: 'Đề xuất hỗ trợ chính sách bán hàng, nhân sự sale...', example: 'Hỗ trợ POSM và dù che cho 3 điểm bán mới' },
];

// 3.2. CHECKLIST BÁO CÁO TỔNG BAR
export const TONG_BAR_CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 101, category: 'Thời gian', title: 'Ngày & thời gian', placeholder: 'Ghi ngày và thời gian đến và đi', example: '18h - 22h 15/05' },
  { id: 102, category: 'Chất lượng', title: 'Chất lượng bia', placeholder: 'Đánh giá về CL bia, hoặc có vđ gì về bia trong ngày', example: 'Bia ngon, không có cặn' },
  { id: 103, category: 'Thiết bị', title: 'Đánh giá kho lạnh', placeholder: 'Ghi nhiệt độ kho và các vđ nếu có', example: '3 độ C, bình thường' },
  { id: 104, category: 'Thiết bị', title: 'Đánh giá tủ ủ', placeholder: 'Ghi nhiệt độ tủ và các vđ nếu có', example: '2 độ C, ổn định' },
  { id: 105, category: 'Thiết bị', title: 'Đánh giá tủ rót', placeholder: 'Ghi nhiệt độ tủ và các vđ nếu có', example: '1 độ C, vòi trơn tru' },
  { id: 106, category: 'Thiết bị', title: 'Đánh giá tủ trưng bày', placeholder: 'Đánh giá về vệ sinh và trưng bày hàng', example: 'Sạch sẽ, gọn gàng, đủ hàng' },
  { id: 107, category: 'Nhân sự', title: 'Công tác vận hành của nv bar', placeholder: 'Đánh giá tính thuần thục của nhân viên bar về công tác vận hành, xuất nhập, đặt hàng', example: 'Nhân viên mới còn lúng túng khi thay bom' },
  { id: 108, category: 'Nhân sự', title: 'Công tác vệ sinh của bar', placeholder: 'Đánh giá việc giữ gìn vệ sinh và trưng bày của tất cả khu vực bar', example: 'Mặt bar hơi ướt, đã nhắc nhở' },
  { id: 109, category: 'Nhân sự', title: 'Trình độ rót bia của bar', placeholder: 'Đạt hay Không đạt', example: 'Đạt, bọt đẹp' },
  { id: 112, category: 'Vấn đề & Sửa chữa', title: 'Các vđ hỏng hóc của bar còn tồn đọng chờ xử lý', placeholder: 'Ghi nhận các vấn đề hỏng hóc', example: 'Hỏng đèn tủ lạnh' },
  { id: 113, category: 'Vấn đề & Sửa chữa', title: 'Các vđ sửa chữa của bar khắc phục trong ngày', placeholder: 'Ghi nhận các vấn đề đã sửa', example: 'Đã thay vòi rót' },
  { id: 110, category: 'Khác', title: 'Các cv hỗ trợ khác', placeholder: 'Các công việc hỗ trợ khác trong ca', example: 'Phục vụ bàn 5 lúc đông khách' },
  { id: 111, category: 'Khác', title: 'Đề xuất', placeholder: 'Ghi lại các đề xuất', example: 'Nên trang bị thêm kẹp đá ở bar' },
];

export const REPORT_CHECKLIST_MAP: Record<ReportType, ChecklistItemDef[]> = {
  van_hanh: CHECKLIST_ITEMS,
  bep: BEP_CHECKLIST_ITEMS,
  bar: BAR_CHECKLIST_ITEMS,
  tong_bar: TONG_BAR_CHECKLIST_ITEMS,
  cx: CX_CHECKLIST_ITEMS,
  tql: TQL_CHECKLIST_ITEMS,
  sale_si: SALE_SI_CHECKLIST_ITEMS,
  ql_kenh: QL_KENH_CHECKLIST_ITEMS,
};