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

      // 物理演算の設定
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

    // 左右2枚を並べる「カスタムコンテンツ」の定義
    lightboxRef.current.on("contentLoad", (e) => {
      const { content } = e
      if (content.type === "html") {
        const container = document.createElement("div")
        container.style.cssText =
          "width:100%; height:100%; display:flex; background:#000;"

        // 2枚の画像を50%ずつ配置（SwiftのUIStackViewのような構造）
        container.innerHTML = `
          <div style="flex: 1; height: 100%; overflow: hidden;">
            <img src="/img/left.jpg" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div style="flex: 1; height: 100%; overflow: hidden; border-left: 1px solid #222;">
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
    <main className="fixed inset-0 bg-[#111] flex items-center justify-center">
      <style jsx global>{`
        .pswp__button,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #000 !important;
        }
        /* 余計なスクロールを抑制 */
        .pswp__html-container {
          overflow: hidden !important;
        }
      `}</style>

      <div id="nuboard-gallery">
        <button
          className="pswp-trigger px-12 py-6 bg-white text-black font-bold rounded-xl shadow-2xl active:scale-95 transition-transform"
          data-pswp-type="html"
          // 重要：2枚合わせたサイズ（例：縦長900x1200が2枚なら1800x1200）
          data-pswp-width="1800"
          data-pswp-height="1200"
        >
          見開きをチェック
        </button>
      </div>
    </main>
  )
}
