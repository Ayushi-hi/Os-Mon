export type TileType = 0|1|2|3|4|5|6|7|8|9

export interface NpcData {
  x: number; y: number; color: string; name: string
  lines: (string | { type: string; text?: string; monId?: number })[]
}
export interface Portal {
  x: number; y: number; to: string; tx: number; ty: number
  label: string; edge: 'top'|'bottom'|'left'|'right'
}
export interface AreaAtmosphere {
  skyBottom: number; fogColor: number; fogDensity: number
  sunColor: number; sunIntensity: number
  ambientColor: number; ambientIntensity: number
  groundColor: number; grassColor: number; tallGrassColor: number
  pathColor: number; wallColor: number; waterColor: number
  treeColor: number; treeTrunkColor: number
  buildingColor: number; buildingRoofColor: number
  particleColor?: number
}
export interface Area {
  id: string; displayName: string
  map: TileType[][]; cols: number; rows: number
  monIds: number[]; desc: string
  playerStart: { x: number; y: number }
  portals: Portal[]; npcs: NpcData[]
  atmo: AreaAtmosphere
}

function mk(C: number, R: number): TileType[][] {
  return Array.from({length:R},()=>Array(C).fill(0) as TileType[])
}
function f(m:TileType[][],r1:number,c1:number,r2:number,c2:number,t:TileType){
  for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++)
    if(r>=0&&r<m.length&&c>=0&&c<m[0].length) m[r][c]=t
}
function s(m:TileType[][],r:number,c:number,t:TileType){
  if(r>=0&&r<m.length&&c>=0&&c<m[0].length) m[r][c]=t
}

function buildCPUValley(): TileType[][] {
  const C=26,R=20,m=mk(C,R)
  f(m,0,0,0,C-1,1);f(m,R-1,0,R-1,C-1,1);f(m,0,0,R-1,0,1);f(m,0,C-1,R-1,C-1,1)
  f(m,10,1,10,C-2,3);f(m,1,12,R-2,13,3);f(m,4,1,4,11,3);f(m,15,14,15,C-2,3)
  f(m,1,1,9,10,5);f(m,11,14,R-2,C-2,5);f(m,5,14,9,C-2,5)
  f(m,1,15,4,22,4)
  s(m,3,11,9);s(m,6,13,9);s(m,11,11,9);s(m,16,15,9)
  // Lab building bottom-left: rows 10-15, cols 2-8
  f(m,10,2,15,8,2);f(m,11,3,14,7,3)
  s(m,10,4,3);s(m,10,5,3);s(m,15,4,3);s(m,15,5,3);s(m,12,2,3);s(m,13,2,3)
  // Connecting path from lab south door to main road (row 10 is wall so door at row 10)
  // Actually lab north wall is row 10 (same as main road). South wall row 15. 
  // Main road is row 10. Lab north door opens directly onto road.
  s(m,10,4,3);s(m,10,5,3)  // north door on main road
  s(m,12,3,7);s(m,13,6,7)
  s(m,11,4,8);s(m,13,5,8)
  f(m,8,10,12,14,3);s(m,10,10,7)
  f(m,1,12,4,13,3)
  s(m,4,3,8);s(m,6,16,8);s(m,16,15,8)
  s(m,10,0,6);s(m,10,C-1,6)
  s(m,0,12,6);s(m,0,13,6);s(m,R-1,12,6);s(m,R-1,13,6)
  return m
}

function buildProcessPlains(): TileType[][] {
  const C=30,R=20,m=mk(C,R)
  f(m,0,0,0,C-1,1);f(m,R-1,0,R-1,C-1,1);f(m,0,0,R-1,0,1);f(m,0,C-1,R-1,C-1,1)
  f(m,10,1,10,C-2,3);f(m,1,14,R-2,15,3);f(m,4,1,4,13,3);f(m,15,16,15,C-2,3)
  f(m,1,1,9,12,5);f(m,11,16,R-2,C-2,5);f(m,5,16,9,C-2,5)
  f(m,1,22,R-2,24,4);f(m,10,22,10,24,3);f(m,4,22,4,24,3)
  // Farmhouse: rows 2-7, cols 16-21 — south door at row 7 opens to path below
  f(m,2,16,7,21,2);f(m,3,17,6,20,3)
  s(m,7,18,3);s(m,7,19,3)  // south door at row 7 (wall bottom). Path from row 8 down:
  f(m,8,18,9,19,3)           // path connecting to main road
  s(m,4,18,7);s(m,3,18,8);s(m,5,19,8)
  f(m,12,2,16,6,4)
  s(m,3,14,9);s(m,9,4,9);s(m,12,17,9);s(m,15,8,9)
  s(m,4,4,8);s(m,10,8,8);s(m,16,20,8)
  s(m,10,C-1,6);s(m,10,0,6)
  s(m,0,14,6);s(m,0,15,6);s(m,R-1,14,6);s(m,R-1,15,6)
  return m
}

