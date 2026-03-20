export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  xpReward: number
  topic: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Deadlock',
    question: 'What are the four necessary conditions for deadlock (Coffman, 1971)?',
    options: [
      'Mutual exclusion, hold-and-wait, no preemption, circular wait',
      'Starvation, livelock, priority inversion, race condition',
      'Semaphore, mutex, monitor, spinlock',
      'Fork, exec, wait, exit',
    ],
    correctIndex: 0,
    explanation: 'Coffman (1971): ALL four must hold simultaneously.\n(1) Mutual exclusion — resource used exclusively.\n(2) Hold-and-wait — holding resource while waiting for another.\n(3) No preemption — resource can\'t be taken away.\n(4) Circular wait — cycle P1→P2→…→Pn→P1.\nBreak any one condition to prevent deadlock.',
    xpReward: 75,
  },
  {
    id: 2,
    topic: 'Processes vs Threads',
    question: 'What is the key difference between a process and a thread?',
    options: [
      'Processes are faster to create than threads',
      'A process has its own virtual address space; threads share the space of their parent process',
      'Threads have separate memory; processes always share memory',
      'They are identical — just different terminology',
    ],
    correctIndex: 1,
    explanation: 'A process = independent program with own virtual address space, PCB, file table. Threads = lightweight execution units sharing the same virtual address space within a process. Creating a thread (~1μs) is much faster than a process (~100μs) but threads need explicit synchronization for shared data.',
    xpReward: 60,
  },
  {
    id: 3,
    topic: 'Virtual Memory',
    question: 'What is the purpose of the Translation Lookaside Buffer (TLB)?',
    options: [
      'Store frequently accessed files on fast disk',
      'Cache recent virtual-to-physical address translations to avoid page table walks',
      'Buffer network packets for retransmission',
      'Store the OS kernel in fast SRAM',
    ],
    correctIndex: 1,
    explanation: 'Every virtual memory access normally requires a page-table walk (1+ RAM accesses) before the actual data access. The TLB caches recent VA→PA translations in fast SRAM inside the CPU. With a TLB hit (~1 cycle), the page table is bypassed entirely. Modern systems achieve 99%+ TLB hit rates.',
    xpReward: 65,
  },
  {
    id: 4,
    topic: 'CPU Scheduling',
    question: 'Which CPU scheduling algorithm can cause process starvation?',
    options: [
      'Round Robin',
      'First-Come-First-Served (FCFS)',
      'Static Priority Scheduling without aging',
      'Cooperative multitasking',
    ],
    correctIndex: 2,
    explanation: 'Static priority scheduling always runs the highest-priority ready process. If high-priority processes arrive continuously, low-priority processes NEVER run — this is starvation. Solution: aging (gradually increase priority of waiting processes). Round Robin is starvation-free because every process gets a time quantum eventually.',
    xpReward: 60,
  },
  {
    id: 5,
    topic: 'Page Faults',
    question: 'What happens when the OS services a page fault?',
    options: [
      'The process is immediately terminated with SIGSEGV',
      'The CPU raises an exception; the OS finds the page on disk, loads it into a free frame, updates the page table, and restarts the faulting instruction',
      'The CPU fetches the page from L3 cache directly',
      'The OS sends a SIGBUS signal to the process',
    ],
    correctIndex: 1,
    explanation: 'Page fault handler sequence:\n(1) CPU raises Page Fault exception, saves state.\n(2) OS checks if address is valid (else SIGSEGV).\n(3) OS finds the page in swap space or memory-mapped file.\n(4) If no free frame: run page replacement (LRU, Clock, etc.).\n(5) DMA transfer from disk to frame (~10ms!).\n(6) Update page table entry: valid=1, frame set.\n(7) Restart faulting instruction.',
    xpReward: 70,
  },
  {
    id: 6,
    topic: 'fork()',
    question: 'What does fork() return to the parent and child processes?',
    options: [
      'Always returns 0 to both',
      'Returns -1 on success, 0 on failure',
      'Returns the child\'s PID (>0) to the parent, and 0 to the child',
      'Returns the parent\'s PID to both',
    ],
    correctIndex: 2,
    explanation: 'fork() creates an exact copy of the calling process. It returns TWICE:\n(1) To the parent it returns the child\'s PID (positive integer).\n(2) To the child it returns 0.\nReturns -1 only if fork fails (e.g., process table full). After fork, parent and child share code but have independent address spaces (copy-on-write).',
    xpReward: 60,
  },
  {
    id: 7,
    topic: 'Thrashing',
    question: 'What is thrashing in virtual memory systems?',
    options: [
      'When the CPU executes too many privileged instructions',
      'When the OS spends more time servicing page faults than executing process code',
      'When a process writes past its stack boundary',
      'When cache eviction rate exceeds 50%',
    ],
    correctIndex: 1,
    explanation: 'Thrashing occurs when the combined working sets of all running processes exceed physical RAM. Each process constantly page-faults while waiting for its pages, so the CPU is nearly always idle waiting for I/O. Fix: suspend some processes until ΣW(t,Δ) < physical RAM (Denning\'s Working Set model).',
    xpReward: 70,
  },
  {
    id: 8,
    topic: 'Mutex vs Semaphore',
    question: 'What is the key difference between a mutex and a semaphore?',
    options: [
      'A mutex is faster but less correct',
      'A semaphore counts from 0 to N and can be signaled by any thread; a mutex has an owner and strictly alternates lock/unlock by the same thread',
      'They are identical primitives with different names',
      'Mutexes work only for processes; semaphores only for threads',
    ],
    correctIndex: 1,
    explanation: 'Semaphore (Dijkstra 1965): counting primitive with P() (wait/decrement) and V() (signal/increment). Any thread can call V() — great for producer/consumer signaling. Mutex: has an owner — only the thread that called lock() can call unlock(). This enables priority inheritance and better error checking.',
    xpReward: 65,
  },
  {
    id: 9,
    topic: 'Inodes',
    question: 'In Unix, what does an inode store and what does it NOT store?',
    options: [
      'Stores: filename, permissions, size. NOT stores: data block pointers',
      'Stores: permissions, size, block pointers, timestamps. NOT stores: the filename',
      'Stores: filename and data. NOT stores: permissions',
      'Stores: only a pointer to the data. NOT stores: metadata',
    ],
    correctIndex: 1,
    explanation: 'An inode stores ALL metadata EXCEPT the filename: UID/GID ownership, permission bits, file type, byte size, timestamps (atime/mtime/ctime), and data block pointers (12 direct + single/double/triple indirect). The filename is stored in the DIRECTORY ENTRY that maps name→inode_number. This enables hard links!',
    xpReward: 65,
  },
  {
    id: 10,
    topic: 'Race Conditions',
    question: 'What is a race condition and how is it prevented?',
    options: [
      'When two processes race to finish first; prevented by making one faster',
      'When the outcome of concurrent operations depends on non-deterministic interleaving; prevented with mutual exclusion (mutex/semaphore)',
      'When the CPU runs too fast for memory; prevented with cache',
      'When a network packet arrives out of order; prevented with TCP',
    ],
    correctIndex: 1,
    explanation: 'A race condition occurs when two threads access shared state and the result depends on the order of execution. Example: Thread A reads x=5, Thread B reads x=5, both write x+1=6. Final x=6, not 7! Fix: protect the critical section with a mutex or semaphore so only one thread accesses shared data at a time.',
    xpReward: 60,
  },
]
