import { ColorScheme } from '../../../shared/components/badge/badge.model'
import { Priority, TaskDuration } from '../models/tasks.model'

export const PRIORITY_MAP: Record<
    Priority,
    { label: string; colorScheme: ColorScheme }
> = {
    high: { label: 'Высокий', colorScheme: 'red' },
    medium: { label: 'Средний', colorScheme: 'yellow' },
    low: { label: 'Низкий', colorScheme: 'green' },
    neutral: { label: 'Обычный', colorScheme: 'gray' }
}

export const DURATION_MAP: Record<
    TaskDuration,
    { label: string; colorScheme: ColorScheme }
> = {
    quick: { label: 'Быстро', colorScheme: 'blue' },
    long: { label: 'Долго', colorScheme: 'orange' }
}