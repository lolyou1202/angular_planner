import {
    Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    AfterViewInit,
    inject,
    output,
    signal,
    ChangeDetectionStrategy,
    Injector
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalConfig } from './modal.model'
import {
    OVERLAY_CHILD_COMPONENT,
    OVERLAY_CONFIG,
    OVERLAY_DATA,
    OVERLAY_REF
} from '../overlay/overlay.tokens'
import { ButtonComponent } from '../../shared/components/button/button.component'

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: 'modal.component.html',
    styleUrl: 'modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements AfterViewInit {
    @ViewChild('dynamicContent', { read: ViewContainerRef, static: false })
    private _dynamicContent!: ViewContainerRef

    private _componentRef?: ComponentRef<unknown>
    private _injector = inject(Injector)

    // Инжектим через общие токены
    public modalConfig = inject<ModalConfig>(OVERLAY_CONFIG)
    private _modalRef = inject(OVERLAY_REF)
    private _childComponent = inject(OVERLAY_CHILD_COMPONENT)

    public readonly isOpen = signal<boolean>(false)
    public closed = output<void>()

    public ngAfterViewInit(): void {
        this.isOpen.set(true)
        this._loadDynamicComponent()
    }

    private _loadDynamicComponent(): void {
        if (this._childComponent && this._dynamicContent) {
            this._dynamicContent.clear()

            const componentInjector = Injector.create({
                providers: [
                    { provide: OVERLAY_DATA, useValue: this.modalConfig?.data },
                    { provide: OVERLAY_REF, useValue: this._modalRef }
                ],
                parent: this._injector
            })

            this._componentRef = this._dynamicContent.createComponent(
                this._childComponent,
                { injector: componentInjector }
            )

            this._componentRef.changeDetectorRef.detectChanges()
        }
    }

    public close(): void {
        this.isOpen.set(false)
        this._modalRef.close()
        this.closed.emit()
    }
}
