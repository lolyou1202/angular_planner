import { Component, DestroyRef, inject, signal } from '@angular/core'
import { TaskGroupComponent } from '../task-group/task-group.component'
import { Group, Task } from '../../models/tasks.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { DragDropService } from '../../../../shared/services/drag-drop.service'

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrl: './task-board.component.scss',
    imports: [TaskGroupComponent]
})
export class TaskBoardComponent {
    protected readonly groups = signal<Group[]>([
        {
            id: 'group-01',
            name: 'Домашнее',
            color: 'blue',
            tasks: [
                {
                    id: 'task-1',
                    completed: true,
                    archived: true,
                    title: 'фывфф',
                    description:
                        'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 3,
                    totalSubtasks: 8,
                    countAttachedFiles: 6,
                    countAttachedLinks: 2,
                    duration: 'long',
                    priority: 'medium',
                    targetDate: '2024-11-24T00:00:00Z'
                },
                {
                    id: 'task-2',
                    completed: false,
                    archived: false,
                    title: 'Протереть пыль',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    //completedSubtasks: 3,
                    //totalSubtasks: 8,
                    //countAttachedFiles: 6,
                    //countAttachedLinks: 2,
                    //duration: 'quick',
                    priority: 'neutral'
                    //targetDate: '2024-11-04T00:00:00Z'
                },
                {
                    id: 'task-10',
                    completed: false,
                    archived: false,
                    title: 'Протереть пыль',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 0,
                    totalSubtasks: 3,
                    //countAttachedFiles: 6,
                    //countAttachedLinks: 2,
                    //duration: 'quick',
                    priority: 'neutral'
                    //targetDate: '2024-11-04T00:00:00Z'
                }
            ]
        },
        {
            id: 'group-02',
            name: 'Рабочее',
            color: '#ff00ff',
            tasks: [
                {
                    id: 'task-3',
                    completed: false,
                    archived: false,
                    title: 'фывфф',
                    //description:
                    //'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 2,
                    totalSubtasks: 10,
                    //countAttachedFiles: 6,
                    countAttachedLinks: 2,
                    duration: 'long',
                    priority: 'high'
                    //targetDate: '2024-11-04T00:00:00Z'
                },
                {
                    id: 'task-4',
                    completed: true,
                    archived: false,
                    title: 'Протереть пыль',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 4,
                    totalSubtasks: 4,
                    //countAttachedFiles: 6,
                    //countAttachedLinks: 2,
                    duration: 'quick',
                    priority: 'low',
                    targetDate: '2024-11-04T00:00:00Z'
                },
                {
                    id: 'task-5',
                    completed: true,
                    archived: false,
                    title: 'Помыть полы',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 3,
                    totalSubtasks: 4,
                    countAttachedFiles: 2,
                    duration: 'quick',
                    priority: 'neutral',
                    targetDate: '2024-08-23T00:00:00Z'
                }
            ]
        }
    ])

    private dragDropService = inject(DragDropService<Task>)
    private destroyRef = inject(DestroyRef)

    protected ngOnInit(): void {
        this.dragDropService.dropComplete$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ data: task, sourceId, targetId, targetIndex }) => {
                if (task && sourceId && targetId && targetIndex !== -1) {
                    this.moveTask(task, sourceId, targetId, targetIndex)
                }
            })
    }

    private moveTask(
        task: Task,
        sourceGroupId: string,
        targetGroupId: string,
        targetIndex: number
    ): void {
        this.groups.update(groups => {
            const newGroups = groups.map(g => ({
                ...g,
                tasks: [...g.tasks]
            }))

            const sourceGroup = newGroups.find(g => g.id === sourceGroupId)
            const targetGroup = newGroups.find(g => g.id === targetGroupId)
            if (!sourceGroup || !targetGroup) return groups

            const taskIndex = sourceGroup.tasks.findIndex(t => t.id === task.id)
            if (taskIndex === -1) return groups

            const [removedTask] = sourceGroup.tasks.splice(taskIndex, 1)
            
            const adjustedTargetIndex = 
                sourceGroupId === targetGroupId && taskIndex < targetIndex
                    ? targetIndex - 1
                    : targetIndex
            
            targetGroup.tasks.splice(adjustedTargetIndex, 0, removedTask)

            return newGroups
        })
    }
}
