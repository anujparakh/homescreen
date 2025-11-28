/**
 * Analyzes image brightness to determine optimal text colors
 */

export interface ImageAnalysis {
  averageBrightness: number // 0-255
  isDark: boolean // true if image is predominantly dark
  textColor: string // recommended text color class
  secondaryTextColor: string // recommended secondary text color class
}

/**
 * Color configurations based on brightness levels
 * Map keys represent the maximum brightness threshold for each level
 */
export const BRIGHTNESS_COLOR_MAP: Map<
  number,
  { textColor: string; secondaryTextColor: string }
> = new Map([
  // Dark images (0-85): White text for high contrast
  [
    85,
    {
      textColor: 'text-white',
      secondaryTextColor: 'text-[#f7f7f7]',
    },
  ],
  // Medium brightness (86-170): Light gray text
  [
    170,
    {
      textColor: 'text-gray-200',
      secondaryTextColor: 'text-[#f7f7f7]',
    },
  ],
  // Bright images (171-255): Dark text for contrast
  [
    255,
    {
      textColor: 'text-gray-900',
      secondaryTextColor: 'text-blue-gray-800',
    },
  ],
])

export type Position =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

interface RegionCoordinates {
  x: number // 0-1 normalized
  y: number // 0-1 normalized
  width: number // 0-1 normalized
  height: number // 0-1 normalized
}

/**
 * Maps position to region coordinates on the image
 */
function getRegionCoordinates(position: Position): RegionCoordinates {
  const regionSize = 0.3 // Sample 30% of the image in each dimension

  switch (position) {
    case 'center':
      return {
        x: 0.5 - regionSize / 2,
        y: 0.5 - regionSize / 2,
        width: regionSize,
        height: regionSize,
      }
    case 'top-left':
      return { x: 0, y: 0, width: regionSize, height: regionSize }
    case 'top-right':
      return { x: 1 - regionSize, y: 0, width: regionSize, height: regionSize }
    case 'bottom-left':
      return { x: 0, y: 1 - regionSize, width: regionSize, height: regionSize }
    case 'bottom-right':
      return {
        x: 1 - regionSize,
        y: 1 - regionSize,
        width: regionSize,
        height: regionSize,
      }
  }
}

/**
 * Analyzes an image's brightness by sampling pixels in a specific region
 * Uses canvas to read pixel data and calculate average brightness
 */
export async function analyzeImageBrightness(
  imageUrl: string,
  position: Position = 'center'
): Promise<ImageAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        // Create canvas to analyze image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Could not get canvas context')
        }

        // Use smaller canvas for performance (sample the image)
        const sampleSize = 100
        canvas.width = sampleSize
        canvas.height = sampleSize

        // Draw image scaled down to canvas
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize)

        // Get region coordinates based on position
        const region = getRegionCoordinates(position)
        const startX = Math.floor(region.x * sampleSize)
        const startY = Math.floor(region.y * sampleSize)
        const regionWidth = Math.floor(region.width * sampleSize)
        const regionHeight = Math.floor(region.height * sampleSize)

        // Get pixel data for the specific region
        const imageData = ctx.getImageData(
          startX,
          startY,
          regionWidth,
          regionHeight
        )
        const pixels = imageData.data

        // Calculate average brightness
        let totalBrightness = 0
        const pixelCount = pixels.length / 4 // 4 values per pixel (RGBA)

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i]!
          const g = pixels[i + 1]!
          const b = pixels[i + 2]!

          // Calculate perceived brightness using standard formula
          // Human eye is more sensitive to green, less to blue
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b
          totalBrightness += brightness
        }

        const averageBrightness = totalBrightness / pixelCount

        // Determine if image is dark (threshold at middle gray)
        const isDark = averageBrightness < 128

        // Find appropriate color scheme based on brightness level
        let colors = {
          textColor: 'text-white',
          secondaryTextColor: 'text-white',
        }
        for (const [maxBrightness, colorScheme] of BRIGHTNESS_COLOR_MAP) {
          if (averageBrightness <= maxBrightness) {
            colors = colorScheme
            break
          }
        }

        resolve({
          averageBrightness,
          isDark,
          textColor: colors.textColor,
          secondaryTextColor: colors.secondaryTextColor,
        })
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for analysis'))
    }

    img.src = imageUrl
  })
}

/**
 * Default analysis for when no background is set
 */
export const DEFAULT_ANALYSIS: ImageAnalysis = {
  averageBrightness: 0,
  isDark: true,
  textColor: 'text-white',
  secondaryTextColor: 'text-white',
}
