"use client"

import { useEffect, useRef, useState } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

function NuboardRow({
  label,
  lightbox,
}: {
  label: string
  lightbox: React.MutableRefObject<PhotoSwipeLightbox | null>
}) {
  const [leftImg, setLeftImg] = useState("/img/left.jpg")
  const [rightImg, setRightImg] = useState("/img/right.jpg")
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

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

  // 長押し開始
  const startPress = (side: "left" | "right") => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      if (side === "left") leftInputRef.current?.click()
      else rightInputRef.current?.click()
    }, 600)
  }

  // 指が離れた時：長押しでなければタップ（閲覧）とみなす
  const endPress = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!isLongPress.current) {
      // PhotoSwipeを特定のインデックス（左=0, 右=1など）で起動
      // ここでは gallery 全体から見たインデックスが必要なため、
      // 簡易的に lightbox のインスタンスから起動させます
      lightbox.current?.loadAndOpen(index)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-md select-none nuboard-group">
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
        <a
          href={leftImg}
          data-pswp-width="900"
          data-pswp-height="1200"
          // 【重要】iOSのシステムメニューを徹底的に排除
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform touch-none"
          style={{ WebkitTouchCallout: "none" }}
          onClick={(e) => e.preventDefault()}
          onPointerDown={() => startPress("left")}
          onPointerUp={() => endPress(0)}
          onContextMenu={(e) => {
            e.preventDefault() // ここでシステムメニューをブロック
            return false
          }}
        >
          <img
            src={leftImg}
            alt="Left"
            className="w-full h-full object-cover pointer-events-none"
          />
        </a>

        {/* 右ページ */}
        <a
          href={rightImg}
          data-pswp-width="900"
          data-pswp-height="1200"
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:scale-[0.98] transition-transform touch-none"
          style={{ WebkitTouchCallout: "none" }}
          onClick={(e) => e.preventDefault()}
          onPointerDown={() => startPress("right")}
          onPointerUp={() => endPress(1)}
          onContextMenu={(e) => {
            e.preventDefault()
            return false
          }}
        >
          <img
            src={rightImg}
            alt="Right"
            className="w-full h-full object-cover pointer-events-none"
          />
        </a>
      </div>
    </div>
  )
}

export default function NuboardApp() {
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
        .pswp__button,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #000 !important;
        }
      `}</style>

      <NuboardRow label="Spread 01" lightbox={lightbox} />
      <NuboardRow label="Spread 02" lightbox={lightbox} />
      <NuboardRow label="Spread 03" lightbox={lightbox} />

      <div className="text-center">
        <p className="text-[10px] text-white/40 uppercase tracking-widest">
          Tap to view / Long press to edit
        </p>
      </div>
    </main>
  )
}
