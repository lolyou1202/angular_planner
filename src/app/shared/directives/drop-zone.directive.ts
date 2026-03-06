import {
    Directive,
    ElementRef,
    inject,
    input,
    OnDestroy,
    OnInit
} from '@angular/core'
import { DragDropService, DropZone } from '../services/drag-drop.service'
import { Subject } from 'rxjs'

/**
 * Директива для drop-зоны
 * 
 * Регистрирует зону для drag&drop
 */
@Directive({
    selector: '[appDropZone]',
    standalone: true
})
export class DropZoneDirective<T = unknown> implements DropZone, OnInit, OnDestroy {
    private readonly elementRef = inject(ElementRef)
    private readonly dragDropService = inject(DragDropService<T>)

    /** ID зоны */
    public readonly appDropZoneId = input.required<string>()

    public readonly element = this.elementRef.nativeElement as HTMLElement
    public id = ''

    public readonly indicatorHover$ = new Subject<{ zoneId: string; index: number } | null>()

    public getDropIndex(): number {
        return -1
    }

    public ngOnInit(): void {
        this.id = this.appDropZoneId()
        this.dragDropService.registerDropZone(this)
    }

    public ngOnDestroy(): void {
        this.dragDropService.unregisterDropZone(this)
        this.indicatorHover$.complete()
    }
}
