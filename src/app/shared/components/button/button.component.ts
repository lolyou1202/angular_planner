import {
    ChangeDetectionStrategy,
    Component,
    input,
    output
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'
import { IconNames } from '../icon/icon-names.type'
import { ButtonVariant, IconPosition } from './button.types'

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
    public readonly variant = input<ButtonVariant>('white-bordered')
    public readonly text = input<string>()
    public readonly iconName = input<IconNames>()
    public readonly iconPosition = input<IconPosition>('left')
    public readonly disabled = input<boolean>()

    public clicked = output<void>()

    public onClick(): void {
        if (this.disabled()) return
        this.clicked.emit()
    }
}
