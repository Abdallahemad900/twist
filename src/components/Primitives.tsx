import {useRef,type ReactNode,type CSSProperties} from 'react'
import {motion,useMotionValue,useSpring,useTransform} from 'motion/react'
import {ArrowUpRight} from 'lucide-react'
import {useLocale} from '../lib/locale'
export function Eyebrow({number,children}:{number?:string;children:ReactNode}){return <div className="eyebrow">{number&&<span className="section-no">{number}</span>}<span>{children}</span></div>}
export function Action({href,children,light=false}:{href:string;children:ReactNode;light?:boolean}){return <a className={`action ${light?'action-light':''}`} href={href}><span>{children}</span><ArrowUpRight aria-hidden="true" size={19}/></a>}
export function Tilt({children,className='',style}:{children:ReactNode;className?:string;style?:CSSProperties}){
 const ref=useRef<HTMLDivElement>(null),x=useMotionValue(0),y=useMotionValue(0),{paused}=useLocale()
 const sx=useSpring(x,{stiffness:130,damping:18}),sy=useSpring(y,{stiffness:130,damping:18})
 const rotateX=useTransform(sy,[-.5,.5],[7,-7]),rotateY=useTransform(sx,[-.5,.5],[-9,9])
 return <motion.div ref={ref} className={`tilt ${className}`} style={{...style,rotateX:paused?0:rotateX,rotateY:paused?0:rotateY,transformPerspective:900}} onPointerMove={e=>{if(paused||e.pointerType==='touch')return;const r=ref.current!.getBoundingClientRect();x.set((e.clientX-r.left)/r.width-.5);y.set((e.clientY-r.top)/r.height-.5)}} onPointerLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.div>
}
