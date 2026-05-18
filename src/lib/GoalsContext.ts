import { createContext } from 'react'
import type { Goal, GoalCategory, GoalLevel } from '../types'

interface GoalsContextType {
  goals: Goal[]
  currentWeekGoals: Goal[]
  getGoalById: (id: string) => Goal | undefined
  getChildGoals: (parentId: string) => Goal[]
  getGoalsByCategory: (category: GoalCategory) => Goal[]
  getGoalsByLevel: (level: GoalLevel) => Goal[]
}

export const GoalsContext = createContext<GoalsContextType>({} as GoalsContextType)
