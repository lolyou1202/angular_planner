import { Component, inject, input, computed } from '@angular/core'
import { Group, Task } from '../../models/tasks.model'
import { TaskCardComponent } from '../task-card/task-card.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { DragDropService } from '../../../../shared/services/drag-drop.service'
import { DropZoneDirective } from '../../../../shared/directives/drop-zone.directive'
import { DropIndicatorDirective } from '../../../../shared/directives/drop-indicator.directive'

@Component({
    selector: 'app-task-group',
    templateUrl: './task-group.component.html',
    styleUrl: './task-group.component.scss',
    imports: [ButtonComponent, TaskCardComponent, DropZoneDirective, DropIndicatorDirective]
})
export class TaskGroupComponent {
    public readonly group = input.required<Group>()
    public readonly groupId = computed(() => this.group().id)

    protected readonly dragDropService = inject(DragDropService<Task>)

    protected readonly dropIndex = computed(() => {
        const targetZoneId = this.dragDropService.targetZoneId()
        if (targetZoneId !== this.groupId()) return -1
        return this.dragDropService.targetIndex()
    })

    protected readonly showIndicator = computed(() =>
        this.dragDropService.isDragging()
    )

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
