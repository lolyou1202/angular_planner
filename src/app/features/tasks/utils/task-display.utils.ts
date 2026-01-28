import { ColorScheme } from '../../../shared/components/badge/badge.component'
import { IconNames } from '../../../shared/components/icon/icon.component'
import {
    Priority,
    Task,
    TaskDuration
} from '../models/tasks.model'
import { formatShortDate } from './date.utils'

export type MetaDataItem = {
    icon: IconNames | 'progress-ring'
    text: string
}
export type TaskMetaData = Pick<
    Task,
    | 'targetDate'
    | 'countAttachedFiles'
    | 'countAttachedLinks'
    | 'totalSubtasks'
    | 'completedSubtasks'
>

export function getTaskMetaData({
    targetDate,
    countAttachedFiles,
    countAttachedLinks,
    completedSubtasks,
    totalSubtasks
}: TaskMetaData): MetaDataItem[] {
    const items: MetaDataItem[] = []

    if (targetDate) {
        items.push({
            icon: 'calendar',
            text: formatShortDate(targetDate)
        })
    }

    if (countAttachedFiles && countAttachedFiles > 0) {
        items.push({
            icon: 'file',
            text: countAttachedFiles.toString()
        })
    }

    if (countAttachedLinks && countAttachedLinks > 0) {
        items.push({
            icon: 'link',
            text: countAttachedLinks.toString()
        })
    }

    if (totalSubtasks && completedSubtasks != null) {
        items.push({
            icon: 'progress-ring',
            text: `${completedSubtasks}/${totalSubtasks}`
        })
    }

    return items
}

export interface DurationBadge {
    text: string
    color: ColorScheme
}

export function getDurationBadge(
    duration?: TaskDuration
): DurationBadge | null {
    if (!duration) return null

    const map: Record<
        TaskDuration,
        { text: string; color: ColorScheme }
    > = {
        quick: { text: 'Быстро', color: 'blue' },
        long: { text: 'Долго', color: 'orange' }
    }
    if (duration && duration in map) {
        return map[duration]
    }
    return null
}

export function getPriorityBadge(
    priority: Priority
): ColorScheme {
    const map: Record<Priority, ColorScheme> = {
        low: 'green',
        medium: 'yellow',
        high: 'red',
        neutral: 'gray'
    }
    return map[priority]
}
