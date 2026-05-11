"use client"

import { motion, useAnimation } from "framer-motion"
import { useState, useRef } from "react"

export default function PhotoAppStylePage() {
  const [isZoomed, setIsZoomed] = useState(false)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // ダブルタップで「等倍」と「2倍」を切り替える
  const handleDoubleTap = (e: React.MouseEvent) => {
    if (isZoomed) {
      // 縮小（全体表示）
      controls.start({
        scale: 1,
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 250, damping: 30 },
      })
      setIsZoomed(false)
    } else {
      // 拡大（タップした付近へ寄る）
      // ※簡易的に中央付近へ拡大。SwiftのScrollViewのようにタップ座標へ寄せることも可能
      controls.start({
        scale: 2.5,
        transition: { type: "spring", stiffness: 250, damping: 30 },
      })
      setIsZoomed(true)
    }
  }

  return (
    <main className="fixed inset-0 bg-[#111] overflow-hidden touch-none">
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        {/* 
          一枚の長い「見開き」ボード
          - drag: 拡大時のみ全方向にドラッグ可能にする
          - dragConstraints: 画面外へ消え去らないように制限（数値は画像サイズに合わせて要調整）
        */}
        <motion.div
          drag={isZoomed ? true : false}
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={true} // SwiftのScrollViewのような慣性を有効化
          animate={controls}
          initial={{ scale: 1 }}
          className="relative w-[90vw] aspect-[2/1] bg-white shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* 左半分 */}
          <div className="flex-1 h-full border-r border-gray-100 flex items-center justify-center text-gray-300 font-mono text-xs">
            LEFT SPREAD
          </div>
          {/* 右半分 */}
          <div className="flex-1 h-full flex items-center justify-center text-gray-300 font-mono text-xs">
            RIGHT SPREAD
          </div>

          {/* センターの綴じ目（Macのプレビューっぽく薄く入れる） */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </motion.div>
      </div>

      {/* ステータス表示 */}
      <div className="absolute bottom-6 left-6 text-[10px] text-white/30 font-mono uppercase tracking-widest">
        {isZoomed ? "Zoomed View" : "Full Canvas"}
      </div>
    </main>
  )
}
