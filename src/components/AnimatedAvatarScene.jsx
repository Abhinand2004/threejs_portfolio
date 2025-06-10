import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Html, useGLTF } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer } from 'three'
import * as THREE from 'three'
import { Text as TroikaText } from 'troika-three-text'
extend({ TroikaText })
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import { Canvas as ThreeCanvas } from "@react-three/fiber"

// ---- TroikaText component for R3F ----
function TroikaTextMesh({
  text = "Hello world!",
  fontUrl = "/fonts/WinkyRough-ExtraBold.ttf",
  position = [100, 0, 100],
  fontSize = 0.2,
  color = "#00eaff",
  anchorX = "center",
  anchorY = "middle",
  ...props
}) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 1) * 0.05)
    }
  })
  return (
    <troikaText
      ref={ref}
      text={text}
      font={fontUrl}
      fontSize={fontSize}
      color={color}
      maxWidth={12}
      anchorX={anchorX}
      anchorY={anchorY}
      outlineWidth={0.02}
      outlineColor="#00cfff"
      outlineOpacity={0.2}
      position={position}
      curveRadius={-15}
      {...props}
    />
  )
}

function CelestialBody({ modelPath, position, scale = [1,1,1], rotationSpeed = 0.08 }) {
  const { scene } = useGLTF(modelPath)
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * state.clock.getDelta()
    }
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  )
}

// Moon Component
function Moon({ position, glowIntensity, scale = 1 }) {
  const moonRef = useRef()
  const { scene } = useGLTF('/models/moon.glb')
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.13
      moonRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.8 + position[1]
      moonRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.5 + position[0]
    }
  })

  return (
    <group ref={moonRef} position={position} scale={[scale, scale, scale]}>
      <primitive 
        object={scene.clone()} 
        scale={[0.9, 0.9, 0.9]}
      />
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#00cfff"
          transparent
          opacity={0.15 + glowIntensity * 0.06}
        />
      </mesh>
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#fff"
          transparent
          opacity={0.09 + glowIntensity * 0.05}
        />
      </mesh>
    </group>
  )
}

// Enhanced Star Component
function Star({ position, scale, rotationSpeed, twinkleSpeed }) {
  const starRef = useRef()
  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed
      starRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.7
      starRef.current.rotation.z = state.clock.elapsedTime * rotationSpeed * 0.5
      const twinkle = Math.sin(state.clock.elapsedTime * twinkleSpeed) * 0.4 + 0.8
      starRef.current.material.emissiveIntensity = twinkle * 1.2
      starRef.current.scale.setScalar(scale * (0.9 + twinkle * 0.6))
    }
  })
  return (
    <mesh ref={starRef} position={position}>
      <octahedronGeometry args={[0.12, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#00cfff"
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}

// Animated Avatar Component with NORMAL lighting
function AnimatedAvatar({ url, scale = 1, position = [0, 0, 0] }) {
  const model = useLoader(FBXLoader, url)
  const mixerRef = useRef()
  const groupRef = useRef()
  useEffect(() => {
    if (model.animations.length > 0) {
      mixerRef.current = new AnimationMixer(model)
      const action = mixerRef.current.clipAction(model.animations[0])
      action.play()
    }
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.color.multiplyScalar(1.3)
            mat.emissive.setHex(0x080808)
            mat.emissiveIntensity = 0.05
          })
        } else {
          child.material.color.multiplyScalar(1.3)
          child.material.emissive.setHex(0x080808)
          child.material.emissiveIntensity = 0.05
        }
      }
    })
  }, [model])
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      groupRef.current.rotation.y = 0.26 + Math.sin(state.clock.elapsedTime * 0.3) * 0.8
    }
  })
  return (
    <group ref={groupRef} position={position}>
      <primitive object={model} scale={scale} />
      <pointLight 
        position={[0, 2, 2]} 
        intensity={0.4}
        color="#ffffff"
        distance={8}
        decay={2}
      />
      <pointLight 
        position={[-2, 1, 2]} 
        intensity={0.25}
        color="#00cfff"
        distance={6}
        decay={2}
      />
    </group>
  )
}

const socialIcons = [
  {
    name: "Instagram",
    url: "https://instagram.com/abhinand_c",
    svgPath: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/abhinandc/",
    svgPath: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
  },
  {
    name: "GitHub",
    url: "https://github.com/Abhinand2004",
    svgPath: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 389.4 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
  },
  {
    name: "Facebook",
    url: "https://facebook.com/abhinandc",
    svgPath: "M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
  }
]

