"use client"

import { useEffect, useRef, useState } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

function NuboardRow({ label, lightbox }: { label: string; lightbox: any }) {
  const [leftImg, setLeftImg] = useState("/img/left.jpg")
  const [rightImg, setRightImg] = useState("/img/right.jpg")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isLongPress = useRef(false)

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

  const startPress = (side: "left" | "right") => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      // 物理的なクリックイベントを発火させる
      const input = document.getElementById(
        `${label}-${side}-input`,
      ) as HTMLInputElement
      input?.click()
    }, 500) // 0.5秒に少し短縮
  }

  const endPress = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // 長押しが確定していなければPhotoSwipeを開く
    if (!isLongPress.current) {
      lightbox.current?.loadAndOpen(index)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-md select-none nuboard-group">
      <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase pl-1">
        {label}
      </span>

      <div className="flex gap-2 w-full aspect-[16/9]">
        {/* 左ページ */}
        <div className="relative flex-1">
          <input
            type="file"
            accept="image/*"
            id={`${label}-left-input`}
            className="hidden"
            onChange={(e) => handleFileChange(e, "left")}
          />
          <a
            href={leftImg}
            data-pswp-width="900"
            data-pswp-height="1200"
            className="block w-full h-full bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform touch-none"
            style={{ WebkitTouchCallout: "none" }}
            onClick={(e) => e.preventDefault()}
            onPointerDown={() => startPress("left")}
            onPointerUp={() => endPress(0)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={leftImg}
              alt="Left"
              className="w-full h-full object-cover pointer-events-none"
            />
          </a>
        </div>

        {/* 右ページ */}
        <div className="relative flex-1">
          <input
            type="file"
            accept="image/*"
            id={`${label}-right-input`}
            className="hidden"
            onChange={(e) => handleFileChange(e, "right")}
          />
          <a
            href={rightImg}
            data-pswp-width="900"
            data-pswp-height="1200"
            className="block w-full h-full bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform touch-none"
            style={{ WebkitTouchCallout: "none" }}
            onClick={(e) => e.preventDefault()}
            onPointerDown={() => startPress("right")}
            onPointerUp={() => endPress(1)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={rightImg}
              alt="Right"
              className="w-full h-full object-cover pointer-events-none"
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default NuboardRow // これが必要
