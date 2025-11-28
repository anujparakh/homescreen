import { useState, useEffect } from 'preact/hooks'

const WELCOME_SHOWN_KEY = 'homescreen-welcome-shown'

export function useWelcomeModal() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Check if this is the first time the user is visiting
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY)

    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [])

  const closeWelcome = () => {
    setShowWelcome(false)
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true')
  }

  return {
    showWelcome,
    closeWelcome,
  }
}
