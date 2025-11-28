import { XIcon } from '@phosphor-icons/react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        class="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div class="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          class="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close welcome modal"
        >
          <XIcon size={20} class="text-gray-400 sm:w-6 sm:h-6" />
        </button>

        {/* Content */}
        <div class="space-y-4 sm:space-y-6">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold mb-2 pr-8">Welcome to The Homescreen!</h2>
            <p class="text-gray-400 text-sm">
              Your minimalistic new tab experience
            </p>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div>
              <h3 class="text-base sm:text-lg font-semibold mb-2 text-gray-200">
                What is this?
              </h3>
              <p class="text-sm sm:text-base text-gray-400 leading-relaxed">
                A clean, distraction-free homepage featuring a simple clock,
                date and weather widget, rotating backgrounds sourced from
                Chromecast, and configurable settings.
              </p>
            </div>

            <div>
              <h3 class="text-base sm:text-lg font-semibold mb-2 text-gray-200">
                How to use
              </h3>
              <ul class="space-y-2 text-gray-400 text-sm sm:text-base">
                <li class="flex items-start">
                  <span class="inline-block w-16 sm:w-20 font-mono text-xs sm:text-sm bg-gray-800 px-2 py-1 rounded mr-2 sm:mr-3 flex-shrink-0 text-center">
                    ,
                  </span>
                  <span>
                    Open settings to customize your experience. Hover over the
                    top right section to see the settings button.
                  </span>
                </li>
                <li class="flex items-start">
                  <span class="inline-block w-16 sm:w-20 font-mono text-xs sm:text-sm bg-gray-800 px-2 py-1 rounded mr-2 sm:mr-3 flex-shrink-0 text-center">
                    Space×2
                  </span>
                  <span>
                    Double-tap space to skip to next background. On a touch
                    screen, double tap the screen.
                  </span>
                </li>
                <li class="flex items-start">
                  <span class="inline-block w-16 sm:w-20 font-mono text-xs sm:text-sm bg-gray-800 px-2 py-1 rounded mr-2 sm:mr-3 flex-shrink-0 text-center">
                    F
                  </span>
                  <span>Toggle fullscreen mode</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={onClose}
            class="w-full bg-indigo-600 text-gray-100 py-2.5 sm:py-3 px-6 rounded-lg font-semibold hover:bg-indigo-400 transition-colors text-sm sm:text-base"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
