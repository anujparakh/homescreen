import type { BackgroundSettings } from '@/types/settings'
import type { ImageData } from '@/types/background'
import { Attribution } from './Attribution'
import { LoadingSpinner } from './LoadingSpinner'

type BackgroundManagerProps = {
  settings: BackgroundSettings
  currentImage: ImageData | null
  isPreloading: boolean
}

export function BackgroundManager({
  settings,
  currentImage,
  isPreloading,
}: BackgroundManagerProps) {
  if (!settings.enabled) {
    return <div class="fixed inset-0 bg-gray-900 -z-10" aria-hidden="true" />
  }

  return (
    <>
      {/* Background image or video with panning animation */}
      <div
        class="fixed inset-0 overflow-hidden -z-10"
        aria-hidden="true"
        style={{ perspective: '1000px' }}
      >
        {currentImage?.isVideo ? (
          <video
            class="absolute w-full h-full object-cover"
            src={currentImage.url}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            class="absolute w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: currentImage
                ? `url(${currentImage.url})`
                : 'none',
              backgroundColor: currentImage ? 'transparent' : '#111827',
              animation:
                currentImage && settings.enableAnimation
                  ? 'slow-pan 90s linear infinite'
                  : 'none',
              transformStyle: 'preserve-3d',
            }}
          />
        )}
      </div>

      {/* Show loading spinner when loading backgrounds */}
      {isPreloading && (
        <div class="fixed inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}

      {settings.showAttribution && currentImage && (
        <Attribution image={currentImage} />
      )}
    </>
  )
}
