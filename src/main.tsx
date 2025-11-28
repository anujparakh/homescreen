import { render } from 'preact'
import { Router, Route } from 'wouter'
import { App } from '@/app'
import { RandomImage } from '@/components/RandomImage'
import { SettingsProvider } from '@/components/settings/SettingsProvider'
// @ts-ignore: allow side-effect import of CSS without type declarations
import '@/index.css'

const root = document.getElementById('app')
if (root) {
  render(
    <SettingsProvider>
      <Router>
        <Route path="/" component={App} />
        <Route path="/random" component={RandomImage} />
      </Router>
    </SettingsProvider>,
    root
  )
}
