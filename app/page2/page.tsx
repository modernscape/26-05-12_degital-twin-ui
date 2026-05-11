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

      // 基本挙動
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,

      // UI非表示設定
      close: false,
      zoom: false,
      counter: false,
      arrowPrev: false,
      arrowNext: false,
      bgOpacity: 1,
    })

    // カスタムHTMLの描画
    lightboxRef.current.on("contentLoad", (e) => {
      const { content } = e
      if (content.type === "html") {
        const wrapper = document.createElement("div")
        wrapper.style.cssText =
          "width:100%; height:100%; display:flex; background:#ffffff;" // 真っ白な板

        wrapper.innerHTML = `
          <div style="flex:1; border-right:4px solid #333; display:flex; align-items:center; justify-content:center;">
            <h1 style="color:#000; font-size:64px; font-family:sans-serif;">LEFT</h1>
          </div>
          <div style="flex:1; display:flex; align-items:center; justify-content:center;">
            <h1 style="color:#000; font-size:64px; font-family:sans-serif;">RIGHT</h1>
          </div>
        `
        content.element = wrapper
      }
    })

    lightboxRef.current.init()
    return () => lightboxRef.current?.destroy()
  }, [])

  return (
    <main className="fixed inset-0 bg-[#333] flex items-center justify-center p-10">
      <style jsx global>{`
        /* PhotoSwipeのUI要素を徹底排除 */
        .pswp__button,
        .pswp__counter,
        .pswp__preloader {
          display: none !important;
        }
        .pswp__bg {
          background: #111 !important;
        }
      `}</style>

      <div id="nuboard-gallery">
        <button
          className="pswp-trigger px-20 py-10 bg-white text-black font-black text-2xl rounded-2xl shadow-2xl"
          data-pswp-type="html"
          data-pswp-width="1800"
          data-pswp-height="950"
        >
          START VIEW
        </button>
      </div>
    </main>
  )
}
