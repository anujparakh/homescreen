import { useState, useEffect } from 'preact/hooks'
import type { ImageData } from '@/types/background'
import {
  analyzeImageBrightness,
  DEFAULT_ANALYSIS,
  type ImageAnalysis,
  type Position,
} from '@/services/imageAnalysisService'

/**
 * Hook that provides adaptive text colors based on the current background image
 * Analyzes image brightness in a specific region and returns appropriate color classes for text
 */
export function useAdaptiveColors(
  currentImage: ImageData | null,
  position: Position = 'center'
) {
  const [analysis, setAnalysis] = useState<ImageAnalysis>(DEFAULT_ANALYSIS)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // If no image, use default (light text on dark background)
    if (!currentImage) {
      setAnalysis(DEFAULT_ANALYSIS)
      return
    }

    // Analyze the current image at the specified position
    const analyzeCurrentImage = async () => {
      setIsAnalyzing(true)
      try {
        const result = await analyzeImageBrightness(currentImage.url, position)
        setAnalysis(result)
      } catch (error) {
        console.error('Failed to analyze image brightness:', error)
        // Fall back to default colors if analysis fails
        setAnalysis(DEFAULT_ANALYSIS)
      } finally {
        setIsAnalyzing(false)
      }
    }

    analyzeCurrentImage()
  }, [currentImage, position])

  return {
    ...analysis,
    isAnalyzing,
  }
}
