import {useRef,useState} from 'react'
import {gsap,useGSAP,useScrollProgress} from '../lib/motion'
import {useLocale} from '../lib/locale'
import {ModelStage} from './ModelStage'
import {Eyebrow,Action} from './Primitives'

export function FrostSection(){
 const root=useRef<HTMLElement>(null),{t,paused}=useLocale(),progress=useScrollProgress(root,paused)
 return <section id="cold" ref={root} className={`frost-section scroll-section ${paused?'still':''}`} data-section="4">
  <div className="sticky-scene"><ModelStage mode="frost" flavour="blueberry_island" water="static" spin={false} progress={progress}/>
   <div className="frost-copy"><Eyebrow number="04">{t('BREAK THE ICE','اكسر التلج')}</Eyebrow><h2>{t('A NEW TASTE.','طعم جديد.')}<br/><em>{t('A NEW MOOD.','مزاج جديد.')}</em></h2><p>{t('Scroll into something refreshingly different.','كمّل واكتشف انتعاش مختلف.')}</p></div>
   <a className="scene-next" href="#flavors">{t('Meet the collection ↓','اكتشف المجموعة ↓')}</a>
  </div>
 </section>
}
export function BentoSection(){
 const root=useRef<HTMLElement>(null),{t,paused,language}=useLocale()
 useGSAP(()=>{
  if(paused)return
  gsap.fromTo('.bento-card',{y:(i)=>i%2?70:-50,rotate:(i)=>i%2?4:-3},{y:0,rotate:0,ease:'none',scrollTrigger:{trigger:root.current,start:'top 85%',end:'bottom 70%',scrub:1}})
  gsap.to('.bento-card img',{scale:1.1,ease:'none',scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:true}})
 },{scope:root,dependencies:[paused,language],revertOnUpdate:true})
 return <section ref={root} id="island" className="bento-section section-pad" data-section="7">
  <div className="section-heading"><div><Eyebrow number="07">{t('POSTCARDS FROM THE ISLAND','صور من الآيلاند')}</Eyebrow><h2>{t('BLUE LOOKS','الأزرق')}<br/><em>{t('GOOD ON YOU.','لايق عليك.')}</em></h2></div><p>{t('A world of blueberries, ice, and a little bit of the unexpected.','عالم من التوت الأزرق والتلج، ومفاجأة في كل تفصيلة.')}</p></div>
  <div className="bento-grid">
   <figure className="bento-card bento-tall"><div className="bento-crop"><img src="/media/berries.png" alt={t('Blueberry Island surrounded by blueberries','بلوبيري آيلاند وسط حبات التوت الأزرق')} loading="lazy"/></div><figcaption><span>01</span>{t('BERRY MUCH YOUR THING','توت على مزاجك')}</figcaption></figure>
   <figure className="bento-card bento-macro"><div className="bento-crop"><img src="/media/macro.png" alt={t('Close-up of the chilled blueberry can','تفاصيل قطرات المياه على العلبة الباردة')} loading="lazy"/></div><figcaption><span>02</span>{t('EVERY LITTLE DETAIL','كل تفصيلة بتفرق')}</figcaption></figure>
   <figure className="bento-card bento-float"><div className="bento-crop"><img src="/media/floating.png" alt={t('Two floating Blueberry Island cans','علبتين بلوبيري آيلاند في الهوا')} loading="lazy"/></div><figcaption><span>03</span>{t('A DIFFERENT PERSPECTIVE','شوفها من زاوية تانية')}</figcaption></figure>
   <div className="bento-card bento-type"><span className="tiny">BLUEBERRY ISLAND</span><strong>{t('STAY','خلّيك')}<br/><em>{t('CURIOUS.','فضولي.')}</em></strong><Action href="#journey">{t('Take a closer look','قرّب وشوف')}</Action></div>
  </div>
 </section>
}
export function WaypointSection(){
 const root=useRef<HTMLElement>(null),{t,paused}=useLocale(),progress=useScrollProgress(root,paused),[step,setStep]=useState(0)
 const titles=[t('FIRST IMPRESSION.','أول انطباع.'),t('TOP OF THE DROP.','من أول فتحة.'),t('THE OTHER SIDE.','من الناحية التانية.'),t('LOOK A LITTLE CLOSER.','قرّب أكتر.'),t('A FRESH PERSPECTIVE.','زاوية جديدة.'),t('BACK TO BLUE.','ورجعنا للأزرق.')]
 const notes=[t('That unmistakable baby blue.','الأزرق الفاتح اللي تعرفه من بعيد.'),t('Silver edges. Small details.','حواف فضية وتفاصيل صغيرة.'),t('Turn it around. Discover the full can.','لف العلبة وشوف كل تفاصيلها.'),t('Chilled, down to the last drop.','برودة لحد آخر قطرة.'),t('A twist from every angle.','تويست من كل زاوية.'),t('Blueberry Island. All the way around.','بلوبيري آيلاند. من كل ناحية.')]
 useGSAP(()=>{
  if(paused){setStep(0);return}
  const trigger=gsap.to({p:0},{p:1,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom bottom',onUpdate:s=>setStep(Math.min(5,Math.round(s.progress*5)))}})
  return()=>{trigger.scrollTrigger?.kill();trigger.kill()}
 },{scope:root,dependencies:[paused],revertOnUpdate:true})
 const go=(i:number)=>{if(paused){progress.current=i/5;setStep(i);return}if(!root.current)return;const top=root.current.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+(root.current.offsetHeight-window.innerHeight)*i/5,behavior:'smooth'})}
 return <section id="journey" ref={root} className={`waypoint-section scroll-section ${paused?'still':''}`} data-section="8"><div className="sticky-scene">
  <div className="waypoint-word" aria-hidden="true">{t('TWIST','تويست')}</div><ModelStage mode="waypoints" progress={progress} viewpoint={paused?step:undefined} flavour="blueberry_island" water="static"/>
  <div className="waypoint-top"><Eyebrow number="08">{t('THE 360° JOURNEY','رحلة ٣٦٠ درجة')}</Eyebrow><span className="tiny">{String(step+1).padStart(2,'0')} / 06</span></div>
  <div className="waypoint-copy"><h2>{titles[step]}</h2><p>{notes[step]}</p></div>
  <nav className="waypoint-dots" aria-label={t('Can viewpoints','زوايا العلبة')}>{titles.map((title,i)=><button key={i} onClick={()=>go(i)} aria-label={title} aria-current={i===step?'step':undefined}><span/></button>)}</nav>
 </div></section>
}
