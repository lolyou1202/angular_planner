import {
    Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    DestroyRef,
    Type,
    AfterViewInit,
    inject,
    output,
    signal,
    input,
    ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
    BaseModalComponent,
    ModalAction,
    ModalComponentConfig,
    ModalRef
} from './modal.model'
import { ButtonComponent } from '../button/button.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

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

    public readonly modalConfig = input<ModalComponentConfig>()
    public readonly childComponent = input<Type<BaseModalComponent>>()
    public readonly childComponentData = input<Record<string, unknown>>()
    public readonly modalRef = input<ModalRef>()

    public readonly isOpen = signal<boolean>(false)

    public closed = output<void>()

    private _componentRef?: ComponentRef<BaseModalComponent>
    private _destroyRef = inject(DestroyRef)

    public ngAfterViewInit(): void {
        this.isOpen.set(true)
        this._loadDynamicComponent()
    }

    private _loadDynamicComponent(): void {
        const childComponent = this.childComponent()
        const childComponentData = this.childComponentData()

        if (childComponent && this._dynamicContent) {
            // Очищаем контейнер
            this._dynamicContent.clear()

            // Создаем компонент
            this._componentRef =
                this._dynamicContent.createComponent(childComponent)

            // Передаем данные в компонент
            this._componentRef.instance.modalData = childComponentData

            // Передаем modalRef в дочерний компонент
            this._componentRef.instance.modalRef = this.modalRef()

            // Обрабатываем события закрытия из дочернего компонента
            if (this._componentRef.instance.closeModal) {
                this._componentRef.instance.closeModal
                    .pipe(takeUntilDestroyed(this._destroyRef))
                    .subscribe(() => {
                        this.close()
                    })
            }

            this._componentRef.changeDetectorRef.detectChanges()
        }
    }

    public onBackdropClick(event: MouseEvent): void {
        const target = event.target as HTMLElement
        const modalConfig = this.modalConfig()

        if (
            target.classList.contains('modal-container') &&
            modalConfig?.closeOnBackdropClick !== false
        ) {
            this.close()
        }
    }

    public onActionClick(action: ModalAction): void {
        if (action.onClick) {
            action.onClick()
        }
    }

    public close(): void {
        this.isOpen.set(false)

        const modalRef = this.modalRef()
        if (modalRef) {
            modalRef.close()
        } else {
            this.closed.emit()
        }
    }
}
