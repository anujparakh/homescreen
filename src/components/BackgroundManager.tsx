import type { BackgroundSettings } from '@/types/settings'
import type { ImageData } from '@/types/background'
import { Attribution } from './Attribution'

type BackgroundManagerProps = {
  settings: BackgroundSettings
  currentImage: ImageData | null
  nextImage: ImageData | null
  isTransitioning: boolean
}

export function BackgroundManager({
  settings,
  currentImage,
  nextImage,
  isTransitioning,
}: BackgroundManagerProps) {

  if (!settings.enabled) {
    return (
      <div class="fixed inset-0 bg-gray-900 -z-10" aria-hidden="true" />
    )
  }

  return (
    <>
      <div
        class="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out -z-10"
        style={{
          backgroundImage: currentImage ? `url(${currentImage.url})` : 'none',
          backgroundColor: currentImage ? 'transparent' : '#111827',
          opacity: 1,
        }}
        aria-hidden="true"
      />

      <div
        class="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out -z-10"
        style={{
          backgroundImage: nextImage ? `url(${nextImage.url})` : 'none',
          opacity: isTransitioning && nextImage ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {settings.showAttribution && currentImage && (
        <Attribution image={currentImage} />
      )}
    </>
  )
}
