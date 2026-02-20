import {
    ChangeDetectionStrategy,
    Component,
    booleanAttribute,
    input,
    output,
    signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../../icon/icon.component'
import { IconNames } from '../../icon/icon-names.type'
import { Direction } from '../border-group.model'

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
    public readonly withDividerBottom = input(false, {
        transform: booleanAttribute
    })

    public mouseEnter = output<void>()
    public mouseLeave = output<void>()

    public readonly isHover = signal<boolean>(false)
    public readonly direction = signal<Direction>('horizontal')

    protected onMouseEnter(): void {
        if (!this.disableHoverMode()) {
            this.mouseEnter.emit()
        }
    }

    protected onMouseLeave(): void {
        if (!this.disableHoverMode()) {
            this.mouseLeave.emit()
        }
    }
}
