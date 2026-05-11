"use client"

import { motion, useAnimation, useMotionValue } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function UltimateBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // MotionValueで値を管理することで、Reactの再レンダリングを介さずヌルヌル動かします
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const [isZoomed, setIsZoomed] = useState(false)
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })

  const SCALE_FACTOR = 2.5

  // 1. スクロール制限の計算
  const updateConstraints = (currentScale: number) => {
    if (!containerRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const zoomedWidth = container.width * 0.95 * currentScale
    const zoomedHeight = ((container.width * 0.95) / (18 / 19.5)) * currentScale

    const xRange = Math.max(0, (zoomedWidth - container.width) / 2)
    const yRange = Math.max(0, (zoomedHeight - container.height) / 2)

    setConstraints({
      left: -xRange,
      right: xRange,
      top: -yRange,
      bottom: yRange,
    })
  }

  // 2. ピンチ操作のロジック
  const lastDistance = useRef<number | null>(null)

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0]
        const t2 = e.touches[1]
        const distance = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY)

        if (lastDistance.current !== null) {
          const delta = distance / lastDistance.current
          let newScale = scale.get() * delta
          // ズーム範囲を1倍〜5倍に制限
          newScale = Math.min(Math.max(newScale, 1), 5)
          scale.set(newScale)
          setIsZoomed(newScale > 1.05)
          updateConstraints(newScale)
        }
        lastDistance.current = distance
      }
    }

    const handleTouchEnd = () => {
      lastDistance.current = null
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      })
      container.addEventListener("touchend", handleTouchEnd)
    }
    return () => {
      container?.removeEventListener("touchmove", handleTouchMove)
      container?.removeEventListener("touchend", handleTouchEnd)
    }
  }, [scale])

  // 3. じわっとダブルタップズーム
  const handleDoubleTap = (e: React.MouseEvent) => {
    const nextZoomed = scale.get() < 1.5 // 1.5倍未満なら拡大、以上なら戻す
    const targetScale = nextZoomed ? SCALE_FACTOR : 1

    let targetX = 0
    let targetY = 0

    if (nextZoomed) {
      const rect = containerRef.current!.getBoundingClientRect()
      targetX = (e.clientX - rect.left - rect.width / 2) * -1.2
      targetY = (e.clientY - rect.top - rect.height / 2) * -1.2
    }

    controls.start({
      scale: targetScale,
      x: targetX,
      y: targetY,
      transition: { type: "tween", duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    })

    // MotionValueも同期させる（ドラッグ制約のため）
    scale.set(targetScale)
    x.set(targetX)
    y.set(targetY)
    setIsZoomed(nextZoomed)
    updateConstraints(targetScale)
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
          drag={isZoomed}
          dragConstraints={constraints}
          dragElastic={0.15}
          dragMomentum={true}
          animate={controls}
          style={{ scale, x, y, aspectRatio: "18 / 19.5", width: "95vw" }}
          className="relative bg-white shadow-2xl flex overflow-hidden origin-center will-change-transform cursor-grab active:cursor-grabbing"
        >
          {/* ページ内容 */}
          <div className="flex-1 h-full border-r border-gray-100 bg-[#fafafa]" />
          <div className="flex-1 h-full bg-[#fafafa]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </motion.div>
      </div>

      {/* ズーム倍率表示 (デバッグ/ガイド用) */}
      <div className="absolute top-10 right-10 text-white/20 font-mono text-[10px]">
        ZOOM: {scale.get().toFixed(1)}x
      </div>
    </main>
  )
}
