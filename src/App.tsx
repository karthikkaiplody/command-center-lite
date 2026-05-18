import { useState, useCallback, useEffect } from 'react'
import { AppLayout } from './components/layout'
import { TodayView } from './views'
import { QuickCaptureModal, SettingsModal, type QuickCaptureSubmission } from './components/ui'
import { useKeyboardShortcut } from './hooks'
import { useApp } from './lib'
import { useConfig } from './hooks/useConfig'

function App() {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsMode, setSettingsMode] = useState<'settings' | 'onboarding'>('settings')
  const { addTask } = useApp()
  const { config, isLoading: isConfigLoading } = useConfig()

  // Show onboarding on first launch if name is not set
  useEffect(() => {
    if (!isConfigLoading && !config.user?.name) {
      setSettingsMode('onboarding')
      setIsSettingsOpen(true)
    }
  }, [isConfigLoading, config.user?.name])

  const openQuickCapture = useCallback(() => {
    setIsQuickCaptureOpen(true)
  }, [])

  const closeQuickCapture = useCallback(() => {
    setIsQuickCaptureOpen(false)
  }, [])

  const openSettings = useCallback(() => {
    setSettingsMode('settings')
    setIsSettingsOpen(true)
  }, [])

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const handleQuickCaptureSubmit = useCallback((submission: QuickCaptureSubmission) => {
    if (submission.destination === 'task') {
      const data = submission.data
      addTask({
        title: data.title,
        category: data.category,
        status: 'todo',
        dueDate: data.dueDate,
        notes: data.notes,
        link: data.link,
        isSyncPriority: false,
        sortOrder: 0,
        source: 'local',
      })
    }
  }, [addTask])

  // Register ⌘K keyboard shortcut
  useKeyboardShortcut({
    key: 'k',
    metaKey: true,
    callback: openQuickCapture,
  })

  // Register ⌘, keyboard shortcut for settings
  useKeyboardShortcut({
    key: ',',
    metaKey: true,
    callback: openSettings,
  })

  return (
    <AppLayout onOpenSettings={openSettings}>
      <TodayView onAddTask={openQuickCapture} />
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={closeQuickCapture}
        onSubmit={handleQuickCaptureSubmit}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        mode={settingsMode}
      />
    </AppLayout>
  )
}

export default App
