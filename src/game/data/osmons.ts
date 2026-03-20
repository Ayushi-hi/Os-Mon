export type Rarity = 'B' | 'C' | 'U' | 'R' | 'L'
export type MonType = 'Process' | 'Memory' | 'FileSystem' | 'Kernel' | 'Network' | 'Sync'

export interface Move {
  id: string
  name: string
  type: MonType
  power: number
  accuracy: number
  effect?: 'paralyze' | 'sleep' | 'confuse'
  desc: string
}

export interface OsMon {
  id: number
  name: string
  concept: string
  type: MonType
  rarity: Rarity
  hp: number
  attack: number
  defense: number
  speed: number
  catchRate: number
  xpBase: number
  spriteColor: string
  spriteAccent: string
  area: string
  desc: string
  moves: string[]
  movePowers: number[]
  moveDescs: string[]
  stats: Record<string, number>
}

export const MOVES: Record<string, Move> = {
  fork:          { id:'fork',          name:'Fork()',          type:'Process',    power:40,  accuracy:95,  desc:'Duplicates the caller into parent+child' },
  spawn:         { id:'spawn',         name:'Spawn()',         type:'Process',    power:55,  accuracy:85,  desc:'Creates process from executable' },
  terminate:     { id:'terminate',     name:'Terminate()',     type:'Process',    power:50,  accuracy:90,  desc:'Ends process, frees all resources' },
  signal:        { id:'signal',        name:'Signal()',        type:'Process',    power:35,  accuracy:85,  effect:'confuse', desc:'Sends async signal to another process' },
  create_thread: { id:'create_thread', name:'Create_Thread()', type:'Process',    power:40,  accuracy:95,  desc:'Spawns new thread of execution' },
  join:          { id:'join',          name:'Join()',          type:'Process',    power:35,  accuracy:100, desc:'Waits for thread completion' },
  mutex_lock:    { id:'mutex_lock',    name:'Mutex_Lock()',    type:'Sync',       power:0,   accuracy:80,  effect:'paralyze', desc:'Acquires mutual exclusion lock' },
  detach:        { id:'detach',        name:'Detach()',        type:'Process',    power:25,  accuracy:95,  desc:'Releases thread to run independently' },
  cache_hit:     { id:'cache_hit',     name:'Cache_Hit()',     type:'Memory',     power:65,  accuracy:90,  desc:'Lightning retrieval from L1/L2 cache' },
  cache_miss:    { id:'cache_miss',    name:'Cache_Miss()',    type:'Memory',     power:10,  accuracy:100, desc:'Slow — data not in cache' },
  evict:         { id:'evict',         name:'Evict()',         type:'Memory',     power:50,  accuracy:90,  desc:'Removes a stale cache line' },
  prefetch:      { id:'prefetch',      name:'Prefetch()',      type:'Memory',     power:55,  accuracy:85,  desc:'Speculatively loads data before needed' },
  circular_wait: { id:'circular_wait', name:'Circular_Wait()', type:'Kernel',     power:75,  accuracy:70,  effect:'sleep', desc:'Processes form a cycle — catastrophic!' },
  hold_and_wait: { id:'hold_and_wait', name:'Hold_and_Wait()', type:'Kernel',     power:70,  accuracy:75,  desc:'Holds resource while waiting for another' },
  acquire_lock:  { id:'acquire_lock',  name:'Acquire_Lock()',  type:'Kernel',     power:65,  accuracy:80,  desc:'Grabs all locks simultaneously' },
  bankers:       { id:'bankers',       name:'Banker()',        type:'Kernel',     power:55,  accuracy:85,  desc:'Banker algorithm may break deadlock' },
  swap_in:       { id:'swap_in',       name:'Swap_In()',       type:'Memory',     power:50,  accuracy:95,  desc:'Loads page from disk into RAM' },
  swap_out:      { id:'swap_out',      name:'Swap_Out()',      type:'Memory',     power:50,  accuracy:95,  desc:'Moves dirty page from RAM to disk' },
  page_fault:    { id:'page_fault',    name:'Page_Fault()',    type:'Memory',     power:75,  accuracy:70,  desc:'Triggers OS page-fault interrupt' },
  tlb_flush:     { id:'tlb_flush',     name:'TLB_Flush()',     type:'Memory',     power:45,  accuracy:90,  desc:'Flushes Translation Lookaside Buffer' },
  round_robin:   { id:'round_robin',   name:'Round_Robin()',   type:'Process',    power:50,  accuracy:100, desc:'Equal time-slice for each process' },
  priority_boost:{ id:'priority_boost',name:'Priority_Boost()',type:'Process',    power:80,  accuracy:70,  desc:'Prevents starvation via aging' },
  ctx_switch:    { id:'ctx_switch',    name:'Context_Switch()',type:'Kernel',     power:65,  accuracy:80,  desc:'Saves and loads full CPU context' },
  preempt:       { id:'preempt',       name:'Preempt()',       type:'Kernel',     power:90,  accuracy:65,  desc:'Forcibly removes process from CPU' },
  read_file:     { id:'read_file',     name:'Read_File()',     type:'FileSystem', power:50,  accuracy:95,  desc:'Sequential read via file descriptor' },
  write_file:    { id:'write_file',    name:'Write_File()',    type:'FileSystem', power:55,  accuracy:90,  desc:'Buffered write to disk blocks' },
  seek:          { id:'seek',          name:'Seek()',          type:'FileSystem', power:45,  accuracy:100, desc:'Moves file pointer to byte offset' },
  truncate:      { id:'truncate',      name:'Truncate()',      type:'FileSystem', power:60,  accuracy:85,  desc:'Shrinks file to given size' },
  system_call:   { id:'system_call',   name:'System_Call()',   type:'Kernel',     power:80,  accuracy:85,  desc:'Services user-space request' },
  interrupt:     { id:'interrupt',     name:'Interrupt()',     type:'Kernel',     power:75,  accuracy:80,  desc:'Handles hardware interrupt' },
  mode_switch:   { id:'mode_switch',   name:'Mode_Switch()',   type:'Kernel',     power:70,  accuracy:85,  desc:'Toggle between user/kernel mode' },
  panic:         { id:'panic',         name:'Panic()',         type:'Kernel',     power:120, accuracy:55,  desc:'KERNEL PANIC — ignores own damage' },
  semaphore:     { id:'semaphore',     name:'Semaphore()',     type:'Sync',       power:65,  accuracy:85,  desc:'Limits concurrent access count' },
  wait:          { id:'wait',          name:'Wait()',          type:'Sync',       power:45,  accuracy:100, effect:'paralyze', desc:'Blocks until condition is true' },
  sig_signal:    { id:'sig_signal',    name:'Signal()',        type:'Sync',       power:55,  accuracy:90,  desc:'Wakes one sleeping waiter' },
  broadcast:     { id:'broadcast',     name:'Broadcast()',     type:'Sync',       power:70,  accuracy:85,  desc:'Wakes ALL waiting processes' },
  send_packet:   { id:'send_packet',   name:'Send_Packet()',   type:'Network',    power:50,  accuracy:95,  desc:'Transmits data across the network' },
  tcp_handshake: { id:'tcp_handshake', name:'TCP_Handshake()', type:'Network',    power:60,  accuracy:90,  desc:'SYN → SYN/ACK → ACK sequence' },
  udp_blast:     { id:'udp_blast',     name:'UDP_Blast()',     type:'Network',    power:45,  accuracy:100, desc:'Connectionless fast transmission' },
  route:         { id:'route',         name:'Route()',         type:'Network',    power:55,  accuracy:90,  desc:'BGP/OSPF pathfinding' },
  create_inode:  { id:'create_inode',  name:'Create_Inode()',  type:'FileSystem', power:45,  accuracy:95,  desc:'Allocates new inode for file' },
  link:          { id:'link',          name:'Link()',          type:'FileSystem', power:40,  accuracy:100, desc:'Creates hard link to inode' },
  unlink:        { id:'unlink',        name:'Unlink()',        type:'FileSystem', power:50,  accuracy:95,  desc:'Removes directory entry' },
  chmod:         { id:'chmod',         name:'Chmod()',         type:'FileSystem', power:35,  accuracy:100, desc:'Changes permission bits' },
  inode_strike:  { id:'inode_strike',  name:'Inode_Strike()',  type:'FileSystem', power:60,  accuracy:95,  desc:'Directly targets inode metadata' },
  enqueue:       { id:'enqueue',       name:'Enqueue()',       type:'Process',    power:45,  accuracy:100, desc:'Adds process to back of queue' },
  dequeue:       { id:'dequeue',       name:'Dequeue()',       type:'Process',    power:45,  accuracy:100, desc:'Removes process from front' },
  prioritize:    { id:'prioritize',    name:'Prioritize()',    type:'Process',    power:55,  accuracy:90,  desc:'Reorders by priority value' },
  starve:        { id:'starve',        name:'Starve()',        type:'Process',    power:65,  accuracy:75,  desc:'Denies CPU to low-priority foe' },
  lock:          { id:'lock',          name:'Lock()',          type:'Sync',       power:60,  accuracy:85,  desc:'Acquires lock, blocks if taken' },
  unlock:        { id:'unlock',        name:'Unlock()',        type:'Sync',       power:45,  accuracy:95,  desc:'Releases lock, wakes one waiter' },
  busy_wait:     { id:'busy_wait',     name:'Busy_Wait()',     type:'Sync',       power:35,  accuracy:100, desc:'CPU spins checking lock — slow!' },
  pri_inherit:   { id:'pri_inherit',   name:'Priority_Inherit()',type:'Sync',     power:75,  accuracy:80,  desc:'Inherits high priority to avoid inversion' },
  trigger_irq:   { id:'trigger_irq',   name:'Trigger_IRQ()',   type:'Kernel',     power:60,  accuracy:90,  desc:'Fires hardware interrupt request' },
  handle_isr:    { id:'handle_isr',    name:'Handle_ISR()',    type:'Kernel',     power:50,  accuracy:95,  desc:'Executes interrupt service routine' },
  priority_int:  { id:'priority_int',  name:'Priority_INT()',  type:'Kernel',     power:70,  accuracy:80,  desc:'High-priority INT jumps queue' },
  mask:          { id:'mask',          name:'Mask()',          type:'Kernel',     power:45,  accuracy:100, desc:'Disables interrupt via CLI/EFLAGS' },
}

