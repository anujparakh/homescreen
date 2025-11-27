import { useState, useEffect } from 'preact/hooks'
import type { ImageData } from '@/types/background'

const FADE_OUT_DELAY = 5000

type AttributionProps = {
  image: ImageData
}

export function Attribution({ image }: AttributionProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, FADE_OUT_DELAY)

    return () => clearTimeout(timer)
  }, [image.url])

  if (image.source === 'sourced') {
    return null
  }

  return (
    <div
      class={`fixed bottom-4 right-4 text-white/60 text-sm transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {image.photographer && <div>Photo by {image.photographer}</div>}
      {image.location && (
        <div class="text-xs text-white/40">{image.location}</div>
      )}
      <div class="text-xs text-white/30 mt-1">{image.attribution}</div>
    </div>
  )
}
