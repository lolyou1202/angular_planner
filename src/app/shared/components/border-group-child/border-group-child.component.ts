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
import { BorderedContainerComponent } from '../bordered-container/bordered-container.component'

@Component({
    selector: 'app-border-group-child',
    standalone: true,
    templateUrl: 'border-group-child.component.html',
    styleUrl: 'border-group-child.component.scss',
    imports: [CommonModule, BorderedContainerComponent, IconComponent],
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
        if (this.disableHoverMode()) return
        this.mouseEnter.emit()
    }
    public onMouseLeave(): void {
        if (this.disableHoverMode()) return
        this.mouseLeave.emit()
    }
}
