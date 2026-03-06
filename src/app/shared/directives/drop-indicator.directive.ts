import { Directive, inject, input, HostListener } from '@angular/core'
import { DragDropService } from '../services/drag-drop.service'

/**
 * Директива drop-индикатора
 *
 * Обновляет целевую зону при наведении курсора
 */
@Directive({
    selector: '[appDropIndicator]',
    standalone: true
})
export class DropIndicatorDirective {
    private readonly dragDropService = inject(DragDropService)

    /** Индекс вставки */
    public readonly appDropIndicatorIndex = input.required<number>()

    /** ID зоны */
    public readonly appDropIndicatorZone = input.required<string>()

    @HostListener('mouseenter')
    protected onMouseEnter(): void {
        if (this.dragDropService.isDragging()) {
            this.dragDropService.updateTarget(
                this.appDropIndicatorZone(),
                this.appDropIndicatorIndex()
            )
        }
    }

    @HostListener('mouseleave')
    protected onMouseLeave(): void {
        if (this.dragDropService.isDragging()) {
            this.dragDropService.updateTarget(null, -1)
        }
    }
}


