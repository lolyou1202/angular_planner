import { Component } from '@angular/core'
import { TaskGroupComponent } from '../task-group/task-group.component'
import { Group } from '../../models/tasks.model'

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrl: './task-board.component.scss',
    imports: [TaskGroupComponent]
})
export class TaskBoardComponent {
    protected readonly groups: Group[] = [
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
                    priority: 'neutral',
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
                    priority: 'neutral',
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
                    priority: 'high',
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
    ]
}