function buildMemoryMountains(): TileType[][] {
  const C=26,R=22,m=mk(C,R)
  f(m,0,0,0,C-1,2);f(m,R-1,0,R-1,C-1,2);f(m,0,0,R-1,0,2);f(m,0,C-1,R-1,C-1,2)
  f(m,5,2,5,10,2);f(m,5,14,5,C-2,2)
  f(m,11,2,11,9,2);f(m,11,15,11,C-2,2)
  f(m,17,3,17,11,2);f(m,17,15,17,C-2,2)
  f(m,1,11,R-2,13,3);f(m,8,1,8,10,3);f(m,14,1,14,9,3)
  f(m,8,14,8,C-2,3);f(m,14,15,14,C-2,3)
  s(m,5,11,3);s(m,5,12,3);s(m,5,13,3)
  s(m,11,10,3);s(m,11,11,3);s(m,11,12,3);s(m,11,13,3);s(m,11,14,3)
  s(m,17,12,3);s(m,17,13,3);s(m,17,14,3)
  // Research station: rows 6-10, cols 15-21 — south door at row 10 opens to lower east traverse (row 14)
  // Connect with path rows 10-14, cols 17-18
  f(m,6,15,10,21,2);f(m,7,16,9,20,3)
  s(m,10,17,3);s(m,10,18,3)
  f(m,10,17,14,18,3)   // connecting path south to lower traverse
  s(m,7,17,7);s(m,8,19,7);s(m,7,16,8);s(m,9,18,8)
  f(m,1,14,4,C-2,4);f(m,9,1,10,8,4);f(m,18,14,R-2,C-2,4)
  f(m,6,2,10,9,5);f(m,12,2,16,10,5)
  s(m,6,12,9);s(m,12,12,9);s(m,18,12,9)
  s(m,8,4,8);s(m,14,4,8);s(m,14,19,8)
  s(m,8,0,6);s(m,14,0,6);s(m,8,C-1,6);s(m,14,C-1,6)
  s(m,0,11,6);s(m,0,12,6);s(m,R-1,11,6);s(m,R-1,12,6)
  return m
}

function buildFileForest(): TileType[][] {
  const C=28,R=24,m=mk(C,R)
  f(m,0,0,0,C-1,1);f(m,R-1,0,R-1,C-1,1);f(m,0,0,R-1,0,1);f(m,0,C-1,R-1,C-1,1)
  f(m,2,2,6,6,1);f(m,2,9,5,13,1);f(m,2,17,5,21,1);f(m,2,24,5,C-2,1)
  f(m,8,2,12,5,1);f(m,9,9,13,12,1);f(m,16,18,20,22,1);f(m,17,2,21,6,1)
  f(m,8,1,8,C-2,3);f(m,1,12,R-2,13,3)
  f(m,4,7,4,11,3);f(m,4,14,4,16,3);f(m,12,6,12,11,3)
  f(m,16,13,16,17,3);f(m,19,7,19,11,3);f(m,12,14,16,14,3)
  f(m,1,7,3,11,5);f(m,9,14,13,17,5);f(m,14,7,18,11,5);f(m,5,17,8,C-2,5)
  f(m,10,7,13,10,4);f(m,17,18,22,22,4)
  // Ranger cabin: rows 3-8, cols 18-23
  f(m,3,18,8,23,2);f(m,4,19,7,22,3)
  s(m,8,20,3);s(m,8,21,3)
  f(m,8,20,8,21,3)
  s(m,5,20,7);s(m,4,20,8);s(m,6,21,8)
  s(m,3,12,9);s(m,9,13,9);s(m,15,12,9);s(m,20,12,9)
  s(m,4,8,8);s(m,12,12,8);s(m,17,9,8)
  s(m,8,0,6);s(m,8,C-1,6)
  s(m,0,12,6);s(m,0,13,6);s(m,R-1,12,6);s(m,R-1,13,6)
  return m
}

function buildSyncSanctuary(): TileType[][] {
  const C=24,R=24,m=mk(C,R)
  f(m,0,0,0,C-1,2);f(m,R-1,0,R-1,C-1,2);f(m,0,0,R-1,0,2);f(m,0,C-1,R-1,C-1,2)
  f(m,1,11,3,12,3);f(m,R-4,11,R-2,12,3);f(m,11,1,12,3,3);f(m,11,C-4,12,C-2,3)
  f(m,4,4,4,C-5,2);f(m,R-5,4,R-5,C-5,2);f(m,4,4,R-5,4,2);f(m,4,C-5,R-5,C-5,2)
  s(m,4,11,3);s(m,4,12,3);s(m,R-5,11,3);s(m,R-5,12,3)
  s(m,11,4,3);s(m,12,4,3);s(m,11,C-5,3);s(m,12,C-5,3)
  f(m,5,11,R-6,12,3);f(m,11,5,12,C-6,3)
  // NW shrine: 5-9, 5-9
  f(m,5,5,9,9,2);f(m,6,6,8,8,3);s(m,9,7,3);s(m,9,8,3);s(m,7,7,7);s(m,6,7,8)
  // NE shrine: 5-9, 14-18
  f(m,5,14,9,18,2);f(m,6,15,8,17,3);s(m,9,15,3);s(m,9,16,3);s(m,7,15,7);s(m,6,16,8)
  // SW shrine: 14-18, 5-9
  f(m,14,5,18,9,2);f(m,15,6,17,8,3);s(m,14,7,3);s(m,14,8,3);s(m,16,7,7);s(m,17,7,8)
  // SE shrine: 14-18, 14-18
  f(m,14,14,18,18,2);f(m,15,15,17,17,3);s(m,14,15,3);s(m,14,16,3);s(m,16,15,7);s(m,17,16,8)
  // Central altar
  s(m,11,11,7);s(m,11,12,7);s(m,12,11,7);s(m,12,12,7)
  // Outer corner pools
  f(m,1,1,3,3,4);f(m,1,C-4,3,C-2,4);f(m,R-4,1,R-2,3,4);f(m,R-4,C-4,R-2,C-2,4)
  // Tall grass in outer ring
  f(m,1,4,3,C-5,5);f(m,R-4,4,R-2,C-5,5);f(m,4,1,R-5,3,5);f(m,4,C-4,R-5,C-2,5)
  // Re-open approach paths after tall grass
  f(m,1,11,3,12,3);f(m,R-4,11,R-2,12,3);f(m,11,1,12,3,3);f(m,11,C-4,12,C-2,3)
  s(m,5,11,9);s(m,R-6,12,9);s(m,11,5,9);s(m,12,C-6,9)
  s(m,8,11,8);s(m,15,12,8);s(m,11,8,8)
  s(m,0,11,6);s(m,0,12,6);s(m,R-1,11,6);s(m,R-1,12,6)
  s(m,11,0,6);s(m,12,0,6);s(m,11,C-1,6);s(m,12,C-1,6)
  return m
}

