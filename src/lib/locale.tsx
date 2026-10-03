import {createContext,useContext,type ReactNode,useState,useEffect} from 'react'
import {useReducedMotion} from 'motion/react'
import type {Flavour} from './flavours'
export type Language='en'|'ar'
const arNames:Record<Flavour,string>={original:'أوريجينال',blueberry_island:'بلوبيري آيلاند',coconutberry:'كوكونت بيري',mango_peach:'مانجو خوخ',strawberry:'فراولة',power_craze:'باور كريز'}
const enNames:Record<Flavour,string>={original:'Original',blueberry_island:'Blueberry Island',coconutberry:'Coconutberry',mango_peach:'Mango Peach',strawberry:'Strawberry',power_craze:'Power Craze'}
const Locale=createContext({language:'en' as Language,setLanguage:(_l:Language)=>{},t:(en:string,_ar:string)=>en,name:(f:Flavour)=>enNames[f],paused:false,setPaused:(_v:boolean)=>{},heroReady:false,setHeroReady:(_v:boolean)=>{}})
export function LocaleProvider({children,initialLanguage}:{children:ReactNode;initialLanguage?:Language}){
 const [language,setLanguage]=useState<Language>(()=>{if(initialLanguage)return initialLanguage;try{return localStorage.getItem('twist-language')==='ar'?'ar':'en'}catch{return 'en'}})
 const [manualPause,setPaused]=useState<boolean|null>(null)
 const [heroReady,setHeroReady]=useState(false)
 const reduced=useReducedMotion()
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';document.title=language==='ar'?'تويست · بلوبيري آيلاند':'TWIST · Blueberry Island';try{localStorage.setItem('twist-language',language)}catch{}},[language])
 return <Locale.Provider value={{language,setLanguage,t:(en,ar)=>language==='ar'?ar:en,name:f=>language==='ar'?arNames[f]:enNames[f],paused:manualPause??!!reduced,setPaused,heroReady,setHeroReady}}>{children}</Locale.Provider>
}
export const useLocale=()=>useContext(Locale)
