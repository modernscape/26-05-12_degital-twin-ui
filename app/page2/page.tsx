"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export default function NuboardStep2() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: "#nuboard-gallery",
      children: "a", // リンク要素をスライドとして認識
      pswpModule: () => import("photoswipe"),

      // 写真アプリの感触
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,

      // UI排除
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
    <main className="fixed inset-0 bg-[#111] flex items-center justify-center p-10">
      <style jsx global>{`
        .pswp__button,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #000 !important;
        }
      `}</style>

      {/* サムネイル形式の安定版 */}
      <div id="nuboard-gallery" className="flex gap-4">
        {/* 左ページ */}
        <a
          href="/img/left.jpg"
          data-pswp-width="900"
          data-pswp-height="1200"
          className="block w-32 h-48 bg-white/10 rounded overflow-hidden border border-white/20"
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
          className="block w-32 h-48 bg-white/10 rounded overflow-hidden border border-white/20"
        >
          <img
            src="/img/right.jpg"
            alt="Right"
            className="w-full h-full object-cover"
          />
        </a>
      </div>

      <p className="fixed bottom-10 text-white/30 text-[10px] tracking-widest uppercase">
        Tap a page to enter spread view
      </p>
    </main>
  )
}
