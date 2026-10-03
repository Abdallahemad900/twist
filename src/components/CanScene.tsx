import {Suspense,useRef,useMemo,useEffect,type RefObject} from 'react'
import {Canvas,useFrame,useThree} from '@react-three/fiber'
import {Environment,Lightformer,OrbitControls,ContactShadows,useGLTF} from '@react-three/drei'
import {Group,ShaderMaterial,MathUtils,Vector2} from 'three'
import {TwistCan,flavours,type Flavour,type WaterMode} from '../TwistCan'
import {waypointAt} from './ui/lycoris-waypoints'

export type SceneMode='hero'|'duo'|'frost'|'lineup'|'single'|'orbit'|'waypoints'
export function preloadModels(flavour:SceneProps['flavour']='blueberry_island'){
 const items=flavour==='all'?flavours.map(f=>f.id):[flavour]
 items.forEach(id=>useGLTF.preload(`/models/web/${id}_dry.glb`))
}
export interface SceneProps {
 mode?:SceneMode;flavour?:Flavour|'all';water?:WaterMode;back?:boolean;spin?:boolean;
 density?:number;paused?:boolean;progress?:RefObject<number>;angle?:number;viewpoint?:number;interactive?:boolean;onReady?:()=>void;
}
function Lighting(){return <>
 <ambientLight intensity={.55}/><directionalLight position={[3,4,5]} intensity={2.8}/>
 <Environment resolution={128}>
  <Lightformer position={[-3,1,4]} scale={[3,6,1]} intensity={3}/>
  <Lightformer position={[3,2,3]} scale={[2,5,1]} intensity={2.5}/>
  <Lightformer position={[0,5,0]} rotation={[Math.PI/2,0,0]} scale={[6,2,1]} intensity={3}/>
 </Environment>
 </>}
