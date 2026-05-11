"use client"

import { motion, useAnimation } from "framer-motion"
import { useState } from "react"

export default function PanoramaZoomPage() {
  const [zoomState, setZoomState] = useState<"out" | "left" | "right">("out")
  const controls = useAnimation()

  const handleDoubleTap = (e: React.MouseEvent) => {
    // タップ位置が画面の左半分か右半分かを判定
    const isClickOnLeft = e.clientX < window.innerWidth / 2

    if (zoomState !== "out") {
      // ズーム中なら元に戻す
      controls.start({
        scale: 1,
        x: 0,
        transition: { type: "spring", bounce: 0, duration: 0.4 },
      })
      setZoomState("out")
    } else {
      // 未ズームなら、タップした側に寄って拡大
      const xOffset = isClickOnLeft ? "25%" : "-25%"
      controls.start({
        scale: 2,
        x: xOffset,
        transition: { type: "spring", bounce: 0, duration: 0.4 },
      })
      setZoomState(isClickOnLeft ? "left" : "right")
    }
  }

  return (
    <main
      className="fixed inset-0 bg-black overflow-hidden touch-none"
      onDoubleClick={handleDoubleTap}
    >
      <motion.div
        animate={controls}
        initial={{ scale: 1 }}
        className="w-[200vw] h-full flex"
      >
        {/* 左セクション */}
        <div className="w-screen h-full bg-[#F9FAFB] border-r border-gray-300 flex items-center justify-center relative">
          <span className="text-gray-300 font-mono tracking-widest">
            LEFT (GOAL)
          </span>
          {/* 中央の綴じ目（影） */}
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-gray-200/50 to-transparent" />
        </div>

        {/* 右セクション */}
        <div className="w-screen h-full bg-[#F9FAFB] flex items-center justify-center relative">
          <span className="text-gray-300 font-mono tracking-widest">
            RIGHT (TASK)
          </span>
          {/* 中央の綴じ目（影） */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-gray-200/50 to-transparent" />
        </div>
      </motion.div>

      {/* ナビゲーションガイド */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-[10px] text-white/50 uppercase tracking-tighter">
        Double Tap to Zoom {zoomState !== "out" ? "Out" : "In"}
      </div>
    </main>
  )
}
