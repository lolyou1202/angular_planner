import { Component, input, output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent, IconNames } from '../icon/icon.component'
import { BorderGroupComponent } from '../border-groupe/border-group.component'
import { BorderGroupChildComponent } from '../border-group-child/border-group-child.component'

export type Variant = 'white-bordered' | 'primary' | 'transparent'
export type IconPosition = 'left' | 'right'
export type PositionInGroupe = 'first' | 'middle' | 'last'
export type Size = 'sm' | 'md' | 'lg'

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        BorderGroupComponent,
        BorderGroupChildComponent
    ],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    variant = input<Variant>('white-bordered')
    text = input<string>()
    icon = input<IconNames>()
    iconPosition = input<IconPosition>('left')
    size = input<Size>('md')
    disabled = input<boolean>()
    className = input<string>('')

    readonly clicked = output<void>()

    onClick() {
        if (this.disabled()) return
        this.clicked.emit()
    }
}
