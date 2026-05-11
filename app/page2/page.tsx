"use client"

import { motion, useAnimation, useMotionValue } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function SnappingBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })

  const SCALE_FACTOR = 2.5

  // エッジの制約を計算する関数
  const updateConstraints = (currentScale: number) => {
    if (!containerRef.current) return
    const container = containerRef.current.getBoundingClientRect()

    // ボードの基本サイズ（95vw）
    const baseWidth = container.width * 0.95
    const baseHeight = baseWidth / (18 / 19.5)

    const zoomedWidth = baseWidth * currentScale
    const zoomedHeight = baseHeight * currentScale

    // 画面からはみ出した分だけ動けるようにする
    const xRange = Math.max(0, (zoomedWidth - container.width) / 2)
    const yRange = Math.max(0, (zoomedHeight - container.height) / 2)

    setConstraints({
      left: -xRange,
      right: xRange,
      top: -yRange,
      bottom: yRange,
    })
  }

  // 指を離した時やズーム終了時に「正しい位置」へ戻す
  const snapToEdges = () => {
    const currentScale = scale.get()
    updateConstraints(currentScale)

    // 現在の座標が制約を超えていないかチェック
    let targetX = x.get()
    let targetY = y.get()

    if (currentScale <= 1.05) {
      targetX = 0
      targetY = 0
    } else {
      // 拡大時は、計算した constraints の範囲内に収める
      targetX = Math.max(constraints.left, Math.min(constraints.right, targetX))
      targetY = Math.max(constraints.top, Math.min(constraints.bottom, targetY))
    }

    controls.start({
      x: targetX,
      y: targetY,
      scale: currentScale,
      transition: { type: "spring", stiffness: 200, damping: 25 },
    })
  }

  const handleDoubleTap = (e: React.MouseEvent) => {
    const isZoomingIn = scale.get() < 1.5
    const targetScale = isZoomingIn ? SCALE_FACTOR : 1

    let targetX = 0
    let targetY = 0

    if (isZoomingIn) {
      const rect = containerRef.current!.getBoundingClientRect()
      targetX = (e.clientX - rect.left - rect.width / 2) * -1.2
      targetY = (e.clientY - rect.top - rect.height / 2) * -1.2
    }

    // じわっとアニメーションしつつ、終了時に値を同期
    controls
      .start({
        scale: targetScale,
        x: targetX,
        y: targetY,
        transition: { type: "tween", duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      })
      .then(() => {
        scale.set(targetScale)
        x.set(targetX)
        y.set(targetY)
        updateConstraints(targetScale)
      })
  }

  return (
    <main
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden touch-none"
      ref={containerRef}
    >
      <div
        className="w-full h-full flex items-center justify-center p-4"
        onDoubleClick={handleDoubleTap}
      >
        <motion.div
          drag
          dragConstraints={constraints}
          dragElastic={0.2} // 境界を超えた時のゴムのような遊び
          dragMomentum={true}
          onDragEnd={snapToEdges} // 指を離した時に吸着させる
          animate={controls}
          style={{ scale, x, y, aspectRatio: "18 / 19.5", width: "95vw" }}
          className="relative bg-white shadow-2xl flex overflow-hidden origin-center will-change-transform cursor-grab active:cursor-grabbing"
        >
          <div className="flex-1 h-full border-r border-gray-100 bg-[#fafafa]" />
          <div className="flex-1 h-full bg-[#fafafa]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </motion.div>
      </div>
    </main>
  )
}
