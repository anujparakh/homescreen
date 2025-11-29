export function goFullScreen(document: Document) {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err)
    })
  } else {
    document.exitFullscreen().catch(err => {
      console.error('Error attempting to exit fullscreen:', err)
    })
  }
}

export const DOUBLE_TAP_DELAY = 300
