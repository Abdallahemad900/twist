import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {createServer} from 'vite'
import React from 'react'
import {renderToString} from 'react-dom/server'

// Server-rendered content and file contracts only. No browser automation or WebGL.
const server=await createServer({server:{middlewareMode:true,watch:null},appType:'custom'})
const checks=[]
const modelHashes=JSON.parse(fs.readFileSync('source-assets/model-sha256.json','utf8'))
try {
 const {default:App}=await server.ssrLoadModule('/src/App.tsx')
 for(const language of ['en','ar']){
  const html=renderToString(React.createElement(App,{initialLanguage:language}))
  const sections=[...html.matchAll(/data-section="(\d+)"/g)].map(m=>Number(m[1]))
  assert.deepEqual(sections,Array.from({length:13},(_,i)=>i+1))
  assert.match(html,/<section id="flavors"[^>]*data-section="5"/)
  assert.equal((html.match(/download=""/g)||[]).length,13)
  const ids=new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]))
  for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(id),`Missing anchor ${id}`)
  for(const [,file] of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)){
   assert.ok(fs.existsSync(path.join('public',file)),`Missing asset ${file}`)
  }
  if(language==='ar'){assert.match(html,/بلوبيري/);assert.match(html,/كل النكهات/);assert.match(html,/تحميل العرض المجسم/)}
  else {assert.match(html,/BLUEBERRY/);assert.match(html,/THE FULL COLLECTION/)}
  checks.push(`${language}: 13 sections, explorer fifth, 12 GLB downloads + collection ZIP, valid anchors and assets`)
 }
 const {sceneCoord,waypointAt}=await server.ssrLoadModule('/src/components/ui/lycoris-waypoints.ts')
 assert.equal(sceneCoord(0,6),0);assert.equal(sceneCoord(1,6),5)
 let last=-1
 for(let i=0;i<=1000;i++){const v=sceneCoord(i/1000,6);assert.ok(v>=last);last=v;assert.ok(waypointAt(i/1000).every(Number.isFinite))}
 checks.push('Waypoint interpolation: bounded, finite and monotonic across 1,001 samples')
 const ids=['original','blueberry_island','coconutberry','mango_peach','strawberry','power_craze']
 for(const id of ids)for(const suffix of ['', '_dry']){
  const file=`models/${id}${suffix}.glb`,buf=fs.readFileSync(`public/${file}`)
  assert.equal(buf.subarray(0,4).toString(),'glTF')
  assert.equal(buf.readUInt32LE(8),buf.length)
  assert.equal(createHash('sha256').update(buf).digest('hex'),modelHashes[`${id}${suffix}.glb`],`Changed existing model ${file}`)
 }
 checks.push('All 12 public GLBs match the existing V2 model files byte for byte')
 fs.writeFileSync('verification.json',JSON.stringify({date:new Date().toISOString(),status:'passed',scope:'Static/server-rendered verification. Browser visual and WebGL execution were blocked by browser URL policy.',checks},null,2))
 console.log(checks.join('\n'))
}finally{await server.close()}
