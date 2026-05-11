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
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

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
    <div className="flex flex-col gap-2 w-full max-w-md select-none nuboard-group">
      <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase pl-1">
        {label}
      </span>
      <div className="flex gap-2 w-full aspect-[16/9]">
        {[
          { side: "left", img: leftImg, ref: leftInputRef, index: 0 },
          { side: "right", img: rightImg, ref: rightInputRef, index: 1 },
        ].map((item) => (
          <div key={item.side} className="relative flex-1 group">
            {/* 隠しインプット */}
            <input
              type="file"
              accept="image/*"
              ref={item.ref}
              className="hidden"
              onChange={(e) =>
                handleFileChange(e, item.side as "left" | "right")
              }
            />

            {/* メインの閲覧エリア（タップでPhotoSwipe） */}
            <a
              href={item.img}
              data-pswp-width="900"
              data-pswp-height="1200"
              className="block w-full h-full bg-white/5 rounded-sm overflow-hidden border border-white/10 active:opacity-80 transition-all"
              onClick={(e) => {
                e.preventDefault()
                lightbox.current?.loadAndOpen(item.index)
              }}
            >
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt={item.side}
              />
            </a>

            {/* 左下の差し替えボタン（タップでピッカー起動） */}
            <button
              onClick={(e) => {
                e.stopPropagation() // PhotoSwipeの起動を防ぐ
                item.ref.current?.click()
              }}
              className="absolute bottom-2 left-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-transform"
            >
              {/* シンプルなカメラアイコン風のSVG */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- メインページコンポーネント ---
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

      <div className="text-center mt-4">
        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">
          Nuboard Archives
        </p>
      </div>
    </main>
  )
}
