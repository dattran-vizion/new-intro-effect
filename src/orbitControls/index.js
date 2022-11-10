import React, { useEffect, useMemo, useRef, useState } from 'react'

import { extend, useFrame, useThree } from '@react-three/fiber'

import { OrbitControls } from './OrbitControls'

window.toggleSpeed = null
window.toggleOverride = null

extend({ OrbitControls })

const isMobileDevice = false
const ROTATE_SPEED = isMobileDevice ? -0.5 : -0.25
const ZOOM_SPEED = isMobileDevice ? 2 : 3

const centerLookAt = { x: 500, y: 0, z: 0 }
const shouldLimitPan = false

const Controls = (props) => {
  // Three Hooks
  const { camera, gl } = useThree()

  // State
  const [ap, setAp] = useState(-1)
  const [autoOverride, setAutoOverride] = useState(false)

  // Control Ref
  const controlRef = useRef(null)

  useEffect(() => {
    if (centerLookAt) {
      const { x, y, z } = centerLookAt
      camera.position.set(x, y, z)
      camera.updateProjectionMatrix()
    }
  }, [camera, centerLookAt])

  window.toggleOverride = (val) => {
    if (typeof val === 'undefined') {
      setAutoOverride(!autoOverride)
    } else {
      setAutoOverride(val)
    }
  }
  window.toggleSpeed = () => {
    if (ap === -1) {
      window.logMessage('DOUBLE SPEED')
      setAp(-100)
    } else {
      window.logMessage('NORMAL SPEED')
      setAp(-1)
    }
  }
  const autoRotate = useMemo(() => {
    if (autoOverride) {
      return false
    }
    return !!props.autoRotate
  }, [props.autoRotate, autoOverride])
  const autoRotateSpeed = useMemo(() => ap, [ap])
  const rotateSpeed = useMemo(() => ROTATE_SPEED, [])
  const zoomSpeed = useMemo(() => ZOOM_SPEED, [])
  const enableDamping = useMemo(() => !!props.enableDamping, [props.enableDamping])

  const [minPolar, maxPolar] = useMemo(() => {
    return shouldLimitPan ? [1.44, 1.71] : [0, Math.PI]
  }, [shouldLimitPan])

  const enable = useMemo(() => {
    return !!props.enable
  }, [props.enable])

  useFrame(() => {
    if (!autoOverride) {
      controlRef?.current && controlRef.current.update()
    }
  })

  return (
    <orbitControls
      ref={controlRef}
      args={[camera, gl.domElement]}
      enabled={enable}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      rotateSpeed={rotateSpeed}
      enableZoom={true}
      zoomSpeed={zoomSpeed}
      minZoom={20}
      maxZoom={140}
      enableDamping={enableDamping}
      enableKeys={true}
      keyPanSpeed={15}
      minPolarAngle={minPolar}
      maxPolarAngle={maxPolar}
    />
  )
}

export default Controls
