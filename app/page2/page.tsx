"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export default function NuboardViewer() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    // 1. ライトボックスの初期化
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: "#nuboard-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),

      // 写真アプリのような挙動にするためのチューニング
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2.5, // ダブルタップ時の吸い付き倍率
      maxZoomLevel: 5,

      // 余計なUIを削ぎ落として「道具」感を出す
      zoom: true,
      close: false,
      counter: false,
      arrowPrev: false,
      arrowNext: false,

      // iPhone Airの120Hzを活かす背景色
      bgOpacity: 1,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    })

    lightboxRef.current.init()

    // 2. ページを開いた瞬間に自動起動
    const timer = setTimeout(() => {
      const trigger = document.querySelector("#nuboard-trigger") as HTMLElement
      trigger?.click()
    }, 50)

    return () => {
      lightboxRef.current?.destroy()
      lightboxRef.current = null
      clearTimeout(timer)
    }
  }, [])

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* 
        PhotoSwipeのトリガーとなる隠し要素
        data-pswp-width/height は iPhone Air 2台分の比率 (1800x1950等) に設定 
      */}
      <div id="nuboard-gallery" className="hidden">
        <a
          id="nuboard-trigger"
          href="https://images.unsplash.com/photo-1615412704911-55d5993f496d?auto=format&fit=crop&q=80&w=2000" // ここを撮影した画像に差し替える
          data-pswp-width="1800"
          data-pswp-height="1950"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/placeholder.png" alt="Nuboard Spread" />
        </a>
      </div>

      {/* ローディング中の表示 */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white/80 rounded-full animate-spin" />
        <span className="text-white/40 font-mono text-[10px] tracking-[0.2em]">
          INITIALIZING CANVAS
        </span>
      </div>

      {/* PhotoSwipeの上に重なるカスタムUI（ここにカメラボタンなどを配置） */}
      <div className="fixed bottom-10 left-0 right-0 z-[10000] flex justify-center pointer-events-none">
        <button
          className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-xl pointer-events-auto active:scale-95 transition-transform"
          onClick={() => console.log("Camera trigger")}
        >
          <div className="w-10 h-10 m-auto rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
        </button>
      </div>
    </main>
  )
}
