import {
    DestroyRef,
    Directive,
    DOCUMENT,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    Renderer2
} from '@angular/core'
import { DragDropService } from '../services/drag-drop.service'
import { fromEvent, merge, filter, takeUntil, take } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

/**
 * Директива для перетаскиваемых элементов
 */
@Directive({
    selector: '[appDraggable]',
    standalone: true
})
export class DraggableDirective<T> implements OnDestroy {
    private readonly element = inject(ElementRef).nativeElement as HTMLElement
    private readonly dragDropService = inject(DragDropService<T>)
    private readonly destroyRef = inject(DestroyRef)
    private readonly renderer = inject(Renderer2)
    private readonly document = inject(DOCUMENT)

    private ghostElement: HTMLElement | null = null

    /** Данные для перетаскивания */
    public readonly appDraggableData = input.required<T>()

    /** ID зоны, к которой принадлежит элемент */
    public readonly appDraggableZone = input.required<string>()

    /** Селектор элемента для захвата (ручка перетаскивания) */
    public readonly appDraggableHandle = input.required<string>()

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        const target = event.target as HTMLElement
        const handleElement = this.element.querySelector(
            this.appDraggableHandle()
        )

        if (!handleElement) return

        const isHandle =
            target === handleElement || handleElement.contains(target)

        if (!isHandle) return

        event.preventDefault()

        const rect = this.element.getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top

        this.dragDropService.startDrag(
            this.appDraggableData(),
            this.appDraggableZone(),
            this.element,
            offsetX,
            offsetY
        )

        this.createGhostElement(event.clientX, event.clientY, offsetX, offsetY)
        this.handleDrag()
    }

    private createGhostElement(
        clientX: number,
        clientY: number,
        offsetX: number,
        offsetY: number
    ): void {
        const rect = this.element.getBoundingClientRect()

        // Клонируем элемент
        this.ghostElement = this.element.cloneNode(true) as HTMLElement

        // Добавляем класс ghost для стилизации
        this.renderer.addClass(this.ghostElement, 'ghost')

        // Устанавливаем CSS переменные для позиционирования
        this.renderer.setStyle(
            this.ghostElement,
            'left',
            `${clientX - offsetX}px`
        )
        this.renderer.setStyle(
            this.ghostElement,
            'top',
            `${clientY - offsetY}px`
        )
        this.renderer.setStyle(this.ghostElement, 'width', `${rect.width}px`)

        this.renderer.appendChild(this.document.body, this.ghostElement)
    }

    private updateGhostPosition(clientX: number, clientY: number): void {
        if (!this.ghostElement) return

        const offsetX = this.dragDropService.dragOffsetX()
        const offsetY = this.dragDropService.dragOffsetY()

        this.renderer.setStyle(
            this.ghostElement,
            'left',
            `${clientX - offsetX}px`
        )
        this.renderer.setStyle(
            this.ghostElement,
            'top',
            `${clientY - offsetY}px`
        )
    }

    private cleanupGhost(): void {
        if (this.ghostElement) {
            this.renderer.removeChild(this.document.body, this.ghostElement)
            this.ghostElement = null
        }
    }

    private handleDrag(): void {
        const mouseUp$ = fromEvent(this.document, 'mouseup')
        const mouseMove$ = fromEvent<MouseEvent>(this.document, 'mousemove')
        const escape$ = fromEvent<KeyboardEvent>(this.document, 'keydown').pipe(
            filter(e => e.key === 'Escape')
        )

        // Объединяем mouseUp и escape в один поток завершения
        const stopDrag$ = merge(mouseUp$, escape$).pipe(take(1))

        // Подписка на движение мыши
        const moveSubscription = mouseMove$
            .pipe(takeUntil(stopDrag$), takeUntilDestroyed(this.destroyRef))
            .subscribe(moveEvent => {
                moveEvent.preventDefault()
                requestAnimationFrame(() => {
                    this.updateGhostPosition(
                        moveEvent.clientX,
                        moveEvent.clientY
                    )
                })
            })

        // Подписка на завершение
        stopDrag$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
            moveSubscription.unsubscribe()
            this.cleanupGhost()

            if ((event as KeyboardEvent).key === 'Escape') {
                this.dragDropService.cancelDrag()
            } else {
                this.dragDropService.endDrag()
            }
        })
    }

    public ngOnDestroy(): void {
        this.cleanupGhost()
    }
}
