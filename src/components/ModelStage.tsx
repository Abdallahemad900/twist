import {Component,Suspense,lazy,useCallback,useEffect,useRef,useState,type ReactNode} from 'react'
import type {SceneProps} from './CanScene'
import {useLocale} from '../lib/locale'
const loadScene=()=>import('./CanScene')
const CanScene=lazy(loadScene)
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?this.props.fallback:this.props.children}
}
export function ModelStage({className='',label,...props}:SceneProps&{className?:string;label?:string}){
 const root=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(props.mode==='hero'),[mounted,setMounted]=useState(props.mode==='hero'),[hidden,setHidden]=useState(false)
 const [readyKey,setReadyKey]=useState('')
 const {paused,t,setHeroReady}=useLocale()
 const mode=props.mode
 const signature=`${mode}-${props.flavour}`
 const ready=readyKey===signature
 const onReady=useCallback(()=>{setReadyKey(signature);if(mode==='hero')setHeroReady(true)},[mode,signature,setHeroReady])
 useEffect(()=>{
  // Warm modules and all requested GLBs before the scene reaches the viewport.
  const warm=new IntersectionObserver(([e])=>{
   if(e.isIntersecting){setMounted(true);void loadScene().then(m=>m.preloadModels(props.flavour)).catch(()=>{});warm.disconnect()}
  },{rootMargin:'600px'})
  const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting))
  if(root.current){warm.observe(root.current);observer.observe(root.current)}
  const onVisibility=()=>setHidden(document.hidden)
  document.addEventListener('visibilitychange',onVisibility)
  return()=>{warm.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility)}
 },[props.flavour])
 const poster=<div className="model-poster" aria-hidden="true"><img src={props.flavour&&props.flavour!=='blueberry_island'?'/media/all-six-front.webp':'/media/blueberry-wet.webp'} alt="" loading={mode==='hero'?'eager':'lazy'} decoding="async"/><span>{t('Interactive 3D','عرض مجسم تفاعلي')}</span></div>
 const fallback=<div className="scene-fallback"><img src="/media/blueberry-wet.webp" alt={t('Blueberry Island can','علبة بلوبيري آيلاند')}/><p>{t('3D needs WebGL. You can still explore the flavors and downloads below.','العرض المجسم يحتاج WebGL. تقدر تستكشف النكهات وتحمل الملفات تحت.')}</p></div>
 return <div ref={root} className={`model-stage ${className}`} role="img" aria-label={label||t('Interactive Twist can in 3D','علبة تويست مجسمة تفاعلية')}>
  {mounted?<SceneBoundary fallback={fallback}><Suspense fallback={null}><CanScene {...props} paused={paused||props.paused||!visible||hidden} onReady={onReady}/></Suspense>{!ready&&poster}</SceneBoundary>:poster}
 </div>
}
