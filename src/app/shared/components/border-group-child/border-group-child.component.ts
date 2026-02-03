import {
    ChangeDetectionStrategy,
    Component,
    booleanAttribute,
    input,
    output,
    signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'
import { IconNames } from '../icon/icon-names.type'
import { BorderGroupPosition } from './border-group-child-position.type'

@Component({
    selector: 'app-border-group-child',
    standalone: true,
    templateUrl: 'border-group-child.component.html',
    styleUrl: 'border-group-child.component.scss',
    imports: [CommonModule, IconComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorderGroupChildComponent {
    public readonly icon = input<IconNames>()
    public readonly text = input<string>()
    public readonly disableHoverMode = input(false, {
        transform: booleanAttribute
    })

    public position = signal<BorderGroupPosition | null>(null)
    public isHover = signal<boolean>(false)

    public mouseEnter = output<void>()
    public mouseLeave = output<void>()

    public onMouseEnter(): void {
        this.mouseEnter.emit()
    }
    public onMouseLeave(): void {
        this.mouseLeave.emit()
    }
}
