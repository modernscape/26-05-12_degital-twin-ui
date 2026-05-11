"use client"

import { useEffect, useRef, useState } from "react"

function NuboardRow({ label }: { label: string }) {
  const [leftImg, setLeftImg] = useState("/img/left.jpg")
  const [rightImg, setRightImg] = useState("/img/right.jpg")
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  // 長押し判定用タイマー
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right",
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (side === "left") setLeftImg(url)
      else setRightImg(url)
    }
  }

  // 長押しの処理
  const startPress = (side: "left" | "right") => {
    timerRef.current = setTimeout(() => {
      if (side === "left") leftInputRef.current?.click()
      else rightInputRef.current?.click()
    }, 600) // 0.6秒長押しでフォトピッカー
  }

  const cancelPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-md select-none">
      <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase pl-1">
        {label}
      </span>

      <input
        type="file"
        accept="image/*"
        ref={leftInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, "left")}
      />
      <input
        type="file"
        accept="image/*"
        ref={rightInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, "right")}
      />

      <div className="flex gap-2 w-full aspect-[16/9]">
        {/* 左ページ */}
        <div
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform touch-none"
          onMouseDown={() => startPress("left")}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={() => startPress("left")}
          onTouchEnd={cancelPress}
          onContextMenu={(e) => e.preventDefault()} // ブラウザのメニューを禁止
        >
          <img
            src={leftImg}
            alt="Left"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* 右ページ */}
        <div
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform touch-none"
          onMouseDown={() => startPress("right")}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={() => startPress("right")}
          onTouchEnd={cancelPress}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            src={rightImg}
            alt="Right"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      </div>
    </div>
  )
}

export default function NuboardApp() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 px-6 gap-12">
      <NuboardRow label="Spread 01" />
      <NuboardRow label="Spread 02" />
      <NuboardRow label="Spread 03" />

      <div className="text-center space-y-2">
        <p className="text-[10px] text-white/40 uppercase tracking-widest">
          Long press to change image
        </p>
        <p className="text-[10px] text-white/20 uppercase tracking-widest">
          Tap to view spread
        </p>
      </div>
    </main>
  )
}
