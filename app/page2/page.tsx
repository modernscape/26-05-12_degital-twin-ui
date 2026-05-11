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

  const SCALE_FACTOR = 2.5 // 拡大率

  // 拡大率に応じて、ドラッグ可能な範囲（constraints）を計算する関数
  const updateConstraints = (zoomed: boolean) => {
    if (!zoomed || !containerRef.current || !boardRef.current) {
      setConstraints({ left: 0, right: 0, top: 0, bottom: 0 })
      return
    }

    const container = containerRef.current.getBoundingClientRect()
    const board = boardRef.current.getBoundingClientRect()

    // 拡大後のサイズを計算
    const zoomedWidth = board.width * SCALE_FACTOR
    const zoomedHeight = board.height * SCALE_FACTOR

    // 画面からはみ出した分の半分が、ドラッグできる距離になる
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

  // ズーム状態が変わったら制約を再計算
  useEffect(() => {
    updateConstraints(isZoomed)
  }, [isZoomed])

  return (
    <main className="fixed inset-0 bg-[#111] overflow-hidden touch-none">
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        <motion.div
          ref={boardRef}
          drag={isZoomed}
          dragConstraints={constraints} // 動的に計算した範囲を適用
          dragElastic={0.2}
          dragMomentum={true}
          animate={controls}
          initial={{ scale: 1 }}
          className="relative w-[90vw] aspect-[2/1] bg-white shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing origin-center"
        >
          {/* 左半分 */}
          <div className="flex-1 h-full border-r border-gray-100 flex items-center justify-center text-gray-300 font-mono text-[10px]">
            LEFT SPREAD
          </div>
          {/* 右半分 */}
          <div className="flex-1 h-full flex items-center justify-center text-gray-300 font-mono text-[10px]">
            RIGHT SPREAD
          </div>

          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-100" />
        </motion.div>
      </div>
    </main>
  )
}
