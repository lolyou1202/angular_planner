import { DOCUMENT, inject, Injectable } from '@angular/core'
import { filter, fromEvent, map, merge, Observable, take, tap } from 'rxjs'
import {
    DragEndEvent,
    DragEndType,
    DragMoveEvent
} from '../models/drag-drop.types'

@Injectable()
export class DragHandlerService {
    private readonly _document = inject(DOCUMENT)

    public getDragStreams(startEvent: MouseEvent): {
        move$: Observable<DragMoveEvent>
        end$: Observable<DragEndEvent>
    } {
        startEvent.preventDefault()

        const mouseMove$ = fromEvent<MouseEvent>(this._document, 'mousemove')
        const mouseUp$ = fromEvent<MouseEvent>(this._document, 'mouseup')
        const escape$ = fromEvent<KeyboardEvent>(
            this._document,
            'keydown'
        ).pipe(
            filter(e => e.key === 'Escape'),
            tap(e => e.preventDefault())
        )

        const stopDrag$ = merge(mouseUp$, escape$).pipe(take(1))

        const end$ = stopDrag$.pipe(
            map(event => {
                const type: DragEndType =
                    event instanceof KeyboardEvent ? 'cancel' : 'end'
                return {
                    type,
                    event
                }
            })
        )

        const move$ = mouseMove$.pipe(
            tap(event => event.preventDefault()),
            map(event => ({
                clientX: event.clientX,
                clientY: event.clientY
            }))
        )

        return { move$, end$ }
    }
}
