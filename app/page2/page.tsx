"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export default function DualPageView() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  // 仮の画像データ（実際にはカメラで撮ったURLを入れる）
  const leftPage =
    "https://images.unsplash.com/photo-1586075010633-2a70099d4b04?q=80&w=1000"
  const rightPage =
    "https://images.unsplash.com/photo-1586075010633-2a70099d4b04?q=80&w=1000"

  useEffect(() => {
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: "#nuboard-gallery",
      children: ".pswp-custom-item",
      pswpModule: () => import("photoswipe"),

      // ズーム・慣性の設定
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,

      // 左右2枚並びを正しく表示するためのカスタム設定
      allowPanToNext: false, // 1つの見開き内で完結させる
      wheelToZoom: true,
    })

    // カスタムコンテンツ（HTML）をレンダリングする処理
    lightboxRef.current.on("contentLoad", (e) => {
      const { content } = e
      if (content.type === "html") {
        content.element = document.createElement("div")
        content.element.className = "pswp__html-container flex"
        content.element.style.width = "100%"
        content.element.style.height = "100%"

        // SwiftのUIStackViewのように2枚並べる
        content.element.innerHTML = `
          <div style="display: flex; width: 100%; height: 100%; background: #000;">
            <img src="${leftPage}" style="width: 50%; height: 100%; object-fit: contain; border-right: 1px solid #222;" />
            <img src="${rightPage}" style="width: 50%; height: 100%; object-fit: contain;" />
          </div>
        `
      }
    })

    lightboxRef.current.init()

    return () => {
      lightboxRef.current?.destroy()
      lightboxRef.current = null
    }
  }, [])

  return (
    <main className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
      <div id="nuboard-gallery">
        {/* 
          PhotoSwipeに「これは画像じゃなくてHTMLだよ」と伝えるためのアイテム
          width/height は 2枚合わせた全体サイズ (例: 1800x1950) 
        */}
        <a
          className="pswp-custom-item"
          data-pswp-type="html"
          data-pswp-width="1800"
          data-pswp-height="975"
        >
          <div className="text-white border border-white/20 p-8 rounded-xl backdrop-blur-md">
            OPEN NUBOARD (2 PAGES)
          </div>
        </a>
      </div>
    </main>
  )
}
