import { Injectable, Type } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import {
    OverlayConfig as CdkOverlayConfig,
    OverlayRef as CdkOverlayRef
} from '@angular/cdk/overlay'
import { OverlayService } from '../overlay/overlay.service'
import { ModalConfig, ModalRef } from './modal.model'
import { ModalComponent } from './modal.component'

@Injectable({ providedIn: 'root' })
export class ModalService extends OverlayService<ModalConfig, ModalRef> {
    /**
     * Создаёт конфигурацию CDK Overlay для модального окна.
     */
    protected createOverlayConfig(config: ModalConfig): CdkOverlayConfig {
        const depth = this.overlayStack.length

        return {
            hasBackdrop: config.hasBackdrop ?? true,
            backdropClass: this._buildClasses(
                'app-modal-backdrop',
                `modal-depth-${depth}`,
                config.backdropClass
            ),
            panelClass: this._buildClasses(
                'app-modal-panel',
                `modal-depth-${depth}`,
                config.panelClass
            ),
            positionStrategy: this.overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block(),
            width: config.width,
            height: config.height,
            maxWidth: config.maxWidth,
            maxHeight: config.maxHeight
        }
    }

    /**
     * Создаёт публичный референс модального окна.
     */
    protected createOverlayInstance(
        cdkOverlayRef: CdkOverlayRef,
        overlayId: string
    ): ModalRef {
        const afterClosed$ = new Subject<void>()

        const instanceRef: ModalRef = {
            id: overlayId,
            afterClosed: afterClosed$.asObservable(),
            close: (): void => {
                afterClosed$.next()
                afterClosed$.complete()
                cdkOverlayRef.dispose()
            }
        }

        // Глобальная обработка Escape для модальных окон
        cdkOverlayRef
            .keydownEvents()
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (
                    event.code === 'Escape' &&
                    this.getTopOverlayId() === overlayId
                ) {
                    instanceRef.close()
                }
            })

        return instanceRef
    }

    /**
     * Компонент-контейнер для модального окна.
     */
    protected getOverlayComponent(): Type<unknown> {
        return ModalComponent
    }

    /**
     * Вспомогательный метод для построения массива классов.
     */
    private _buildClasses(
        ...classes: (string | string[] | undefined)[]
    ): string[] {
        return classes.flatMap(c => (Array.isArray(c) ? c : c ? [c] : []))
    }
}