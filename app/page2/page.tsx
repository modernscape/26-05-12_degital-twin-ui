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

  // 1. スクロール範囲の動的計算
  const updateConstraints = (currentScale: number) => {
    if (!containerRef.current || !boardRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const board = boardRef.current.getBoundingClientRect()

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

  // 2. ダブルタップで「タップした場所」へズーム
  const handleDoubleTap = (e: React.MouseEvent) => {
    if (scale.get() > 1.1) {
      // 縮小
      controls.start({ scale: 1, x: 0, y: 0 })
      scale.set(1)
      setIsZoomed(false)
    } else {
      // 拡大：タップした位置のオフセットを計算
      const rect = containerRef.current!.getBoundingClientRect()
      const offsetX = (e.clientX - rect.left - rect.width / 2) * -1.5
      const offsetY = (e.clientY - rect.top - rect.height / 2) * -1.5

      controls.start({ scale: SCALE_FACTOR, x: offsetX, y: offsetY })
      scale.set(SCALE_FACTOR)
      setIsZoomed(true)
    }
  }

  // 3. ピンチズーム（簡易実装版：拡大率の変化を監視）
  useEffect(() => {
    const unsubscribe = scale.on("change", (latest) => {
      updateConstraints(latest)
    })
    return () => unsubscribe()
  }, [])

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] overflow-hidden touch-none">
      <div
        ref={containerRef}
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
          style={{ scale }} // MotionValueでスケールを管理
          className="relative w-[95vw] aspect-[18/19.5] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex overflow-hidden origin-center will-change-transform"
        >
          {/* 左ページ */}
          <div className="flex-1 h-full border-r border-gray-100 bg-[#fafafa] flex items-center justify-center relative">
            <span className="text-[10px] text-gray-300 font-mono rotate-90 uppercase tracking-[0.2em] opacity-40">
              Spread Left
            </span>
          </div>

          {/* 右ページ */}
          <div className="flex-1 h-full bg-[#fafafa] flex items-center justify-center relative">
            <span className="text-[10px] text-gray-300 font-mono rotate-90 uppercase tracking-[0.2em] opacity-40">
              Spread Right
            </span>
          </div>

          {/* センターの溝 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </motion.div>
      </div>

      {/* モード表示 */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] text-white/20 font-mono tracking-widest">
        {isZoomed ? "DETAIL VIEW" : "PANORAMA VIEW"}
      </div>
    </main>
  )
}
