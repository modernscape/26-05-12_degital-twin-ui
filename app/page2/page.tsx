"use client"

import { useState, useRef } from "react"

export default function SimpleZoomPage() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const SCALE_FACTOR = 2.5
  const DURATION = "1.0s" // ここをいじるだけで確実に「じわ〜っ」とします

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (isZoomed) {
      setOffset({ x: 0, y: 0 })
      setIsZoomed(false)
    } else {
      const rect = containerRef.current!.getBoundingClientRect()
      // タップした位置へ引き寄せる計算
      const x = (e.clientX - rect.left - rect.width / 2) * -1.5
      const y = (e.clientY - rect.top - rect.height / 2) * -1.5
      setOffset({ x, y })
      setIsZoomed(true)
    }
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
        {/* 
          CSSの transition を使って、scale と transform を直接制御。
          cubic-bezier(0.2, 0, 0, 1) は iOS のズーム感に非常に近い設定です。
        */}
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${isZoomed ? SCALE_FACTOR : 1})`,
            transition: `transform ${DURATION} cubic-bezier(0.2, 0, 0, 1)`,
            aspectRatio: "18 / 19.5",
          }}
          className="relative w-[95vw] bg-white shadow-2xl flex overflow-hidden origin-center will-change-transform"
        >
          {/* 左ページ */}
          <div className="flex-1 h-full border-r border-gray-100 bg-[#fafafa] flex items-center justify-center">
            <span className="text-[10px] text-gray-300 font-mono rotate-90">
              LEFT
            </span>
          </div>
          {/* 右ページ */}
          <div className="flex-1 h-full bg-[#fafafa] flex items-center justify-center">
            <span className="text-[10px] text-gray-300 font-mono rotate-90">
              RIGHT
            </span>
          </div>
          {/* 中央の溝 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
