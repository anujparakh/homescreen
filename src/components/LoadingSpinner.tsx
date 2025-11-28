export function LoadingSpinner() {
  return (
    <div class="relative">
      {/* Outer spinning ring */}
      <div class="w-20 h-20 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      {/* Inner pulsing circle */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-75"></div>
    </div>
  )
}
