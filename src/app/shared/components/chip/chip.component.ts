import { Component, input, output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BorderGroupComponent } from '../border-group/border-group.component'
import { BorderGroupChildComponent } from '../border-group/border-group-child/border-group-child.component'

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule, BorderGroupComponent, BorderGroupChildComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  public label = input.required<string>()

  public removed = output()

  public removeChip(): void {
    this.removed.emit()
  }
}
