import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    input,
    OnDestroy,
    OutputRefSubscription
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BorderGroupChildComponent } from '../border-group-child/border-group-child.component'
import { Subscription } from 'rxjs'

export type HoverMode = 'individual-hover' | 'group-hover'

@Component({
    selector: 'app-border-group',
    standalone: true,
    templateUrl: 'border-group.component.html',
    styleUrl: 'border-group.component.scss',
    imports: [CommonModule]
})
export class BorderGroupComponent
    implements AfterContentInit, OnDestroy
{
    @ContentChildren(BorderGroupChildComponent)
    children!: QueryList<BorderGroupChildComponent>

    hoverMode = input<HoverMode>('individual-hover')

    private _childrenChangesSubscription?: Subscription
    private _mouseEventSubscriptions?: OutputRefSubscription[]

    ngAfterContentInit() {
        this._updateChildrenClasses()

        this._childrenChangesSubscription =
            this.children.changes.subscribe(() => {
                this._updateChildrenClasses()
            })
    }

    ngOnDestroy() {
        this._clearMouseEventSubscriptions()
        if (this._childrenChangesSubscription) {
            this._childrenChangesSubscription.unsubscribe()
        }
    }

    private _updateChildrenClasses(): void {
        this.children.forEach((child, index) => {
            this._updateChildPosition(
                child,
                index,
                this.children.length
            )

            this._updateMouseListeners(child)
        })
    }

    private _updateChildPosition(
        child: BorderGroupChildComponent,
        index: number,
        total: number
    ): void {
        if (total === 1) {
            child.position.set('single')
        } else if (index === 0) {
            child.position.set('first')
        } else if (index === total - 1) {
            child.position.set('last')
        } else {
            child.position.set('middle')
        }
    }

    private _updateMouseListeners(
        child: BorderGroupChildComponent
    ): void {
        if (this.hoverMode() === 'individual-hover') {
            const enterUnsub = child.mouseEnter.subscribe(() => {
                child.isHover.set(true)
            })

            const leaveUnsub = child.mouseLeave.subscribe(() => {
                child.isHover.set(false)
            })

            if (this._mouseEventSubscriptions) {
                this._mouseEventSubscriptions.push(
                    enterUnsub,
                    leaveUnsub
                )
            }
        }
    }

    private _clearMouseEventSubscriptions(): void {
        this._mouseEventSubscriptions?.forEach(sub =>
            sub.unsubscribe()
        )
        this._mouseEventSubscriptions = []
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
