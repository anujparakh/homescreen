import { useState, useEffect } from 'preact/hooks'
import type { ImageData } from '@/types/background'
import { fetchChromecastImage } from '@/services/chromecastService'
import { LoadingSpinner } from './LoadingSpinner'

export function RandomImage() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  console.log(imageData)
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const imageData = await fetchChromecastImage()
        setImageData(imageData)
        setLoading(false)
      } catch (err) {
        setError('Failed to load image')
        setLoading(false)
      }
    }

    fetchImageData()
  }, [])

  if (loading) {
    return (
      <div class="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !imageData) {
    return (
      <div class="min-h-screen bg-gray-900 flex items-center justify-center">
        <div class="text-red-400 text-xl">
          {error || 'Failed to load image'}
        </div>
      </div>
    )
  }

  return (
    <div class="relative min-h-screen w-full overflow-hidden bg-black">
      <img
        src={imageData.url}
        alt="Random background image"
        class="absolute inset-0 w-full h-full object-cover"
      />

      {/* Attribution overlay */}
      {(imageData.photographer || imageData.location) && (
        <div class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          <div class="text-sm">
            {imageData.photographer && (
              <div>Photo by {imageData.photographer}</div>
            )}
            {imageData.location && (
              <div class="text-xs text-gray-300 mt-1">{imageData.location}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
