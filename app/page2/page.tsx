"use client"

import { useEffect, useRef, useState } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

// 1行分（見開き1セット）のコンポーネント
function NuboardRow({ label }: { label: string }) {
  const [leftImg, setLeftImg] = useState("/img/left.jpg")
  const [rightImg, setRightImg] = useState("/img/right.jpg")
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  // フォトピッカーで画像が選ばれた時の処理
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

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase pl-1">
        {label}
      </span>

      {/* 隠しインプット */}
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
        {/* 左ページ：長押し or クリックで画像選択 */}
        <div
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform"
          onClick={() => leftInputRef.current?.click()}
          onContextMenu={(e) => {
            e.preventDefault()
            leftInputRef.current?.click()
          }} // 右クリック/長押し対応
        >
          <img
            src={leftImg}
            alt="Left"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* 右ページ */}
        <div
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform"
          onClick={() => rightInputRef.current?.click()}
          onContextMenu={(e) => {
            e.preventDefault()
            rightInputRef.current?.click()
          }}
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

      <p className="text-[10px] text-white/20 uppercase tracking-widest">
        Tap a page to change image
      </p>
    </main>
  )
}
