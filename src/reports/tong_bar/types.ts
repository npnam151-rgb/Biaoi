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
  items: ReportItem[];
}

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  {
    id: 101,
    category: 'Thời gian',
    title: 'Ngày & thời gian',
    placeholder: 'Ghi ngày và thời gian đến và đi',
    example: '18h - 22h 15/05',
  },
  {
    id: 102,
    category: 'Chất lượng',
    title: 'Chất lượng bia',
    placeholder: 'Đánh giá về CL bia, hoặc có vđ gì về bia trong ngày',
    example: 'Bia ngon, không có cặn',
  },
  {
    id: 103,
    category: 'Thiết bị',
    title: 'Đánh giá kho lạnh',
    placeholder: 'Ghi nhiệt độ kho và các vđ nếu có',
    example: '3 độ C, bình thường',
  },
  {
    id: 104,
    category: 'Thiết bị',
    title: 'Đánh giá tủ ủ',
    placeholder: 'Ghi nhiệt độ tủ và các vđ nếu có',
    example: '2 độ C, ổn định',
  },
  {
    id: 105,
    category: 'Thiết bị',
    title: 'Đánh giá tủ rót',
    placeholder: 'Ghi nhiệt độ tủ và các vđ nếu có',
    example: '1 độ C, vòi trơn tru',
  },
  {
    id: 106,
    category: 'Thiết bị',
    title: 'Đánh giá tủ trưng bày',
    placeholder: 'Đánh giá về vệ sinh và trưng bày hàng',
    example: 'Sạch sẽ, gọn gàng, đủ hàng',
  },
  {
    id: 107,
    category: 'Nhân sự',
    title: 'Công tác vận hành của nv bar',
    placeholder: 'Đánh giá tính thuần thục của nhân viên bar về công tác vận hành, xuất nhập, đặt hàng',
    example: 'Nhân viên mới còn lúng túng khi thay bom',
  },
  {
    id: 108,
    category: 'Nhân sự',
    title: 'Công tác vệ sinh của bar',
    placeholder: 'Đánh giá việc giữ gìn vệ sinh và trưng bày của tất cả khu vực bar',
    example: 'Mặt bar hơi ướt, đã nhắc nhở',
  },
  {
    id: 109,
    category: 'Nhân sự',
    title: 'Trình độ rót bia của bar',
    placeholder: 'Đạt hay Không đạt',
    example: 'Đạt, bọt đẹp',
  },
  {
    id: 112,
    category: 'Vấn đề & Sửa chữa',
    title: 'Các vđ hỏng hóc của bar còn tồn đọng chờ xử lý',
    placeholder: 'Ghi nhận các vấn đề hỏng hóc',
    example: 'Hỏng đèn tủ lạnh',
  },
  {
    id: 113,
    category: 'Vấn đề & Sửa chữa',
    title: 'Các vđ sửa chữa của bar khắc phục trong ngày',
    placeholder: 'Ghi nhận các vấn đề đã sửa',
    example: 'Đã thay vòi rót',
  },
  {
    id: 110,
    category: 'Khác',
    title: 'Các cv hỗ trợ khác',
    placeholder: 'Các công việc hỗ trợ khác trong ca',
    example: 'Phục vụ bàn 5 lúc đông khách',
  },
  {
    id: 111,
    category: 'Khác',
    title: 'Đề xuất',
    placeholder: 'Ghi lại các đề xuất',
    example: 'Nên trang bị thêm kẹp đá ở bar',
  },
];
