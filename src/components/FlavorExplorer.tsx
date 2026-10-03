import {useState} from 'react'
import {ArrowLeft,ArrowRight,RotateCw,Droplets} from 'lucide-react'
import {ModelStage} from './ModelStage'
import {Eyebrow} from './Primitives'
import {flavours,type Flavour,type WaterMode} from '../lib/flavours'
import {useLocale} from '../lib/locale'
export function FlavorExplorer({selected,onSelect}:{selected:Flavour|'all';onSelect:(f:Flavour|'all')=>void}){
 const {t,name}=useLocale(),[water,setWater]=useState<WaterMode>('static'),[back,setBack]=useState(false),[spin,setSpin]=useState(false),[angle,setAngle]=useState(0)
 return <section id="flavors" className="explorer section-pad" data-section="5">
  <div className="section-heading"><div><Eyebrow number="05">{t('THE FULL COLLECTION','كل النكهات')}</Eyebrow><h2>{t('SIX FLAVORS.','ست نكهات.')}<br/><em>{t('YOUR TWIST.','تويست على مزاجك.')}</em></h2></div><p>{t('One family. Six different personalities. Pick a can and get to know every side.','عيلة واحدة، وست شخصيات مختلفة. اختار علبتك وشوفها من كل زاوية.')}</p></div>
  <div className="flavor-tabs" role="group" aria-label={t('Choose flavor','اختار النكهة')}>
   <button aria-pressed={selected==='all'} onClick={()=>{onSelect('all');setAngle(0)}}>{t('All six','الست نكهات')}</button>
   {flavours.map(f=><button key={f.id} aria-pressed={selected===f.id} onClick={()=>{onSelect(f.id);setAngle(0)}}><i style={{background:f.color}}/>{name(f.id)}{f.id==='blueberry_island'&&<small>{t('NEW','جديد')}</small>}</button>)}
  </div>
  <div className="explorer-stage"><ModelStage mode={selected==='all'?'lineup':'single'} flavour={selected} water={water} back={back} spin={spin} angle={angle} interactive/>
   <div className="viewer-caption"><span>{selected==='all'?t('06 / 06 — THE COLLECTION','٠٦ / ٠٦ — المجموعة'):name(selected)}</span><span>{t('ROTATE WITH THE ARROWS','لف العلبة بالأسهم')}</span></div>
  </div>
  <div className="explorer-controls">
   <div className="view-controls"><button onClick={()=>setAngle(a=>a-Math.PI/4)} aria-label={t('Rotate left','لف لليسار')}><ArrowLeft size={18}/></button><button aria-pressed={back} onClick={()=>{setBack(!back);setAngle(0);setSpin(false)}}>{back?t('Show fronts','شوف الوجه الأمامي'):t('Show backs','شوف الظهر')}</button><button onClick={()=>setAngle(a=>a+Math.PI/4)} aria-label={t('Rotate right','لف لليمين')}><ArrowRight size={18}/></button></div>
   <button className="control-toggle" aria-pressed={spin} onClick={()=>setSpin(!spin)}><RotateCw size={16} aria-hidden="true"/>{spin?t('Stop rotation','وقف الدوران'):t('Auto rotate','دوران تلقائي')}</button>
   <label className="select-control"><Droplets size={16} aria-hidden="true"/><span className="sr-only">{t('Water droplets','قطرات المياه')}</span><select aria-label={t('Water droplets','قطرات المياه')} value={water} onChange={e=>setWater(e.target.value as WaterMode)}><option value="static">{t('Chilled','بارد')}</option><option value="animated">{t('Running droplets','قطرات متحركة')}</option><option value="off">{t('Dry can','بدون قطرات')}</option></select></label>
  </div>
 </section>
}
