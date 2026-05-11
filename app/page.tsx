"use client"

import { useEffect, useRef, useState } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

// --- サブコンポーネント: 見開き1行分 ---
function NuboardRow({
  label,
  lightbox,
}: {
  label: string
  lightbox: React.MutableRefObject<PhotoSwipeLightbox | null>
}) {
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

    // 長押し中であることを視覚的にフィードバック
    timerRef.current = setTimeout(() => {
      isLongPressThresholdMet.current = true
    }, 500)
  }

  const endPress = (side: "left" | "right", index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const duration = Date.now() - pressStartTime.current

    // iOS制限対策: 「指を離した瞬間」であればピッカー起動が許可される
    if (duration >= 500 || isLongPressThresholdMet.current) {
      const input = document.getElementById(
        `${label}-${side}-input`,
      ) as HTMLInputElement
      input?.click()
    } else {
      // 短いタップならフルスクリーン表示
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
                alt={side}
                className="w-full h-full object-cover pointer-events-none"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- メインページコンポーネント (Vercelビルドエラー解決の export default) ---
export default function NuboardPage() {
  const lightbox = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    lightbox.current = new PhotoSwipeLightbox({
      gallery: ".nuboard-group",
      children: "a",
      pswpModule: () => import("photoswipe"),
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,
      close: false,
      zoom: false,
      counter: false,
      arrowPrev: false,
      arrowNext: false,
      bgOpacity: 1,
    })
    lightbox.current.init()

    return () => {
      lightbox.current?.destroy()
      lightbox.current = null
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 px-6 gap-12">
      <style jsx global>{`
        /* UIパーツを徹底排除 */
        .pswp__button,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #000 !important;
        }
      `}</style>

      <NuboardRow label="Spread-01" lightbox={lightbox} />
      <NuboardRow label="Spread-02" lightbox={lightbox} />
      <NuboardRow label="Spread-03" lightbox={lightbox} />

      <div className="text-center space-y-2 mt-4">
        <p className="text-[10px] text-white/40 uppercase tracking-widest">
          Tap to view / Long press to edit
        </p>
      </div>
    </main>
  )
}
