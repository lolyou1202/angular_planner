import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BorderGroupChildComponent } from '../border-group-child/border-group-child.component'

export type HoverMode = 'individual-hover' | 'group-hover'

@Component({
    selector: 'app-border-group',
    standalone: true,
    templateUrl: 'border-group.component.html',
    styleUrl: 'border-group.component.scss',
    imports: [CommonModule]
})
export class BorderGroupComponent implements AfterContentInit {
    @ContentChildren(BorderGroupChildComponent)
    children!: QueryList<BorderGroupChildComponent>

    hoverMode = input<HoverMode>('individual-hover')

    ngAfterContentInit() {
        this.children.forEach(child => {
            if (this.hoverMode() === 'individual-hover') {
                child.mouseEnter.subscribe(() =>
                    child.isHover.set(true)
                )
                child.mouseLeave.subscribe(() =>
                    child.isHover.set(false)
                )
            }
        })
    }

    onMouseEnter() {
        if (this.hoverMode() === 'group-hover') {
            this.children.forEach(child => {
                child.isHover.set(true)
            })
        }
    }
    onMouseLeave() {
        if (this.hoverMode() === 'group-hover') {
            this.children.forEach(child => {
                child.isHover.set(false)
            })
        }
    }
}
