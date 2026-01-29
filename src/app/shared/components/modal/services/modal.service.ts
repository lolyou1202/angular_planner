import { Injectable, Type, inject } from '@angular/core'
import { ComponentPortal } from '@angular/cdk/portal'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { ModalComponent } from '../modal.component'
import { ModalConfig } from '../models/modal.model'

@Injectable()
export class ModalService {
    private _overlay = inject(Overlay)

    private _currentOverlayRef: OverlayRef | null = null

    /** Открыть модальное окно с указанным компонентом */
    open(
        component: Type<any> | null,
        config: ModalConfig = {}
    ): void {
        // Закрыть предыдущее модальное окно, если оно открыто
        this.close()

        // Создать overlay
        const overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'app-modal__backdrop',
            positionStrategy: this._overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            scrollStrategy:
                this._overlay.scrollStrategies.block()
        })

        // Сохранить overlayRef
        this._currentOverlayRef = overlayRef

        // Прикрепить модальный компонент
        const modalPortal = new ComponentPortal(ModalComponent)
        const componentRef = overlayRef.attach(modalPortal)

        // Передать конфигурацию и компонент в модальное окно
        componentRef.instance.setConfig({
            title: config.title || '',
            content: config.content || '',
            closeOnBackdropClick:
                config.closeOnBackdropClick || true,
            data: config.data || null,
            actions: config.actions || []
        })
        if (component) {
            componentRef.instance.childComponent = component
        }

        // Закрыть при клике на backdrop, если настроено
        if (config.closeOnBackdropClick !== false) {
            overlayRef.backdropClick().subscribe(() => {
                this.close()
            })
        }

        // Подписаться на закрытие
        overlayRef
            .detachments()
            .subscribe(() => (this._currentOverlayRef = null))

        componentRef.instance.closed.subscribe(() => {
            this.close()
        })
    }

    /** Закрыть модальное окно */
    close(): void {
        if (this._currentOverlayRef) {
            this._currentOverlayRef.dispose()
            this._currentOverlayRef = null
        }
    }
}
