"use client"

import { motion, useAnimation } from "framer-motion"
import { useState } from "react"

export default function ZoomableBoard() {
  const [isZoomed, setIsZoomed] = useState(false)
  const controls = useAnimation()

  // ダブルタップ時の処理
  const handleDoubleTap = () => {
    if (isZoomed) {
      // 標準サイズに戻す
      controls.start({
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      })
    } else {
      // 1.5倍〜2倍に拡大する
      controls.start({
        scale: 1.8,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      })
    }
    setIsZoomed(!isZoomed)
  }

  return (
    <main className="fixed inset-0 bg-black overflow-hidden touch-none">
      {/* 
        スクロールとズームを両立させるためのコンテナ
        isZoomed のときはスクロールを抑制（または自由移動）にする調整が可能
      */}
      <div
        className={`h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar ${isZoomed ? "overflow-hidden" : ""}`}
        onDoubleClick={handleDoubleTap}
      >
        <motion.div
          animate={controls}
          initial={{ scale: 1 }}
          className="flex h-full min-w-[200%] origin-center"
        >
          {/* 左ページ */}
          <section className="w-screen h-full flex-shrink-0 snap-start bg-[#F9FAFB] border-r border-gray-200 relative flex items-center justify-center">
            <div className="text-gray-300 font-mono">LEFT (GOAL)</div>
            <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-gray-200/30 to-transparent pointer-events-none" />
          </section>

          {/* 右ページ */}
          <section className="w-screen h-full flex-shrink-0 snap-start bg-[#F9FAFB] relative flex items-center justify-center">
            <div className="text-gray-300 font-mono">RIGHT (TASK)</div>
            <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-gray-200/30 to-transparent pointer-events-none" />
          </section>
        </motion.div>
      </div>

      {/* 操作ガイド（拡大中のみ表示） */}
      {isZoomed && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-xs backdrop-blur-md">
          Zoom Mode: Double Tap to Reset
        </div>
      )}
    </main>
  )
}
