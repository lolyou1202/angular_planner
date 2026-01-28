import {
    Component,
    booleanAttribute,
    input,
    output,
    signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconNames, IconComponent } from '../icon/icon.component'

export type BorderGroupPosition =
    | 'first'
    | 'middle'
    | 'last'
    | 'single'

@Component({
    selector: 'app-border-group-child',
    standalone: true,
    templateUrl: 'border-group-child.component.html',
    styleUrl: 'border-group-child.component.scss',
    imports: [CommonModule, IconComponent]
})
export class BorderGroupChildComponent {
    icon = input<IconNames>()
    text = input<string>()
    disableHoverMode = input(false, {
        transform: booleanAttribute
    })

    position = signal<BorderGroupPosition | null>(null)
    isHover = signal<boolean>(false)

    mouseEnter = output<void>()
    mouseLeave = output<void>()

    onMouseEnter() {
        this.mouseEnter.emit()
    }
    onMouseLeave() {
        this.mouseLeave.emit()
    }
}
