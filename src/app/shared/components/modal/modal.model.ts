import { Observable } from 'rxjs'
import { Variant } from '../button/button.component'

export interface ModalConfig<T = any> {
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
    variant: Exclude<Variant, 'transparent'>
    disabled?: boolean
    onClick?: () => void
}

// Интерфейс для конфигурации, передаваемой в компонент
export interface ModalComponentConfig<
    T = any
> extends ModalConfig<T> {
    modalId: string
}

export interface ModalRef<T = any> {
    close: (result?: any) => void
    afterClosed: Observable<any>
    componentInstance?: T
    id: string
}
