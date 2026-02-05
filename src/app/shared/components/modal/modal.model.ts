import { Observable } from 'rxjs'
import { ButtonVariant } from '../button/button.types'

export interface ModalConfig<T = unknown> {
    title?: string
    data?: T
    width?: string
    height?: string
    maxWidth?: string
    maxHeight?: string
    panelClass?: string | string[]
    backdropClass?: string | string[]
    hasBackdrop?: boolean
    closeOnBackdropClick?: boolean
    actions?: ModalAction[]
}

export interface ModalAction {
    text: string
    variant: Exclude<ButtonVariant, 'transparent'>
    disabled?: boolean
    onClick?: () => void
}

// Интерфейс для конфигурации, передаваемой в компонент
export interface ModalComponentConfig<T = unknown> extends ModalConfig<T> {
    modalId: string
}

export interface ModalRef<T = unknown> {
    close: () => void
    afterClosed: Observable<unknown>
    componentInstance?: T
    id: string
}

export interface BaseModalComponent {
    modalData?: Record<string, unknown>
    modalRef?: ModalRef<unknown>
    closeModal?: Observable<void>
}
