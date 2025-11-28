# The Homescreen

A minimal homescreen web app. 
Features:
- Rotating Backgrounds curated from Chromecast backgrounds
- Configurable widgets
  - Clock widget
  - Date widget
  - Weather widget
- Settings modal to configure the widgets, background settings, etc.
- Settings are saved in local storage for user
- Supported keyboard shortcuts:
  - `F` to go fullscreen
  - `,` to open settings
  - Double tap space to go to next Image
  - On touch devices, double tap screen to go to next Image

## Demo

First time welcome screen\
<img width="1582" height="1030" alt="image" src="https://github.com/user-attachments/assets/296e4f99-ad2b-449f-b3c3-b6ce0a195531" />

Regular Homescreen\
<img width="1582" height="1030" alt="image" src="https://github.com/user-attachments/assets/82a3a4c3-e8e7-4077-ba4a-fd7d8c5ef793" />

Settings Modal\
<img width="1582" height="1030" alt="image" src="https://github.com/user-attachments/assets/4ba124ab-5752-4852-a164-2e8c9ba1ba9c" />


## Running the App

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Requirements

- Node.js 20 or higher
