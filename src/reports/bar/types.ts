export type ItemType = 'text';

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
  // VẬN HÀNH
  { id: 1, category: 'VẬN HÀNH', title: 'Chất lượng bia', placeholder: 'Đạt đk để bán hay có vđ gì', example: 'Đạt' },
  { id: 2, category: 'VẬN HÀNH', title: 'Nhiệt độ các tủ ủ', placeholder: 'Ghi lại nhiệt độ các tủ ủ tại thời điểm báo cáo', example: '2 độ C' },
  { id: 3, category: 'VẬN HÀNH', title: 'SL ca, cốc, tháp, ly rượu vận hành', placeholder: 'Nhập SL ca, cốc, tháp, ly rượu, cốc cối tại điểm', example: 'Cốc to: 100c\nCốc nhỏ: 100c\nCa 2L: 20c\nCa 1L: 10c\nTháp 3L: 6c\nTháp 2L: 5c\nCốc cối: 20c\nCốc TB: 20c' },
  { id: 4, category: 'VẬN HÀNH', title: 'Báo hỏng/bổ sung', placeholder: 'Báo các thiết bị hỏng hoặc CCDC cần bổ sung', example: 'Vòi rót bia số 2 bị rỉ nước' },
  { id: 5, category: 'VẬN HÀNH', title: 'Vấn đề phát sinh', placeholder: 'Các vấn đề phát sinh trong ngày', example: 'Khách phàn nàn bia nhiều bọt' },

  // BIA BOM, BIA KEG
  { id: 6, category: 'BIA BOM, BIA KEG', title: 'SL bom, két nhập', placeholder: 'Nhập SL bom, két nhập trong ngày', example: '30L: 2 bom\n50L: 5 bom\n1L: 20 két' },
  { id: 7, category: 'BIA BOM, BIA KEG', title: 'SL bom, két điều chuyển', placeholder: 'Nhập số lượng và nơi điều chuyển', example: 'Điều chuyển VTP: 2bom 50L, kho tổng 3 két' },
  { id: 8, category: 'BIA BOM, BIA KEG', title: 'SL bom, két bán tại CH', placeholder: 'Nhập SL bom, két bán trong ngày', example: '30L: 2 bom\n50L: 5 bom\n1L: 20 két' },
  { id: 9, category: 'BIA BOM, BIA KEG', title: 'SL bom, keg bán tiệc/khách sỉ', placeholder: 'Nhập SL bom bán tiệc trong ngày / Khách sỉ', example: 'Khách tiệc: 30L: 2 bom\nKhách sỉ: 1L: 20 két' },
  { id: 10, category: 'BIA BOM, BIA KEG', title: 'SL bom dở', placeholder: 'Nhập SL bom dở cuối ngày', example: '30L: 1 bom\n50L: 1 bom' },
  { id: 11, category: 'BIA BOM, BIA KEG', title: 'SL bom nguyên tồn', placeholder: 'Nhập SL bom nguyên cuối ngày', example: '30L: 2 bom\n50L: 5 bom\n1L: 20 két' },
  { id: 12, category: 'BIA BOM, BIA KEG', title: 'SL bia đặt mới', placeholder: 'Nhập SL bia đặt mới', example: '30L: 3 bom\n50L: 5 bom\n1L: 20 két' },
  { id: 13, category: 'BIA BOM, BIA KEG', title: 'SL vỏ 50L tồn cuối ngày', placeholder: 'Nhập SL vỏ tồn cuối ngày', example: '01 dở, 3 bia, 2 vỏ' },
  { id: 14, category: 'BIA BOM, BIA KEG', title: 'SL vỏ 30L tồn cuối ngày', placeholder: 'Nhập SL vỏ tồn cuối ngày', example: '01 dở, 3 bia, 2 vỏ' },
  { id: 15, category: 'BIA BOM, BIA KEG', title: 'SL vỏ keg1L tồn cuối ngày', placeholder: 'Nhập số lượng', example: '50 keg bia, 20 keg vỏ' },

  // BIA LON, CHAI, UNI, COCACOLA
  { id: 16, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL lon, chai nhập', placeholder: 'Nhập SL bom, két nhập trong ngày', example: 'Pre chai: 4 két\nTB chai: 6 két\nPre lon: 2 thùng' },
  { id: 17, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL bán trong ngày', placeholder: 'Nhập SL bán', example: 'Pre chai: 12c\nTB chai: 14c\nPre lon: 4 lon' },
  { id: 18, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL bia chai, lon tồn', placeholder: 'Nhập SL bia tồn', example: 'Pre chai: 48c\nTB chai: 25c\nPre lon: 20lon' },
  { id: 19, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL vỏ bia chai tồn', placeholder: 'Nhập SL vỏ chai', example: 'Pre chai: 48c\nTB chai: 25c' },
  { id: 20, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL bia đặt mới', placeholder: 'Nhập SL cần đặt', example: 'Pre chai: 2 két\nTB chai: 2 két\nPre long: 1 thùng' },
  { id: 21, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL rượu tồn cuối ngày', placeholder: 'Nhập SL tồn', example: 'Mơ HN: 1 thùng 8c\nVodka HN: 1 thùng\nMơ: 0\nDứa: 0\nNếp: 0' },
  { id: 22, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL uni tồn cuối ngày', placeholder: 'Nhập SL tồn', example: '5 thùng 2c' },
  { id: 23, category: 'BIA LON, CHAI, UNI, COCACOLA', title: 'SL nước ngọt tồn cuối ngày', placeholder: 'Nhập SL tồn', example: 'coca: 9 thùng 17 lon\nfanta: 7lon\nsprite: 1 thùng 38 lon' }
];