export type Group = {
    id: string
    name: string
    color: string
    tasks: Task[]
}

export type Task = {
    id: string
    completed: boolean
    archived: boolean
    title: string
    description?: string
    priority: Priority
    duration?: TaskDuration
    countAttachedLinks?: number
    countAttachedFiles?: number
    totalSubtasks?: number
    completedSubtasks?: number
    targetDate?: string
}

export type Priority = 'low' | 'medium' | 'high' | 'neutral'
export type TaskDuration = 'quick' | 'long'