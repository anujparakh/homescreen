# Rotating Background Implementation Plan

## Overview
Implement a rotating background system with two image sources:
1. **Chromecast** - Fetch random images from https://chromecastbg.alexmeub.com/images.v9.json (~2000+ curated images)
2. **Sourced** - User-provided local images (5 images in 4K quality)

## User Preferences (Confirmed)
- ✅ **CORS:** No issues - JSON endpoint is publicly accessible via CloudFront CDN
- ✅ **Sourced Images:** 5 images in 4K quality, user will provide them (can be large file size)
- ✅ **Default Source:** Chromecast
- ✅ **Default Rotation:** 30 minutes
- ✅ **Attribution:** Fade out after 5 seconds
- ✅ **Image Validation:** Must filter out 404s from Chromecast (some images may be deleted)

## Key Design Decisions

### Image Source Architecture
- Two distinct image sources, each with its own fetching strategy
- Chromecast: Fetch JSON and extract "Best" quality image URLs
- Sourced: Static local images stored in `public/backgrounds/`
- No API keys or external dependencies required

### Background Rotation System
- Preload next image before transitioning (never show broken/loading images)
- Smooth crossfade transitions using dual-layer technique
- User-configurable rotation intervals
- Manual skip to next background
- Works offline with Sourced images

### Settings Integration
- Extend existing Settings type with background configuration
- Add new "Background" tab to SettingsPanel
- Leverage existing localStorage persistence system
- Source selection (Chromecast vs Sourced)
- Rotation interval configuration

## Technical Architecture

### 1. Settings Schema Extension

**Location:** `src/types/settings.ts`

Add new `BackgroundSettings` type:
```typescript
export type BackgroundSettings = {
  enabled: boolean
  source: 'chromecast' | 'sourced'
  rotationInterval: number // milliseconds (15min, 30min, 1hr, 2hr, 4hr)
  showAttribution: boolean
}

export type Settings = {
  clock: ClockSettings
  date: DateSettings
  background: BackgroundSettings // NEW
}
```

Default settings:
- enabled: true
- source: 'chromecast'
- rotationInterval: 1800000 (30 minutes)
- showAttribution: true

### 2. File Structure

```
src/
├── components/
│   ├── BackgroundManager.tsx        # Main background rotation component
│   ├── BackgroundSettingsTab.tsx    # Settings UI for backgrounds
│   └── Attribution.tsx              # Image attribution display
├── services/
│   ├── chromecastScraper.ts        # Fetches from chromecastbg.alexmeub.com JSON
│   └── sourcedService.ts           # Manages local fallback images
├── hooks/
│   └── useBackgroundRotation.ts    # Custom hook for rotation logic
└── types/
    └── background.ts               # Background-related types

public/
└── backgrounds/
    ├── sourced-1.jpg               # User-provided images (4K quality)
    ├── sourced-2.jpg
    ├── sourced-3.jpg
    ├── sourced-4.jpg
    └── sourced-5.jpg
```

### Type Definitions

**Location:** `src/types/background.ts`

```typescript
export interface ImageData {
  url: string                    // Direct image URL
  photographer?: string | null   // Photographer name (Chromecast only)
  location?: string              // Photo location (Chromecast only)
  attribution: string            // Source attribution text
  source: 'chromecast' | 'sourced'
}

export interface ChromecastImage {
  url: string              // Base URL with size parameter
  name: string             // Filename
  photographer: string     // Photographer name
  gplus: string           // Google+ profile (legacy)
  location: string        // Photo location
  second_url: string      // Alternative URL if available
}
```

### 3. Chromecast Scraper Service

**Location:** `src/services/chromecastScraper.ts`

**Strategy:**
- Fetch JSON directly from https://chromecastbg.alexmeub.com/images.v9.json
- Select a random image from the array
- Build "Best" quality URL using the URL transformation logic
- Validate image loads before returning (filter out 404s)
- Return the image URL with metadata

**URL Transformation Logic:**
The site has two URL formats:
1. **Old style:** `/s2560/` format
2. **New style:** `s1280-w1280-h720-p-k-no-nd-mv` format (most common)

