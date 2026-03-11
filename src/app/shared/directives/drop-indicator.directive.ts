import { Directive, inject, input, ElementRef, DestroyRef } from '@angular/core'
import { DragDropService } from '../services/drag-drop.service'
import { filter, fromEvent } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Directive({
    selector: '[appDropIndicator]',
    standalone: true
})
export class DropIndicatorDirective {
    private readonly element = inject(ElementRef).nativeElement as HTMLElement
    private readonly destroyRef = inject(DestroyRef)
    private readonly dragDropService = inject(DragDropService)

    public readonly appDropIndicatorIndex = input.required<number>()
    public readonly appDropIndicatorZone = input.required<string>()

    private _watchDragOver(): void {
        fromEvent<MouseEvent>(this.element, 'mouseover')
            .pipe(
                filter(() => this.dragDropService.isDragging()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.dragDropService.updateTarget(
                    this.appDropIndicatorZone(),
                    this.appDropIndicatorIndex()
                )
            })
    }

    public ngOnInit(): void {
        this._watchDragOver()
    }
}