export const MONS: OsMon[] = [
  {
    id:1, name:'Processus', concept:'Processes', type:'Process', rarity:'B',
    hp:45, attack:40, defense:35, speed:45, catchRate:200, xpBase:64,
    spriteColor:'#3d7fe0', spriteAccent:'#1a3060', area:'Process Plains',
    desc:'The most fundamental OS-Mon. Born when the OS calls fork() or exec(), it holds program state in a Process Control Block. Each Processus has its own address space and file descriptors.',
    moves:['fork','spawn','terminate','signal'],
    movePowers:[40,55,50,35],
    moveDescs:['Duplicates caller into parent+child','Creates process from executable','Ends process, frees all resources','Sends async signal to another process'],
    stats:{HP:45,ATK:40,DEF:35,SPD:45,INT:40},
  },
  {
    id:2, name:'Threadax', concept:'Threading', type:'Process', rarity:'B',
    hp:40, attack:45, defense:30, speed:55, catchRate:180, xpBase:60,
    spriteColor:'#3dcc70', spriteAccent:'#1a4030', area:'Process Plains',
    desc:'Lighter than Processus, Threadax shares address space with sibling threads. Created via pthread_create() or similar, it multiplexes on a single CPU core or runs truly parallel on SMP systems.',
    moves:['create_thread','join','mutex_lock','detach'],
    movePowers:[40,35,0,25],
    moveDescs:['Spawns new thread of execution','Waits for thread completion','Acquires mutual exclusion lock','Releases thread to run independently'],
    stats:{HP:40,ATK:45,DEF:30,SPD:55,INT:42},
  },
  {
    id:3, name:'Cachemon', concept:'Memory Cache', type:'Memory', rarity:'C',
    hp:50, attack:55, defense:50, speed:70, catchRate:150, xpBase:75,
    spriteColor:'#e0c030', spriteAccent:'#4a3800', area:'Memory Mountains',
    desc:'Lives between CPU and RAM in L1/L2/L3 hierarchy. A cache hit is 4 cycles; a RAM access is 100+ cycles. Cachemon exploits spatial and temporal locality for massive speedups.',
    moves:['cache_hit','cache_miss','evict','prefetch'],
    movePowers:[65,10,50,55],
    moveDescs:['Lightning retrieval from L1/L2 cache','Slow — data not in cache','Removes a stale cache line','Speculatively loads data before needed'],
    stats:{HP:50,ATK:55,DEF:50,SPD:70,INT:60},
  },
  {
    id:4, name:'DeadLockus', concept:'Deadlocks', type:'Kernel', rarity:'R',
    hp:65, attack:70, defense:65, speed:20, catchRate:50, xpBase:150,
    spriteColor:'#e03030', spriteAccent:'#400000', area:'Sync Sanctuary',
    desc:'Born when all four Coffman conditions hold simultaneously: mutual exclusion, hold-and-wait, no preemption, and circular wait. DeadLockus is nearly immovable but devastating.',
    moves:['circular_wait','hold_and_wait','acquire_lock','bankers'],
    movePowers:[75,70,65,55],
    moveDescs:['Processes form a cycle — catastrophic!','Holds resource while waiting for another','Grabs all locks simultaneously','Banker algorithm may break deadlock'],
    stats:{HP:65,ATK:70,DEF:65,SPD:20,INT:70},
  },
  {
    id:5, name:'PageSwap', concept:'Virtual Memory', type:'Memory', rarity:'C',
    hp:55, attack:50, defense:60, speed:40, catchRate:140, xpBase:90,
    spriteColor:'#9944ee', spriteAccent:'#2a0055', area:'Memory Mountains',
    desc:'PageSwap manages the illusion of infinite memory. It moves 4KB pages between physical RAM and swap space on disk. A page fault triggers the OS to reload the missing page.',
    moves:['swap_in','swap_out','page_fault','tlb_flush'],
    movePowers:[50,50,75,45],
    moveDescs:['Loads page from disk into RAM','Moves dirty page from RAM to disk','Triggers OS page-fault interrupt','Flushes Translation Lookaside Buffer'],
    stats:{HP:55,ATK:50,DEF:60,SPD:40,INT:65},
  },
  {
    id:6, name:'CPUScheduler', concept:'CPU Scheduling', type:'Kernel', rarity:'L',
    hp:80, attack:85, defense:75, speed:85, catchRate:25, xpBase:250,
    spriteColor:'#ffcc00', spriteAccent:'#553300', area:'CPU Valley',
    desc:'The legendary arbiter of CPU time. CPUScheduler implements Round Robin, SJF, FCFS, and Priority queues. Catching it requires deep knowledge of scheduling algorithms.',
    moves:['round_robin','priority_boost','ctx_switch','preempt'],
    movePowers:[50,80,65,90],
    moveDescs:['Equal time-slice for each process','Prevents starvation via aging','Saves and loads full CPU context','Forcibly removes process from CPU'],
    stats:{HP:80,ATK:85,DEF:75,SPD:85,INT:90},
  },
  {
    id:7, name:'Filesaur', concept:'File Systems', type:'FileSystem', rarity:'C',
    hp:60, attack:55, defense:70, speed:35, catchRate:130, xpBase:85,
    spriteColor:'#66aa33', spriteAccent:'#1a3308', area:'File Forest',
    desc:'Filesaur organizes data in hierarchical directories. It knows FAT32, ext4, NTFS, and APFS. Its massive body stores terabytes; its tree-like form mirrors the directory hierarchy.',
    moves:['read_file','write_file','seek','truncate'],
    movePowers:[50,55,45,60],
    moveDescs:['Sequential read via file descriptor','Buffered write to disk blocks','Moves file pointer to byte offset','Shrinks file to given size'],
    stats:{HP:60,ATK:55,DEF:70,SPD:35,INT:60},
  },
  {
    id:8, name:'Kernelion', concept:'OS Kernel', type:'Kernel', rarity:'L',
    hp:90, attack:90, defense:85, speed:75, catchRate:15, xpBase:300,
    spriteColor:'#ff7700', spriteAccent:'#4a2200', area:'Kernel Castle',
    desc:'The mightiest OS-Mon. Kernelion operates in privileged Ring 0, managing all hardware and software. It handles system calls, interrupts, and memory. A kernel panic resets everything.',
    moves:['system_call','interrupt','mode_switch','panic'],
    movePowers:[80,75,70,120],
    moveDescs:['Services user-space request','Handles hardware interrupt','Toggle between user/kernel mode','KERNEL PANIC — ignores own damage'],
    stats:{HP:90,ATK:90,DEF:85,SPD:75,INT:100},
  },
  {
    id:9, name:'Syncro', concept:'Synchronization', type:'Sync', rarity:'R',
    hp:55, attack:65, defense:55, speed:60, catchRate:55, xpBase:130,
    spriteColor:'#ee44bb', spriteAccent:'#440033', area:'Sync Sanctuary',
    desc:'Syncro enforces order among concurrent processes using semaphores and condition variables. Without it, race conditions corrupt shared data.',
    moves:['semaphore','wait','sig_signal','broadcast'],
    movePowers:[65,45,55,70],
    moveDescs:['Limits concurrent access count','Blocks until condition is true','Wakes one sleeping waiter','Wakes ALL waiting processes'],
    stats:{HP:55,ATK:65,DEF:55,SPD:60,INT:75},
  },
  {
    id:10, name:'Networkit', concept:'Networking', type:'Network', rarity:'C',
    hp:50, attack:50, defense:45, speed:80, catchRate:145, xpBase:80,
    spriteColor:'#2288ee', spriteAccent:'#0a2055', area:'Network Nexus',
    desc:'Networkit traverses the OSI stack at light speed. It knows the TCP three-way handshake (SYN-SYN/ACK-ACK), UDP datagrams, IP routing, and ARP.',
    moves:['send_packet','tcp_handshake','udp_blast','route'],
    movePowers:[50,60,45,55],
    moveDescs:['Transmits data across the network','SYN → SYN/ACK → ACK sequence','Connectionless fast transmission','BGP/OSPF pathfinding'],
    stats:{HP:50,ATK:50,DEF:45,SPD:80,INT:55},
  },
  {
    id:11, name:'Segmentian', concept:'Segmentation', type:'Memory', rarity:'U',
    hp:58, attack:52, defense:65, speed:30, catchRate:100, xpBase:100,
    spriteColor:'#cc7733', spriteAccent:'#3a1a00', area:'Memory Mountains',
    desc:'Segmentian divides memory into logical named segments: text, data, BSS, heap, stack. It guards boundaries with segment descriptors and throws SIGSEGV on violations.',
    moves:['swap_in','evict','page_fault','tlb_flush'],
    movePowers:[55,45,75,45],
    moveDescs:['Divides memory into logical regions','Compacts fragmented free regions','Allocates a new memory segment','Segfault — skips opponent turn!'],
    stats:{HP:58,ATK:52,DEF:65,SPD:30,INT:62},
  },
  {
    id:12, name:'Inodeer', concept:'Inodes', type:'FileSystem', rarity:'C',
    hp:48, attack:45, defense:55, speed:45, catchRate:155, xpBase:72,
    spriteColor:'#44cc77', spriteAccent:'#0a3a1a', area:'File Forest',
    desc:'Every Unix file has exactly one Inodeer storing metadata: UID, GID, permissions, timestamps, and 12 direct + indirect block pointers. The filename lives in the directory, not the inode.',
    moves:['create_inode','link','unlink','chmod'],
    movePowers:[45,40,50,35],
    moveDescs:['Allocates new inode for file','Creates hard link to inode','Removes directory entry','Changes permission bits (rwxrwxrwx)'],
    stats:{HP:48,ATK:45,DEF:55,SPD:45,INT:52},
  },
  {
    id:13, name:'Queuemon', concept:'Process Queues', type:'Process', rarity:'C',
    hp:52, attack:48, defense:52, speed:50, catchRate:160, xpBase:70,
    spriteColor:'#6699ee', spriteAccent:'#0a1a44', area:'CPU Valley',
    desc:'Queuemon manages the ready queue, wait queue, and I/O queues. It supports FIFO, priority heaps, and MLFQ. When the queue is full, it becomes surprisingly powerful.',
    moves:['enqueue','dequeue','prioritize','starve'],
    movePowers:[45,45,55,65],
    moveDescs:['Adds process to back of queue','Removes process from front','Reorders by priority value','Denies CPU to low-priority foe'],
    stats:{HP:52,ATK:48,DEF:52,SPD:50,INT:50},
  },
  {
    id:14, name:'Buffering', concept:'Buffers', type:'Memory', rarity:'U',
    hp:55, attack:50, defense:60, speed:38, catchRate:105, xpBase:95,
    spriteColor:'#ee8833', spriteAccent:'#3a2000', area:'File Forest',
    desc:'Buffering absorbs speed mismatches between fast CPUs and slow I/O. It fills quietly, then flushes with a burst. Double buffering hides I/O latency behind CPU computation.',
    moves:['swap_in','cache_hit','page_fault','prefetch'],
    movePowers:[40,65,70,55],
    moveDescs:['Accumulates incoming data quietly','Writes all buffered data at once','Buffer overflow — harms both sides!','Uses two alternating buffers'],
    stats:{HP:55,ATK:50,DEF:60,SPD:38,INT:55},
  },
  {
    id:15, name:'Contextus', concept:'Context Switch', type:'Kernel', rarity:'R',
    hp:50, attack:60, defense:45, speed:75, catchRate:60, xpBase:120,
    spriteColor:'#bb33ff', spriteAccent:'#330055', area:'CPU Valley',
    desc:'The fastest OS-Mon. Contextus saves all registers, PC, and SP into the PCB, then loads another process. On modern x86-64 this takes ~1-10 microseconds. Too many switches waste CPU.',
    moves:['ctx_switch','preempt','round_robin','priority_boost'],
    movePowers:[65,90,50,80],
    moveDescs:['Saves all CPU registers to PCB','Loads saved CPU state from PCB','Voluntarily gives up CPU','Forcibly switches context on foe'],
    stats:{HP:50,ATK:60,DEF:45,SPD:75,INT:68},
  },
  {
    id:16, name:'Interruptus', concept:'Interrupts', type:'Kernel', rarity:'U',
    hp:52, attack:65, defense:42, speed:72, catchRate:95, xpBase:105,
    spriteColor:'#eecc00', spriteAccent:'#3a2e00', area:'Kernel Castle',
    desc:'Interruptus halts normal execution to vector the CPU to an Interrupt Service Routine. Hardware IRQs, software traps, and CPU exceptions are its weapons.',
    moves:['trigger_irq','handle_isr','priority_int','mask'],
    movePowers:[60,50,70,45],
    moveDescs:['Fires hardware interrupt request','Executes interrupt service routine','High-priority INT jumps queue','Disables interrupt via CLI/EFLAGS'],
    stats:{HP:52,ATK:65,DEF:42,SPD:72,INT:65},
  },
  {
    id:17, name:'Mutexor', concept:'Mutual Exclusion', type:'Sync', rarity:'R',
    hp:58, attack:62, defense:70, speed:28, catchRate:52, xpBase:130,
    spriteColor:'#ee2266', spriteAccent:'#400011', area:'Sync Sanctuary',
    desc:'Slow but unbreakable. Mutexor owns a critical section — only the holding thread may unlock it. Can cause priority inversion (solved by priority inheritance) and is susceptible to deadlock.',
    moves:['lock','unlock','busy_wait','pri_inherit'],
    movePowers:[60,45,35,75],
    moveDescs:['Acquires lock, blocks if taken','Releases lock, wakes one waiter','CPU spins checking lock — slow!','Inherits high priority to avoid inversion'],
    stats:{HP:58,ATK:62,DEF:70,SPD:28,INT:72},
  },
  {
    id:18, name:'Monitormon', concept:'Monitors', type:'Sync', rarity:'U',
    hp:55, attack:58, defense:62, speed:42, catchRate:90, xpBase:110,
    spriteColor:'#22ddbb', spriteAccent:'#003a30', area:'Sync Sanctuary',
    desc:'Monitormon is a high-level synchronization object combining a mutex with condition variables. Used in Java (synchronized), Python (threading.Lock), and OS kernels to avoid busy-waiting.',
    moves:['wait','sig_signal','broadcast','lock'],
    movePowers:[55,55,70,60],
    moveDescs:['Atomically releases lock and sleeps','Signals one waiting thread to wake','Wakes all threads on condition','Acquires monitor lock on entry'],
    stats:{HP:55,ATK:58,DEF:62,SPD:42,INT:70},
  },
]

export const RARITY_LABELS: Record<Rarity, string> = {
  B: 'BASIC', C: 'COMMON', U: 'UNCOMMON', R: 'RARE', L: 'LEGENDARY'
}

export const RARITY_MULT: Record<Rarity, number> = {
  B: 1, C: 1.2, U: 1.5, R: 2, L: 3
}
