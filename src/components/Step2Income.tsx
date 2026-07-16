import type { ReactNode } from 'react';
import type { Incomes } from '../types';
import Tooltip from './Tooltip';

interface Props {
  data: Incomes;
  updateData: (data: Partial<Incomes>) => void;
  maritalStatus: string;
}

const Step2Income = ({ data, updateData, maritalStatus }: Props) => {
  const showSpouse = maritalStatus === 'สมรส';

  const handleUpdate = (person: 'taxpayer' | 'spouse', field: string, value: number) => {
    updateData({
      [person]: {
        ...data[person],
        [field]: value
      }
    });
  };

  const renderInput = (label: string, field: keyof typeof data.taxpayer, subtext?: string, tooltipText?: ReactNode) => {
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
            value={data.taxpayer[field] ?? ''} 
            onChange={e => handleUpdate('taxpayer', field, e.target.value as any)} 
            style={{ width: '100%' }}
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
      <h2 className="section-title">2. รายได้พึงประเมิน</h2>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
        <span className="help-text">(เงินได้มาตรา 40 ก่อนหักภาษีหรือประกันสังคม)</span>
      </div>

      {renderInput(
        'มาตรา 40(1) เงินเดือน ค่าจ้าง โบนัส บำนาญ', 
        'section40_1',
        '* ระบบคำนวณหักค่าใช้จ่ายให้อัตโนมัติ ไม่ต้องกรอกเอง',
        'เงินได้เนื่องจากการจ้างแรงงาน เช่น เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส เบี้ยหวัด บำเหน็จ บำนาญ เงินค่าเช่าบ้านที่ได้รับจากนายจ้าง ฯลฯ'
      )}
      {renderInput(
        'มาตรา 40(2) ค่าจ้างทั่วไป ค่านายหน้า เบี้ยประชุม', 
        'section40_2', 
        '* ระบบคำนวณหักค่าใช้จ่าย (รวมกับ 40(1)) ให้อัตโนมัติ',
        'เงินได้เนื่องจากหน้าที่หรือตำแหน่งงานที่ทำ หรือจากการรับทำงานให้ เช่น ค่าธรรมเนียม ค่านายหน้า ค่าส่วนลด เงินอุดหนุนในงานที่ทำ เบี้ยประชุม ค่าสอนหนังสือ ฯลฯ'
      )}

      {renderInput(
        'มาตรา 40(3) ค่าลิขสิทธิ์ กู๊ดวิลล์', 
        'section40_3',
        '',
        'เงินได้ประเภทค่าแห่งกู๊ดวิลล์ ค่าแห่งลิขสิทธิ์ สิทธิบัตร เครื่องหมายการค้า หรือสิทธิอย่างอื่น เงินปี หรือเงินได้มีลักษณะเป็นเงินรายปี (หักค่าใช้จ่ายได้ 50% ไม่เกิน 1 แสนบาท หรือหักตามจริง)'
      )}
      {renderInput('หักค่าใช้จ่าย 40(3)', 'expense40_3', 'ตามจริง หรือ 50% ไม่เกิน 1 แสน')}

      {renderInput(
        'มาตรา 40(4) ดอกเบี้ย เงินปันผล คริปโตฯ', 
        'section40_4', 
        'ไม่สามารถหักค่าใช้จ่ายได้',
        'เงินได้ประเภทดอกเบี้ย เงินปันผล เงินส่วนแบ่งกำไร เงินโบนัสที่จ่ายแก่ผู้ถือหุ้น รวมถึงผลประโยชน์ที่ได้จากการโอนคริปโทเคอร์เรนซีหรือโทเคนดิจิทัล (กฎหมายไม่อนุญาตให้หักค่าใช้จ่าย)'
      )}
      
      {renderInput(
        'มาตรา 40(5) ค่าเช่าทรัพย์สิน', 
        'section40_5',
        '',
        'เงินได้จากการให้เช่าทรัพย์สิน (บ้าน ที่ดิน รถยนต์ ฯลฯ) รวมถึงการผิดสัญญาเช่าซื้อ หักค่าใช้จ่ายแบบเหมาได้ 10-30% ขึ้นอยู่กับประเภททรัพย์สิน หรือหักตามจริง'
      )}
      
      {renderInput(
        'มาตรา 40(6) วิชาชีพอิสระ (หมอ, ทนาย, วิศวะ)', 
        'section40_6',
        '',
        'เงินได้จากวิชาชีพอิสระ คือ วิชากฎหมาย การประกอบโรคศิลปะ วิศวกรรม สถาปัตยกรรม การบัญชี ประณีตศิลปกรรม (ประกอบโรคศิลปะหักเหมา 60% วิชาชีพอื่นหักเหมา 30% หรือหักตามจริง)'
      )}
      {renderInput('หักค่าใช้จ่าย 40(6)', 'expense40_6', 'หักเหมา 30% หรือ 60%')}
      
      {renderInput(
        'มาตรา 40(7) รับเหมา (ผู้รับเหมาจัดหาสัมภาระ)', 
        'section40_7',
        '',
        'เงินได้จากการรับเหมาที่ผู้รับเหมาต้องลงทุนด้วยการจัดหาสัมภาระในส่วนสำคัญนอกจากเครื่องมือ (เช่น รับเหมาก่อสร้าง) หักค่าใช้จ่ายเหมา 60% หรือหักตามจริง'
      )}
      {renderInput('หักค่าใช้จ่าย 40(7)', 'expense40_7', 'หักเหมา 60% หรือตามจริง')}
      
      {renderInput(
        'มาตรา 40(8) ธุรกิจ การพาณิชย์ อื่นๆ', 
        'section40_8',
        '',
        'เงินได้จากการธุรกิจ การพาณิชย์ การเกษตร การอุตสาหกรรม การขนส่ง การขายอสังหาริมทรัพย์ หรือการอื่นใดที่ไม่เข้า 40(1) ถึง 40(7) (หักค่าใช้จ่ายเหมา 60% หรือหักตามจริง ขึ้นอยู่กับประเภทกิจการ)'
      )}
      {renderInput('หักค่าใช้จ่าย 40(8)', 'expense40_8', 'หักเหมา 60% หรือตามจริง')}

      <h3 className="section-title" style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginTop: '2rem' }}>ภาษีที่ชำระไว้แล้ว</h3>
      {renderInput(
        'ภาษีหัก ณ ที่จ่าย', 
        'withholdingTax', 
        'รวมภาษีทั้งหมดที่ถูกหักไว้ระหว่างปี',
        'ภาษีเงินได้หัก ณ ที่จ่าย ที่ผู้จ่ายเงินได้หักไว้แล้ว (เช่น ตามที่ระบุในหนังสือรับรองการหักภาษี ณ ที่จ่าย หรือ 50 ทวิ) รวมถึงภาษีที่จ่ายล่วงหน้า'
      )}
    </div>
  );
};

export default Step2Income;