// 3D Slider Component (only for desktop/tablet)
function Slider3D({ label, value, onChange, min, max, step, position, scale = 1 }) {
  const groupRef = useRef()
  const sliderRef = useRef()
  const knobRef = useRef()
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    if (sliderRef.current) sliderRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    if (knobRef.current) knobRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2
  })
  const handlePointerDown = (event) => event.stopPropagation()
  const normalizedValue = (value - min) / (max - min)
  const sliderWidth = 3 * scale
  const knobSize = 0.2 * scale
  const textSize = 0.25 * scale
  const valueTextSize = 0.2 * scale
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <mesh ref={sliderRef} position={[0, 0, 0]}>
        <boxGeometry args={[sliderWidth, 0.15, 0.3]} />
        <meshStandardMaterial
          color="#001122"
          emissive="#00cfff"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh 
        ref={knobRef}
        position={[(normalizedValue - 0.5) * (sliderWidth * 0.93), 0.15, 0]}
        onPointerDown={handlePointerDown}
      >
        <sphereGeometry args={[knobSize, 16, 16]} />
        <meshStandardMaterial
          color="#00cfff"
          emissive="#00cfff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={textSize}
        color="#00cfff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
        <meshStandardMaterial
          emissive="#00cfff"
          emissiveIntensity={0.4}
        />
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={valueTextSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {value.toFixed(2)}
        <meshStandardMaterial
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </Text>
      <Html center position={[0, 0, 0.2]}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            width: `${200 * scale}px`,
            opacity: 0,
            cursor: 'pointer',
            height: `${60 * scale}px`
          }}
        />
      </Html>
    </group>
  )
}

// Social Icon 3D Component
function SocialIcon3D({ icon, position, index, glowIntensity, scale = 1 }) {
  const meshRef = useRef()
  const groupRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.2
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.1
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + index * 0.5) * 0.08
      groupRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.05))
    }
  })
  const iconSize = 44 * scale
  
  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} scale={[0.36 * scale, 0.36 * scale, 0.16 * scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00cfff"
          emissive="#00cfff"
          emissiveIntensity={0.08 + glowIntensity * 0.80}
          metalness={0.45}
          roughness={0.42}
        />
      </mesh>
      <Html center position={[0, 1, 1]}>
        <a 
          href={icon.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            filter: `drop-shadow(0 0 4px #00cfff)`,
            transition: 'all 0.3s ease'
          }}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 512 512" fill="#00cfff">
            <path d={icon.svgPath} />
          </svg>
        </a>
      </Html>
    </group>
  )
}

// Galaxy background: responsive star count
function GalaxyBackground({ glowIntensity, backgroundDarkness, starCount = 900 }) {
  const starData = useMemo(() => {
    const stars = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        position: [
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 120
        ],
        scale: Math.random() * 1.3 + 0.4,
        rotationSpeed: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 3 + 1
      })
    }
    return stars
  }, [starCount])

  return (
    <>
      {starData.map((star, index) => (
        <Star
          key={index}
          position={star.position}
          scale={star.scale}
          rotationSpeed={star.rotationSpeed}
          twinkleSpeed={star.twinkleSpeed}
        />
      ))}
      <Moon 
        position={[10, 6, -18]} 
        glowIntensity={glowIntensity}
      />
    </>
  )
}

