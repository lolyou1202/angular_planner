import {
    Component,
    booleanAttribute,
    input,
    model,
    output
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent, IconNames } from '../icon/icon.component'

export type ColorScheme =
    | 'orange'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'red'
    | 'gray'
    | 'purple'
    | 'done'

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss'
})
export class BadgeComponent {
    text = input<string>()
    iconName = input<IconNames>()
    colorScheme = input<ColorScheme>('gray')
    withToggle = input(false, {
        transform: booleanAttribute
    })

    isActive = model<boolean>(false)
    toggled = output<boolean>()

    toggle() {
        if (this.withToggle()) {
            this.isActive.update(state => !state)
            this.toggled.emit(this.isActive())
        }
    }
}
