import { createContext } from 'react'
import type { InboxItem } from '../types'

interface InboxContextType {
  items: InboxItem[]
  inboxCount: number
  pendingCount: number
  urgentCount: number
  stats: { total: number; pending: number; urgent: number }
  deferredItems: InboxItem[]
  getItemById: (id: string) => InboxItem | undefined
  routeToTask: (id: string, taskData: unknown) => Promise<void>
  routeToGoal: (id: string, goalId: string) => Promise<void>
  markDone: (id: string) => Promise<void>
  dismiss: (id: string) => Promise<void>
  defer: (id: string, until: string) => Promise<void>
  bulkMarkDone: (ids: string[]) => Promise<void>
  bulkDismiss: (ids: string[]) => Promise<void>
}

export const InboxContext = createContext<InboxContextType>({} as InboxContextType)