For "Best" quality (highest resolution):
- Old style: Replace with `/s3840/` (4K)
- New style: Replace with `s2560-w2560-h1440` (2.5K)

**Implementation approach:**
```typescript
export async function fetchChromecastImage(): Promise<ImageData> {
  // 1. Fetch the JSON file directly
  const response = await fetch('https://chromecastbg.alexmeub.com/images.v9.json')
  const images: ChromecastImage[] = await response.json()

  // 2. Select random image
  const randomIndex = Math.floor(Math.random() * images.length)
  const image = images[randomIndex]

  // 3. Build "Best" quality URL
  let bestUrl: string
  if (image.url.includes('/s2560/')) {
    // Old style
    bestUrl = image.url.replace('/s2560/', '/s3840/')
  } else {
    // New style
    bestUrl = image.url.replace(
      /s1280-w1280-h720-p-k-no-nd-mv|s1920-w1920-h1080/,
      's2560-w2560-h1440'
    )
  }

  // 4. Validate image loads (check for 404s)
  const isValid = await validateImageUrl(bestUrl)
  if (!isValid) {
    // Recursively try another random image
    return fetchChromecastImage()
  }

  // 5. Return image data
  return {
    url: bestUrl,
    photographer: image.photographer !== 'Unknown' ? image.photographer : null,
    location: image.location,
    attribution: 'Chromecast Backgrounds',
    source: 'chromecast'
  }
}

// Validation function to check if image loads
async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url

    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000)
  })
}
```

**Error Handling:**
- Network failures → Fall back to Sourced images
- JSON parse errors → Fall back to Sourced images
- Invalid image (404) → Try another random image (max 5 attempts, then fallback)
- Timeout on validation → Try next image

### 4. Sourced Images Service

**Location:** `src/services/sourcedService.ts`

**Strategy:**
- Manage array of 5 local image paths
- Rotate through images sequentially
- Track current index in localStorage
- No network requests needed

**Implementation:**
```typescript
const SOURCED_IMAGES = [
  '/backgrounds/sourced-1.jpg',
  '/backgrounds/sourced-2.jpg',
  '/backgrounds/sourced-3.jpg',
  '/backgrounds/sourced-4.jpg',
  '/backgrounds/sourced-5.jpg',
]

export function getNextSourcedImage(): ImageData {
  // 1. Load current index from localStorage
  // 2. Get image at current index
  // 3. Increment index (wrap around at 5)
  // 4. Save new index to localStorage
  // 5. Return image data
}
```

**Image Specifications:**
- Format: JPEG optimized for web
- Resolution: 4K quality (user will provide)
- File size: Can be large (user confirmed okay)
- Total: 5 images

### 5. Background Manager Component

**Location:** `src/components/BackgroundManager.tsx`

**Responsibilities:**
- Coordinate image fetching from selected source
- Implement dual-layer crossfade transitions
- Preload images before displaying
- Handle rotation timer
- Manage error states and fallbacks

**Dual-Layer Transition System:**
```tsx
// Two overlapping div elements
<div className="background-layer background-current" style={{backgroundImage: currentImage}} />
<div className="background-layer background-next" style={{backgroundImage: nextImage}} />
```

**Transition Flow:**
1. Timer triggers rotation event
2. Fetch next image URL based on source setting
3. Preload image (wait for complete load)
4. If load successful → begin crossfade transition
5. If load fails → try fallback source (Sourced images)
6. Swap layers after transition completes

**CSS for Transitions:**
```css
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 1.5s ease-in-out;
}

.background-current {
  z-index: 0;
  opacity: 1;
}

.background-next {
  z-index: 1;
  opacity: 0;
}

.background-next.transitioning {
  opacity: 1;
}
```

### 6. Background Rotation Hook

**Location:** `src/hooks/useBackgroundRotation.ts`

**Responsibilities:**
- Manage rotation interval timer
- Track current and next images
- Handle preloading logic
- Coordinate with settings

