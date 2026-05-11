"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

// 1行分（見開き1セット）のコンポーネント
function NuboardRow({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase pl-1">
        {label}
      </span>
      <div id={id} className="flex gap-2 w-full aspect-[16/9]">
        {/* 左ページ */}
        <a
          href="/img/left.jpg"
          data-pswp-width="900"
          data-pswp-height="1200"
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:opacity-70 transition-opacity"
        >
          <img
            src="/img/left.jpg"
            alt="Left"
            className="w-full h-full object-cover"
          />
        </a>

        {/* 右ページ */}
        <a
          href="/img/right.jpg"
          data-pswp-width="900"
          data-pswp-height="1200"
          className="flex-1 bg-white/5 rounded-sm overflow-hidden border border-white/10 active:opacity-70 transition-opacity"
        >
          <img
            src="/img/right.jpg"
            alt="Right"
            className="w-full h-full object-cover"
          />
        </a>
      </div>
    </div>
  )
}

export default function NuboardList() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    // ページ内のすべての gallery 要素を対象にする
    lightboxRef.current = new PhotoSwipeLightbox({
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

    lightboxRef.current.init()
    return () => {
      lightboxRef.current?.destroy()
      lightboxRef.current = null
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

      {/* 縦に3行並べる */}
      <div className="nuboard-group">
        <NuboardRow id="row-1" label="Spread 01" />
      </div>

      <div className="nuboard-group">
        <NuboardRow id="row-2" label="Spread 02" />
      </div>

      <div className="nuboard-group">
        <NuboardRow id="row-3" label="Spread 03" />
      </div>

      <div className="mt-8">
        <button className="text-[10px] text-white/20 border border-white/10 px-6 py-2 rounded-full uppercase tracking-widest active:bg-white active:text-black transition-colors">
          Settings
        </button>
      </div>
    </main>
  )
}
