import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    input,
    model
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
    public readonly checked = model<boolean>(false)
    public readonly disabled = input(false, { transform: booleanAttribute })

    protected onToggle(): void {
        if (!this.disabled()) {
            this.checked.update(value => !value)
        }
    }
}