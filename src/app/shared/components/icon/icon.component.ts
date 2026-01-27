import { Component, HostBinding, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { cn } from '../../../utils/cn'

export type IconNames =
    | 'flag'
    | 'double-chevron-bottom-circle'
    | 'double-chevron-top-circle'
    | 'check'
    | 'drag'
    | 'calendar'
    | 'file'
    | 'link'
    | 'plus'
    | 'more'
    | 'search'
    | 'cross'

@Component({
    selector: 'app-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss'
})
export class IconComponent {
    name = input.required<IconNames>()
    color = input<string>()

    @HostBinding('class')
    get hostClass() {
        return cn('app-icon')
    }
    @HostBinding('style.color')
    get hostStyleColor() {
        return this.color()
    }
}
