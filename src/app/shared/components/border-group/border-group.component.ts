import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    input,
    inject,
    DestroyRef,
    OutputRefSubscription,
    ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BorderGroupChildComponent } from './border-group-child/border-group-child.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Direction, HoverMode } from './border-group.model'

@Component({
    selector: 'app-border-group',
    standalone: true,
    templateUrl: 'border-group.component.html',
    styleUrl: 'border-group.component.scss',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorderGroupComponent implements AfterContentInit {
    @ContentChildren(BorderGroupChildComponent)
    private _children!: QueryList<BorderGroupChildComponent>

    public readonly hoverMode = input<HoverMode>('individual-hover')
    public readonly direction = input<Direction>('horizontal')

    private _destroyRef = inject(DestroyRef)
    private _subscriptions: {
        [key: number]: { [key in 'enter' | 'leave']: OutputRefSubscription }
    } = {}

    public ngAfterContentInit(): void {
        this._updateChildrenClasses()

        this._children.changes
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this._updateChildrenClasses()
            })
    }

    private _updateChildrenClasses(): void {
        this._clearAllSubscriptions()

        this._children.forEach((child, index) => {
            child.direction.set(this.direction())

            this._setupMouseListeners(child, index)
        })
    }

    private _setupMouseListeners(
        child: BorderGroupChildComponent,
        index: number
    ): void {
        if (this.hoverMode() === 'individual-hover') {
            this._subscriptions[index] = {
                enter: child.mouseEnter.subscribe(() => {
                    if (!child.disableHoverMode()) {
                        child.isHover.set(true)
                    }
                }),
                leave: child.mouseLeave.subscribe(() => {
                    if (!child.disableHoverMode()) {
                        child.isHover.set(false)
                    }
                })
            }
        }
    }

    private _clearAllSubscriptions(): void {
        Object.values(this._subscriptions).forEach(sub => {
            if (sub.enter) sub.enter.unsubscribe()
            if (sub.leave) sub.leave.unsubscribe()
        })
        this._subscriptions = {}
    }

    public onMouseEnter(): void {
        if (this.hoverMode() === 'group-hover') {
            this._children.forEach(child => {
                if (!child.disableHoverMode()) {
                    child.isHover.set(true)
                }
            })
        }
    }

    public onMouseLeave(): void {
        if (this.hoverMode() === 'group-hover') {
            this._children.forEach(child => {
                child.isHover.set(false)
            })
        }
    }
}
