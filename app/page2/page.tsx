"use client"

import { motion, useAnimation } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function PerfectScrollPage() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const SCALE_FACTOR = 2.5

  // 1. スクロール可能な範囲を計算する関数
  const calculateConstraints = (zoomed: boolean) => {
    if (!containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()

    if (!zoomed) {
      setConstraints({ left: 0, right: 0, top: 0, bottom: 0 })
      return
    }

    // 拡大後のサイズを計算 (95vw * SCALE_FACTOR)
    const zoomedWidth = container.width * 0.95 * SCALE_FACTOR
    const zoomedHeight = ((container.width * 0.95) / (18 / 19.5)) * SCALE_FACTOR

    // 画面からはみ出した分の「半分」が、中心からの移動可能距離
    const xRange = (zoomedWidth - container.width) / 2
    const yRange = (zoomedHeight - container.height) / 2

    setConstraints({
      left: -xRange,
      right: xRange,
      top: -yRange,
      bottom: yRange,
    })
  }

  const handleDoubleTap = (e: React.MouseEvent) => {
    const nextZoomed = !isZoomed
    setIsZoomed(nextZoomed)
    calculateConstraints(nextZoomed)

    let x = 0
    let y = 0

    if (nextZoomed) {
      const rect = containerRef.current!.getBoundingClientRect()
      // タップ位置への吸い付きを少しマイルドに調整
      x = (e.clientX - rect.left - rect.width / 2) * -1.2
      y = (e.clientY - rect.top - rect.height / 2) * -1.2
    }

    controls.start({
      x,
      y,
      scale: nextZoomed ? SCALE_FACTOR : 1,
      transition: {
        type: "tween",
        duration: 1.2, // じわっと動く
        ease: [0.22, 1, 0.36, 1],
      },
    })
  }

  // 画面サイズ変更時にも制約を再計算
  useEffect(() => {
    const handleResize = () => calculateConstraints(isZoomed)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isZoomed])

  return (
    <main
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden touch-none"
      ref={containerRef}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        <motion.div
          animate={controls}
          drag={isZoomed}
          dragConstraints={constraints} // 計算した制約を適用
          dragElastic={0.2} // 端で少しだけゴムのように伸びる（iOS感）
          dragMomentum={true}
          style={{
            aspectRatio: "18 / 19.5",
            width: "95vw",
          }}
          className="relative bg-white shadow-2xl flex overflow-hidden origin-center will-change-transform cursor-grab active:cursor-grabbing"
        >
          {/* 左ページ */}
          <div className="flex-1 h-full border-r border-gray-200 bg-[#fafafa] flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-4/5 border border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-[10px] text-gray-300 font-mono">LEFT</span>
            </div>
          </div>

          {/* 右ページ */}
          <div className="flex-1 h-full bg-[#fafafa] flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-4/5 border border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-[10px] text-gray-300 font-mono">RIGHT</span>
            </div>
          </div>

          {/* センターの溝 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white shadow-inner" />
        </motion.div>
      </div>

      {/* ガイド */}
      {!isZoomed && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[10px] tracking-[0.3em] font-light">
          DOUBLE TAP TO FOCUS
        </div>
      )}
    </main>
  )
}
