import React, { useEffect, useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer } from 'three'

export default function AnimatedAvatar({ url, scale = 1, position = [0, 0, 0] }) {
  const model = useLoader(FBXLoader, url)
  const mixerRef = useRef()

  useEffect(() => {
    if (model.animations.length > 0) {
      mixerRef.current = new AnimationMixer(model)
      const action = mixerRef.current.clipAction(model.animations[0])
      action.play()
    }
  }, [model])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
  })

  return <primitive object={model} scale={scale} position={position} />
}