**State:**
```typescript
const [currentImage, setCurrentImage] = useState<ImageData | null>(null)
const [nextImage, setNextImage] = useState<ImageData | null>(null)
const [isTransitioning, setIsTransitioning] = useState(false)
const [isPreloading, setIsPreloading] = useState(false)
```

**Preload Function:**
```typescript
const preloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = reject
    img.src = url

    // 30-second timeout
    setTimeout(() => reject(new Error('Load timeout')), 30000)
  })
}
```

### 7. Background Settings Tab

**Location:** `src/components/BackgroundSettingsTab.tsx`

**UI Elements:**
- **Enable/Disable Toggle** - Turn background rotation on/off
- **Source Selector** - Radio buttons or dropdown for Chromecast vs Sourced
- **Rotation Interval** - Dropdown with preset intervals (15min, 30min, 1hr, 2hr, 4hr)
- **Manual Skip Button** - Skip to next background immediately
- **Show Attribution Toggle** - Show/hide attribution text

**Integration:**
- Follow same pattern as ClockSettingsTab and DateSettingsTab
- Use existing Toggle component for boolean settings
- Use select elements for dropdown choices

### 8. Attribution Component

**Location:** `src/components/Attribution.tsx`

**Display:**
- Position: Bottom-right corner
- Style: Semi-transparent, small text
- Content: Shows photographer name and location for Chromecast images
- Hidden for Sourced images (user-provided, no attribution needed)
- Fade out after 5 seconds (user preference)

**Behavior:**
1. Visible when new image loads (opacity: 1)
2. After 5 seconds, fade to opacity: 0
3. Reset and show again when next image loads

**Example:**
```tsx
<div className={`fixed bottom-4 right-4 text-white/60 text-sm transition-opacity duration-1000 ${
  isVisible ? 'opacity-100' : 'opacity-0'
}`}>
  {photographer && <div>Photo by {photographer}</div>}
  {location && <div className="text-xs text-white/40">{location}</div>}
</div>
```

### 9. localStorage Cache Structure

**Key:** `'homescreen-background-cache'`

**Structure:**
```typescript
{
  currentSourcedIndex: number,  // Track position in Sourced rotation (0-4)
  lastChromecastUrl: string,    // Cache last successful Chromecast URL
  lastFetchTime: number,        // Timestamp of last fetch
}
```

## Implementation Phases

### Phase 1: Core Services (30-45 min)
1. Create `src/types/background.ts` with type definitions
2. Implement `sourcedService.ts` with local image rotation
3. Implement `chromecastScraper.ts` with JSON fetching logic
4. Add 5 images to `public/backgrounds/` directory
5. Test both services independently

### Phase 2: Background Manager (45-60 min)
1. Create `BackgroundManager` component with dual-layer system
2. Implement `useBackgroundRotation` hook
3. Add preloading logic with timeout handling
4. Integrate with both image sources
5. Add error handling and fallback to Sourced
6. Test transitions and rotation

### Phase 3: Settings Integration (30-45 min)
1. Extend `Settings` type in `src/types/settings.ts`
2. Update default settings in `useSettings.ts`
3. Create `BackgroundSettingsTab` component
4. Add "Background" tab to SettingsPanel
5. Wire up settings to BackgroundManager

### Phase 4: UI Polish (20-30 min)
1. Create `Attribution` component
2. Integrate BackgroundManager into App component
3. Style transitions and loading states
4. Test all settings combinations
5. Verify localStorage persistence

## Critical Implementation Details

### Chromecast Implementation Details

**No CORS Issues:**
- The JSON endpoint (images.v9.json) is served from CloudFront CDN
- No CORS headers are needed (public resource)
- Direct fetch from browser works without restrictions
- No proxy or workarounds needed

**JSON Structure:**
- Contains ~2000+ high-quality images
- Each entry includes photographer, location, and URL
- Images are hosted on Google's lh3.googleusercontent.com CDN
- Regular updates to the JSON file (last modified: Oct 2023)

