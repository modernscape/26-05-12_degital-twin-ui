"use client"

import { useEffect, useRef, useState } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import Dexie, { type Table } from "dexie"

// --- DB定義 ---
interface NuboardData {
  id: string // "Spread-01-left" など
  imageBlob: Blob
}

class NuboardDatabase extends Dexie {
  photos!: Table<NuboardData>
  constructor() {
    super("NuboardDB")
    this.version(1).stores({
      photos: "id",
    })
  }
}

const db = new NuboardDatabase()

// --- サブコンポーネント ---
function NuboardRow({ label, lightbox }: { label: string; lightbox: any }) {
  const [leftImg, setLeftImg] = useState("/img/left.jpg")
  const [rightImg, setRightImg] = useState("/img/right.jpg")
  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  // 初期読み込み：DBから画像を取得
  useEffect(() => {
    const loadImages = async () => {
      const leftData = await db.photos.get(`${label}-left`)
      const rightData = await db.photos.get(`${label}-right`)
      if (leftData) setLeftImg(URL.createObjectURL(leftData.imageBlob))
      if (rightData) setRightImg(URL.createObjectURL(rightData.imageBlob))
    }
    loadImages()
  }, [label])

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right",
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      // 1. DBに保存
      await db.photos.put({
        id: `${label}-${side}`,
        imageBlob: file,
      })
      // 2. 表示を更新
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
          <div key={item.side} className="relative flex-1">
            <input
              type="file"
              accept="image/*"
              ref={item.ref}
              className="hidden"
              onChange={(e) =>
                handleFileChange(e, item.side as "left" | "right")
              }
            />
            <a
              href={item.img}
              data-pswp-width="900"
              data-pswp-height="1200"
              className="block w-full h-full bg-white/5 rounded-sm overflow-hidden border border-white/10 active:opacity-80 transition-all"
              onClick={(e) => {
                e.preventDefault()
                lightbox.current?.loadAndOpen(item.index === 0 ? 0 : 1) // 簡易化のため
              }}
            >
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt={item.side}
              />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation()
                item.ref.current?.click()
              }}
              className="absolute bottom-2 left-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-transform"
            >
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

// --- メインページ ---
export default function NuboardPage() {
  const lightbox = useRef<PhotoSwipeLightbox | null>(null)

  useEffect(() => {
    lightbox.current = new PhotoSwipeLightbox({
      gallery: ".nuboard-group",
      children: "a",
      pswpModule: () => import("photoswipe"),
      bgOpacity: 1,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    })
    lightbox.current.init()
    return () => {
      lightbox.current?.destroy()
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
    </main>
  )
}
