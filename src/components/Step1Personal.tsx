import { useState } from 'react';
import type { PersonalInfo, TaxFormData } from '../types';
import CustomSelect from './CustomSelect';

interface Props {
  data: PersonalInfo;
  updateData: (data: Partial<PersonalInfo>) => void;
  loadFullData: (data: TaxFormData) => void;
  resetData?: () => void;
}

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwnxmQ5QlniGO86E4AiequcErIpI8KmUCYjeq1hEEcjoytWfgqOvKGlAaEbKIA6bBAtlw/exec';

const Step1Personal = ({ data, updateData, loadFullData, resetData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleLoadData = async () => {
    if (!data.taxId) {
      setLoadError('กรุณากรอกเลขประจำตัวผู้เสียภาษีอากรก่อน');
      return;
    }
    
    setIsLoading(true);
    setLoadError('');

    try {
      const response = await fetch(`${GAS_URL}?action=load&taxId=${data.taxId}`);
      if (!response.ok) {
        throw new Error('Network error');
      }
      
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        loadFullData(result.data);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // ซ่อนหลังจาก 3 วินาที
      } else {
        setLoadError(result.message || 'ไม่พบข้อมูล');
      }
    } catch (error: any) {
      console.error(error);
      setLoadError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">1. ข้อมูลส่วนตัวและสถานภาพ</h2>
      
      <div className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="taxId" className="input-label">เลขประจำตัวผู้เสียภาษีอากร</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <input 
              id="taxId"
              type="text" 
              maxLength={13}
              value={data.taxId} 
              onChange={e => updateData({ taxId: e.target.value })} 
              placeholder="13 หลัก"
              style={{ flex: '1 1 200px', maxWidth: '100%' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 0 auto' }}>
              {!confirmClear ? (
                <>
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1, whiteSpace: 'nowrap' }}
                    onClick={handleLoadData}
                    disabled={isLoading || !data.taxId}
                  >
                    {isLoading ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลที่เคยบันทึก'}
                  </button>
                  {resetData && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ color: '#ef4444', borderColor: '#fca5a5', background: '#fef2f2', whiteSpace: 'nowrap' }}
                      onClick={() => setConfirmClear(true)}
                      title="ล้างข้อมูลทั้งหมดเพื่อเริ่มกรอกใหม่"
                    >
                      ล้างข้อมูล
                    </button>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, alignItems: 'center', background: '#fff', padding: '0.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0.5rem' }}>แน่ใจนะ?</span>
                  <button 
                    className="btn btn-primary" 
                    style={{ background: '#ef4444', whiteSpace: 'nowrap', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    onClick={() => { if(resetData) resetData(); setConfirmClear(false); }}
                  >
                    ล้างเลย
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.75rem', fontSize: '0.85rem', border: 'none' }}
                    onClick={() => setConfirmClear(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>
          </div>
          {loadError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{loadError}</p>}
        </div>

        <div className="flex-row-mobile-col" style={{ marginBottom: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="firstName" className="input-label">ชื่อ</label>
          <input 
            id="firstName"
            type="text" 
            value={data.firstName} 
            onChange={e => updateData({ firstName: e.target.value })} 
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="lastName" className="input-label">นามสกุล</label>
          <input 
            id="lastName"
            type="text" 
            value={data.lastName} 
            onChange={e => updateData({ lastName: e.target.value })} 
          />
        </div>
      </div>
      </div>
      <div className="flex-row-mobile-col" style={{ marginTop: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1, minWidth: 0 }}>
          <label htmlFor="birthDate" className="input-label">วันเกิด</label>
          <input 
            id="birthDate"
            type="date" 
            value={data.birthDate} 
            onChange={e => updateData({ birthDate: e.target.value })} 
            style={{ width: '100%', padding: '0.5rem 0.25rem' }}
          />
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: 0 }}>
          <label htmlFor="maritalStatus" className="input-label">สถานภาพ</label>
          <CustomSelect 
            id="maritalStatus"
            value={data.maritalStatus} 
            onChange={(value) => updateData({ maritalStatus: value as any })}
            options={[
              { value: "โสด", label: "โสด" },
              { value: "สมรส", label: "สมรส" },
              { value: "หม้าย", label: "หม้าย" }
            ]}
          />
        </div>

        {data.maritalStatus === 'สมรส' && (
          <div className="form-group" style={{ flex: 1.2, minWidth: 0 }}>
            <label htmlFor="filingStatus" className="input-label">การยื่นแบบ</label>
            <CustomSelect 
              id="filingStatus"
              value={data.filingStatus} 
              onChange={(value) => updateData({ filingStatus: value as any })}
              options={[
                { value: "แยกยื่น", label: "แยกยื่น" },
                { value: "รวมคำนวณ", label: "รวมคำนวณ" }
              ]}
            />
          </div>
        )}
      </div>

      {data.maritalStatus === 'สมรส' && (
        <div style={{ background: 'var(--background-start)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', marginBottom: '1rem', border: '1px solid var(--card-border)' }}>
          <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>ข้อมูลคู่สมรส</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="spouseTaxId" className="input-label">เลขประจำตัวผู้เสียภาษีอากร (คู่สมรส)</label>
              <input 
                id="spouseTaxId"
                type="text" 
                maxLength={13}
                value={data.spouseTaxId || ''} 
                onChange={e => updateData({ spouseTaxId: e.target.value })} 
              />
            </div>
            <div className="flex-row-mobile-col">
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="spouseFirstName" className="input-label">ชื่อ (คู่สมรส)</label>
                <input 
                  id="spouseFirstName"
                  type="text" 
                  value={data.spouseFirstName || ''} 
                  onChange={e => updateData({ spouseFirstName: e.target.value })} 
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="spouseLastName" className="input-label">นามสกุล (คู่สมรส)</label>
                <input 
                  id="spouseLastName"
                  type="text" 
                  value={data.spouseLastName || ''} 
                  onChange={e => updateData({ spouseLastName: e.target.value })} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-group mt-4">
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="refund"
            checked={data.refundRequest}
            onChange={e => updateData({ refundRequest: e.target.checked })}
          />
          <label htmlFor="refund">มีความประสงค์จะขอคืนเงินภาษีที่ชำระไว้เกิน (ผ่าน PromptPay)</label>
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="political"
            checked={data.politicalSubsidy}
            onChange={e => updateData({ politicalSubsidy: e.target.checked })}
          />
          <label htmlFor="political">ประสงค์อุดหนุนเงินภาษีให้พรรคการเมือง (สูงสุด 500 บาท)</label>
        </div>
        {data.politicalSubsidy && (
          <div className="mt-4" style={{ maxWidth: '300px' }}>
            <label htmlFor="politicalPartyCode" className="input-label">รหัสพรรคการเมือง</label>
            <input 
              id="politicalPartyCode"
              type="text" 
              maxLength={3}
              value={data.politicalPartyCode || ''} 
              onChange={e => updateData({ politicalPartyCode: e.target.value })} 
              placeholder="000"
            />
          </div>
        )}
      </div>

      {showToast && (
        <div className="toast-notification">
          <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓</span> ดึงข้อมูลสำเร็จเรียบร้อย
        </div>
      )}
    </div>
  );
};

export default Step1Personal;