function buildNetworkNexus(): TileType[][] {
  const C=28,R=20,m=mk(C,R)
  f(m,0,0,0,C-1,2);f(m,R-1,0,R-1,C-1,2);f(m,0,0,R-1,0,2);f(m,0,C-1,R-1,C-1,2)
  f(m,5,1,6,C-2,3);f(m,13,1,14,C-2,3)
  f(m,1,6,R-2,7,3);f(m,1,13,R-2,14,3);f(m,1,20,R-2,21,3)
  // Row A buildings (rows 1-4)
  f(m,1,1,4,5,2);f(m,2,2,3,4,3);s(m,4,3,3)
  f(m,1,9,4,12,2);f(m,2,10,3,11,3);s(m,4,10,3)
  f(m,1,16,4,19,2);f(m,2,17,3,18,3);s(m,4,17,3)
  f(m,1,23,4,C-2,2);f(m,2,24,3,C-3,3);s(m,4,24,3)
  // Row B buildings (rows 7-12)
  f(m,7,1,12,5,2);f(m,8,2,11,4,3);s(m,7,3,3)
  f(m,7,9,12,12,2);f(m,8,10,11,11,3);s(m,7,10,3)
  f(m,7,16,12,19,2);f(m,8,17,11,18,3);s(m,7,17,3)
  f(m,7,23,12,C-2,2);f(m,8,24,11,C-3,3);s(m,7,24,3)
  // Row C buildings (rows 15-18)
  f(m,15,1,R-2,5,2);f(m,16,2,R-3,4,3);s(m,15,3,3)
  f(m,15,9,R-2,12,2);f(m,16,10,R-3,11,3);s(m,15,10,3)
  f(m,15,16,R-2,19,2);f(m,16,17,R-3,18,3);s(m,15,17,3)
  f(m,15,23,R-2,C-2,2);f(m,16,24,R-3,C-3,3);s(m,15,24,3)
  // Data streams
  f(m,1,8,4,8,4);f(m,7,8,12,8,4);f(m,15,8,R-2,8,4)
  f(m,1,22,4,22,4);f(m,7,22,12,22,4);f(m,15,22,R-2,22,4)
  s(m,5,7,7);s(m,5,14,7);s(m,13,7,7);s(m,13,21,7)
  s(m,6,7,8);s(m,5,21,8);s(m,14,14,8)
  s(m,5,0,6);s(m,13,0,6);s(m,5,C-1,6);s(m,13,C-1,6)
  s(m,0,6,6);s(m,0,7,6);s(m,R-1,6,6);s(m,R-1,7,6)
  return m
}

function buildKernelCastle(): TileType[][] {
  const C=32,R=26,m=mk(C,R)
  // Double outer wall
  f(m,0,0,0,C-1,2);f(m,R-1,0,R-1,C-1,2);f(m,0,0,R-1,0,2);f(m,0,C-1,R-1,C-1,2)
  f(m,1,1,1,C-2,2);f(m,R-2,1,R-2,C-2,2);f(m,1,1,R-2,1,2);f(m,1,C-2,R-2,C-2,2)
  // Outer corridors
  f(m,2,2,2,C-3,3);f(m,R-3,2,R-3,C-3,3);f(m,2,2,R-3,2,3);f(m,2,C-3,R-3,C-3,3)
  // Corner towers
  f(m,2,2,4,4,2);f(m,2,C-5,4,C-3,2);f(m,R-5,2,R-3,4,2);f(m,R-5,C-5,R-3,C-3,2)
  // Lava moat
  f(m,5,5,5,C-6,4);f(m,R-6,5,R-6,C-6,4);f(m,5,5,R-6,5,4);f(m,5,C-6,R-6,C-6,4)
  // Drawbridges
  f(m,5,14,5,17,3);f(m,R-6,14,R-6,17,3);f(m,12,5,13,5,3);f(m,12,C-6,13,C-6,3)
  // Inner keep walls
  f(m,6,6,6,C-7,2);f(m,R-7,6,R-7,C-7,2);f(m,6,6,R-7,6,2);f(m,6,C-7,R-7,C-7,2)
  // Inner gates
  s(m,6,14,3);s(m,6,15,3);s(m,6,16,3);s(m,R-7,14,3);s(m,R-7,15,3);s(m,R-7,16,3)
  s(m,12,6,3);s(m,13,6,3);s(m,12,C-7,3);s(m,13,C-7,3)
  // Inner courtyard paths
  f(m,7,14,R-8,17,3);f(m,12,7,13,C-8,3)
  f(m,7,7,7,13,3);f(m,7,18,7,C-8,3);f(m,R-8,7,R-8,13,3);f(m,R-8,18,R-8,C-8,3)
  // Throne room
  f(m,10,13,15,18,2);f(m,11,14,14,17,3)
  s(m,10,15,3);s(m,10,16,3);s(m,15,15,3);s(m,15,16,3)
  s(m,12,13,3);s(m,13,13,3);s(m,12,18,3);s(m,13,18,3)
  s(m,12,15,7);s(m,12,16,7)
  // Boss arenas
  f(m,7,7,11,12,5);f(m,7,19,11,C-8,5);f(m,16,7,R-8,12,5);f(m,16,19,R-8,C-8,5)
  // Lava pits in boss zones
  f(m,8,8,9,10,4);f(m,8,20,9,22,4);f(m,17,8,18,10,4);f(m,17,20,18,22,4)
  // Approach path from south portals to drawbridge
  f(m,R-6,14,R-3,17,3)
  // North approach
  f(m,2,14,5,17,3)
  // NPCs on clear paths
  s(m,7,15,8);s(m,12,15,8);s(m,18,15,8);s(m,3,15,8)
  // Portals
  s(m,0,14,6);s(m,0,15,6);s(m,0,16,6)
  s(m,R-1,14,6);s(m,R-1,15,6);s(m,R-1,16,6)
  s(m,12,0,6);s(m,13,0,6)
  return m
}

