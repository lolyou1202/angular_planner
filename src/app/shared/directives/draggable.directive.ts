import {
    DestroyRef,
    Directive,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy
} from '@angular/core'
import { DragDropService } from '../services/drag-drop.service'
import { animationFrameScheduler, observeOn, takeUntil } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { DragGhostService } from '../services/drag-ghost.service'
import { DragHandlerService } from '../services/drag-handler.service'

@Directive({
    selector: '[appDraggable]',
    standalone: true,
    providers: [DragHandlerService, DragGhostService]
})
export class DraggableDirective<T> implements OnDestroy {
    private readonly _element = inject(ElementRef).nativeElement as HTMLElement
    private readonly _destroyRef = inject(DestroyRef)
    private readonly _dragDropService = inject(DragDropService<T>)
    private readonly _ghostService = inject(DragGhostService)
    private readonly _handlerService = inject(DragHandlerService)

    public readonly appDraggableData = input.required<T>()
    public readonly appDraggableZone = input.required<string>()
    public readonly appDraggableHandle = input.required<string>()

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        if (!this._isHandleClick(event)) return

        this._cleanup()

        const rect = this._element.getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top

        this._dragDropService.startDrag(
            this.appDraggableData(),
            this.appDraggableZone(),
            this._element,
            offsetX,
            offsetY
        )

        this._ghostService.createGhost(
            this._element,
            event.clientX,
            event.clientY,
            offsetX,
            offsetY
        )

        this._dragHandling(event, offsetX, offsetY)
    }

    private _isHandleClick(event: MouseEvent): boolean {
        const target = event.target as HTMLElement
        const handleElement = this._element.querySelector(
            this.appDraggableHandle()
        )

        if (!handleElement) return false

        return target === handleElement || handleElement.contains(target)
    }

    private _dragHandling(
        event: MouseEvent,
        offsetX: number,
        offsetY: number
    ): void {
        const { move$, end$ } = this._handlerService.getDragStreams(event)

        move$
            .pipe(
                takeUntil(end$),
                takeUntilDestroyed(this._destroyRef),
                observeOn(animationFrameScheduler)
            )
            .subscribe(moveEvent => {
                this._ghostService.updatePosition(
                    moveEvent.clientX,
                    moveEvent.clientY,
                    offsetX,
                    offsetY
                )
            })

        end$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(endEvent => {
            if (endEvent.type === 'cancel') {
                this._dragDropService.cancelDrag()
            } else {
                this._dragDropService.endDrag()
            }

            this._cleanup()
        })
    }

    private _cleanup(): void {
        this._ghostService.removeGhost()
    }

    public ngOnDestroy(): void {
        this._cleanup()
    }
}
