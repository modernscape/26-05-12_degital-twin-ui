"use client"

import { useEffect, useRef } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export default function NuboardViewer() {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: "#nuboard-gallery",
      children: ".pswp-trigger",
      pswpModule: () => import("photoswipe"),

      // 1. 写真アプリの挙動を再現
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2, // Wタップ時の倍率
      maxZoomLevel: 4,

      // 2. 余計なUIを排除（道具感を出す）
      close: false,
      zoom: false,
      counter: false,
      arrowPrev: false,
      arrowNext: false,

      // 3. iPhone Airの画面をフルに使う
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      bgOpacity: 1,
    })

    // 見開き2枚を1つの「スライド」として構築
    lightboxRef.current.on("contentLoad", (e) => {
      const { content } = e
      if (content.type === "html") {
        content.element = document.createElement("div")
        content.element.className = "w-full h-full flex bg-[#1a1a1a]"

        // 左右2枚の画像を並べる（現在はプレースホルダー）
        content.element.innerHTML = `
          <div style="display: flex; width: 100%; height: 100%; background: #000;">
            <div style="flex: 1; background: #fafafa; border-right: 1px solid #ddd; display: flex; align-items: center; justify-content: center;">
              <span style="color: #999; font-family: monospace;">LEFT</span>
            </div>
            <div style="flex: 1; background: #fafafa; display: flex; align-items: center; justify-content: center;">
              <span style="color: #999; font-family: monospace;">RIGHT</span>
            </div>
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
    <main className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
      {/* PhotoSwipeのUI要素をCSSで強制的に消去・調整 */}
      <style jsx global>{`
        .pswp__button--close,
        .pswp__button--zoom,
        .pswp__counter {
          display: none !important;
        }
        .pswp__bg {
          background: #0a0a0a !important;
        }
        /* スクロールバー非表示 */
        .pswp__html-container {
          overflow: hidden !important;
        }
      `}</style>

      <div id="nuboard-gallery">
        <button
          className="pswp-trigger px-10 py-5 bg-white/5 border border-white/10 rounded-full text-white/50 font-light tracking-[0.3em] text-xs hover:bg-white/10 transition-all active:scale-95"
          data-pswp-type="html"
          // ここが重要：2枚合わせたアスペクト比をiPhone Airに合わせる
          data-pswp-width="1800"
          data-pswp-height="975"
        >
          ENTER VIEW
        </button>
      </div>
    </main>
  )
}
