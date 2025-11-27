import { render } from 'preact'
import { App } from '@/app'
import { SettingsProvider } from '@/components/SettingsProvider'
// @ts-ignore: allow side-effect import of CSS without type declarations
import '@/index.css'

const root = document.getElementById('app')
if (root) {
  render(
    <SettingsProvider>
      <App />
    </SettingsProvider>,
    root
  )
}
