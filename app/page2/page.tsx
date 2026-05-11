"use client"

import { motion, useAnimation } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function PerfectBoard() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const SCALE_FACTOR = 2.5

  // 1. ダブルタップ：ここが「じわっと」動く肝です
  const handleDoubleTap = (e: React.MouseEvent) => {
    const nextZoomed = !isZoomed
    setIsZoomed(nextZoomed)

    let x = 0
    let y = 0

    if (nextZoomed) {
      const rect = containerRef.current!.getBoundingClientRect()
      x = (e.clientX - rect.left - rect.width / 2) * -1.5
      y = (e.clientY - rect.top - rect.height / 2) * -1.5
      setScale(SCALE_FACTOR)
    } else {
      setScale(1)
    }

    // transitionを「spring」ではなく「tween」にし、durationを長く設定
    controls.start({
      x,
      y,
      scale: nextZoomed ? SCALE_FACTOR : 1,
      transition: {
        type: "tween",
        duration: 1.2, // ここを1.8にすれば、さらに超スローになります
        ease: [0.22, 1, 0.36, 1], // iOSのズームに近い、心地よい減速感
      },
    })
  }

  // 2. ピンチズーム（標準のブラウザ操作を活かすための設定）
  // ※より厳密な自前ピンチが必要な場合は、前述のTouchイベントを再度組み込みますが
  // まずはドラッグとズームの干渉を防ぐ構成にしています。

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
          animate={controls}
          drag={isZoomed} // 拡大時のみドラッグ可能
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={true}
          style={{
            aspectRatio: "18 / 19.5",
          }}
          className="relative w-[95vw] bg-white shadow-2xl flex overflow-hidden origin-center will-change-transform cursor-grab active:cursor-grabbing"
        >
          {/* 左ページ */}
          <div className="flex-1 h-full border-r border-gray-100 bg-[#fafafa] flex items-center justify-center pointer-events-none">
            <span className="text-[10px] text-gray-300 font-mono rotate-90">
              LEFT PAGE
            </span>
          </div>

          {/* 右ページ */}
          <div className="flex-1 h-full bg-[#fafafa] flex items-center justify-center pointer-events-none">
            <span className="text-[10px] text-gray-300 font-mono rotate-90">
              RIGHT PAGE
            </span>
          </div>

          {/* センターの溝 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </motion.div>
      </div>

      {/* 撮影ボタン（仮） */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <button className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md active:scale-90 transition-transform" />
      </div>
    </main>
  )
}