**Image Quality Levels:**
The original site offers 3 quality levels:
1. **Good:** 1920x1080 resolution
2. **Better:** 1920x1200 or 2560 (depends on format)
3. **Best:** 2560x1440 or 3840 (4K) - we'll use this

**Image Validation:**
- Some images may 404 (deleted from Google servers)
- Must validate each image loads before displaying
- Implement retry logic (try up to 5 random images)
- Fall back to Sourced images if all attempts fail

### Preload Before Transition (CRITICAL)

**Never show unloaded images:**
1. Start preloading 30-60 seconds before rotation time
2. Keep current background visible during preload
3. Only trigger transition after successful preload
4. Implement 30-second timeout - if image doesn't load, skip to next
5. Show loading indicator if needed (optional)

### Error Recovery Hierarchy

1. Try primary source (Chromecast or Sourced based on setting)
2. If Chromecast fails → automatically use Sourced
3. If individual Sourced image fails → try next in sequence
4. If all fail → show solid color fallback (bg-gray-900)

### App Component Integration

**Update `src/app.tsx`:**
- Remove hard-coded `bg-gray-900` background
- Add `<BackgroundManager />` component at root level
- Ensure BackgroundManager renders behind all other content (z-index 0)
- Keep all UI elements above background (z-index 1+)

## Testing Checklist

- [ ] Sourced images load and rotate correctly
- [ ] Chromecast scraper fetches random images successfully
- [ ] Transitions only occur after images fully preload
- [ ] 30-second timeout works for slow/failed loads
- [ ] Smooth crossfade transitions (no flicker)
- [ ] Manual skip button works instantly
- [ ] Settings persist across page reloads
- [ ] Background disabled = solid color fallback
- [ ] Chromecast failure automatically falls back to Sourced
- [ ] Attribution displays correctly (only for Chromecast)
- [ ] Attribution fades out after 5 seconds
- [ ] Performance is smooth (no lag or jank)
- [ ] Works on different screen sizes
- [ ] localStorage cache updates correctly

## Technical Constraints

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use standard DOM APIs (fetch, Image)
- CSS transitions widely supported

### Performance
- Preload images in background (doesn't block UI)
- Use CSS transitions (GPU-accelerated)
- Lazy load BackgroundManager (no impact on initial load)

### Bundle Size
- Sourced images: 5 images in 4K (user will provide)
- No external libraries needed
- Minimal JavaScript overhead (~5-10KB)

## Success Criteria

Implementation is successful when:
1. ✅ Both image sources (Chromecast and Sourced) work reliably
2. ✅ Smooth transitions with no visible loading states
3. ✅ Chromecast scraper extracts "Best" quality images correctly
4. ✅ Settings integrate seamlessly with existing UI
5. ✅ Automatic fallback to Sourced when Chromecast unavailable
6. ✅ No performance impact on clock functionality
7. ✅ Works offline with Sourced images
8. ✅ 30-second preload timeout prevents hanging
9. ✅ Attribution fades out after 5 seconds as requested

## Key Files to Review Before Implementation

Based on the codebase exploration, these files will need to be read/modified:
- `src/types/settings.ts` - Extend Settings type with BackgroundSettings
- `src/hooks/useSettings.ts` - Add default background settings
- `src/app.tsx` - Integrate BackgroundManager component, remove hard-coded bg-gray-900
- `src/components/SettingsPanel.tsx` - Add Background tab to settings modal
- `src/index.css` - Add CSS for background transitions and animations

## Implementation Summary

This plan provides a complete roadmap for implementing rotating backgrounds with:

1. **Simple Architecture:** Direct JSON fetch from Chromecast API (no HTML scraping/CORS complexity)
2. **Robust Error Handling:** Image validation, retry logic, automatic fallback to Sourced
3. **Smooth UX:** Preload-then-transition system, crossfade animations, fade-out attribution
4. **Flexible Settings:** User control over source, intervals, and display preferences
5. **Performance:** Lazy loading, GPU-accelerated transitions, efficient caching
6. **Type Safety:** Full TypeScript coverage with strict typing

**Estimated Implementation Time:** 2.5-3 hours total

**Ready to implement when approved by user.**
