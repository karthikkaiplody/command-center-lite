import type { Task, Meeting, Contact } from '../types'

const today = new Date().toISOString().split('T')[0]

export const mockTasks: Task[] = [
  { id: '1', title: 'Review billing-platform PR #892', category: 'work', status: 'todo', isSyncPriority: false, sortOrder: 0, createdAt: new Date().toISOString(), source: 'local', notes: 'Focus on the rate limiting changes' },
  { id: '2', title: 'Update Universe demo script', category: 'work', status: 'todo', isSyncPriority: false, sortOrder: 1, createdAt: new Date().toISOString(), source: 'local' },
  { id: '3', title: 'Schedule dentist appointment', category: 'home', status: 'todo', isSyncPriority: false, sortOrder: 2, createdAt: new Date().toISOString(), source: 'local' },
  { id: '4', title: 'Check Collective deployment', category: 'side-project', status: 'todo', isSyncPriority: false, sortOrder: 3, createdAt: new Date().toISOString(), source: 'local', notes: 'Verify the new auth flow is working' },
  { id: '5', title: 'Morning workout', category: 'personal', status: 'done', isSyncPriority: false, sortOrder: 4, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), source: 'local' },
  { id: '6', title: 'Review team RFC', category: 'work', status: 'done', isSyncPriority: false, sortOrder: 5, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), source: 'local' },
  { id: '7', title: 'Write blog post draft', category: 'side-project', status: 'in-progress', isSyncPriority: false, sortOrder: 6, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), source: 'local' },
  { id: '8', title: 'Meal prep for the week', category: 'home', status: 'todo', isSyncPriority: false, sortOrder: 7, createdAt: new Date().toISOString(), source: 'local' },
]

export const mockMeetings: Meeting[] = [
  { id: '1', date: today, time: '09:00', title: 'Morning sync', category: 'work', done: true },
  { id: '2', date: today, time: '10:30', title: '1:1 with Sarah', category: 'work', done: false },
  { id: '3', date: today, time: '14:00', title: 'Architecture review', category: 'work', done: false },
  { id: '4', date: today, time: '16:30', title: 'Sprint retro', category: 'work', done: false },
]

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    checkInFrequency: 'weekly',
    contactMethod: 'Slack',
    knownFor: 'Engineering mentor',
    nextCheckIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    notes: 'Ask about the new team structure',
  },
  {
    id: '2',
    name: 'Mom',
    checkInFrequency: 'weekly',
    contactMethod: 'Phone',
    knownFor: 'Family',
    nextCheckIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
  },
  {
    id: '3',
    name: 'Alex Rivera',
    checkInFrequency: 'bi-weekly',
    contactMethod: 'Coffee',
    knownFor: 'Former coworker, startup founder',
    nextCheckIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
  },
  {
    id: '4',
    name: 'Jordan Kim',
    checkInFrequency: 'monthly',
    contactMethod: 'Text',
    knownFor: 'College friend',
    nextCheckIn: new Date().toISOString(), // today
  },
]
