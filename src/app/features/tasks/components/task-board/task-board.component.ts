import { Component, inject } from '@angular/core'
import { TaskGroupComponent } from '../task-group/task-group.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { FilterComponent } from '../../../../shared/components/filter/filter.component'
import { InputComponent } from '../../../../shared/components/input/input.component'
import { Group, Task } from '../../models/tasks.model'
import { FilterModalComponent } from '../../../../shared/components/filter/filter-modal/filter-modal.component'
import { FilterService } from '../../../../shared/components/filter/filter.service'

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrl: './task-board.component.scss',
    imports: [
        TaskGroupComponent,
        ButtonComponent,
        FilterComponent,
        InputComponent
    ]
})
export class TaskBoardComponent {
    //private _filterService = inject(FilterService<Task>)

    protected readonly FilterModalComponent =
        FilterModalComponent

    groups: Group[] = [
        {
            id: 'group-01',
            name: 'Домашнее',
            color: 'blue',
            tasks: [
                {
                    id: 'task-1334',
                    completed: false,
                    title: 'фывфф',
                    description:
                        'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 3,
                    totalSubtasks: 8,
                    countAttachedFiles: 6,
                    countAttachedLinks: 2,
                    duration: 'long',
                    priority: 'neutral',
                    targetDate: '2024-11-04T00:00:00Z'
                },
                {
                    id: 'task-1402',
                    completed: false,
                    title: 'Протереть пыль',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    //completedSubtasks: 3,
                    //totalSubtasks: 8,
                    //countAttachedFiles: 6,
                    //countAttachedLinks: 2,
                    duration: 'quick',
                    priority: 'neutral',
                    targetDate: '2024-11-04T00:00:00Z'
                }
            ]
        },
        {
            id: 'group-02',
            name: 'Рабочее',
            color: 'red',
            tasks: [
                {
                    id: 'task-1344',
                    completed: false,
                    title: 'фывфф',
                    description:
                        'Протереть пф as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 3,
                    totalSubtasks: 8,
                    countAttachedFiles: 6,
                    countAttachedLinks: 2,
                    duration: 'long',
                    priority: 'neutral',
                    targetDate: '2024-11-04T00:00:00Z'
                },
                {
                    id: 'task-1702',
                    completed: false,
                    title: 'Протереть пыль',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 3,
                    totalSubtasks: 8,
                    countAttachedFiles: 6,
                    countAttachedLinks: 2,
                    duration: 'quick',
                    priority: 'neutral',
                    targetDate: '2024-11-04T00:00:00Z'
                },
                {
                    id: 'task-1494',
                    completed: true,
                    title: 'Помыть полы',
                    description:
                        'Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv Протереть пыль dsfdas f af asdf as f asdf sad f sdfsdfsd fsdf sdf sd fsdqwwwFWNKF F SDF SDAB Sv',
                    completedSubtasks: 1,
                    totalSubtasks: 4,
                    countAttachedLinks: 3,
                    duration: 'long',
                    priority: 'high',
                    targetDate: '2024-08-23T00:00:00Z'
                }
            ]
        }
    ]
}
