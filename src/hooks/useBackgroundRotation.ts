import { useState, useEffect, useCallback, useRef } from 'preact/hooks'
import type { ImageData } from '@/types/background'
import type { BackgroundSettings } from '@/types/settings'
import { fetchChromecastImage } from '@/services/chromecastService'
import { getNextSourcedImage } from '@/services/sourcedService'
import { fetchAppleVideo } from '@/services/appleService'

const PRELOAD_TIMEOUT = 30000

export function useBackgroundRotation(settings: BackgroundSettings) {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null)
  const [isPreloading, setIsPreloading] = useState(false)
  const previousSourceRef = useRef<string>(settings.source)

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
        if (settings.appleVideoUrl) {
          return {
            url: settings.appleVideoUrl,
            source: 'apple' as const,
            attribution: 'Apple',
            photographer: undefined,
            location: undefined,
            isVideo: true,
          }
        }
        return await fetchAppleVideo()
      } else if (settings.source === 'uw') {
        return {
          url: '/backgrounds/uw-background.jpg',
          attribution: '',
          source: 'uw',
          photographer: undefined,
          location: undefined,
        }
      } else {
        return getNextSourcedImage()
      }
    } catch (error) {
      console.error('Failed to fetch from primary source:', error)
      return getNextSourcedImage()
    }
  }, [settings.source, settings.appleVideoFilename, settings.appleVideoUrl])

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
    if (!settings.enabled || settings.source === 'solid-color') return

    if (!currentImage) {
      loadNextImage()
    }
  }, [settings.enabled, settings.source, currentImage, loadNextImage])

  // Reload background when source or apple filename changes
  useEffect(() => {
    if (!settings.enabled || !currentImage || settings.source === 'solid-color' || settings.source === 'uw') return

    // Check if source actually changed
    if (previousSourceRef.current !== settings.source) {
      previousSourceRef.current = settings.source
      loadNextImage()
    }
  }, [settings.source, settings.enabled, currentImage, loadNextImage])

  const previousFilenameRef = useRef<string>(settings.appleVideoFilename)
  useEffect(() => {
    if (!settings.enabled || settings.source !== 'apple') return
    if (previousFilenameRef.current !== settings.appleVideoFilename) {
      previousFilenameRef.current = settings.appleVideoFilename
      loadNextImage()
    }
  }, [settings.appleVideoFilename, settings.appleVideoUrl, settings.enabled, settings.source, loadNextImage])

  useEffect(() => {
    if (!settings.enabled || !currentImage || settings.source === 'solid-color' || settings.source === 'uw' || settings.source === 'apple' || settings.rotationInterval === 0) return

    const interval = setInterval(() => {
      loadNextImage()
    }, settings.rotationInterval)

    return () => clearInterval(interval)
  }, [settings.enabled, settings.rotationInterval, settings.source, currentImage, loadNextImage])

  return {
    currentImage,
    nextImage: null,
    isTransitioning: false,
    isPreloading,
    skipToNext,
  }
}