export const AREAS: Record<string, Area> = {

'CPU Valley': {
  id:'cpu_valley',displayName:'CPU Valley',
  map:buildCPUValley(),cols:26,rows:20,monIds:[1,2,6,13,15],
  desc:'The Academy\'s starting town. Processes compete for CPU time in these sunny green hills.',
  playerStart:{x:12,y:10},
  atmo:{skyBottom:0xb8e4ff,fogColor:0xa0d4f0,fogDensity:0.008,sunColor:0xfff5cc,sunIntensity:1.4,ambientColor:0xc8e8ff,ambientIntensity:0.7,groundColor:0x3a6e28,grassColor:0x4a9a32,tallGrassColor:0x3a8222,pathColor:0xb09050,wallColor:0x6a7080,waterColor:0x3377cc,treeColor:0x3d8a22,treeTrunkColor:0x7a5230,buildingColor:0x889090,buildingRoofColor:0x5a6878},
  portals:[
    {x:0,y:10,to:'Process Plains',tx:28,ty:10,label:'PROCESS PLAINS',edge:'left'},
    {x:25,y:10,to:'Network Nexus',tx:1,ty:5,label:'NETWORK NEXUS',edge:'right'},
    {x:12,y:0,to:'Kernel Castle',tx:15,ty:23,label:'KERNEL CASTLE',edge:'top'},
    {x:13,y:0,to:'Kernel Castle',tx:16,ty:23,label:'KERNEL CASTLE',edge:'top'},
    {x:12,y:19,to:'Memory Mountains',tx:11,ty:1,label:'MEMORY MTN',edge:'bottom'},
    {x:13,y:19,to:'Memory Mountains',tx:12,ty:1,label:'MEMORY MTN',edge:'bottom'},
  ],
  npcs:[
    {x:4,y:4,color:'#ff8800',name:'Prof. Dijkstra',lines:[
      'Welcome to OS-Mon Academy. I am Professor Dijkstra.',
      'This world was born when the Operating System gained sentience. Every concept took living form — processes, mutexes, page faults — we call them OS-Mons.',
      'You have been given a starter Processus. The most fundamental creature. Guard it well.',
      'Walk into the tall grass to encounter wild OS-Mons. Use Kernel Balls from your bag to catch them.',
      'The glowing black pillars are Knowledge Terminals. Stand near one and press E to earn XP.',
      'Head south to Memory Mountains when you are ready. North leads to the legendary Kernel Castle — eventually.',
      {type:'quiz',text:'Before you go — answer my first question. Every Trainer must pass this test.'},
    ]},
    {x:6,y:16,color:'#4488ff',name:'Rival Torvalds',lines:[
      'You finally showed up. I have already caught three OS-Mons and a Queuemon.',
      'This valley is the easy part. My uncle reached Kernel Castle once. Said the lava moat never cools.',
      'Most Trainers quit at the Sync Sanctuary. Deadlock Dan has never lost a battle.',
      {type:'battle',monId:1,text:'Stop stalling. My Processus knows Fork(). Let\'s find out if yours can keep up.'},
    ]},
    {x:16,y:15,color:'#88ff88',name:'Scholar Knuth',lines:[
      'I study scheduling theory here in CPU Valley. These hills are peaceful. The OS beneath them is not.',
      'The CPU runs one process at a time. The scheduler decides who gets those cycles.',
      'FCFS sounds fair — first come, first served. But one slow process blocks everything. Convoy effect.',
      'SJF is optimal for average wait time. But you need to predict the future to use it.',
      'Linux\'s CFS uses virtual runtime — a red-black tree where every process earns equal CPU time. Elegant.',
    ]},
  ],
},

'Process Plains': {
  id:'process_plains',displayName:'Process Plains',
  map:buildProcessPlains(),cols:30,rows:20,monIds:[1,2,13,15],
  desc:'Flat green plains west of the Valley. Processes are born here and threads race across open ground.',
  playerStart:{x:28,y:10},
  atmo:{skyBottom:0xccf090,fogColor:0x98d060,fogDensity:0.007,sunColor:0xffffd0,sunIntensity:1.6,ambientColor:0xd8ffb0,ambientIntensity:0.65,groundColor:0x4a8a28,grassColor:0x5aaa38,tallGrassColor:0x48921e,pathColor:0xd8b860,wallColor:0x8a8a60,waterColor:0x4488ee,treeColor:0x44a828,treeTrunkColor:0x8a6038,buildingColor:0xc8a860,buildingRoofColor:0x9a7840},
  portals:[
    {x:29,y:10,to:'CPU Valley',tx:1,ty:10,label:'CPU VALLEY',edge:'right'},
    {x:0,y:10,to:'File Forest',tx:26,ty:8,label:'FILE FOREST',edge:'left'},
    {x:14,y:0,to:'Sync Sanctuary',tx:11,ty:22,label:'SYNC SANCTUARY',edge:'top'},
    {x:15,y:0,to:'Sync Sanctuary',tx:12,ty:22,label:'SYNC SANCTUARY',edge:'top'},
    {x:14,y:19,to:'Memory Mountains',tx:11,ty:1,label:'MEMORY MTN',edge:'bottom'},
    {x:15,y:19,to:'Memory Mountains',tx:12,ty:1,label:'MEMORY MTN',edge:'bottom'},
  ],
  npcs:[
    {x:4,y:4,color:'#3dcc70',name:'Threadsmith',lines:[
      'Welcome to the Plains. Widest sky in the whole OS world.',
      'A process is a full program in isolation — its own memory, its own open files, its own entire universe.',
      'A thread shares that universe with siblings. Cheaper to create, faster to switch. Dangerous if unsynchronised.',
      'fork() is the great act of creation. One process becomes two, identical in every bit. Parent gets child PID. Child gets zero.',
      'That single difference in return value is how all of Unix decides who is who.',
      'The zombie processes wandering these plains? Terminated, but their parent never called wait(). They linger.',
    ]},
    {x:10,y:10,color:'#4488ff',name:'Trainer Fork',lines:[
      'These plains stretch to the river and beyond. I grew up running fork() here.',
      'Threadax OS-Mons are native — fastest things in the game. They skip most of process creation.',
      'No new address space to allocate. No new page tables. Just a new stack and a new execution context.',
      'But they share memory with their siblings. One unsynchronised write and everything corrupts.',
      {type:'battle',monId:2,text:'My Threadax was raised on these plains. Disciplined and fast. Show me yours.'},
    ]},
    {x:16,y:20,color:'#ff8866',name:'Signal Sally',lines:[
      'Signals are how the OS taps a process on the shoulder. Or punches it in the face.',
      'SIGTERM asks politely. SIGKILL does not ask. No signal handler catches SIGKILL — not one.',
      'SIGCHLD tells a parent its child has gone. Ignore it and the child becomes a zombie.',
      'Pipes connect processes like an assembly line. Unidirectional. One writes, one reads. Perfect simplicity.',
      'The river east of here is a real data stream. It only flows one way. Same principle.',
    ]},
  ],
},

'Memory Mountains': {
  id:'memory_mountains',displayName:'Memory Mountains',
  map:buildMemoryMountains(),cols:26,rows:22,monIds:[3,5,11],
  desc:'Cold blue mountains where page tables are carved into stone. Data pools glow with virtual addresses.',
  playerStart:{x:12,y:8},
  atmo:{skyBottom:0x6688cc,fogColor:0x5577bb,fogDensity:0.020,sunColor:0xdde8ff,sunIntensity:0.95,ambientColor:0x7788bb,ambientIntensity:0.95,groundColor:0x22304a,grassColor:0x263650,tallGrassColor:0x1a2840,pathColor:0x707890,wallColor:0x3a4870,waterColor:0x1a3488,treeColor:0x243260,treeTrunkColor:0x404860,buildingColor:0x445588,buildingRoofColor:0x334466,particleColor:0x8888ff},
  portals:[
    {x:0,y:8,to:'CPU Valley',tx:1,ty:10,label:'CPU VALLEY',edge:'left'},
    {x:0,y:14,to:'CPU Valley',tx:1,ty:10,label:'CPU VALLEY',edge:'left'},
    {x:25,y:8,to:'Sync Sanctuary',tx:1,ty:11,label:'SYNC SANCTUARY',edge:'right'},
    {x:25,y:14,to:'Sync Sanctuary',tx:1,ty:12,label:'SYNC SANCTUARY',edge:'right'},
    {x:11,y:0,to:'Process Plains',tx:14,ty:18,label:'PROCESS PLAINS',edge:'top'},
    {x:12,y:0,to:'Process Plains',tx:15,ty:18,label:'PROCESS PLAINS',edge:'top'},
    {x:11,y:21,to:'File Forest',tx:12,ty:1,label:'FILE FOREST',edge:'bottom'},
    {x:12,y:21,to:'File Forest',tx:13,ty:1,label:'FILE FOREST',edge:'bottom'},
  ],
  npcs:[
    {x:4,y:8,color:'#9944ee',name:'Prof. Denning',lines:[
      'These mountains are Memory itself made physical. That glowing pool below us? That is RAM.',
      'Every process believes it has the entire address space. It does not. The OS maintains the illusion with page tables.',
      'Four kilobytes per page. Virtual address maps to physical frame. The mapping lives in those stone walls.',
      'When a page is evicted to disk, a page fault fires. The process stalls — ten milliseconds — while the OS fetches it back.',
      'Ten milliseconds. That is one hundred thousand nanoseconds. Ram takes a hundred nanoseconds. The difference is everything.',
      {type:'quiz',text:'Tell me: what is the TLB and why does every context switch threaten it?'},
    ]},
    {x:4,y:14,color:'#e0c030',name:'Cacher Kim',lines:[
      'Feel the cold? That is what it costs to miss the cache.',
      'L1 is warmest — 32 kilobytes, right inside the CPU die, four cycles away.',
      'L2 cools down — 256 kilobytes, twelve cycles. L3 is frigid — eight megabytes, forty cycles.',
      'RAM is the mountain base. A hundred cycles at minimum. Disk is the abyss. Millions.',
      'A 64-byte cache line loads on every miss. Sequential access loads the next line before you ask. Arrays exploit this perfectly.',
      'A linked list pointer-chases across random addresses. Every node: a potential cache miss. This is why arrays win.',
    ]},
    {x:14,y:19,color:'#44cc88',name:'Swap Guru',lines:[
      'I have seen these mountains during thrashing. It is not a pleasant sight.',
      'When combined working sets exceed physical RAM, every process page-faults constantly.',
      'The CPU appears stuck. It is not — it is waiting. Disk after disk after disk.',
      'Denning\'s Working Set Model is the cure. Track which pages each process actually uses.',
      'If the sum exceeds physical RAM, suspend some processes entirely. Better one process waits than all crawl.',
    ]},
  ],
},

'File Forest': {
  id:'file_forest',displayName:'File Forest',
  map:buildFileForest(),cols:28,rows:24,monIds:[7,12,14],
  desc:'Ancient forest where every tree is a directory and every leaf holds an inode. The canopy filters starlight.',
  playerStart:{x:12,y:8},
  atmo:{skyBottom:0x0f4020,fogColor:0x0a3015,fogDensity:0.024,sunColor:0x99ee77,sunIntensity:0.75,ambientColor:0x40aa40,ambientIntensity:0.85,groundColor:0x081f06,grassColor:0x174a0e,tallGrassColor:0x0e3308,pathColor:0x5a4218,wallColor:0x2a3818,waterColor:0x183820,treeColor:0x165810,treeTrunkColor:0x3a2008,buildingColor:0x3a5520,buildingRoofColor:0x284010,particleColor:0x88ff44},
  portals:[
    {x:0,y:8,to:'Process Plains',tx:1,ty:10,label:'PROCESS PLAINS',edge:'left'},
    {x:27,y:8,to:'Network Nexus',tx:1,ty:13,label:'NETWORK NEXUS',edge:'right'},
    {x:12,y:0,to:'Memory Mountains',tx:11,ty:20,label:'MEMORY MTN',edge:'top'},
    {x:13,y:0,to:'Memory Mountains',tx:12,ty:20,label:'MEMORY MTN',edge:'top'},
    {x:12,y:23,to:'Sync Sanctuary',tx:11,ty:1,label:'SYNC SANCTUARY',edge:'bottom'},
    {x:13,y:23,to:'Sync Sanctuary',tx:12,ty:1,label:'SYNC SANCTUARY',edge:'bottom'},
  ],
  npcs:[
    {x:8,y:4,color:'#66aa33',name:'Arborist ext4',lines:[
      'Every tree you see is a directory. Its branches lead to other directories. Its roots are an inode.',
      'The filename you know — that path you type — is not in the inode. It lives in the parent directory entry.',
      'The inode holds everything else. Permissions. Timestamps. Pointers to data blocks. Size. Owner.',
      'This forest has been here since the first filesystem was mounted. ext4 — fourth extended. Journaled.',
      'Journaling means writes go to the journal first, then to disk. If the power dies, the journal shows what was in progress.',
      {type:'quiz',text:'Answer me: what is the one thing a Unix inode never contains?'},
    ]},
    {x:12,y:12,color:'#44cc77',name:'Linker Linus',lines:[
      'Hard links and symbolic links look similar. They are completely different.',
      'A hard link is another name for the same inode. Both names are equally real. Neither is the original.',
      'Delete one — the inode survives. Its link count decrements. Still positive. Data intact.',
      'A symlink is just a file that contains a path string. It points at a name, not an inode.',
      'Delete the target of a symlink and the symlink becomes dangling. Points at nothing.',
      'You cannot hard-link directories. The filesystem would form a cycle and fsck would never finish.',
    ]},
    {x:17,y:9,color:'#ff8833',name:'Buffer Barry',lines:[
      'I keep the ranger cabin east of here. Come visit — the quiz terminal inside gives good XP.',
      'The kernel page cache is invisible but everywhere. Every file read goes through it.',
      'Read the same block twice in a row? Second read is instant. Already warm in cache.',
      'write() puts data in the page cache first. The block is dirty. pdflush comes later and commits it to disk.',
      'O_DIRECT skips all of that. Databases use it because they maintain their own buffer pools.',
      'Two caches of the same data just waste memory and create consistency problems.',
    ]},
  ],
},

'Sync Sanctuary': {
  id:'sync_sanctuary',displayName:'Sync Sanctuary',
  map:buildSyncSanctuary(),cols:24,rows:24,monIds:[4,9,17,18],
  desc:'An ancient OS monastery. Synchronisation is sacred law here. Race conditions are strictly forbidden.',
  playerStart:{x:11,y:11},
  atmo:{skyBottom:0x380070,fogColor:0x200048,fogDensity:0.020,sunColor:0xcc44ff,sunIntensity:0.85,ambientColor:0x7733bb,ambientIntensity:1.05,groundColor:0x150028,grassColor:0x220838,tallGrassColor:0x160226,pathColor:0x5522aa,wallColor:0x442288,waterColor:0x330088,treeColor:0x2a0888,treeTrunkColor:0x220660,buildingColor:0x442288,buildingRoofColor:0x331166,particleColor:0xaa44ff},
  portals:[
    {x:11,y:0,to:'File Forest',tx:12,ty:22,label:'FILE FOREST',edge:'top'},
    {x:12,y:0,to:'File Forest',tx:13,ty:22,label:'FILE FOREST',edge:'top'},
    {x:11,y:23,to:'File Forest',tx:12,ty:22,label:'FILE FOREST',edge:'bottom'},
    {x:12,y:23,to:'File Forest',tx:13,ty:22,label:'FILE FOREST',edge:'bottom'},
    {x:0,y:11,to:'Memory Mountains',tx:24,ty:8,label:'MEMORY MTN',edge:'left'},
    {x:0,y:12,to:'Memory Mountains',tx:24,ty:14,label:'MEMORY MTN',edge:'left'},
    {x:23,y:11,to:'Kernel Castle',tx:1,ty:12,label:'KERNEL CASTLE',edge:'right'},
    {x:23,y:12,to:'Kernel Castle',tx:1,ty:13,label:'KERNEL CASTLE',edge:'right'},
  ],
  npcs:[
    {x:11,y:8,color:'#ee44bb',name:'Dijkstra II',lines:[
      'Silence. You enter the Sync Sanctuary. Race conditions do not exist here. We have made sure of that.',
      'In 1965 the original Dijkstra — my predecessor — invented the semaphore. Two operations: P() and V(). They changed concurrent programming forever.',
      'A mutex adds ownership to a binary semaphore. Only the thread that locked it may unlock it. Priority inheritance becomes possible.',
      'Without these primitives, shared variables are bets. Thread A reads x=5. Thread B reads x=5. Both write x+1. Result: 6, not 7.',
      'One lost update. Multiply that by a billion operations and you have a corrupted database.',
      {type:'quiz',text:'Tell me the four Coffman conditions. I have asked every Trainer who passed through these gates.'},
    ]},
    {x:15,y:12,color:'#ff4444',name:'Deadlock Dan',lines:[
      'Another Trainer thinks they can break my DeadLockus. They never do.',
      'Deadlock is not a bug. It is an emergent property of four simultaneous conditions.',
      'Mutual exclusion. Hold and wait. No preemption. Circular wait. All four. Remove any one and deadlock is structurally impossible.',
      'The Banker\'s Algorithm can help — never allocate a resource if it could lead to a state with no safe sequence.',
      'Linux avoids deadlock in the kernel by imposing a strict global lock ordering. Always acquire lock A before lock B. Document it. Enforce it. No exceptions.',
      {type:'battle',monId:4,text:'Face my DeadLockus. Four conditions, zero escapes. It has never been broken.'},
    ]},
    {x:11,y:15,color:'#22ddbb',name:'Monitor Maria',lines:[
      'The four shrines here each hold one synchronisation primitive. Ancient and perfect.',
      'A monitor is the highest-level abstraction: mutex plus condition variables plus the shared data they protect. All in one.',
      'Java\'s synchronized keyword turns any object into a monitor automatically.',
      'But Hoare monitors and Mesa monitors differ critically. Hoare: signal() immediately transfers to the waiter. Mesa: the waiter is merely scheduled.',
      'Every real system uses Mesa semantics. This means your condition check must be a while loop, never an if.',
      'By the time the waiter actually runs, the condition may have changed. Check again. Always.',
    ]},
  ],
},

'Network Nexus': {
  id:'network_nexus',displayName:'Network Nexus',
  map:buildNetworkNexus(),cols:28,rows:20,monIds:[10],
  desc:'A gleaming data centre district. Server racks hum with TCP connections. Packets race between buildings.',
  playerStart:{x:2,y:6},
  atmo:{skyBottom:0x001428,fogColor:0x000e1e,fogDensity:0.016,sunColor:0x2288ff,sunIntensity:1.1,ambientColor:0x0033aa,ambientIntensity:1.0,groundColor:0x000810,grassColor:0x001020,tallGrassColor:0x000810,pathColor:0x1a3888,wallColor:0x0e1e3a,waterColor:0x0022bb,treeColor:0x002244,treeTrunkColor:0x0a1828,buildingColor:0x0e2a4a,buildingRoofColor:0x0a1e38,particleColor:0x00aaff},
  portals:[
    {x:0,y:5,to:'CPU Valley',tx:24,ty:10,label:'CPU VALLEY',edge:'left'},
    {x:0,y:13,to:'CPU Valley',tx:24,ty:10,label:'CPU VALLEY',edge:'left'},
    {x:27,y:5,to:'Kernel Castle',tx:1,ty:12,label:'KERNEL CASTLE',edge:'right'},
    {x:27,y:13,to:'Kernel Castle',tx:1,ty:13,label:'KERNEL CASTLE',edge:'right'},
    {x:6,y:0,to:'File Forest',tx:26,ty:8,label:'FILE FOREST',edge:'top'},
    {x:7,y:0,to:'File Forest',tx:27,ty:8,label:'FILE FOREST',edge:'top'},
    {x:6,y:19,to:'CPU Valley',tx:12,ty:18,label:'CPU VALLEY',edge:'bottom'},
    {x:7,y:19,to:'CPU Valley',tx:13,ty:18,label:'CPU VALLEY',edge:'bottom'},
  ],
  npcs:[
    {x:7,y:6,color:'#2288ee',name:'TCP Thompson',lines:[
      'Welcome to the Nexus. Every building here is a server. Every data channel you see is a live TCP connection.',
      'TCP provides reliable, ordered, byte-stream delivery over an unreliable network. The internet is fundamentally unreliable. TCP hides that.',
      'Three-way handshake before a single byte of application data moves. SYN. SYN-ACK. ACK. About forty milliseconds of ceremony.',
      'Packets can be lost, reordered, corrupted. TCP detects all of this and retransmits. Transparently.',
      'Congestion control is the hidden genius — slow start, then linear growth, halve on congestion signal. The whole internet self-regulates.',
      {type:'quiz',text:'Quick: what specific mechanism makes TCP reliable when the underlying IP layer is not?'},
    ]},
    {x:21,y:5,color:'#44aaff',name:'Router Rita',lines:[
      'I route packets between all seven regions of this world. Every hop a decision.',
      'Each router holds a routing table: destination prefix maps to next hop. Locally optimal. Globally correct.',
      'OSPF floods link-state advertisements. Every router builds a complete map. Then Dijkstra finds the shortest path.',
      'BGP connects entire autonomous systems — whole networks speaking to each other. Policy dominates over raw latency.',
      'Your path to Kernel Castle goes through this Nexus. Five hops minimum. Each one a router making a decision.',
    ]},
    {x:14,y:14,color:'#88eeff',name:'Socket Sam',lines:[
      'I built this district from socket(). bind(). listen(). Three calls and a data centre exists.',
      'The socket API is fifty years old and still runs the internet. Some abstractions are just right.',
      'The revolution was non-blocking I/O with epoll. Instead of one thread per connection — which breaks at ten thousand — one event loop watches everything.',
      'Data arrives on a socket? epoll wakes your thread. You handle it. Return to waiting. Ten thousand connections, one thread.',
      'Nginx. Node.js. Redis. All of them work this way. Event-driven, not thread-per-connection.',
    ]},
  ],
},

'Kernel Castle': {
  id:'kernel_castle',displayName:'Kernel Castle',
  map:buildKernelCastle(),cols:32,rows:26,monIds:[6,8,16],
  desc:'The final stronghold. The OS kernel made physical — volcanic moat, ancient walls, legendary OS-Mons in every wing.',
  playerStart:{x:15,y:23},
  atmo:{skyBottom:0x280e00,fogColor:0x1e0800,fogDensity:0.015,sunColor:0xff5500,sunIntensity:1.2,ambientColor:0x551800,ambientIntensity:0.9,groundColor:0x0e0400,grassColor:0x160600,tallGrassColor:0x0e0400,pathColor:0x503828,wallColor:0x3a2818,waterColor:0xcc2200,treeColor:0x2e1000,treeTrunkColor:0x200a00,buildingColor:0x3a2810,buildingRoofColor:0x2a1808,particleColor:0xff4400},
  portals:[
    {x:14,y:0,to:'CPU Valley',tx:12,ty:1,label:'CPU VALLEY',edge:'top'},
    {x:15,y:0,to:'CPU Valley',tx:13,ty:1,label:'CPU VALLEY',edge:'top'},
    {x:16,y:0,to:'CPU Valley',tx:14,ty:1,label:'CPU VALLEY',edge:'top'},
    {x:14,y:25,to:'Network Nexus',tx:26,ty:5,label:'NETWORK NEXUS',edge:'bottom'},
    {x:15,y:25,to:'Network Nexus',tx:26,ty:5,label:'NETWORK NEXUS',edge:'bottom'},
    {x:16,y:25,to:'Network Nexus',tx:26,ty:13,label:'NETWORK NEXUS',edge:'bottom'},
    {x:0,y:12,to:'Sync Sanctuary',tx:22,ty:11,label:'SYNC SANCTUARY',edge:'left'},
    {x:0,y:13,to:'Sync Sanctuary',tx:22,ty:12,label:'SYNC SANCTUARY',edge:'left'},
  ],
  npcs:[
    {x:15,y:7,color:'#ff7700',name:'Linus T.',lines:[
      'You crossed the moat. The lava is real. Most Trainers never make it this far.',
      'This castle is the kernel — the bridge between all hardware and every program ever written.',
      'Ring 0. Full hardware access. No restrictions. The CPU obeys every instruction without question.',
      'User programs live in Ring 3 — isolated by the hardware itself. They cannot even access their own physical memory directly.',
      'The SYSCALL instruction is the drawbridge. It raises privilege, enters the kernel, executes the system call, returns.',
      'Linux has around four hundred system calls. open. read. write. fork. mmap. ioctl. Each one a carefully engineered interface.',
      {type:'battle',monId:8,text:'You want Kernelion? Cross the throne room first. Nothing passes unchallenged.'},
    ]},
    {x:15,y:12,color:'#eecc00',name:'IRQ Inspector',lines:[
      'Every interrupt in this world is my responsibility. I have answered millions.',
      'When a key is pressed, the keyboard controller raises an IRQ line. The CPU stops, saves its state, and vectors to my handler.',
      'Save registers. Acknowledge the interrupt. Do the absolute minimum. Return.',
      'The top half must complete in microseconds. Anything deferred goes to the bottom half — tasklets and workqueues, scheduled when idle.',
      'Real-time systems live or die by interrupt latency. A missed deadline in a nuclear plant or an aircraft control system.',
      {type:'quiz',text:'Tell me the complete sequence of events when a hardware interrupt fires. Every step.'},
    ]},
    {x:15,y:18,color:'#cc88ff',name:'Ring Watcher',lines:[
      'I guard the boundary between user space and kernel space. I have done so since this castle was built.',
      'x86 has four privilege rings. We use two. Ring 0 for the kernel. Ring 3 for everything else.',
      'A context switch saves the program counter, stack pointer, all general-purpose registers, floating-point state, and CR3 — the page table base.',
      'Swapping CR3 flushes the TLB. Every virtual address translation must be relearned. That is why context switches cost what they cost.',
      'Threads within the same process skip CR3 — same address space. Ten times cheaper than a full process switch.',
      'The throne room ahead holds Kernelion. Catch rate: fifteen. The hardest OS-Mon in existence. Bring every ball you have.',
    ]},
  ],
},

}

export const AREA_ORDER = [
  'CPU Valley','Process Plains','Memory Mountains',
  'File Forest','Sync Sanctuary','Network Nexus','Kernel Castle',
]
