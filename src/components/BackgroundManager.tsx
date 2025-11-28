import type { BackgroundSettings } from '@/types/settings'
import type { ImageData } from '@/types/background'
import { Attribution } from './Attribution'
import { LoadingSpinner } from './LoadingSpinner'

type BackgroundManagerProps = {
  settings: BackgroundSettings
  currentImage: ImageData | null
  nextImage: ImageData | null
  isTransitioning: boolean
  isPreloading: boolean
}

export function BackgroundManager({
  settings,
  currentImage,
  nextImage,
  isTransitioning,
  isPreloading,
}: BackgroundManagerProps) {

  if (!settings.enabled) {
    return (
      <div class="fixed inset-0 bg-gray-900 -z-10" aria-hidden="true" />
    )
  }

  // Show loading spinner when initially loading the first image
  const showLoadingSpinner = !currentImage && isPreloading

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

      {showLoadingSpinner && (
        <div class="fixed inset-0 flex items-center justify-center z-10">
          <LoadingSpinner />
        </div>
      )}

      {settings.showAttribution && currentImage && (
        <Attribution image={currentImage} />
      )}
    </>
  )
}
