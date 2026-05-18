import { useState, useEffect, type FormEvent } from 'react'
import { Button } from './Button'
import { useConfig, type AppConfig } from '../../hooks/useConfig'
import { isElectron } from '../../lib/electron'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'onboarding' | 'settings'
}

type Section = 'identity' | 'voice' | 'github'

export function SettingsModal({ isOpen, onClose, mode = 'settings' }: SettingsModalProps) {
  const { config, updateConfig, isLoading } = useConfig()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('identity')
  const [launchOnLogin, setLaunchOnLogin] = useState(false)

  const [form, setForm] = useState({
    name: '',
    elevenlabsApiKey: '',
    elevenlabsVoiceId: '',
    githubDefaultOrg: '',
    githubTeamRepos: '',
  })

  useEffect(() => {
    if (!isLoading && isOpen) {
      setForm({
        name: config.user?.name || '',
        elevenlabsApiKey: config.elevenlabs?.apiKey || '',
        elevenlabsVoiceId: config.elevenlabs?.voiceId || '',
        githubDefaultOrg: config.github?.defaultOrg || '',
        githubTeamRepos: (config.github?.teamRepos || []).join(', '),
      })
      // Load current login item setting
      if (isElectron() && window.electronAPI) {
        window.electronAPI.getLoginItemSettings().then(s => setLaunchOnLogin(s.openAtLogin))
      }
    }
  }, [config, isLoading, isOpen])

  if (!isOpen) return null

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)

    const updates: Partial<AppConfig> = {
      user: { name: form.name.trim() },
      elevenlabs: {
        apiKey: form.elevenlabsApiKey.trim(),
        voiceId: form.elevenlabsVoiceId.trim(),
      },
      github: {
        defaultOrg: form.githubDefaultOrg.trim(),
        teamRepos: form.githubTeamRepos
          .split(',')
          .map(r => r.trim())
          .filter(Boolean),
      },
    }

    await updateConfig(updates)

    // Persist login-on-login setting
    if (isElectron() && window.electronAPI) {
      await window.electronAPI.setLoginItemSettings({ openAtLogin: launchOnLogin })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  const isOnboarding = mode === 'onboarding'

  const sections: { id: Section; label: string; optional: boolean }[] = [
    { id: 'identity', label: 'Identity', optional: false },
    { id: 'voice', label: 'Voice', optional: true },
    { id: 'github', label: 'GitHub', optional: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isOnboarding ? undefined : onClose}
      />

      <div className="relative w-full max-w-lg mx-4 bg-mantle border border-surface1 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-surface1">
          {isOnboarding ? (
            <>
              <p className="font-mono text-xs uppercase tracking-wider text-overlay1 mb-2">Welcome</p>
              <h2 className="text-2xl font-display text-text">Set up Command Center</h2>
              <p className="text-sm text-subtext1 mt-2">
                Tell us a bit about yourself to get started. You can change these anytime.
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-xs uppercase tracking-wider text-overlay1 mb-2">Settings</p>
              <h2 className="text-2xl font-display text-text">Preferences</h2>
            </>
          )}
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-surface1 px-8">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`
                font-mono text-xs uppercase tracking-wider px-0 py-3 mr-6
                border-b-2 transition-colors cursor-pointer
                ${activeSection === s.id
                  ? 'border-mauve text-text'
                  : 'border-transparent text-overlay1 hover:text-subtext1'}
              `}
            >
              {s.label}
              {s.optional && (
                <span className="ml-1 text-[10px] normal-case tracking-normal opacity-50">optional</span>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave}>
          <div className="px-8 py-6 min-h-[200px]">
            {activeSection === 'identity' && (
              <div className="space-y-4">
                <Field
                  label="Your name"
                  hint="Used in your daily greeting"
                  required
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Alex"
                    className={inputClass}
                    autoFocus
                    required
                  />
                </Field>

                {isElectron() && !isOnboarding && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-subtext1">Launch on Login</p>
                      <p className="text-xs text-overlay0 mt-0.5">Start Command Center when you log in to macOS</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLaunchOnLogin(v => !v)}
                      className={`
                        relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-mauve/40 focus:ring-offset-2 focus:ring-offset-mantle
                        ${launchOnLogin ? 'bg-mauve' : 'bg-surface2'}
                      `}
                      role="switch"
                      aria-checked={launchOnLogin}
                    >
                      <span
                        className={`
                          inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform
                          ${launchOnLogin ? 'translate-x-4.5' : 'translate-x-0.5'}
                        `}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'voice' && (
              <div className="space-y-4">
                <p className="text-xs text-overlay1 mb-4">
                  Add an ElevenLabs API key to enable the "Read aloud" feature in your morning briefing.
                </p>
                <Field label="API Key" hint="From elevenlabs.io → Profile → API Keys">
                  <input
                    type="password"
                    value={form.elevenlabsApiKey}
                    onChange={e => setForm(f => ({ ...f, elevenlabsApiKey: e.target.value }))}
                    placeholder="sk-..."
                    className={inputClass}
                  />
                </Field>
                <Field label="Voice ID" hint="Leave blank to use the default voice">
                  <input
                    type="text"
                    value={form.elevenlabsVoiceId}
                    onChange={e => setForm(f => ({ ...f, elevenlabsVoiceId: e.target.value }))}
                    placeholder="JBFqnCBsd6RMkjVDRZzb"
                    className={inputClass}
                  />
                </Field>
              </div>
            )}

            {activeSection === 'github' && (
              <div className="space-y-4">
                <p className="text-xs text-overlay1 mb-4">
                  Connect GitHub to see your PRs and assigned issues. Requires <code className="bg-surface1 px-1 rounded">gh</code> CLI installed and authenticated.
                </p>
                <Field label="Default org" hint="Your GitHub org or username">
                  <input
                    type="text"
                    value={form.githubDefaultOrg}
                    onChange={e => setForm(f => ({ ...f, githubDefaultOrg: e.target.value }))}
                    placeholder="e.g. my-org"
                    className={inputClass}
                  />
                </Field>
                <Field label="Repositories" hint="Comma-separated repo names (short or org/repo)">
                  <input
                    type="text"
                    value={form.githubTeamRepos}
                    onChange={e => setForm(f => ({ ...f, githubTeamRepos: e.target.value }))}
                    placeholder="e.g. my-app, my-org/other-repo"
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <div className="flex gap-2">
              {sections.filter(s => s.id !== activeSection).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className="font-mono text-xs text-overlay1 hover:text-subtext1 transition-colors cursor-pointer"
                >
                  {s.label} →
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {!isOnboarding && (
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={saving || !form.name.trim()}
              >
                {saved ? '✓ Saved' : saving ? 'Saving…' : isOnboarding ? 'Get Started' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass = `
  w-full bg-surface0 border border-surface1 rounded-lg
  px-3 py-2 text-sm text-text placeholder:text-overlay0
  focus:outline-none focus:ring-2 focus:ring-mauve/40 focus:border-mauve/60
  transition-colors
`.trim()

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-1 mb-1.5">
        <label className="font-mono text-xs uppercase tracking-wider text-subtext1">
          {label}
        </label>
        {required && <span className="text-red/60 text-xs">*</span>}
      </div>
      {children}
      {hint && <p className="text-xs text-overlay0 mt-1">{hint}</p>}
    </div>
  )
}
