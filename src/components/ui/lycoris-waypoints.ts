/** Camera pacing adapted from the supplied Lycoris Specimen by kedhareswer (21st.dev).
 * The flower renderer is replaced with the user's existing Twist GLB.
 */
const clamp01=(t:number)=>Math.max(0,Math.min(1,t))
const easeInOut=(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2
export function sceneCoord(p:number,n:number,hold=.35){
 if(n<=1)return 0
 const t=clamp01(p)*(n-1),i=Math.min(Math.floor(t),n-2),h=hold/2
 return i+easeInOut(clamp01((t-i-h)/(1-2*h)))
}
// [rotation Y, rotation X, rotation Z, scale, vertical offset]
export const BLUEBERRY_WAYPOINTS=[
 [0,.08,-.12,1,0],
 [.7,.8,.12,1.25,-.4],
 [Math.PI,0,0,.9,0],
 [Math.PI*1.4,-.2,-.28,1.32,.2],
 [Math.PI*2,.15,.25,.9,0],
 [Math.PI*2+.2,0,-.12,1.1,0],
] as const
export function waypointAt(progress:number){
 const c=sceneCoord(progress,BLUEBERRY_WAYPOINTS.length),i=Math.min(Math.floor(c),4),f=c-i
 return BLUEBERRY_WAYPOINTS[i].map((v,k)=>v+(BLUEBERRY_WAYPOINTS[i+1][k]-v)*f)
}
