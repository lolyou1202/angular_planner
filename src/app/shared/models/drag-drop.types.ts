export interface DropResult<T = unknown> {
    data: T
    sourceZoneId: string
    targetZoneId: string
    targetIndex: number
}

export interface DragState<T = unknown> {
    data: T
    sourceZoneId: string
    element: HTMLElement
    offsetX: number
    offsetY: number
}

export interface DragStartEvent {
    event: MouseEvent
    offsetX: number
    offsetY: number
}

export interface DragMoveEvent {
    clientX: number
    clientY: number
}

export type DragEndType = 'end' | 'cancel'

export interface DragEndEvent {
    type: DragEndType
    event: MouseEvent | KeyboardEvent
}
