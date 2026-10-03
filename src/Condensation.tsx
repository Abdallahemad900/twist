import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

export interface CondensationProps {
  /** Model units are metres. Change these when adapting to another can. */
  radius?: number
  minY?: number
  maxY?: number
  count?: number
  seed?: number
  animate?: boolean
  /** Water transmission costs an extra render pass; false is a lighter option. */
  transmission?: boolean
}

/** One instanced draw for all beads. Place beside the dry GLB under the same group. */
export function Condensation({radius=.0265,minY=.012,maxY=.119,count=420,seed=923,animate=false,transmission=true}:CondensationProps) {
  const mesh = useRef<InstancedMesh>(null)
  const elapsed = useRef(0)
  const dummy = useMemo(()=>new Object3D(),[])
  const drops = useMemo(()=>{
    let state=seed>>>0
    const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296}
    return Array.from({length:Math.max(0,Math.min(2000,Math.floor(count)))},(_,i)=>{
      const a=random()*Math.PI*2
      const y=minY+random()*(maxY-minY)
      const r=.00016+random()**2.9*.00092
      return {a,y,r,stretch:1+(r/.0011)**2*.65,moving:i<18,speed:.0014+random()*.001}
    })
  },[count,seed,minY,maxY])
  const setDrop=(i:number,y:number)=>{
    const d=drops[i]
    const rr=radius+d.r*.16
    dummy.position.set(rr*Math.cos(d.a),y,rr*Math.sin(d.a))
    // Sphere local Z is the radial axis, local Y runs vertically.
    dummy.rotation.set(0,Math.PI/2-d.a,0)
    dummy.scale.set(d.r,d.r*d.stretch,d.r*.6)
    dummy.updateMatrix()
    mesh.current!.setMatrixAt(i,dummy.matrix)
  }
  useLayoutEffect(()=>{
    if(!mesh.current)return
    elapsed.current=0
    drops.forEach((d,i)=>setDrop(i,d.y))
    mesh.current.instanceMatrix.needsUpdate=true
    mesh.current.computeBoundingSphere()
  },[drops,radius])
  useFrame((_,delta)=>{
    if(!animate||!mesh.current)return
    elapsed.current+=Math.min(delta,.05)
    const span=maxY-minY
    drops.forEach((d,i)=>{
      if(d.moving){
        const offset=((d.y-minY-elapsed.current*d.speed)%span+span)%span
        setDrop(i,minY+offset)
      }
    })
    mesh.current.instanceMatrix.needsUpdate=true
  })
  return <instancedMesh ref={mesh} args={[undefined,undefined,drops.length]} frustumCulled={false} name="WebGL condensation">
    <sphereGeometry args={[1,10,6]}/>
    <meshPhysicalMaterial color="#faffff" roughness={.075} metalness={0}
      transmission={transmission ? .98 : 0} ior={1.333} thickness={.0005}
      clearcoat={.2} clearcoatRoughness={.055} envMapIntensity={1.2}/>
  </instancedMesh>
}
