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
    public readonly name = input.required<IconNames>()
    public readonly color = input<string>()
    public readonly size = input<string>()

    @HostBinding('style.--icon-color')
    public get hostStyleColor(): string | undefined {
        return this.color()
    }
    @HostBinding('style.--icon-size')
    public get hostStyleSize(): string | undefined {
        return this.size()
    }
}
