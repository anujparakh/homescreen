import { useState, useEffect } from 'preact/hooks'
import type { ImageData } from '@/types/background'
import { useSettings } from '@/hooks/useSettings'

const FADE_OUT_DELAY = 10000

type AttributionProps = {
  image: ImageData
}

export function Attribution({ image }: AttributionProps) {
  const [isVisible, setIsVisible] = useState(true)
  const settings = useSettings().settings

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

  const locationClass =
    settings.clock.alignment === 'bottom-right'
      ? 'bottom-3 left-3 sm:bottom-4 sm:left-4'
      : 'bottom-3 right-3 sm:bottom-4 sm:right-4'

  return (
    <div
      class={`fixed ${locationClass} text-white/60 text-xs sm:text-sm transition-opacity duration-1000 hover:opacity-100 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {image.photographer && <div>Photo by {image.photographer}</div>}
      {image.location && (
        <div class="text-[10px] sm:text-xs text-white/40">{image.location}</div>
      )}
      <div class="text-[10px] sm:text-xs text-white/30 mt-1">{image.attribution}</div>
    </div>
  )
}
