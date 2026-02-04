import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-bordered-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bordered-container.component.html',
    styleUrl: './bordered-container.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorderedContainerComponent {
    public readonly withHoverMode = input(false, {
        transform: booleanAttribute
    })
    public readonly isHover = input<boolean>(false)
}
