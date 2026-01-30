import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconNames } from './icon-names.type'

@Component({
    selector: 'app-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
    name = input.required<IconNames>()
    color = input<string>()

    @HostBinding('style.color')
    get hostStyleColor() {
        return this.color()
    }
}
