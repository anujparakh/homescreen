# Claude Context

## Project Overview
This is a minimalist clock web application built with Preact, TypeScript, and Tailwind CSS. The app displays a live clock centered on a dark background.

## Tech Stack
- **Framework**: Preact 10.24.3 (lightweight React alternative)
- **Language**: TypeScript with strict type checking enabled
- **Styling**: Tailwind CSS 3.4.17
- **Build Tool**: Vite 6.0.3
- **Node Version**: 20+ (specified in package.json engines)

## Project Structure
```
/
├── src/
│   ├── components/
│   │   └── Clock.tsx        # Clock component with time/date display
│   ├── app.tsx              # Main app component with dark background
│   ├── main.tsx             # Entry point that renders the app
│   └── index.css            # Tailwind CSS imports
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript config with strict mode
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS with Tailwind & Autoprefixer
├── vite.config.ts           # Vite bundler configuration
├── eslint.config.js         # ESLint configuration
└── .prettierrc              # Prettier code formatting config
```

## Key Components

### Clock Component ([src/components/Clock.tsx](src/components/Clock.tsx))
- Uses `useState` and `useEffect` hooks
- Updates every second via `setInterval`
- Displays time in HH:MM:SS format
- Shows full date below the time
- Styled with Tailwind (large white text, gray date text)

### App Component ([src/app.tsx](src/app.tsx))
- Root component that provides the dark background (`bg-gray-900`)
- Centers the Clock component using Flexbox

## TypeScript Configuration
- Strict mode enabled with additional checks:
  - `noUnusedLocals`, `noUnusedParameters`
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
  - `noImplicitReturns`, `noImplicitOverride`
- JSX factory set to Preact

## Code Quality Tools
- **ESLint**: TypeScript-aware linting with recommended rules
- **Prettier**: Code formatting with single quotes, no semicolons, 2-space indentation

## Development Commands
- `yarn dev` - Start development server (Vite)
- `yarn build` - TypeScript check + production build
- `yarn preview` - Preview production build locally
- `yarn lint` - Run ESLint on TypeScript files
- `yarn format` - Format code with Prettier

## Styling Approach
- Tailwind utility classes used throughout
- Dark theme (`bg-gray-900` background)
- Monospace font for clock digits
- Responsive design with Flexbox centering

## Notes for Future Development
- All TypeScript files use strict type checking
- Preact is used instead of React for smaller bundle size
- The clock updates every second; consider optimization if needed
- No state management library needed for this simple app
