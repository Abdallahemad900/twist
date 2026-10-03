export const flavours=[
 {id:'original',name:'Original',color:'#e2e4e1'},
 {id:'coconutberry',name:'Coconutberry',color:'#b43ea8'},
 {id:'blueberry_island',name:'Blueberry Island',color:'#75cfdf'},
 {id:'mango_peach',name:'Mango Peach',color:'#ec801d'},
 {id:'strawberry',name:'Strawberry',color:'#db2936'},
 {id:'power_craze',name:'Power Craze',color:'#2255b7'},
] as const
export type Flavour=typeof flavours[number]['id']
export type WaterMode='off'|'static'|'animated'
