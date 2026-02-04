import { Component, input, output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'
import { IconNames } from '../icon/icon-names.type'
import { ButtonSize, ButtonVariant, IconPosition } from './button.types'
import { BorderedContainerComponent } from '../bordered-container/bordered-container.component'

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule, IconComponent, BorderedContainerComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    public readonly variant = input<ButtonVariant>('white-bordered')
    public readonly text = input<string>()
    public readonly icon = input<IconNames>()
    public readonly iconPosition = input<IconPosition>('left')
    public readonly size = input<ButtonSize>('md')
    public readonly disabled = input<boolean>()

    public clicked = output<void>()

    public onClick(): void {
        if (this.disabled()) return
        this.clicked.emit()
    }
}