function Can({flavour,water='animated',density=220,paused=false}:SceneProps&{flavour:Flavour}){
 return <group><TwistCan flavour={flavour} water={water} animateDrops={!paused} dropCount={density} position={[0,-1.206,0]} scale={18}/></group>
}
function Berries({paused}:{paused:boolean}){
 const root=useRef<Group>(null)
 const berries=useMemo(()=>Array.from({length:20},(_,i)=>{const a=i*2.39996;return {x:Math.cos(a)*(1.45+(i%4)*.23),y:Math.sin(a)*1.7,z:-.5-(i%3)*.4,s:.09+(i%5)*.025,a}}),[])
 useFrame((s)=>{if(root.current&&!paused){root.current.rotation.z=Math.sin(s.clock.elapsedTime*.12)*.06;root.current.position.y=Math.sin(s.clock.elapsedTime*.4)*.04}})
 return <group ref={root}>{berries.map((b,i)=><group key={i} position={[b.x,b.y,b.z]} scale={b.s} rotation={[.3,b.a,.5]}>
  <mesh><sphereGeometry args={[1,20,14]}/><meshStandardMaterial color={i%3?'#344774':'#4c6393'} roughness={.55} metalness={.05}/></mesh>
  <mesh position={[0,.88,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.24,.1,6,12]}/><meshStandardMaterial color="#203158" roughness={.8}/></mesh>
  <mesh position={[0,.92,0]}><coneGeometry args={[.24,.09,5]}/><meshStandardMaterial color="#121e40"/></mesh>
 </group>)}</group>
}
function Feature({mode='hero',flavour='blueberry_island',water='animated',paused=false,progress,spin=true,back=false,angle=0,viewpoint,density=260}:SceneProps){
 const group=useRef<Group>(null),second=useRef<Group>(null)
 const {invalidate}=useThree()
 useEffect(()=>invalidate(),[invalidate,viewpoint,angle,back,spin,paused])
 const elapsed=useRef(0)
 useFrame((state,delta)=>{
  if(!group.current)return
  if(!paused)elapsed.current+=Math.min(delta,.04)
  const t=elapsed.current, g=group.current
  if(mode==='waypoints'){
   const k=waypointAt(paused&&viewpoint!==undefined?viewpoint/5:progress?.current??0)
   g.rotation.set(k[1],k[0],k[2]);g.scale.setScalar(k[3]);g.position.y=k[4]
  }else if(mode==='single'){
   g.rotation.set(.05,angle+(back?Math.PI:0)+(spin?t*.3:0),0)
  }else{
   const py=paused?0:state.pointer.y*.08,px=paused?0:state.pointer.x*.14
   g.rotation.x=MathUtils.damp(g.rotation.x,.08+py,3,delta)
   g.rotation.y=MathUtils.damp(g.rotation.y,(spin?t*.32:0)+px+angle,3,delta)
   g.rotation.z=mode==='duo'?-.27:-.16
   g.position.y=paused?0:Math.sin(t*.9)*.06
   g.position.x=mode==='duo'?.63:0
   if(second.current){second.current.rotation.set(-.15,-t*.18+.5,.38);second.current.position.set(-.62,-.05,-.6)}
  }
 })
 return <>
  <group ref={group}><Can flavour={flavour==='all'?'blueberry_island':flavour} water={water} paused={paused} density={density}/></group>
  {mode==='duo'&&<group ref={second}><Can flavour="blueberry_island" water={water} paused={paused}/></group>}
  {(mode==='hero'||mode==='duo')&&<Berries paused={paused}/>}
  {mode==='frost'&&<Frost progress={progress} paused={paused}/>}
 </>
}
const frostFragment=`
precision highp float;
uniform float uProgress; uniform vec2 uResolution;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
void main(){
 vec2 uv=gl_FragCoord.xy/uResolution;vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.);
 float n=noise(uv*18.)*.5+noise(uv*65.)*.3+noise(uv*220.)*.2;
 float edge=length(p*vec2(.82,1.)) + (n-.5)*.22;
 float aperture=mix(-.18,1.8,uProgress);
 float frost=smoothstep(aperture-.05,aperture+.13,edge);
 vec3 color=mix(vec3(.38,.65,.8),vec3(.89,.98,1.),n);
 float shards=pow(abs(sin(uv.x*75.+noise(uv*8.)*14.)),28.);
 color+=shards*.1;
 gl_FragColor=vec4(color,frost*.98);
}`
function Frost({progress,paused}:{progress?:RefObject<number>;paused:boolean}){
 const mat=useRef<ShaderMaterial>(null)
 const {size,gl}=useThree()
 const uniforms=useMemo(()=>({uProgress:{value:0},uResolution:{value:new Vector2(1,1)}}),[])
 useEffect(()=>{uniforms.uResolution.value.set(size.width*gl.getPixelRatio(),size.height*gl.getPixelRatio())},[size,gl,uniforms])
 useFrame(()=>{if(mat.current)mat.current.uniforms.uProgress.value=paused?1:(progress?.current??0)})
 return <mesh position={[0,0,2]} renderOrder={20}><planeGeometry args={[30,30]}/><shaderMaterial ref={mat} transparent depthWrite={false} depthTest={false} uniforms={uniforms} fragmentShader={frostFragment} vertexShader="void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"/></mesh>
}
function Collection({mode,flavour='all',water='static',back=false,spin=false,paused=false,density,angle=0}:SceneProps){
 const root=useRef<Group>(null)
 const {size}=useThree()
 const narrow=size.width<680
 const shown=flavour==='all'?flavours:flavours.filter(f=>f.id===flavour)
 useFrame((_,delta)=>{if(root.current&&spin&&!paused)root.current.rotation.y+=delta*.16})
 return <group ref={root}>{shown.map((f,i)=>{
  const orbit=mode==='orbit',a=i/6*Math.PI*2
  const x=shown.length===1?0:orbit?Math.cos(a)*2.0:narrow?(i%3-1)*1.38:(i-2.5)*1.23
  const y=shown.length===1?0:orbit?Math.sin(a)*.5:narrow?(i<3?1.35:-1.35):0
  return <group key={f.id} position={[x,y,orbit?Math.sin(a)*1.3:0]} rotation={[orbit?-.08:0,angle+(back?Math.PI:0),orbit?Math.cos(a)*.16:0]} scale={narrow&&shown.length>1?.9:1}>
   <Can flavour={f.id} water={water} paused={paused} density={density}/>
  </group>
 })}</group>
}
function Fit({mode,flavour}:SceneProps){
 const {camera,size,invalidate}=useThree()
 useEffect(()=>{
  const aspect=size.width/size.height,multi=(mode==='lineup'||mode==='orbit')&&flavour==='all'
  const distance=multi?(mode==='orbit'?Math.max(6.2,7.5/aspect):size.width<680?Math.max(8.7,6/aspect):Math.max(6.2,12/aspect)):mode==='duo'?Math.max(5.8,4.3/aspect):Math.max(4.9,2.7/aspect)
  camera.position.set(0,.13,distance);camera.lookAt(0,0,0);camera.updateProjectionMatrix();invalidate()
 },[camera,size,mode,flavour,invalidate])
 return null
}
function ResponsiveControls(){
 const {size,gl}=useThree()
 // Let a vertical touch gesture keep scrolling on phones. Their cans have
 // explicit rotation buttons; mouse dragging remains available on desktop.
 useEffect(()=>{if(size.width<680)gl.domElement.style.touchAction='pan-y'},[gl,size.width])
 return size.width>=680?<OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI*.2} maxPolarAngle={Math.PI*.8} enableDamping/>:null
}
function Loaded({onReady,signature}:{onReady?:()=>void;signature:string}){useEffect(()=>{onReady?.()},[onReady,signature]);return null}
export default function CanScene(props:SceneProps){
 const {mode='hero',flavour='blueberry_island',paused=false,interactive=false}=props
 const moving=!paused&&(props.water==='animated'||!!props.spin||['hero','duo','frost','waypoints'].includes(mode))
 return <Canvas camera={{fov:36,near:.01,far:60}} dpr={[1,1.25]} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} frameloop={moving?'always':'demand'}>
  <Suspense fallback={null}><Lighting/>
   {mode==='lineup'||mode==='orbit'?<Collection {...props}/>:<Feature {...props}/>}
   {(mode==='lineup'||mode==='single')&&<ContactShadows position={[0,-1.24,0]} opacity={.3} scale={12} blur={2.5} far={3} resolution={256} frames={1}/>}
   <Loaded onReady={props.onReady} signature={`${flavour}-${props.water}-${paused}`}/>
  </Suspense>
  <Fit mode={mode} flavour={flavour}/>
  {interactive&&<ResponsiveControls/>}
 </Canvas>
}
