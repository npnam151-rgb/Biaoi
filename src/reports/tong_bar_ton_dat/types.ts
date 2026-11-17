export const TON_DAT_STORES = [
  { code: '01 ĐD', name: '01 Đặng Dung' },
  { code: '03 NVH', name: '03 Nguyễn Văn Huyên' },
  { code: '12 ĐT', name: '12 Đào Tấn' },
  { code: '94 LĐ', name: '94 Lò Đúc' },
  { code: '96 HT', name: '96 Hồng Tiến' },
  { code: '98 VTP', name: '98 Vũ Trọng Phụng' },
] as const;

export type TonDatStoreCode = (typeof TON_DAT_STORES)[number]['code'];

export interface UnitColumnDef {
  key: string;
  label: string;
}

export interface ProductGroupDef {
  id: string;
  name: string;
  category: 'Bia Bom & Keg' | 'Bia Craft & Rượu' | 'Bia Chai & Lon' | 'Nước Ngọt & Nước Suối';
  units: UnitColumnDef[];
}

export const PRODUCT_GROUPS: ProductGroupDef[] = [
  {
    id: 'bom_30l',
    name: 'Bom 30L',
    category: 'Bia Bom & Keg',
    units: [{ key: 'bom_30l_bom', label: 'bom' }],
  },
  {
    id: 'bom_50l',
    name: 'Bom 50L',
    category: 'Bia Bom & Keg',
    units: [{ key: 'bom_50l_bom', label: 'bom' }],
  },
  {
    id: 'keg_1l',
    name: 'Keg1L',
    category: 'Bia Bom & Keg',
    units: [
      { key: 'keg_1l_ket', label: 'két' },
      { key: 'keg_1l_keg', label: 'keg' },
    ],
  },
  {
    id: 'tb_craft',
    name: 'TB craft',
    category: 'Bia Craft & Rượu',
    units: [
      { key: 'tb_craft_xach', label: 'xách' },
      { key: 'tb_craft_chai', label: 'chai' },
    ],
  },
  {
    id: 'ruou_mo',
    name: 'Rượu Mơ',
    category: 'Bia Craft & Rượu',
    units: [
      { key: 'ruou_mo_can', label: 'can' },
      { key: 'ruou_mo_chai', label: 'chai' },
    ],
  },
  {
    id: 'ruou_dua',
    name: 'Rượu Dứa',
    category: 'Bia Craft & Rượu',
    units: [
      { key: 'ruou_dua_can', label: 'can' },
      { key: 'ruou_dua_chai', label: 'chai' },
    ],
  },
  {
    id: 'hn_pre_chai',
    name: 'HN pre chai',
    category: 'Bia Chai & Lon',
    units: [
      { key: 'hn_pre_chai_ket', label: 'két' },
      { key: 'hn_pre_chai_chai', label: 'chai' },
    ],
  },
  {
    id: 'tb_chai',
    name: 'TB chai',
    category: 'Bia Chai & Lon',
    units: [
      { key: 'tb_chai_ket', label: 'két' },
      { key: 'tb_chai_chai', label: 'chai' },
    ],
  },
  {
    id: 'hn_pre_lon',
    name: 'HN pre lon',
    category: 'Bia Chai & Lon',
    units: [
      { key: 'hn_pre_lon_thung', label: 'thùng' },
      { key: 'hn_pre_lon_lon', label: 'lon' },
    ],
  },
  {
    id: 'tb_lon',
    name: 'TB lon',
    category: 'Bia Chai & Lon',
    units: [
      { key: 'tb_lon_thung', label: 'thùng' },
      { key: 'tb_lon_lon', label: 'lon' },
    ],
  },
  {
    id: 'coca',
    name: 'Coca',
    category: 'Nước Ngọt & Nước Suối',
    units: [
      { key: 'coca_thung', label: 'thùng' },
      { key: 'coca_lon', label: 'lon' },
    ],
  },
  {
    id: 'uniqua',
    name: 'Uniqua',
    category: 'Nước Ngọt & Nước Suối',
    units: [
      { key: 'uniqua_thung', label: 'thùng' },
      { key: 'uniqua_chai', label: 'chai' },
    ],
  },
];

export interface FlatUnitColumn extends UnitColumnDef {
  productName: string;
  productId: string;
}

export const ALL_UNIT_COLUMNS: FlatUnitColumn[] = PRODUCT_GROUPS.flatMap((group) =>
  group.units.map((u) => ({
    ...u,
    productName: group.name,
    productId: group.id,
  }))
);

export type UnitValueMap = Record<string, string>;

export interface BranchTonDatEntry {
  staffName: string;
  ton: UnitValueMap;
  dat: UnitValueMap;
  updatedAt?: string;
}

export interface TonDatBarReportData {
  date: string; // YYYY-MM-DD
  branches: Record<TonDatStoreCode, BranchTonDatEntry>;
}

export const createEmptyUnitMap = (): UnitValueMap => {
  const map: UnitValueMap = {};
  ALL_UNIT_COLUMNS.forEach((col) => {
    map[col.key] = '';
  });
  return map;
};

export const createEmptyBranchEntry = (staffName = ''): BranchTonDatEntry => ({
  staffName,
  ton: createEmptyUnitMap(),
  dat: createEmptyUnitMap(),
});

export const createInitialTonDatBarData = (dateStr?: string): TonDatBarReportData => {
  const date = dateStr || new Date().toISOString().split('T')[0];
  const branches = {} as Record<TonDatStoreCode, BranchTonDatEntry>;
  TON_DAT_STORES.forEach((store) => {
    branches[store.code] = createEmptyBranchEntry();
  });
  return { date, branches };
};

export function parseFlexibleNumber(raw: string | number | undefined | null): number | null {
  if (raw === undefined || raw === null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/\s+/g, '').replace(',', '.');
  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return null;
  return parsed;
}

export function formatVietnameseNumber(num: number): string {
  const rounded = Math.round(num * 1000) / 1000;
  return String(rounded).replace('.', ',');
}

export function computeColumnTotals(
  branches: Record<TonDatStoreCode, BranchTonDatEntry>,
  type: 'ton' | 'dat'
): Record<string, string> {
  const totals: Record<string, string> = {};
  ALL_UNIT_COLUMNS.forEach((col) => {
    let sum = 0;
    let hasAnyValue = false;
    TON_DAT_STORES.forEach((store) => {
      const val = branches[store.code]?.[type]?.[col.key];
      const parsed = parseFlexibleNumber(val);
      if (parsed !== null) {
        sum += parsed;
        hasAnyValue = true;
      }
    });
    totals[col.key] = hasAnyValue ? formatVietnameseNumber(sum) : '';
  });
  return totals;
}

export function hasBranchData(entry: BranchTonDatEntry | undefined): boolean {
  if (!entry) return false;
  if (entry.staffName && entry.staffName.trim() !== '') return true;
  const hasTon = ALL_UNIT_COLUMNS.some((c) => (entry.ton?.[c.key] || '').trim() !== '');
  const hasDat = ALL_UNIT_COLUMNS.some((c) => (entry.dat?.[c.key] || '').trim() !== '');
  return hasTon || hasDat;
}

export function countBranchFilledFields(entry: BranchTonDatEntry | undefined): number {
  if (!entry) return 0;
  let count = 0;
  ALL_UNIT_COLUMNS.forEach((c) => {
    if ((entry.ton?.[c.key] || '').trim() !== '') count += 1;
    if ((entry.dat?.[c.key] || '').trim() !== '') count += 1;
  });
  return count;
}