function Scene({ glowIntensity, backgroundDarkness, screenSize, setGlowIntensity, setBackgroundDarkness }) {
  const description = `Hi there! 👋
I'm Abhinand

Welcome to my virtual dimension. What you see here is built from passion — it's personal, it's me. This space is more than a portfolio; it's a digital canvas of everything I love creating. Let's explore it together.`

  // Responsive scaling based on screen size
  const scales = {
    mobile: {
      avatar: 0.8,
      text: 0.25,
      socialIcon: 0.7,
      moon: 0.6,
      sun: [1.5, 1.5, 1.5],
      slider: 0.6,
      camera: { position: [0, 0, 10], fov: 70 }
    },
    tablet: {
      avatar: 1.8,
      text: 0.35,
      socialIcon: 0.85,
      moon: 0.8,
      sun: [2, 2, 2],
      slider: 0.8,
      camera: { position: [0, 0, 9], fov: 65 }
    },
    desktop: {
      avatar: 3.0,
      text: 0.5,
      socialIcon: 1.0,
      moon: 1.0,
      sun: [2.5, 2.5, 2.5],
      slider: 1.0,
      camera: { position: [0, 0, 8], fov: 60 }
    },
    large: {
      avatar: 3.5,
      text: 0.6,
      socialIcon: 1.2,
      moon: 1.2,
      sun: [3, 3, 3],
      slider: 1.2,
      camera: { position: [0, 0, 8], fov: 55 }
    }
  }

  const currentScale = scales[screenSize]

  // Responsive positions
  const getResponsivePositions = () => {
    switch(screenSize) {
      case 'mobile':
        return {
          text: [0, -1.5, 0],
          avatar: [-0.8, 0.5, -1],
          socialIcons: (index) => [-1.2 + (index * 0.8), -3.2, 0],
          sliders: {
            glow: [6, 0.5, -2],
            darkness: [6, -1.5, -2]
          },
          moon: [6, 4, -12],
          sun: [8, 10, -60]
        }
      case 'tablet':
        return {
          text: [-2.5, 1.8, 0],
          avatar: [-4, -1.5, 0.3],
          socialIcons: (index) => [-1 + (index * 1), -2.8, 0],
          sliders: {
            glow: [7.5, 0.8, -2],
            darkness: [7.5, -1.2, -2]
          },
          moon: [8, 5, -15],
          sun: [9, 12, -70]
        }
      case 'desktop':
        return {
          text: [-4.5, 2.5, 0],
          avatar: [-6.8, -3.3, 0.5],
          socialIcons: (index) => [0 + (index * 1.2), -3.5, 0],
          sliders: {
            glow: [9, 1, -2],
            darkness: [9, -2, -2]
          },
          moon: [10, 6, -18],
          sun: [10, 16, -80]
        }
      case 'large':
        return {
          text: [-5.5, 3, 0],
          avatar: [-8, -4, 0.8],
          socialIcons: (index) => [0 + (index * 1.4), -4, 0],
          sliders: {
            glow: [11, 1.5, -2],
            darkness: [11, -2.5, -2]
          },
          moon: [12, 7, -20],
          sun: [12, 18, -90]
        }
      default:
        return scales.desktop
    }
  }

  const positions = getResponsivePositions()
  // Star count
  const starCount = screenSize === 'mobile' ? 400 : screenSize === 'tablet' ? 600 : screenSize === 'large' ? 1200 : 900

  return (
    <>
      <ambientLight intensity={0.7 + glowIntensity * 0.25} color="#f0f8ff" />
      <directionalLight 
        position={[5, 7, 12]} 
        intensity={0.3 + glowIntensity * 0.15}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-6, 6, -6]}
        intensity={0.2 + glowIntensity * 0.1}
        color="#e8f9ff"
      />
      <OrbitControls 
        enablePan={false}
        minDistance={screenSize === 'mobile' ? 6 : 4}
        maxDistance={screenSize === 'mobile' ? 20 : 15}
        maxPolarAngle={Math.PI / 2}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <Environment preset="night" />
      <GalaxyBackground 
        glowIntensity={glowIntensity} 
        backgroundDarkness={backgroundDarkness}
        starCount={starCount}
      />

      {/* Sun - scaled and positioned responsively */}
      <CelestialBody
        modelPath="/models/sun.glb"
        position={positions.sun}
        scale={currentScale.sun}
        rotationSpeed={0.03}
      />

      {/* Text - responsive positioning and sizing */}
      <TroikaTextMesh
        text={description}
        fontUrl="/fonts/WinkyRough-ExtraBold.ttf"
        position={positions.text}
        fontSize={currentScale.text}
        color="#00eaff"
        anchorX={screenSize === 'mobile' ? "center" : "left"}
        anchorY={screenSize === 'mobile' ? "bottom" : "top"}
      />

      {/* Desktop/Tablet controls - scaled appropriately */}
      {screenSize !== 'mobile' && (
        <>
          <Slider3D
            label="✨ Glow Power"
            value={glowIntensity}
            onChange={setGlowIntensity}
            min={0.1}
            max={2.5}
            step={0.01}
            position={positions.sliders.glow}
            scale={currentScale.slider}
          />
          <Slider3D
            label="🌑 Darkness Level"
            value={backgroundDarkness}
            onChange={setBackgroundDarkness}
            min={0}
            max={2}
            step={0.01}
            position={positions.sliders.darkness}
            scale={currentScale.slider}
          />
        </>
      )}

      {/* Avatar - responsive scaling and positioning */}
      <AnimatedAvatar 
        url="/models/Arm Stretching.fbx" 
        scale={currentScale.avatar}
        position={positions.avatar}
      />

      {/* Social Icons - responsive layout */}
      {socialIcons.map((icon, index) => (
        <SocialIcon3D
          key={icon.name}
          icon={icon}
          index={index}
          position={positions.socialIcons(index)}
          glowIntensity={glowIntensity}
          scale={currentScale.socialIcon}
        />
      ))}
    </>
  )
}

