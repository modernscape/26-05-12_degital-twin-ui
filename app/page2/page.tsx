"use client"

import { motion, useAnimation, useMotionValue } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function PhotoAppStylePage() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const scale = useMotionValue(1)
  const SCALE_FACTOR = 2.15

  // ピンチ操作用の変数
  const lastDistance = useRef<number | null>(null)

  // 1. スクロール範囲の動的計算
  const updateConstraints = (currentScale: number) => {
    if (!containerRef.current || !boardRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const zoomedWidth = container.width * 0.95 * currentScale
    const zoomedHeight = ((container.width * 0.95) / (18 / 19.5)) * currentScale

    const overlapX = Math.max(0, (zoomedWidth - container.width) / 2)
    const overlapY = Math.max(0, (zoomedHeight - container.height) / 2)

    setConstraints({
      left: -overlapX,
      right: overlapX,
      top: -overlapY,
      bottom: overlapY,
    })
  }

  // 2. ピンチジェスチャーの実装
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // 2本指の距離を計算 (ピタゴラスの定理)
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch1.pageX - touch2.pageX,
          touch1.pageY - touch2.pageY,
        )

        if (lastDistance.current !== null) {
          const delta = distance / lastDistance.current
          let newScale = scale.get() * delta

          // ズーム範囲を制限 (1倍〜4倍)
          newScale = Math.min(Math.max(newScale, 1), 4)

          scale.set(newScale)
          setIsZoomed(newScale > 1.05)
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
      if (container) {
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [scale])

  // 3. ダブルタップズーム
  const handleDoubleTap = (e: React.MouseEvent) => {
    // transition を各プロパティに直接指定するか、スプリングに切り替える
    const animSettings = {
      scale: scale.get() > 1.1 ? 1 : SCALE_FACTOR,
      x: 0,
      y: 0,
    }

    if (!(scale.get() > 1.1)) {
      // 拡大時のみ、タップ位置に基づいた座標計算を入れる
      const rect = containerRef.current!.getBoundingClientRect()
      animSettings.x = (e.clientX - rect.left - rect.width / 2) * -1.5
      animSettings.y = (e.clientY - rect.top - rect.height / 2) * -1.5
    }

    // アニメーション実行
    controls.start({
      ...animSettings,
      transition: {
        type: "spring",
        duration: 0.8, // ここでお好みの長さに調整（1.2 くらいにするとかなり優雅です）
        bounce: 0,
      },
    })

    // 状態更新
    const isNowZoomed = !(scale.get() > 1.1)
    scale.set(animSettings.scale)
    setIsZoomed(isNowZoomed)
  }

  useEffect(() => {
    const unsubscribe = scale.on("change", (latest) =>
      updateConstraints(latest),
    )
    return () => unsubscribe()
  }, [])

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
          ref={boardRef}
          drag={isZoomed}
          dragConstraints={constraints}
          dragElastic={0.1}
          dragMomentum={true}
          animate={controls}
          style={{ scale }}
          className="relative w-[95vw] aspect-[18/19.5] bg-white shadow-2xl flex overflow-hidden origin-center will-change-transform"
        >
          <div className="flex-1 h-full border-r border-gray-100 bg-[#fafafa] flex items-center justify-center">
            <span className="text-[10px] text-gray-300 font-mono rotate-90 opacity-40">
              LEFT
            </span>
          </div>
          <div className="flex-1 h-full bg-[#fafafa] flex items-center justify-center">
            <span className="text-[10px] text-gray-300 font-mono rotate-90 opacity-40">
              RIGHT
            </span>
          </div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </motion.div>
      </div>
    </main>
  )
}
