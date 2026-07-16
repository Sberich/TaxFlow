export interface PersonalInfo {
  taxId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  maritalStatus: 'โสด' | 'สมรส' | 'หม้าย';
  filingStatus: 'แยกยื่น' | 'รวมคำนวณ';
  refundRequest: boolean;
  politicalSubsidy: boolean;
  politicalPartyCode?: string;
  
  // เพิ่มข้อมูลคู่สมรส
  spouseTaxId?: string;
  spouseFirstName?: string;
  spouseLastName?: string;
}

export interface IncomeDetails {
  section40_1: number; // เงินเดือน
  section40_2: number; // รับจ้าง, ฟรีแลนซ์
  section40_3: number; // ลิขสิทธิ์
  section40_4: number; // ดอกเบี้ย, ปันผล, คริปโต
  section40_5: number; // ค่าเช่า
  section40_6: number; // วิชาชีพอิสระ
  section40_7: number; // รับเหมา
  section40_8: number; // ธุรกิจอื่นๆ
  
  // สำหรับการหักค่าใช้จ่าย
  expense40_1_2: number; 
  expense40_3: number;
  expense40_5: number;
  expense40_6: number;
  expense40_7: number;
  expense40_8: number;
  
  // ภาษีที่ถูกหัก ณ ที่จ่าย
  withholdingTax: number;
}

export interface Incomes {
  taxpayer: IncomeDetails;
  spouse: IncomeDetails;
}

export interface DeductionDetails {
  // กลุ่มลดหย่อนส่วนตัว/ครอบครัว
  personal: number; // 60,000
  spouse: number; // 60,000 (เฉพาะฝั่งที่หัก)
  children: number; // บุตร
  parents: number; // บิดามารดา
  disabled: number; // ผู้พิการ

  // กลุ่มประกันและการลงทุน
  lifeInsurance: number;
  healthInsurance: number;
  parentsHealthInsurance: number;
  providentFund: number; // กองทุนสำรองเลี้ยงชีพ
  ssf: number;
  rmf: number;
  thaiEsg: number;
  socialSecurity: number;

  // อื่นๆ
  homeLoanInterest: number;
  donations: number;
  easyEReceipt: number;
}

export interface Deductions {
  taxpayer: DeductionDetails;
  spouse: DeductionDetails;
}

export interface IndividualTaxSummary {
  totalIncome: number;
  totalExpense: number;
  incomeAfterExpense: number;
  totalDeductions: number;
  netIncome: number;
  taxCalculated: number;
  withholdingTax: number;
  totalTax: number; // ภาษีที่ต้องชำระเพิ่มเติม หรือ (ชำระไว้เกิน)
}

export interface TaxSummary {
  taxpayer: IndividualTaxSummary;
  spouse?: IndividualTaxSummary; // มีค่าเมื่อแยกยื่น
  combined?: IndividualTaxSummary; // มีค่าเมื่อรวมคำนวณ
}

export interface TaxFormData {
  personalInfo: PersonalInfo;
  incomes: Incomes;
  deductions: Deductions;
  summary: TaxSummary;
}
