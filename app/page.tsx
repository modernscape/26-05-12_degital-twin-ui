"use client"

import { useEffect, useRef, useState } from "react"
// ... (PhotoSwipeのインポートはそのまま)

function NuboardRow({ label, lightbox }: { label: string; lightbox: any }) {
  const [leftImg, setLeftImg] = useState("/img/left.jpg")
  const [rightImg, setRightImg] = useState("/img/right.jpg")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pressStartTime = useRef<number>(0)
  const isLongPressThresholdMet = useRef(false)

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

  const startPress = () => {
    pressStartTime.current = Date.now()
    isLongPressThresholdMet.current = false

    // 視覚的なフィードバック（長押し中であることを示す）
    timerRef.current = setTimeout(() => {
      isLongPressThresholdMet.current = true
      // ここで少しバイブレーションをさせると「道具感」が出ます
      if (navigator.vibrate) navigator.vibrate(10)
    }, 500)
  }

  const endPress = (side: "left" | "right", index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const duration = Date.now() - pressStartTime.current

    if (duration >= 500 || isLongPressThresholdMet.current) {
      // 【重要】長押し確定後に指を離した「この瞬間」にクリック
      const input = document.getElementById(
        `${label}-${side}-input`,
      ) as HTMLInputElement
      input?.click()
    } else {
      // 短いタップならPhotoSwipeを開く
      lightbox.current?.loadAndOpen(index)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-md select-none nuboard-group">
      <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase pl-1">
        {label}
      </span>
      <div className="flex gap-2 w-full aspect-[16/9]">
        {["left", "right"].map((side, i) => (
          <div key={side} className="relative flex-1">
            <input
              type="file"
              accept="image/*"
              id={`${label}-${side}-input`}
              className="hidden"
              onChange={(e) => handleFileChange(e, side as "left" | "right")}
            />
            <a
              href={side === "left" ? leftImg : rightImg}
              data-pswp-width="900"
              data-pswp-height="1200"
              className="block w-full h-full bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-95 active:opacity-60 transition-all touch-none"
              style={{ WebkitTouchCallout: "none" }}
              onClick={(e) => e.preventDefault()}
              onPointerDown={startPress}
              onPointerUp={() => endPress(side as "left" | "right", i)}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={side === "left" ? leftImg : rightImg}
                className="w-full h-full object-cover pointer-events-none"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NuboardRow // これが必要
