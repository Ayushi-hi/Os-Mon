type KeyHandler = (key: string) => void

class InputHandler {
  private keys: Set<string> = new Set()
  private listeners: Map<string, KeyHandler[]> = new Map()
  private initialized = false

  init() {
    if (this.initialized) return
    this.initialized = true
    window.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (['button', 'input', 'textarea', 'select'].includes(tag)) return
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault()
      this.keys.add(e.key)
      const handlers = this.listeners.get(e.key) || []
      handlers.forEach(h => h(e.key))
    })
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key)
    })
  }

  isDown(key: string): boolean { return this.keys.has(key) }

  on(key: string, handler: KeyHandler) {
    if (!this.listeners.has(key)) this.listeners.set(key, [])
    this.listeners.get(key)!.push(handler)
  }

  off(key: string, handler: KeyHandler) {
    const handlers = this.listeners.get(key) || []
    this.listeners.set(key, handlers.filter(h => h !== handler))
  }

  destroy() {
    this.listeners.clear()
  }
}

export const inputHandler = new InputHandler()
