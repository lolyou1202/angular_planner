import {
    ChangeDetectionStrategy,
    Component,
    booleanAttribute,
    input,
    model
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'
import { IconNames } from '../icon/icon-names.type'
import { ColorScheme } from './badge.model'

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
    public readonly text = input<string>()
    public readonly iconName = input<IconNames>()
    public readonly colorScheme = input<ColorScheme>('gray')
    public readonly withToggle = input(false, {
        transform: booleanAttribute
    })

    public readonly isActive = model<boolean>(false)

    protected toggle(): void {
        if (this.withToggle()) {
            this.isActive.update(state => !state)
        }
    }
}