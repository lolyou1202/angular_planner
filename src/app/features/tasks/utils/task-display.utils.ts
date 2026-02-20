import { Task } from '../models/tasks.model'
import { formatShortDate } from './date.utils'
import { IconNames } from '../../../shared/components/icon/icon-names.type'

export type MetaDataItem = {
    icon: IconNames | 'progress-ring'
    label: string
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
            label: formatShortDate(targetDate)
        })
    }

    if (countAttachedFiles && countAttachedFiles > 0) {
        items.push({
            icon: 'file',
            label: countAttachedFiles.toString()
        })
    }

    if (countAttachedLinks && countAttachedLinks > 0) {
        items.push({
            icon: 'link',
            label: countAttachedLinks.toString()
        })
    }

    if (totalSubtasks && completedSubtasks != null) {
        items.push({
            icon: 'progress-ring',
            label: `${completedSubtasks}/${totalSubtasks}`
        })
    }

    return items
}