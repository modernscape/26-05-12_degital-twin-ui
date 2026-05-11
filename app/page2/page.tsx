"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export default function NuboardStep2() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: "#nuboard-gallery",
      children: ".pswp-trigger",
      pswpModule: () => import("photoswipe"),

      // 挙動の設定
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

      // 1枚の板として扱うための必須設定
      allowPanToNext: false, // 次のスライドへ「ページング」させない
      wheelToZoom: true,
    })

    // 2枚を横並びにした「1枚のスライド」を作成
    lightboxRef.current.on("contentLoad", (e) => {
      const { content } = e
      if (content.type === "html") {
        const container = document.createElement("div")
        // ここで2枚をガッチャンコ
        container.style.cssText =
          "width:100%; height:100%; display:flex; background:#fff;"

        container.innerHTML = `
          <div style="flex: 1; height: 100%; overflow: hidden; border-right: 1px solid #ddd;">
            <img src="/img/left.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div style="flex: 1; height: 100%; overflow: hidden;">
            <img src="/img/right.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
        `
        content.element = container
      }
    })

    lightboxRef.current.init()
    return () => lightboxRef.current?.destroy()
  }, [])

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
      <style jsx global>{`
        .pswp__button,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #0a0a0a !important;
        }
        .pswp__html-container {
          overflow: hidden !important;
        }
      `}</style>

      <div id="nuboard-gallery">
        <button
          className="pswp-trigger px-12 py-6 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
          data-pswp-type="html"
          // 重要：2枚合わせた仮想的なサイズ（iPhone Air 2画面分を想定）
          data-pswp-width="1800"
          data-pswp-height="950"
        >
          ヌーボードを広げる
        </button>
      </div>
    </main>
  )
}
