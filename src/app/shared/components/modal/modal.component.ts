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
import { ButtonComponent } from '../button/button.component'
import {
    MODAL_CHILD_COMPONENT,
    MODAL_CONFIG,
    MODAL_DATA,
    MODAL_REF
} from './modal.tokens'

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: 'modal.component.html',
    styleUrl: 'modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements AfterViewInit {
    @ViewChild('dynamicContent', {
        read: ViewContainerRef,
        static: false
    })
    private _dynamicContent!: ViewContainerRef

    private _componentRef?: ComponentRef<unknown>
    private _injector = inject(Injector)

    public modalConfig = inject(MODAL_CONFIG)
    private _childComponent = inject(MODAL_CHILD_COMPONENT)
    private _modalRef = inject(MODAL_REF, { optional: true })

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
                    { provide: MODAL_DATA, useValue: this.modalConfig?.data },
                    { provide: MODAL_REF, useValue: this._modalRef }
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

        if (this._modalRef) {
            this._modalRef.close()
        } else {
            this.closed.emit()
        }
    }
}
