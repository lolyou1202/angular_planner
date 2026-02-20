import { Observable } from 'rxjs'
import { OverlayConfig as CdkOverlayConfig } from '@angular/cdk/overlay'

/**
 * Публичный интерфейс для управления экземпляром оверлея (ModalRef, PopoverRef и т.д.)
 */
export interface OverlayInstanceRef {
    id: string
    afterClosed: Observable<void>
    close: () => void
}

/**
 * Базовая конфигурация, расширяющая конфигурацию CDK.
 * Конкретные сервисы могут дополнять этот интерфейс.
 */
export interface OverlayBaseConfig<T = unknown> extends CdkOverlayConfig {
    data?: T
    closeOnBackdropClick?: boolean
}