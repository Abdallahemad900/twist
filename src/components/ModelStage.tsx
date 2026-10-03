import {Component,Suspense,lazy,useCallback,useEffect,useRef,useState,type ReactNode} from 'react'
import type {SceneProps} from './CanScene'
import {useLocale} from '../lib/locale'
const CanScene=lazy(()=>import('./CanScene'))
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?this.props.fallback:this.props.children}
}
export function ModelStage({className='',label,...props}:SceneProps&{className?:string;label?:string}){
 const root=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(props.mode==='hero'),[hidden,setHidden]=useState(false)
 const [readyKey,setReadyKey]=useState('')
 const {paused,t,setHeroReady}=useLocale()
 const mode=props.mode
 const signature=`${mode}-${props.flavour}-${props.water}-${paused}`
 const ready=readyKey===signature
 const onReady=useCallback(()=>{setReadyKey(signature);if(mode==='hero')setHeroReady(true)},[mode,signature,setHeroReady])
 useEffect(()=>{
  const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'100px'})
  if(root.current)observer.observe(root.current)
  const onVisibility=()=>setHidden(document.hidden)
  document.addEventListener('visibilitychange',onVisibility)
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',onVisibility)}
 },[])
 const fallback=<div className="scene-fallback"><img src="/media/blueberry-wet.png" alt={t('Blueberry Island can','علبة بلوبيري آيلاند')}/><p>{t('3D needs WebGL. You can still explore the flavors and downloads below.','العرض المجسم يحتاج WebGL. تقدر تستكشف النكهات وتحمل الملفات تحت.')}</p></div>
 return <div ref={root} className={`model-stage ${className}`} role="img" aria-label={label||t('Interactive Twist can in 3D','علبة تويست مجسمة تفاعلية')}>
  {visible&&!hidden?<SceneBoundary fallback={fallback}><Suspense fallback={<div className="model-loader">{t('Loading 3D…','تحميل العرض المجسم…')}</div>}><CanScene {...props} paused={paused||props.paused} onReady={onReady}/></Suspense>{!ready&&<div className="model-loader" role="status">{t('Bringing the chill…','بنجهّز الانتعاش…')}</div>}</SceneBoundary>:<div className="stage-placeholder"/>}
 </div>
}
