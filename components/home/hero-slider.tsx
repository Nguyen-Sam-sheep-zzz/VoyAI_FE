"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    title: "Hạ Long Bay",
    subtitle: "Kỳ quan thiên nhiên",
    image: "/images/halong-bay-limestone-karst-vietnam-scenic.jpg",
  },
  {
    id: 2,
    title: "Phố cổ Hội An",
    subtitle: "Phố cổ kỳ bí",
    image: "/images/hoi-an-ancient-town-lantern-vietnam-historic.jpg",
  },
  {
    id: 3,
    title: "Sa Pa",
    subtitle: "Vùng đất mây mù",
    image: "/images/sapa-mountains-terraced-rice-vietnam-scenic.jpg",
  },
  {
    id: 4,
    title: "Sông Mekong",
    subtitle: "Sông nước hữu tình",
    image: "/images/mekong-delta-floating-market-vietnam-waterway.jpg",
  },
  {
    id: 5,
    title: "Bãi biển Đà Nẵng",
    subtitle: "Bãi biển thanh bình",
    image: "/images/danang-beach-golden-sand-vietnam-tropical.jpg",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-amber-0/60 to-amber-500/60 px-4">
        <div className="text-center text-white max-w-3xl">
          <div className="inline-block mb-6 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold">✈️ Khám Phá Việt Nam</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{slides[currentSlide].title}</h1>

          <p className="text-xl md:text-2xl text-amber-50 mb-8">{slides[currentSlide].subtitle}</p>

          <p className="text-lg md:text-xl text-amber-50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bắt đầu cuộc phiêu lưu du lịch của bạn. Lên kế hoạch cho chuyến đi hoàn hảo với AI.
          </p>

          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">🗺️</span>
              <span className="text-sm font-medium">Khám phá Việt Nam</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-medium">5000+ Kế Hoạch</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8 h-2 rounded-full"
                : "bg-white/50 w-2 h-2 rounded-full hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        ❮
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        ❯
      </button>
    </section>
  )
}
