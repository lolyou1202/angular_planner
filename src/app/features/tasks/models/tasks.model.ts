export type Task = {
    id: string
    completed: boolean
    //status: Status
    title: string
    description?: string
    priority: Priority
    duration?: TaskDuration
    countAttachedLinks?: number
    countAttachedFiles?: number
    totalSubtasks?: number
    completedSubtasks?: number
    targetDate: string
}
export type Group = {
    id: string
    name: string
    color: string
    tasks: Task[]
}

//export type Status =
//    | 'empty'
//    | 'not-started'
//    | 'in-progress'
//    | 'in-review'
//    | 'hold'
//    | 'backlog'
//    | 'archived'
//    | 'blocked'
//    | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'neutral'
export type TaskDuration = 'quick' | 'long'

export const priorityMap = {
    high: { label: 'Высокий', colorScheme: 'red' },
    medium: { label: 'Средний', colorScheme: 'yellow' },
    low: { label: 'Низкий', colorScheme: 'green' },
    neutral: { label: 'Обычный', colorScheme: 'gray' }
}