function getScreenSize(width) {
  if (width < 600) return 'mobile'
  if (width < 1024) return 'tablet'
  if (width < 1600) return 'desktop'
  return 'large'
}


// ...other components (TroikaTextMesh, CelestialBody, Moon, Star, AnimatedAvatar, socialIcons, Slider3D, SocialIcon3D, GalaxyBackground, Scene, getScreenSize) remain unchanged...

// --- Enhanced 3D Arrow Button Component ---
function Arrow3DButton({ onClick, size = 120 }) {
  const groupRef = useRef()
  const arrowShaftRef = useRef()
  const arrowHeadRef = useRef()
  const glowRingRef = useRef()
  const particlesRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.3
      groupRef.current.rotation.x = Math.cos(time * 0.6) * 0.1
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.15
    }
    if (arrowShaftRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.1
      arrowShaftRef.current.scale.setScalar(pulse)
      arrowShaftRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2
    }
    if (arrowHeadRef.current) {
      const morph = 1 + Math.sin(time * 2.5) * 0.15
      arrowHeadRef.current.scale.set(morph, morph * 1.2, morph)
      arrowHeadRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 4) * 0.3
    }
    if (glowRingRef.current) {
      glowRingRef.current.rotation.z = time * 1.5
      glowRingRef.current.rotation.x = time * 0.8
      const glowPulse = 0.2 + Math.sin(time * 3) * 0.15
      glowRingRef.current.material.opacity = glowPulse
      glowRingRef.current.scale.setScalar(1 + Math.sin(time * 2.2) * 0.2)
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 2
      particlesRef.current.rotation.x = time * 1.2
    }
  })

  const scale = size / 120

  return (
    <ThreeCanvas
      style={{
        width: size,
        height: size,
        background: "transparent",
        cursor: "pointer",
        display: "block"
      }}
      camera={{ position: [0, 0, 4], fov: 75 }}
      onPointerDown={onClick}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 3]} intensity={0.8} color="#00eaff" />
      <pointLight position={[-2, -1, 2]} intensity={0.4} color="#ffffff" />
      <group ref={groupRef} scale={[scale, scale, scale]}>
        {/* Glow Ring */}
        <mesh ref={glowRingRef}>
          <torusGeometry args={[1.2, 0.1, 16, 100]} />
          <meshStandardMaterial 
            color="#00eaff" 
            transparent 
            opacity={0.3}
            emissive="#00eaff"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Swirling Particles */}
        <group ref={particlesRef}>
          {[...Array(8)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.5,
                Math.sin((i / 8) * Math.PI * 2) * 0.3,
                Math.sin((i / 8) * Math.PI * 2) * 1.5
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial 
                color="#00eaff" 
                emissive="#00eaff"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
        {/* Arrow Shaft */}
        <mesh ref={arrowShaftRef} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
          <meshStandardMaterial 
            color="#00eaff" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#00eaff"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Arrow Head */}
        <mesh ref={arrowHeadRef} position={[0, 0.2, 0]}>
          <coneGeometry args={[0.25, 0.6, 6]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#00eaff"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Inner Core Glow */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial 
            color="#00eaff" 
            transparent 
            opacity={0.1}
            emissive="#00eaff"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Outer Energy Field */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.0, 16, 16]} />
          <meshStandardMaterial 
            color="#00eaff" 
            transparent 
            opacity={0.05}
            emissive="#00eaff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </ThreeCanvas>
  )
}

// --- Enhanced Floating Arrow Button Nav ---
// ...existing imports and code...

