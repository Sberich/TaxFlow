import type { Incomes, Deductions, TaxSummary, IncomeDetails, DeductionDetails, IndividualTaxSummary } from '../types';

const calculateIndividual = (income: IncomeDetails, deduction: DeductionDetails): IndividualTaxSummary => {
  const getNum = (val: any) => Number(val) || 0;

  const totalIncome = 
    getNum(income.section40_1) + 
    getNum(income.section40_2) + 
    getNum(income.section40_3) + 
    getNum(income.section40_4) + 
    getNum(income.section40_5) + 
    getNum(income.section40_6) + 
    getNum(income.section40_7) + 
    getNum(income.section40_8);

  // หักเงินสะสม กบข./กองทุนสำรองเลี้ยงชีพ ออกจาก 40(1) ก่อนนำไปคิดค่าใช้จ่าย
  const exemptedIncome = getNum(deduction.providentFund);
  const net40_1 = Math.max(0, getNum(income.section40_1) - exemptedIncome);
  
  let expense40_1_2 = (net40_1 + getNum(income.section40_2)) * 0.5;
  if (expense40_1_2 > 100000) expense40_1_2 = 100000;

  const totalExpense = 
    expense40_1_2 + 
    getNum(income.expense40_3) + 
    getNum(income.expense40_5) + 
    getNum(income.expense40_6) + 
    getNum(income.expense40_7) + 
    getNum(income.expense40_8);

  // เพื่อให้ตัวเลขในหน้าจอสรุปผล (A - B - C = D) คำนวณได้ตรงกัน
  const incomeAfterExpense = totalIncome - totalExpense;

  const totalDeductions = 
    exemptedIncome + // นำมารวมกับค่าลดหย่อนเพื่อให้แสดงผลในหน้า UI ได้ถูกต้อง
    getNum(deduction.personal) +
    getNum(deduction.spouse) +
    getNum(deduction.children) +
    getNum(deduction.parents) +
    getNum(deduction.disabled) +
    getNum(deduction.lifeInsurance) +
    getNum(deduction.healthInsurance) +
    getNum(deduction.parentsHealthInsurance) +
    getNum(deduction.ssf) +
    getNum(deduction.rmf) +
    getNum(deduction.thaiEsg) +
    getNum(deduction.socialSecurity) +
    getNum(deduction.homeLoanInterest) +
    getNum(deduction.donations) +
    getNum(deduction.easyEReceipt);

  let netIncome = incomeAfterExpense - totalDeductions;
  if (netIncome < 0) netIncome = 0;

  let taxCalculated = 0;
  if (netIncome > 5000000) {
    taxCalculated += (netIncome - 5000000) * 0.35 + 1265000;
  } else if (netIncome > 2000000) {
    taxCalculated += (netIncome - 2000000) * 0.30 + 365000;
  } else if (netIncome > 1000000) {
    taxCalculated += (netIncome - 1000000) * 0.25 + 115000;
  } else if (netIncome > 750000) {
    taxCalculated += (netIncome - 750000) * 0.20 + 65000;
  } else if (netIncome > 500000) {
    taxCalculated += (netIncome - 500000) * 0.15 + 27500;
  } else if (netIncome > 300000) {
    taxCalculated += (netIncome - 300000) * 0.10 + 7500;
  } else if (netIncome > 150000) {
    taxCalculated += (netIncome - 150000) * 0.05;
  }

  const withholdingTax = income.withholdingTax || 0; 
  const totalTax = taxCalculated - withholdingTax;

  return {
    totalIncome,
    totalExpense,
    incomeAfterExpense,
    totalDeductions,
    netIncome,
    taxCalculated,
    withholdingTax,
    totalTax
  };
};

export const calculateTax = (incomes: Incomes, deductions: Deductions, filingStatus: string): TaxSummary => {
  const taxpayerSummary = calculateIndividual(incomes.taxpayer, deductions.taxpayer);
  const spouseSummary = calculateIndividual(incomes.spouse, deductions.spouse);

  if (filingStatus === 'รวมคำนวณ') {
    // การรวมคำนวณ: ให้นำเงินได้หลังหักค่าใช้จ่ายของแต่ละคนมารวมกัน
    const combinedTotalIncome = taxpayerSummary.totalIncome + spouseSummary.totalIncome;
    const combinedTotalExpense = taxpayerSummary.totalExpense + spouseSummary.totalExpense;
    const combinedIncomeAfterExpense = taxpayerSummary.incomeAfterExpense + spouseSummary.incomeAfterExpense;
    
    const combinedTotalDeductions = taxpayerSummary.totalDeductions + spouseSummary.totalDeductions;
    
    let netIncome = combinedIncomeAfterExpense - combinedTotalDeductions;
    if (netIncome < 0) netIncome = 0;

    let taxCalculated = 0;
    if (netIncome > 5000000) taxCalculated += (netIncome - 5000000) * 0.35 + 1265000;
    else if (netIncome > 2000000) taxCalculated += (netIncome - 2000000) * 0.30 + 365000;
    else if (netIncome > 1000000) taxCalculated += (netIncome - 1000000) * 0.25 + 115000;
    else if (netIncome > 750000) taxCalculated += (netIncome - 750000) * 0.20 + 65000;
    else if (netIncome > 500000) taxCalculated += (netIncome - 500000) * 0.15 + 27500;
    else if (netIncome > 300000) taxCalculated += (netIncome - 300000) * 0.10 + 7500;
    else if (netIncome > 150000) taxCalculated += (netIncome - 150000) * 0.05;

    const combinedWithholdingTax = taxpayerSummary.withholdingTax + spouseSummary.withholdingTax;
    const totalTax = taxCalculated - combinedWithholdingTax;

    const combinedSummary = {
      totalIncome: combinedTotalIncome,
      totalExpense: combinedTotalExpense,
      incomeAfterExpense: combinedIncomeAfterExpense,
      totalDeductions: combinedTotalDeductions,
      netIncome,
      taxCalculated,
      withholdingTax: combinedWithholdingTax,
      totalTax
    };
    
    return {
      taxpayer: taxpayerSummary,
      spouse: spouseSummary,
      combined: combinedSummary
    };
  } else {
    // แยกยื่น
    return {
      taxpayer: taxpayerSummary,
      spouse: spouseSummary
    };
  }
};
