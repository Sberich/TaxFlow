import { useState } from 'react';
import type { TaxFormData, IndividualTaxSummary, IncomeDetails, DeductionDetails } from '../types';

interface Props {
  formData: TaxFormData;
}

const incomeLabels: Record<string, string> = {
  section40_1: 'เงินเดือน โบนัส (40(1))',
  section40_2: 'รับจ้าง ฟรีแลนซ์ (40(2))',
  section40_3: 'ค่าลิขสิทธิ์ (40(3))',
  section40_4: 'ดอกเบี้ย ปันผล (40(4))',
  section40_5: 'ค่าเช่า (40(5))',
  section40_6: 'วิชาชีพอิสระ (40(6))',
  section40_7: 'รับเหมา (40(7))',
  section40_8: 'ธุรกิจอื่นๆ (40(8))',
  withholdingTax: 'ภาษีหัก ณ ที่จ่าย'
};

const deductionLabels: Record<string, string> = {
  personal: 'ลดหย่อนส่วนตัว',
  spouse: 'ลดหย่อนคู่สมรส',
  children: 'ลดหย่อนบุตร',
  parents: 'ดูแลบิดามารดา',
  disabled: 'ดูแลผู้พิการ',
  lifeInsurance: 'เบี้ยประกันชีวิต',
  healthInsurance: 'เบี้ยประกันสุขภาพ',
  parentsHealthInsurance: 'ประกันสุขภาพบิดามารดา',
  providentFund: 'กองทุนสำรองเลี้ยงชีพ/กบข.',
  ssf: 'กองทุน SSF',
  rmf: 'กองทุน RMF',
  thaiEsg: 'กองทุน ThaiESG',
  socialSecurity: 'เงินสมทบประกันสังคม',
  homeLoanInterest: 'ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย',
  donations: 'เงินบริจาค',
  easyEReceipt: 'Easy E-Receipt'
};

