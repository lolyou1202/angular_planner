import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    inject
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { Task } from '../../models/tasks.model'
import { DURATION_MAP, PRIORITY_MAP } from '../../constants/map.constants'
import { getTaskMetaData } from '../../utils/task-display.utils'
import { BadgeComponent } from '../../../../shared/components/badge/badge.component'
import { IconComponent } from '../../../../shared/components/icon/icon.component'
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component'
import { ProgressRingComponent } from '../../../../shared/components/progress-ring/progress-ring.component'
import { DraggableDirective } from '../../../../shared/directives/draggable.directive'
import { DragDropService } from '../../../../shared/services/drag-drop.service'

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.scss',
    imports: [
        CommonModule,
        BadgeComponent,
        CheckboxComponent,
        IconComponent,
        ProgressRingComponent,
        DraggableDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {
    public readonly task = input.required<Task>()
    public readonly groupId = input.required<string>() // ID группы для drag&drop

    public readonly taskClicked = output()

    private readonly dragDropService = inject(DragDropService<Task>)

    protected readonly isDragging = computed(
        () =>
            this.dragDropService.isDragging() &&
            this.dragDropService.draggedItem()?.id === this.task().id
    )

    protected readonly priorityBadge = computed(
        () => PRIORITY_MAP[this.task().priority]
    )

    protected readonly durationBadge = computed(() => {
        const duration = this.task().duration

        if (duration) {
            return DURATION_MAP[duration]
        } else {
            return null
        }
    })

    protected readonly metaDataItems = computed(() =>
        getTaskMetaData(this.task())
    )

    protected onClickTask(): void {
        this.taskClicked.emit()
    }
}
