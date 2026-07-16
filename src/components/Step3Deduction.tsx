import type { ReactNode } from 'react';
import type { Deductions } from '../types';
import Tooltip from './Tooltip';

interface Props {
  data: Deductions;
  updateData: (data: Partial<Deductions>) => void;
  maritalStatus: string;
}

const Step3Deduction = ({ data, updateData, maritalStatus }: Props) => {
  const showSpouse = maritalStatus === 'สมรส';

  const handleUpdate = (person: 'taxpayer' | 'spouse', field: string, value: number) => {
    updateData({
      [person]: {
        ...data[person],
        [field]: value
      }
    });
  };

  const renderInput = (label: string, field: keyof typeof data.taxpayer, subtext?: string, tooltipText?: ReactNode, isPersonalAllowance?: boolean) => {
    const taxpayerId = `taxpayer-${field}`;
    const spouseId = `spouse-${field}`;
    return (
    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
        <div className="input-label" style={{ margin: 0 }}>{label}</div>
        {tooltipText && <Tooltip text={tooltipText} />}
        {subtext && <span className="help-text-sm margin-left">{subtext}</span>}
      </div>
      
      <div className="flex-row-mobile-col">
        <div style={{ flex: 1 }}>
          <label htmlFor={taxpayerId} className="help-text">ผู้มีเงินได้</label>
          <input 
            id={taxpayerId}
            type="number" 
            min="0"
            step="any"
            value={data.taxpayer[field] ?? (isPersonalAllowance ? 60000 : '')} 
            onChange={e => handleUpdate('taxpayer', field, e.target.value as any)} 
            style={{ width: '100%' }}
            disabled={isPersonalAllowance} 
          />
        </div>
        
        {showSpouse && (
          <div style={{ flex: 1 }}>
            <label htmlFor={spouseId} className="help-text">คู่สมรส</label>
            <input 
              id={spouseId}
              type="number" 
              min="0"
              step="any"
              value={data.spouse[field] ?? ''} 
              onChange={e => handleUpdate('spouse', field, e.target.value as any)} 
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  )};

  return (
    <div>
      <h2 className="section-title">3. รายการลดหย่อนและยกเว้นภาษี</h2>
      
      <h3 className="section-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>กลุ่มลดหย่อนส่วนตัวและครอบครัว</h3>
      {renderInput(
        'ผู้มีเงินได้ / คู่สมรส', 
        'personal', 
        'หักลดหย่อนส่วนตัว', 
        'หักลดหย่อนได้ 60,000 บาท เสมอ (หากคู่สมรสมีเงินได้และยื่นรวม จะได้สิทธิ์ลดหย่อน 60,000 บาท ในช่องคู่สมรสด้วย)', 
        true
      )}
      {renderInput(
        'คู่สมรส (กรณีไม่มีเงินได้)', 
        'spouse', 
        'สูงสุด 60,000', 
        'หักได้ 60,000 บาท ในกรณีคู่สมรสจดทะเบียนสมรสถูกต้องตามกฎหมาย และคู่สมรสไม่มีรายได้เลยตลอดทั้งปีภาษี'
      )}
      {renderInput(
        'บุตร (รวมทุกคน)', 
        'children', 
        'คนละ 30,000 หรือ 60,000', 
        <ul>
          <li style={{marginBottom:'0.25rem'}}>บุตรชอบด้วยกฎหมายลดหย่อนได้คนละ 30,000 บาท (ไม่จำกัดจำนวน)</li>
          <li style={{marginBottom:'0.25rem'}}>บุตรคนที่ 2 เป็นต้นไปที่เกิดตั้งแต่ปี 2561 ได้เพิ่มอีก 30,000 บาท (รวม 60,000 บาท/คน)</li>
          <li>บุตรบุญธรรม ลดหย่อนได้คนละ 30,000 บาท (รวมบุตรชอบด้วยกฎหมายแล้วต้องไม่เกิน 3 คน)</li>
        </ul>
      )}
      {renderInput(
        'อุปการะเลี้ยงดูบิดามารดา', 
        'parents', 
        'คนละ 30,000', 
        'บิดามารดาต้องมีอายุ 60 ปีขึ้นไป และมีเงินได้พึงประเมินในปีภาษีไม่เกิน 30,000 บาท ลดหย่อนได้คนละ 30,000 บาท (บิดามารดาของคู่สมรสก็สามารถหักได้ หากคู่สมรสไม่มีเงินได้)'
      )}
      {renderInput(
        'อุปการะผู้พิการ/ทุพพลภาพ', 
        'disabled', 
        'คนละ 60,000', 
        'ผู้พิการต้องมีบัตรประจำตัวคนพิการ และผู้มีเงินได้ต้องเป็นผู้ดูแลที่มีชื่อในบัตรคนพิการ ลดหย่อนได้คนละ 60,000 บาท'
      )}

      <h3 className="section-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginTop: '2rem', marginBottom: '1rem' }}>กลุ่มประกันและการลงทุน</h3>
      {renderInput(
        'เงินสมทบกองทุนประกันสังคม', 
        'socialSecurity', 
        'ตามที่จ่ายจริง', 
        'หักได้ตามจำนวนเงินที่จ่ายจริง แต่ไม่เกินเพดานที่กฎหมายกำหนดในแต่ละปีภาษี (ปกติคือ 5% ของค่าจ้างสูงสุด 15,000 บาท = เดือนละ 750 บาท หรือ 9,000 บาทต่อปี)'
      )}
      {renderInput(
        'เบี้ยประกันชีวิตทั่วไป', 
        'lifeInsurance', 
        'สูงสุด 100,000', 
        'ประกันชีวิตที่มีกำหนดเวลาตั้งแต่ 10 ปีขึ้นไป เมื่อรวมกับเงินฝากแบบมีเงื่อนไขกรมธรรม์แล้ว หักได้ตามที่จ่ายจริง สูงสุดไม่เกิน 100,000 บาท'
      )}
      {renderInput(
        'เบี้ยประกันสุขภาพ', 
        'healthInsurance', 
        'สูงสุด 25,000', 
        'เบี้ยประกันสุขภาพตัวเอง หักได้ตามจริงแต่ไม่เกิน 25,000 บาท และเมื่อรวมกับประกันชีวิตทั่วไปแล้วต้องไม่เกิน 100,000 บาท'
      )}
      {renderInput(
        'เบี้ยประกันสุขภาพบิดามารดา', 
        'parentsHealthInsurance', 
        'สูงสุด 15,000', 
        'หักได้ตามจริงไม่เกิน 15,000 บาท (บิดามารดาต้องมีรายได้ไม่เกิน 30,000 บาท/ปี)'
      )}
      {renderInput(
        'เงินสะสมกองทุนสำรองเลี้ยงชีพ / กบข.', 
        'providentFund',
        'ส่วนที่เกิน 10,000 บาท',
        'นำไปหักออกจากเงินได้ 40(1) โดยตรง (สูงสุดไม่เกิน 15% ของค่าจ้าง และไม่เกิน 500,000 บาท)'
      )}
      {renderInput(
        'RMF (กองทุนรวมเพื่อการเลี้ยงชีพ)', 
        'rmf',
        '',
        'หักได้สูงสุด 30% ของเงินได้พึงประเมิน แต่ไม่เกิน 500,000 บาท (เมื่อรวมกับกองทุนเพื่อการเกษียณอื่นๆ เช่น กบข. ประกันบำนาญ SSF ต้องไม่เกิน 500,000 บาท)'
      )}
      {renderInput(
        'SSF (กองทุนรวมเพื่อการออม)', 
        'ssf',
        '',
        'หักได้สูงสุด 30% ของเงินได้พึงประเมิน แต่ไม่เกิน 200,000 บาท (และต้องถือครองไม่น้อยกว่า 10 ปีเต็ม)'
      )}
      {renderInput(
        'Thai ESG', 
        'thaiEsg',
        '',
        'หักลดหย่อนได้สูงสุด 30% ของเงินได้พึงประเมิน สูงสุดไม่เกิน 300,000 บาท (และต้องถือครองไม่น้อยกว่า 5 ปีนับจากวันที่ซื้อ - ตามประกาศกฎหมายอัปเดตล่าสุด)'
      )}

      <h3 className="section-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginTop: '2rem', marginBottom: '1rem' }}>มาตรการกระตุ้นเศรษฐกิจและการกุศล</h3>
      {renderInput(
        'ดอกเบี้ยเงินกู้ยืมเพื่อที่อยู่อาศัย', 
        'homeLoanInterest', 
        'สูงสุด 100,000',
        'ดอกเบี้ยเงินกู้ยืมเพื่อซื้อ เช่าซื้อ หรือสร้างอาคารที่อยู่อาศัย หักได้ตามจริงแต่ไม่เกิน 100,000 บาท'
      )}
      {renderInput(
        'ช้อปดีมีคืน / Easy E-Receipt', 
        'easyEReceipt', 
        'ตามที่รัฐกำหนดในแต่ละปี',
        'หักได้ตามจริงสูงสุดตามเพดานที่รัฐกำหนดในปีภาษีนั้นๆ (เช่น 50,000 บาท) ต้องใช้ใบกำกับภาษีเต็มรูปหรือใบรับอิเล็กทรอนิกส์ (e-Tax Invoice/e-Receipt)'
      )}
      {renderInput(
        'เงินบริจาค', 
        'donations',
        'พรรคการเมือง/สถานศึกษา/ทั่วไป',
        <ul>
          <li style={{marginBottom:'0.25rem'}}>**พรรคการเมือง:** หักได้ตามจริง สูงสุด 10,000 บาท</li>
          <li style={{marginBottom:'0.25rem'}}>**บริจาคสนับสนุนการศึกษา/พยาบาล (e-Donation):** หักได้ 2 เท่าของที่จ่ายจริง แต่ไม่เกิน 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อนอื่นๆ</li>
          <li>**บริจาคทั่วไป:** หักได้ตามจริง แต่ไม่เกิน 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อนอื่นๆ</li>
        </ul>
      )}

    </div>
  );
};

export default Step3Deduction;
