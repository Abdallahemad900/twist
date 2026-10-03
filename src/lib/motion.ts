import {useEffect,useRef,type RefObject} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useGSAP} from '@gsap/react'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger,useGSAP)
export {gsap,ScrollTrigger,useGSAP}

export function useSmoothScroll(paused:boolean){
 useEffect(()=>{
  if(paused)return
  const lenis=new Lenis({duration:1.12,smoothWheel:true,anchors:{offset:-80},syncTouch:false})
  lenis.on('scroll',ScrollTrigger.update)
  const update=(time:number)=>lenis.raf(time*1000)
  gsap.ticker.add(update)
  return()=>{gsap.ticker.remove(update);lenis.destroy()}
 },[paused])
}
export function useScrollProgress(ref:RefObject<HTMLElement|null>,paused=false){
 const progress=useRef(0)
 useGSAP(()=>{
  if(paused){progress.current=0;return}
  const trigger=ScrollTrigger.create({trigger:ref.current,start:'top top',end:'bottom bottom',onUpdate:self=>{progress.current=self.progress}})
  return()=>trigger.kill()
 },{scope:ref,dependencies:[paused],revertOnUpdate:true})
 return progress
}
