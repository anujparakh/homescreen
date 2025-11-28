import { useState, useEffect, useCallback } from 'preact/hooks'
import type { ImageData } from '@/types/background'
import type { BackgroundSettings } from '@/types/settings'
import { fetchChromecastImage } from '@/services/chromecastService'
import { getNextSourcedImage } from '@/services/sourcedService'

const PRELOAD_TIMEOUT = 30000

export function useBackgroundRotation(settings: BackgroundSettings) {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null)
  const [nextImage, setNextImage] = useState<ImageData | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)

  const preloadImage = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url

      setTimeout(() => reject(new Error('Load timeout')), PRELOAD_TIMEOUT)
    })
  }, [])

  const fetchNextImage = useCallback(async (): Promise<ImageData> => {
    try {
      if (settings.source === 'chromecast') {
        return await fetchChromecastImage()
      } else {
        return getNextSourcedImage()
      }
    } catch (error) {
      console.error('Failed to fetch from primary source:', error)
      return getNextSourcedImage()
    }
  }, [settings.source])

  const loadNextImage = useCallback(
    async (setAsCurrent = false) => {
      if (isPreloading) return

      setIsPreloading(true)
      try {
        const imageData = await fetchNextImage()
        await preloadImage(imageData.url)
        if (setAsCurrent) {
          setCurrentImage(imageData)
        } else {
          setNextImage(imageData)
        }
      } catch (error) {
        console.error('Failed to preload next image:', error)
        try {
          const fallbackImage = getNextSourcedImage()
          await preloadImage(fallbackImage.url)
          if (setAsCurrent) {
            setCurrentImage(fallbackImage)
          } else {
            setNextImage(fallbackImage)
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback image:', fallbackError)
        }
      } finally {
        setIsPreloading(false)
      }
    },
    [fetchNextImage, preloadImage, isPreloading]
  )

  const transitionToNext = useCallback(() => {
    if (!nextImage) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImage(nextImage)
      setNextImage(null)
      setIsTransitioning(false)
    }, 1500)
  }, [nextImage])

  const skipToNext = useCallback(() => {
    if (nextImage) {
      transitionToNext()
    } else {
      loadNextImage()
    }
  }, [nextImage, transitionToNext, loadNextImage])

  useEffect(() => {
    if (!settings.enabled) return

    if (!currentImage) {
      loadNextImage(true)
    }
  }, [settings.enabled, currentImage, loadNextImage])

  useEffect(() => {
    if (!settings.enabled || !currentImage) return

    const interval = setInterval(() => {
      loadNextImage()
    }, settings.rotationInterval)

    return () => clearInterval(interval)
  }, [settings.enabled, settings.rotationInterval, currentImage, loadNextImage])

  useEffect(() => {
    if (nextImage && !isTransitioning) {
      transitionToNext()
    }
  }, [nextImage, isTransitioning, transitionToNext])

  return {
    currentImage,
    nextImage,
    isTransitioning,
    isPreloading,
    skipToNext,
  }
}
