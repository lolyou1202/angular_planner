export interface TaskFilter {
    search?: string
    priority?: ('neutral' | 'high' | 'medium' | 'low')[]
    duration?: ('quick' | 'long')[]
    completed?: boolean
    hasSubtasks?: boolean
    hasAttachments?: boolean
    dateRange?: {
        from: Date
        to: Date
    }
}
