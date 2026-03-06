import { computed, Injectable, signal } from '@angular/core'
import { Subject } from 'rxjs'

/**
 * Результат перетаскивания
 */
export interface DropResult<T = unknown> {
    data: T
    sourceId: string
    targetId: string
    targetIndex: number
}

/**
 * Событие наведения на индикатор
 */
export interface IndicatorHoverEvent {
    zoneId: string
    index: number
}

/**
 * Интерфейс для drop-зоны
 */
export interface DropZone {
    id: string
    element: HTMLElement
    /** Поток событий наведения на индикаторы */
    indicatorHover$: Subject<IndicatorHoverEvent | null>
}

@Injectable({ providedIn: 'root' })
export class DragDropService<T = unknown> {
    private dragState = signal<DragState<T> | null>(null)
    private targetZoneIdInternal = signal<string | null>(null)
    private targetIndexInternal = signal<number>(-1)
    private isDraggingInternal = signal(false)

    private dropZones = new Set<DropZone>()

    private dropCompleteSubject = new Subject<DropResult<T>>()
    public readonly dropComplete$ = this.dropCompleteSubject.asObservable()

    // Computed signals для публичного API
    public readonly isDragging = computed(() => this.isDraggingInternal())
    public readonly draggedItem = computed(() => this.dragState()?.data ?? null)
    public readonly sourceId = computed(() => this.dragState()?.sourceId ?? null)
    public readonly draggedElement = computed(
        () => this.dragState()?.element ?? null
    )
    public readonly dragOffsetX = computed(() => this.dragState()?.offsetX ?? 0)
    public readonly dragOffsetY = computed(() => this.dragState()?.offsetY ?? 0)
    public readonly targetZoneId = computed(() => this.targetZoneIdInternal())
    public readonly targetIndex = computed(() => this.targetIndexInternal())

    /**
     * Регистрация drop-зоны
     */
    public registerDropZone(zone: DropZone): void {
        this.dropZones.add(zone)
    }

    /**
     * Удаление drop-зоны
     */
    public unregisterDropZone(zone: DropZone): void {
        this.dropZones.delete(zone)
    }

    /**
     * Начало перетаскивания
     */
    public startDrag(
        data: T,
        sourceZoneId: string,
        element: HTMLElement,
        offsetX: number,
        offsetY: number
    ): void {
        this.dragState.set({
            data,
            sourceId: sourceZoneId,
            element,
            offsetX,
            offsetY
        })
        this.targetZoneIdInternal.set(sourceZoneId)
        this.targetIndexInternal.set(0)
        this.isDraggingInternal.set(true)
    }

    /**
     * Обновление целевой зоны и индекса
     */
    public updateTarget(zoneId: string | null, index: number): void {
        if (!this.isDraggingInternal()) return
        this.targetZoneIdInternal.set(zoneId)
        this.targetIndexInternal.set(index)
    }

    /**
     * Завершение перетаскивания с подтверждением
     */
    public endDrag(): void {
        const dragState = this.dragState()
        const targetZoneId = this.targetZoneIdInternal()
        const targetIndex = this.targetIndexInternal()

        // Отмена если зона не найдена или индекс невалидный
        if (!dragState || targetZoneId === null || targetIndex === -1) {
            this.cancelDrag()
            return
        }

        const result: DropResult<T> = {
            data: dragState.data,
            sourceId: dragState.sourceId,
            targetId: targetZoneId,
            targetIndex
        }

        this.resetState()
        this.dropCompleteSubject.next(result)
    }

    /**
     * Отмена перетаскивания (без применения изменений)
     */
    public cancelDrag(): void {
        this.resetState()
    }

    private resetState(): void {
        this.dragState.set(null)
        this.targetZoneIdInternal.set(null)
        this.targetIndexInternal.set(-1)
        this.isDraggingInternal.set(false)
    }
}

interface DragState<T = unknown> {
    data: T
    sourceId: string
    element: HTMLElement
    offsetX: number
    offsetY: number
}
