import { Component, input } from '@angular/core'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { TaskCardComponent } from '../task-card/task-card.component'
import { Group } from '../../models/tasks.model'

@Component({
    selector: 'app-task-group',
    templateUrl: './task-group.component.html',
    styleUrl: './task-group.component.scss',
    imports: [ButtonComponent, TaskCardComponent]
})
export class TaskGroupComponent {
    group = input.required<Group>()

    onClickMore() {}
    onClickAddTask() {}
    onClickTask({ taskId }: { taskId: string }) {}
}
