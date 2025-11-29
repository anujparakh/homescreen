import { ArrowsOutIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { cn } from '@/util/cn'
import { goFullScreen } from '@/util/common-utils'

type TouchControlsProps = {
  isVisible: boolean
  onSkipToNext: () => void
}

export function TouchControls({
  isVisible,
  onSkipToNext,
}: TouchControlsProps) {
  return (
    <div
      class={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 transition-all z-50',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div class="flex gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-md">
        <button
          onClick={() => goFullScreen(document)}
          class="p-3 rounded-xl bg-white/10 hover:bg-white/20"
          aria-label="Toggle fullscreen"
        >
          <ArrowsOutIcon size={32} class="text-emerald-300" />
        </button>
        <button
          onClick={onSkipToNext}
          class="p-3 rounded-xl bg-white/10 hover:bg-white/20"
          aria-label="Next background"
        >
          <ArrowRightIcon size={32} class="text-sky-300" />
        </button>
      </div>
    </div>
  )
}
