import {
    Component,
    computed,
    input,
    output
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BadgeComponent } from '../../../../shared/components/badge/badge.component'
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component'
import { IconComponent } from '../../../../shared/components/icon/icon.component'
import { Task } from '../../models/tasks.model'
import { ProgressRingComponent } from '../../../../shared/components/progress-ring/progress-ring.component'
import {
    getDurationBadge,
    getPriorityBadge,
    getTaskMetaData
} from '../../utils/task-display.utils'

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.scss',
    imports: [
        CommonModule,
        BadgeComponent,
        CheckboxComponent,
        IconComponent,
        ProgressRingComponent
    ]
})
export class TaskCardComponent {
    task = input.required<Task>()

    readonly taskClicked = output()

    priorityBadge = computed(() =>
        getPriorityBadge(this.task().priority)
    )

    durationBadge = computed(() =>
        getDurationBadge(this.task().duration)
    )

    metaDataItems = computed(() => getTaskMetaData(this.task()))

    onClickTask() {
        this.taskClicked.emit()
    }
}
