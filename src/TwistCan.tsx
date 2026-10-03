import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { Condensation } from './Condensation'

import type {Flavour,WaterMode} from './lib/flavours'
export {flavours,type Flavour,type WaterMode} from './lib/flavours'
export type TwistCanProps=ThreeElements['group'] & {
  flavour:Flavour
  water?:WaterMode
  modelPath?:string
  dropCount?:number
  seed?:number
  transmission?:boolean
  /** Freeze the procedural water layer while retaining its chosen density. */
  animateDrops?:boolean
}

/** Front faces +Z, Y is up, base is y=0; height ≈0.134 m. */
export function TwistCan({flavour,water='static',modelPath='/models',dropCount=420,seed=923,transmission=true,animateDrops=true,...props}:TwistCanProps){
  const suffix=water==='static'?'':'_dry'
  const {scene}=useGLTF(`${modelPath}/${flavour}${suffix}.glb`)
  // Independent transforms, shared immutable geometry/materials for efficient reuse.
  const object=useMemo(()=>scene.clone(true),[scene])
  return <group {...props}>
    <primitive object={object} dispose={null}/>
    {water==='animated'&&<Condensation count={dropCount} seed={seed} animate={animateDrops} transmission={transmission}/>}
  </group>
}
