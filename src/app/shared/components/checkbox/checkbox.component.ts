import { Component, input, model } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
    checked = model<boolean>(false)
    disabled = input<boolean>(false)

    onToggle() {
        if (this.disabled()) return
        this.checked.update(value => !value)
    }
}
