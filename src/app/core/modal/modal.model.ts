import { ButtonVariant } from '../../shared/components/button/button.types'
import { OverlayBaseConfig, OverlayInstanceRef } from '../overlay/overlay.model'

// Тип конфигурации модального окна, расширяющий базовый оверлей
export interface ModalConfig<T = unknown> extends OverlayBaseConfig<T> {
    title?: string
    actions?: ModalAction[]
}

export interface ModalAction {
    text: string
    variant: Exclude<ButtonVariant, 'transparent'>
    disabled?: boolean
    onClick?: () => void
}

export interface ModalRef extends OverlayInstanceRef {
    // Добавляем специфичные для модалки поля, если нужно
}