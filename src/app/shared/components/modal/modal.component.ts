import {
    Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    inject,
    OnDestroy,
    output,
    signal,
    Type,
    AfterViewInit
} from '@angular/core'
import {
    ModalConfig,
    ModalService
} from '../../../core/services/modal.service'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../button/button.component'

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: 'modal.component.html',
    styleUrl: 'modal.component.scss'
})
export class ModalComponent implements AfterViewInit, OnDestroy {
    private _modalService = inject(ModalService)

    @ViewChild('componentContainer', {
        read: ViewContainerRef,
        static: true
    })
    componentContainer!: ViewContainerRef

    closed = output()

    private _config = signal<ModalConfig>({})
    protected readonly config = this._config.asReadonly()

    private _childComponent: Type<any> | null = null

    private _componentRef: ComponentRef<any> | null = null

    setConfig(config: ModalConfig): void {
        this._config.set(config)
    }

    ngAfterViewInit() {
        if (this._childComponent) {
            this._loadComponent()
        }
    }

    set childComponent(component: Type<any> | null) {
        this._childComponent = component
        if (component && this.componentContainer) {
            this._loadComponent()
        }
    }

    get childComponent(): Type<any> | null {
        return this._childComponent
    }

    private _loadComponent(): void {
        if (this.childComponent && this.componentContainer) {
            this.componentContainer.clear()
            this._componentRef =
                this.componentContainer.createComponent(
                    this.childComponent
                )

            // Передать данные в дочерний компонент, если они есть
            if (
                this.config().data &&
                this._componentRef.instance
            ) {
                Object.assign(
                    this._componentRef.instance,
                    this.config().data
                )
            }
        }
    }

    onClose(): void {
        this.closed.emit()
        this._modalService.close()
    }

    ngOnDestroy(): void {
        if (this._componentRef) {
            this._componentRef.destroy()
        }
    }
}
