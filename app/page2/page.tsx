"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export default function NuboardStep1() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: "#nuboard-gallery",
      children: ".pswp-trigger",
      pswpModule: () => import("photoswipe"),

      // 写真アプリの感触を定義
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2.5, // Wタップでガッツリ寄る
      maxZoomLevel: 5,

      // 不要なUIを全カット
      close: false,
      zoom: false,
      counter: false,
      arrowPrev: false,
      arrowNext: false,
      preloader: false,
      bgOpacity: 1,
    })

    lightboxRef.current.init()

    return () => {
      lightboxRef.current?.destroy()
      lightboxRef.current = null
    }
  }, [])

  return (
    <main className="fixed inset-0 bg-[#111] flex items-center justify-center">
      {/* 邪魔なUI（Xボタン等）を消すおまじない */}
      <style jsx global>{`
        .pswp__button,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #000 !important;
        }
      `}</style>

      <div id="nuboard-gallery">
        <a
          href="https://placehold.jp/24/ffffff/000000/1800x950.png?text=NUBOARD%20SPREAD%20VIEW"
          className="pswp-trigger block px-12 py-6 bg-white text-black font-bold rounded-xl shadow-2xl active:scale-95 transition-transform"
          data-pswp-width="1800"
          data-pswp-height="950"
        >
          ヌーボードを起動
        </a>
      </div>
    </main>
  )
}
