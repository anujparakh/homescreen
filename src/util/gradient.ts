import type { SolidColorSettings } from '@/types/settings'

export function getGradientCSS(solidColor: SolidColorSettings): string {
  const { colorA, colorB, gradientType } = solidColor
  switch (gradientType) {
    case 'linear-vertical':
      return `linear-gradient(to bottom, ${colorA}, ${colorB})`
    case 'linear-horizontal':
      return `linear-gradient(to right, ${colorA}, ${colorB})`
    case 'radial':
      return `radial-gradient(ellipse at center, ${colorB} 0%, ${colorA} 100%)`
    default: // linear-diagonal
      return `linear-gradient(135deg, ${colorA}, ${colorB})`
  }
}
