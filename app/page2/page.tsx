"use client"

import { motion, useAnimation } from "framer-motion"
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

  // iPhone Airの比率を定義 (縦19.5 : 横9)
  // 見開きなので 横は 9 * 2 = 18 になる
  const ASPECT_RATIO = 18 / 19.5
  const SCALE_FACTOR = 2.15 // 1ページが画面にフィットする倍率

  const updateConstraints = (zoomed: boolean) => {
    if (!zoomed || !containerRef.current || !boardRef.current) {
      setConstraints({ left: 0, right: 0, top: 0, bottom: 0 })
      return
    }

    const container = containerRef.current.getBoundingClientRect()
    // 拡大後のボードサイズを計算
    const zoomedWidth = container.width * 0.95 * SCALE_FACTOR
    const zoomedHeight =
      ((container.width * 0.95) / ASPECT_RATIO) * SCALE_FACTOR

    const overlapX = Math.max(0, (zoomedWidth - container.width) / 2)
    const overlapY = Math.max(0, (zoomedHeight - container.height) / 2)

    setConstraints({
      left: -overlapX,
      right: overlapX,
      top: -overlapY,
      bottom: overlapY,
    })
  }

  const handleDoubleTap = () => {
    if (isZoomed) {
      controls.start({ scale: 1, x: 0, y: 0 })
      setIsZoomed(false)
    } else {
      controls.start({ scale: SCALE_FACTOR })
      setIsZoomed(true)
    }
  }

  useEffect(() => {
    updateConstraints(isZoomed)
  }, [isZoomed])

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
          dragElastic={0.15}
          dragMomentum={true}
          animate={controls}
          initial={{ scale: 1 }}
          style={{ aspectRatio: ASPECT_RATIO }}
          className="relative w-[95vw] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex overflow-hidden origin-center"
        >
          {/* 左ページ：iPhone Air 1台分の比率 */}
          <div className="flex-1 h-full border-r border-gray-200 bg-[#fdfdfd] flex items-center justify-center relative">
            <span className="text-[8px] text-gray-300 font-mono rotate-90 opacity-50">
              IPHONE AIR ASPECT (L)
            </span>
          </div>

          {/* 右ページ：iPhone Air 1台分の比率 */}
          <div className="flex-1 h-full bg-[#fdfdfd] flex items-center justify-center relative">
            <span className="text-[8px] text-gray-300 font-mono rotate-90 opacity-50">
              IPHONE AIR ASPECT (R)
            </span>
          </div>

          {/* センターの溝（物理的な質感を少しだけ） */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
        </motion.div>
      </div>

      {/* 下部のインジケーター（現在の位置確認用） */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 opacity-20">
        <div
          className={`w-1.5 h-1.5 rounded-full bg-white ${!isZoomed ? "opacity-100" : "opacity-30"}`}
        />
        <div
          className={`w-1.5 h-1.5 rounded-full bg-white ${isZoomed ? "opacity-100" : "opacity-30"}`}
        />
      </div>
    </main>
  )
}
