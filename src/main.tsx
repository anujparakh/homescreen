import { render } from 'preact'
import { App } from '@/app'
import { SettingsProvider } from '@/components/SettingsProvider'
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
