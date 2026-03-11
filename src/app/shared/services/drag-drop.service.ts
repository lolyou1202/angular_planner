import { computed, Injectable, OnDestroy, signal } from '@angular/core'
import { Subject } from 'rxjs'
import { DragState, DropResult } from '../models/drag-drop.types'

@Injectable({ providedIn: 'root' })
export class DragDropService<T = unknown> implements OnDestroy {
    private _dragState = signal<DragState<T> | null>(null)
    private _targetZoneId = signal<string | null>(null)
    private _targetIndex = signal<number>(-1)
    private _isDragging = signal(false)
    private _dropComplete$ = new Subject<DropResult<T>>()

    public readonly dropComplete$ = this._dropComplete$.asObservable()
    public readonly isDragging = computed(() => this._isDragging())
    public readonly draggedData = computed(
        () => this._dragState()?.data ?? null
    )
    public readonly sourceZoneId = computed(
        () => this._dragState()?.sourceZoneId ?? null
    )
    public readonly draggedElement = computed(
        () => this._dragState()?.element ?? null
    )
    public readonly dragOffsetX = computed(
        () => this._dragState()?.offsetX ?? 0
    )
    public readonly dragOffsetY = computed(
        () => this._dragState()?.offsetY ?? 0
    )
    public readonly targetZoneId = computed(() => this._targetZoneId())
    public readonly targetIndex = computed(() => this._targetIndex())

    public startDrag(
        data: T,
        sourceZoneId: string,
        element: HTMLElement,
        offsetX: number,
        offsetY: number
    ): void {
        this._dragState.set({
            data,
            sourceZoneId,
            element,
            offsetX,
            offsetY
        })
        this._targetZoneId.set(sourceZoneId)
        this._targetIndex.set(-1)
        this._isDragging.set(true)
    }

    public updateTarget(zoneId: string | null, index: number): void {
        if (!this._isDragging()) return

        this._targetZoneId.set(zoneId)
        this._targetIndex.set(index)
    }

    public endDrag(): void {
        const dragState = this._dragState()
        const targetZoneId = this._targetZoneId()
        const targetIndex = this._targetIndex()

        if (!dragState || targetZoneId === null || targetIndex === -1) {
            this.cancelDrag()
            return
        }

        const result: DropResult<T> = {
            data: dragState.data,
            sourceZoneId: dragState.sourceZoneId,
            targetZoneId,
            targetIndex
        }

        this._resetState()
        this._dropComplete$.next(result)
    }

    public cancelDrag(): void {
        this._resetState()
    }

    private _resetState(): void {
        this._dragState.set(null)
        this._targetZoneId.set(null)
        this._targetIndex.set(-1)
        this._isDragging.set(false)
    }

    public ngOnDestroy(): void {
        this._dropComplete$.complete()
    }
}
