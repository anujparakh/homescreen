import { useState, useEffect, useCallback } from 'preact/hooks'
import type { ImageData } from '@/types/background'
import type { BackgroundSettings } from '@/types/settings'
import { fetchChromecastImage } from '@/services/chromecastService'
import { getNextSourcedImage } from '@/services/sourcedService'
import { fetchAppleVideo } from '@/services/appleService'

const PRELOAD_TIMEOUT = 30000

export function useBackgroundRotation(settings: BackgroundSettings) {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null)
  const [isPreloading, setIsPreloading] = useState(false)

  const preloadMedia = useCallback(
    (url: string, isVideo: boolean): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (isVideo) {
          const video = document.createElement('video')
          video.onloadeddata = () => resolve(url)
          video.onerror = () => reject(new Error('Failed to load video'))
          video.src = url
          video.load()

          setTimeout(() => reject(new Error('Load timeout')), PRELOAD_TIMEOUT)
        } else {
          const img = new Image()
          img.onload = () => resolve(url)
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = url

          setTimeout(() => reject(new Error('Load timeout')), PRELOAD_TIMEOUT)
        }
      })
    },
    []
  )

  const fetchNextImage = useCallback(async (): Promise<ImageData> => {
    try {
      if (settings.source === 'chromecast') {
        return await fetchChromecastImage()
      } else if (settings.source === 'apple') {
        return await fetchAppleVideo()
      } else {
        return getNextSourcedImage()
      }
    } catch (error) {
      console.error('Failed to fetch from primary source:', error)
      return getNextSourcedImage()
    }
  }, [settings.source])

  const loadNextImage = useCallback(async () => {
    if (isPreloading) return

    setIsPreloading(true)
    try {
      const imageData = await fetchNextImage()
      await preloadMedia(imageData.url, imageData.isVideo ?? false)
      setCurrentImage(imageData)
    } catch (error) {
      console.error('Failed to preload next image:', error)
      try {
        const fallbackImage = getNextSourcedImage()
        await preloadMedia(fallbackImage.url, fallbackImage.isVideo ?? false)
        setCurrentImage(fallbackImage)
      } catch (fallbackError) {
        console.error('Failed to load fallback image:', fallbackError)
      }
    } finally {
      setIsPreloading(false)
    }
  }, [fetchNextImage, preloadMedia, isPreloading])

  const skipToNext = useCallback(() => {
    loadNextImage()
  }, [loadNextImage])

  useEffect(() => {
    if (!settings.enabled) return

    if (!currentImage) {
      loadNextImage()
    }
  }, [settings.enabled, currentImage, loadNextImage])

  useEffect(() => {
    if (!settings.enabled || !currentImage) return

    const interval = setInterval(() => {
      loadNextImage()
    }, settings.rotationInterval)

    return () => clearInterval(interval)
  }, [settings.enabled, settings.rotationInterval, currentImage, loadNextImage])

  return {
    currentImage,
    nextImage: null,
    isTransitioning: false,
    isPreloading,
    skipToNext,
  }
}
