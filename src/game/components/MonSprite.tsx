import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OsMon } from '../data/osmons'

interface MonSpriteProps {
  mon: OsMon
  size?: number
  flip?: boolean
  animate?: boolean
}

export default function MonSprite({ mon, size = 120, flip = false, animate = true }: MonSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(window.devicePixelRatio)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 1, 5)
    camera.lookAt(0, 0.5, 0)

    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambient)
    const light = new THREE.DirectionalLight(0xffeedd, 1.0)
    light.position.set(3, 5, 5)
    scene.add(light)

    const color1 = parseInt(mon.spriteColor.replace('#', ''), 16)
    const color2 = parseInt(mon.spriteAccent.replace('#', ''), 16)
    const mat1 = new THREE.MeshLambertMaterial({ color: color1 })
    const mat2 = new THREE.MeshLambertMaterial({ color: color2 })
    const matEye = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x888888 })

    const group = new THREE.Group()
    const variant = mon.name.charCodeAt(0) % 5

    if (variant === 0) {
      // Blob: big sphere body + small head + antennae
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 10), mat1)
      body.position.y = 0.8; group.add(body)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), mat2)
      head.position.set(0, 1.75, 0.3); group.add(head)
      const ant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), mat2)
      ant1.position.set(-0.2, 2.25, 0.2); ant1.rotation.z = 0.3; group.add(ant1)
      const ant2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), mat2)
      ant2.position.set(0.2, 2.25, 0.2); ant2.rotation.z = -0.3; group.add(ant2)
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), matEye)
      eyeL.position.set(-0.15, 1.78, 0.7); group.add(eyeL)
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), matEye)
      eyeR.position.set(0.15, 1.78, 0.7); group.add(eyeR)
    } else if (variant === 1) {
      // Angular: box body + head + back spikes
      const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.1, 0.8), mat1)
      body.position.y = 0.9; group.add(body)
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mat2)
      head.position.set(0, 1.8, 0); group.add(head)
      for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 5), mat2)
        spike.position.set(-0.45 + (Math.random() - 0.5) * 0.2, 1.0 + i * 0.18, -0.5)
        spike.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.3
        group.add(spike)
      }
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), matEye)
      eyeL.position.set(-0.16, 1.83, 0.36); group.add(eyeL)
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), matEye)
      eyeR.position.set(0.16, 1.83, 0.36); group.add(eyeR)
    } else if (variant === 2) {
      // Round: big sphere + small head + cheek spheres
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 12), mat1)
      body.position.y = 1.0; group.add(body)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), mat2)
      head.position.set(0, 2.05, 0.1); group.add(head)
      const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), new THREE.MeshLambertMaterial({ color: 0xff6688 }))
      cheekL.position.set(-0.32, 2.0, 0.5); group.add(cheekL)
      const cheekR = cheekL.clone()
      cheekR.position.set(0.32, 2.0, 0.5); group.add(cheekR)
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 6), matEye)
      eyeL.position.set(-0.18, 2.12, 0.55); group.add(eyeL)
      const eyeR = eyeL.clone()
      eyeR.position.set(0.18, 2.12, 0.55); group.add(eyeR)
    } else if (variant === 3) {
      // Wide: flat box body + armor plates
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.9), mat1)
      body.position.y = 0.7; group.add(body)
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), mat2)
      head.position.set(0, 1.45, 0); group.add(head)
      for (let i = 0; i < 3; i++) {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.1), mat2)
        plate.position.set(-0.5 + i * 0.5, 0.7, 0.5); group.add(plate)
      }
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.06), matEye)
      eyeL.position.set(-0.16, 1.5, 0.34); group.add(eyeL)
      const eyeR = eyeL.clone()
      eyeR.position.set(0.16, 1.5, 0.34); group.add(eyeR)
    } else {
      // Spiky: octahedron body + cone spikes + glowing eye
      const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), mat1)
      body.position.y = 1.0; group.add(body)
      for (let i = 0; i < 6; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.55, 5), mat2)
        const angle = (i / 6) * Math.PI * 2
        spike.position.set(Math.cos(angle) * 0.85, 1.0, Math.sin(angle) * 0.85)
        spike.rotation.z = -angle + Math.PI / 2; group.add(spike)
      }
      const eyeC = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshLambertMaterial({ color: 0xff4400, emissive: 0xff2200 }))
      eyeC.position.set(0, 1.15, 0.75); group.add(eyeC)
    }

    if (flip) group.rotation.y = Math.PI
    scene.add(group)

    const loopFn = (time: number) => {
      frameRef.current = requestAnimationFrame(loopFn)
      if (animate) {
        group.position.y = Math.sin(time * 0.002) * 0.08
        group.rotation.y += flip ? -0.008 : 0.008
      }
      renderer.render(scene, camera)
    }
    frameRef.current = requestAnimationFrame(loopFn)

    return () => {
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
    }
  }, [mon.id, size, flip, animate])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  )
}