const Step4Summary = ({ formData }: Props) => {
  const { summary, personalInfo } = formData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwnxmQ5QlniGO86E4AiequcErIpI8KmUCYjeq1hEEcjoytWfgqOvKGlAaEbKIA6bBAtlw/exec';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }

      if (result.status === 'success') {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Unknown server error');
      }
    } catch (error: any) {
      console.error('Error submitting data:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSummaryCard = (title: string, data: IndividualTaxSummary, taxpayerData?: IndividualTaxSummary, spouseData?: IndividualTaxSummary) => (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
      <h3 className="section-title" style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{title}</h3>
      
      <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--background-start)', borderRadius: '8px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
          <div className="help-text" style={{ marginBottom: '0.5rem' }}>เงินได้ทั้งหมด</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(data.totalIncome)}</div>
          {taxpayerData && spouseData && (
            <div className="help-text-sm" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>ผู้ยื่น: {formatCurrency(taxpayerData.totalIncome)}</span>
              <span>คู่สมรส: {formatCurrency(spouseData.totalIncome)}</span>
            </div>
          )}
        </div>
        <div style={{ padding: '1rem', background: 'var(--background-start)', borderRadius: '8px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
          <div className="help-text" style={{ marginBottom: '0.5rem' }}>หักค่าใช้จ่าย</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(data.totalExpense)}</div>
          {taxpayerData && spouseData && (
            <div className="help-text-sm" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>ผู้ยื่น: {formatCurrency(taxpayerData.totalExpense)}</span>
              <span>คู่สมรส: {formatCurrency(spouseData.totalExpense)}</span>
            </div>
          )}
        </div>
        <div style={{ padding: '1rem', background: 'var(--background-start)', borderRadius: '8px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
          <div className="help-text" style={{ marginBottom: '0.5rem' }}>ลดหย่อน & เงินยกเว้น</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(data.totalDeductions)}</div>
          {taxpayerData && spouseData && (
            <div className="help-text-sm" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>ผู้ยื่น: {formatCurrency(taxpayerData.totalDeductions)}</span>
              <span>คู่สมรส: {formatCurrency(spouseData.totalDeductions)}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h4 className="help-text" style={{ margin: 0, fontSize: '1rem' }}>เงินได้สุทธิเพื่อคำนวณภาษี</h4>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', margin: '0.5rem 0' }}>
          {formatCurrency(data.netIncome)}
        </div>
      </div>

      <div style={{ padding: '1rem', background: data.totalTax > 0 ? '#fff1f2' : 'var(--background-start)', borderRadius: '8px', border: `1px solid ${data.totalTax > 0 ? '#fecdd3' : 'var(--card-border)'}`, textAlign: 'center' }}>
        <h4 style={{ margin: 0, color: data.totalTax > 0 ? 'var(--error-color)' : 'var(--secondary-color)', fontSize: '1.1rem' }}>
          {data.totalTax > 0 ? 'ภาษีที่ต้องชำระเพิ่มเติม' : 'ภาษีที่ชำระไว้เกิน (ขอคืนได้)'}
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: data.totalTax > 0 ? 'var(--error-color)' : 'var(--secondary-color)', margin: '0.5rem 0' }}>
          {formatCurrency(Math.abs(data.totalTax))}
        </div>
      </div>
    </div>
  );

  const renderDetailRow = (label: string, taxpayerVal: number, spouseVal: number, isCombined: boolean) => {
    if (!taxpayerVal && !spouseVal) return null;
    return (
      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--card-border)', fontSize: '0.85rem' }}>
        <div style={{ flex: isCombined ? 1.5 : 2, color: 'var(--text-main)' }}>{label}</div>
        <div style={{ flex: 1, textAlign: 'right', color: taxpayerVal ? 'var(--text-main)' : 'var(--text-muted)' }}>{taxpayerVal ? formatCurrency(taxpayerVal) : '-'}</div>
        {isCombined && (
          <div style={{ flex: 1, textAlign: 'right', color: spouseVal ? 'var(--text-main)' : 'var(--text-muted)' }}>{spouseVal ? formatCurrency(spouseVal) : '-'}</div>
        )}
      </div>
    );
  };

  const renderDetailedBreakdown = () => {
    const isCombined = personalInfo.filingStatus === 'รวมคำนวณ';
    
    return (
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 className="section-title" style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>รายละเอียดข้อมูลที่กรอก</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Income Box */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', fontSize: '1.05rem' }}>รายได้ (Income)</h4>
            <div style={{ display: 'flex', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
              <div style={{ flex: isCombined ? 1.5 : 2 }}>รายการ</div>
              <div style={{ flex: 1, textAlign: 'right' }}>{isCombined ? 'ผู้ยื่น' : 'จำนวนเงิน'}</div>
              {isCombined && <div style={{ flex: 1, textAlign: 'right' }}>คู่สมรส</div>}
            </div>
            {Object.entries(incomeLabels).map(([key, label]) => 
              renderDetailRow(label, formData.incomes.taxpayer[key as keyof IncomeDetails] || 0, formData.incomes.spouse[key as keyof IncomeDetails] || 0, isCombined)
            )}
          </div>

          {/* Deductions Box */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', fontSize: '1.05rem' }}>ลดหย่อน & เงินยกเว้น</h4>
            <div style={{ display: 'flex', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
              <div style={{ flex: isCombined ? 1.5 : 2 }}>รายการ</div>
              <div style={{ flex: 1, textAlign: 'right' }}>{isCombined ? 'ผู้ยื่น' : 'จำนวนเงิน'}</div>
              {isCombined && <div style={{ flex: 1, textAlign: 'right' }}>คู่สมรส</div>}
            </div>
            {Object.entries(deductionLabels).map(([key, label]) => 
              renderDetailRow(label, formData.deductions.taxpayer[key as keyof DeductionDetails] || 0, formData.deductions.spouse[key as keyof DeductionDetails] || 0, isCombined)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>4. สรุปผลการคำนวณภาษี</h2>
      
      {renderDetailedBreakdown()}

      {personalInfo.filingStatus === 'รวมคำนวณ' && summary.combined ? (
        renderSummaryCard('สรุปยอดรวม (ยื่นร่วมกัน)', summary.combined, summary.taxpayer, summary.spouse)
      ) : (
        <>
          {renderSummaryCard(`สรุปยอด ผู้มีเงินได้ (${personalInfo.firstName || 'ไม่ระบุชื่อ'})`, summary.taxpayer)}
          {summary.spouse && renderSummaryCard(`สรุปยอด คู่สมรส (${personalInfo.spouseFirstName || 'ไม่ระบุชื่อ'})`, summary.spouse)}
        </>
      )}

      <div className="text-center" style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--card-border)' }}>
        
        {submitStatus === 'success' && (
          <div style={{ color: 'var(--secondary-color)', marginBottom: '1rem', fontWeight: 500 }}>
            ✅ บันทึกข้อมูลลง Google Sheets เรียบร้อยแล้ว
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div style={{ color: 'var(--error-color)', marginBottom: '1rem', fontWeight: 500 }}>
            ❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล: {errorMessage}
          </div>
        )}

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', maxWidth: '300px', fontSize: '1.1rem', padding: '1rem' }}
          onClick={handleSubmit}
          disabled={isSubmitting || submitStatus === 'success'}
        >
          {isSubmitting ? 'กำลังบันทึกข้อมูล...' : submitStatus === 'success' ? 'บันทึกสำเร็จ' : 'บันทึกข้อมูลลง Google Sheets'}
        </button>
      </div>
    </div>
  );
};

export default Step4Summary;
