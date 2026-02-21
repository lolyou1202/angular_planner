import { Component, input } from '@angular/core'
import { Group } from '../../models/tasks.model'
import { TaskCardComponent } from '../task-card/task-card.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'

@Component({
    selector: 'app-task-group',
    templateUrl: './task-group.component.html',
    styleUrl: './task-group.component.scss',
    imports: [ButtonComponent, TaskCardComponent]
})
export class TaskGroupComponent {
    public readonly group = input.required<Group>()

    protected onClickMore(): void {
        console.log('more')
    }
    protected onClickAddTask(): void {
        console.log('add task')
    }
    protected onClickTask({ taskId }: { taskId: string }): void {
        console.log(`task ${taskId}`)
    }
}