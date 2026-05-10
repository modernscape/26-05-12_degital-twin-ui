"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function DigitalTwinPage() {
  const [windowWidth, setWindowWidth] = useState(0)

  // 画面幅の取得
  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // スワイプの位置を管理 (x: 0 が左ページ, x: windowWidth が右ページ)
  const x = useMotionValue(0)

  // ドラッグ量に応じて透明度を 0.6(重なり) から 1.0(全表示) に変化させる
  // 画面の半分以上引き出したら不透明度を上げる設定
  const opacity = useTransform(
    x,
    [0, windowWidth * 0.5, windowWidth],
    [0.6, 0.8, 1.0],
  )

  return (
    <main className="fixed inset-0 bg-black overflow-hidden touch-none">
      {/* --- 底レイヤー (左ページ: 目標など) --- */}
      <div className="absolute inset-0 w-full h-full bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-gray-400">Left Page (Base)</div>
        {/* <img src="/left-image.jpg" className="w-full h-full object-cover" /> */}
      </div>

      {/* --- 上レイヤー (右ページ: タスクなど) --- */}
      {/* 
          drag: "x" で横方向のみ
          dragConstraints: 画面の右端から左端までの移動制限
      */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: windowWidth }}
        style={{ x, opacity }}
        className="absolute inset-0 w-full h-full bg-[#F9FAFB] shadow-2xl border-l border-gray-200 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="text-gray-400">Right Page (Overlay)</div>
        {/* <img src="/right-image.jpg" className="w-full h-full object-cover" /> */}

        {/* 綴じ目のインダストリアルな装飾（チラ見せ用） */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-gray-300 to-transparent opacity-50" />
      </motion.div>

      {/* ガイド（操作用） */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-30 text-xs">
        ← Swipe to Overlay →
      </div>
    </main>
  )
}
