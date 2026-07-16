import { useState, useEffect } from 'react';
import Step1Personal from './components/Step1Personal';
import Step2Income from './components/Step2Income';
import Step3Deduction from './components/Step3Deduction';
import Step4Summary from './components/Step4Summary';
import type { TaxFormData } from './types';
import { calculateTax } from './utils/taxCalculator';

const emptyIncome = {
  section40_1: 0, section40_2: 0, section40_3: 0, section40_4: 0,
  section40_5: 0, section40_6: 0, section40_7: 0, section40_8: 0,
  expense40_1_2: 0, expense40_3: 0, expense40_5: 0, expense40_6: 0, expense40_7: 0, expense40_8: 0,
  withholdingTax: 0,
};

const emptyDeduction = {
  personal: 60000, spouse: 0, children: 0, parents: 0, disabled: 0,
  lifeInsurance: 0, healthInsurance: 0, parentsHealthInsurance: 0,
  providentFund: 0, ssf: 0, rmf: 0, thaiEsg: 0, socialSecurity: 0,
  homeLoanInterest: 0, donations: 0, easyEReceipt: 0,
};

const initialData: TaxFormData = {
  personalInfo: {
    taxId: '', firstName: '', lastName: '', birthDate: '',
    maritalStatus: 'โสด', filingStatus: 'แยกยื่น',
    refundRequest: false, politicalSubsidy: false, politicalPartyCode: '',
    spouseTaxId: '', spouseFirstName: '', spouseLastName: '',
  },
  incomes: {
    taxpayer: { ...emptyIncome },
    spouse: { ...emptyIncome },
  },
  deductions: {
    taxpayer: { ...emptyDeduction },
    spouse: { ...emptyDeduction },
  },
  summary: {
    taxpayer: { totalIncome: 0, totalExpense: 0, incomeAfterExpense: 0, totalDeductions: 0, netIncome: 0, taxCalculated: 0, withholdingTax: 0, totalTax: 0 }
  },
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Note: we're resetting localStorage completely for this major update. 
  // We don't read from localStorage for this migration step to avoid errors with old data structure.
  // We'll re-enable localstorage normally.
  const [formData, setFormData] = useState<TaxFormData>(() => {
    const savedData = localStorage.getItem('taxFormDataV2');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('taxFormDataV2', JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    if (currentStep < 4) {
      if (currentStep === 3) {
        const summary = calculateTax(formData.incomes, formData.deductions, formData.personalInfo.filingStatus);
        setFormData(prev => ({ ...prev, summary }));
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateData = (section: keyof TaxFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const loadFullData = (data: TaxFormData) => {
    setFormData(data);
  };

  const resetData = () => {
    setFormData(initialData);
    setCurrentStep(1);
  };

  return (
    <div className="glass-card">
      <div className="text-center mb-4">
        <h1 className="app-title">
          <img src="/logo.svg" alt="TaxFlow Logo" className="app-logo" />
          TaxFlow
        </h1>
        <p className="app-subtitle">คำนวณภาษีเงินได้บุคคลธรรมดา (ภ.ง.ด.90)</p>
      </div>

      <div className="wizard-header">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`step-indicator ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="wizard-content">
        {currentStep === 1 && (
          <Step1Personal data={formData.personalInfo} updateData={(data) => updateData('personalInfo', data)} loadFullData={loadFullData} resetData={resetData} />
        )}
        {currentStep === 2 && (
          <Step2Income data={formData.incomes} updateData={(data) => updateData('incomes', data)} maritalStatus={formData.personalInfo.maritalStatus} />
        )}
        {currentStep === 3 && (
          <Step3Deduction data={formData.deductions} updateData={(data) => updateData('deductions', data)} maritalStatus={formData.personalInfo.maritalStatus} />
        )}
        {currentStep === 4 && (
          <Step4Summary formData={formData} />
        )}
      </div>

      <div className="wizard-actions">
        {currentStep > 1 ? (
          <button className="btn btn-secondary" onClick={handlePrev}>ย้อนกลับ</button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 4 && (
          <button className="btn btn-primary" onClick={handleNext}>ถัดไป</button>
        )}
      </div>
    </div>
  );
}

export default App;