// --- Enhanced Floating Arrow Button Nav (DOM only, with animation) ---
function ArrowButtonNav() {
  const navigate = useNavigate()
  const size = 100

  return (
    <>
      <style>{`
        @keyframes morphGlow {
          0% {
            transform: translateY(0) scale(1) rotateZ(0deg);
            filter: brightness(1) drop-shadow(0 0 20px #00eaff66);
          }
          25% {
            transform: translateY(-8px) scale(1.05) rotateZ(90deg);
            filter: brightness(1.2) drop-shadow(0 0 30px #00eaff99);
          }
          50% {
            transform: translateY(0) scale(1.1) rotateZ(180deg);
            filter: brightness(1.4) drop-shadow(0 0 40px #00eaffcc);
          }
          75% {
            transform: translateY(-4px) scale(1.03) rotateZ(270deg);
            filter: brightness(1.1) drop-shadow(0 0 25px #00eaff88);
          }
          100% {
            transform: translateY(0) scale(1) rotateZ(360deg);
            filter: brightness(1) drop-shadow(0 0 20px #00eaff66);
          }
        }
        .morphing-arrow-btn {
          animation: morphGlow 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, filter;
          position: relative;
        }
        .morphing-arrow-btn::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(0, 234, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .morphing-arrow-btn:hover::before {
          opacity: 1;
        }
        .morphing-arrow-btn:hover {
          animation-duration: 2s;
          transform: scale(1.1);
          filter: brightness(1.3) drop-shadow(0 0 50px #00eaff);
        }
        .morphing-arrow-btn:active {
          animation-duration: 0.5s;
          transform: scale(0.95);
          filter: brightness(1.6) drop-shadow(0 0 60px #00eaff) saturate(1.5);
        }
        .morphing-arrow-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 234, 255, 0.3);
          border-radius: 50%;
        }
      `}</style>
      <button
        className="morphing-arrow-btn"
        style={{
          position: "fixed",
          right: "3vw",
          bottom: "3vh",
          zIndex: 1000,
          width: size + 20,
          height: size + 20,
          cursor: "pointer",
          padding: 0
        }}
        tabIndex={0}
        aria-label="Navigate to next section"
        onClick={() => navigate("/abc")}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            navigate("/abc")
          }
        }}
      >
        {/* SVG Arrow Icon (rotated 180deg for "down" arrow) */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          style={{ display: "block", transform: "rotate(180deg)" }}
        >
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00eaff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00eaff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="55" fill="url(#glow)" opacity="0.3" />
          <circle cx="60" cy="60" r="40" fill="url(#glow)" opacity="0.15" />
          <rect x="54" y="30" width="12" height="40" rx="6" fill="#00eaff" />
          <polygon points="60,90 80,60 40,60" fill="#fff" stroke="#00eaff" strokeWidth="3" />
        </svg>
      </button>
    </>
  )
}

// ...rest of your code remains unchanged...

export default function AnimatedAvatarSceneResponsive() {
  const [glowIntensity, setGlowIntensity] = useState(0.8)
  const [backgroundDarkness, setBackgroundDarkness] = useState(0.3)
  const [screenSize, setScreenSize] = useState(getScreenSize(typeof window !== "undefined" ? window.innerWidth : 1200))
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(getScreenSize(window.innerWidth))
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    const origBodyStyle = document.body.style.cssText
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    document.documentElement.style.height = '100vh'
    return () => {
      window.removeEventListener('resize', checkScreenSize)
      document.body.style.cssText = origBodyStyle
      document.documentElement.style.height = ''
    }
  }, [])

  // Responsive Canvas camera
  const cameraProps = {
    ...{
      mobile: { position: [0, 0, 10], fov: 70 },
      tablet: { position: [0, 0, 9], fov: 65 },
      desktop: { position: [0, 0, 8], fov: 60 },
      large: { position: [0, 0, 8], fov: 55 }
    }[screenSize]
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0, 0, 0, 0.95)', // navbar background color
      position: 'fixed',
      left: 0,
      top: 0,
      overflow: 'hidden'
    }}>
      <Canvas 
        camera={cameraProps}
        style={{ background: 'transparent', width: '100vw', height: '100vh' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        <Scene 
          glowIntensity={glowIntensity} 
          backgroundDarkness={backgroundDarkness}
          screenSize={screenSize}
          setGlowIntensity={setGlowIntensity}
          setBackgroundDarkness={setBackgroundDarkness}
        />
      </Canvas>
      <ArrowButtonNav />
    </div>
  )
}