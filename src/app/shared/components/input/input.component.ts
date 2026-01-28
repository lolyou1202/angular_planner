import { Component, input, model, output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent, IconNames } from '../icon/icon.component'

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent {
    text = model<string>('')
    placeholder = input<string>()
    leftIconName = input<IconNames>()

	onClickLeftIcon = output()

    onInput(event: Event) {
        const value = (event.target as HTMLInputElement).value
        this.text.set(value)
    }

    clearInput() {
        this.text.set('')
    }
}
