import { Variant } from "../../button/button.component"

export interface ModalConfig {
    title?: string
    content?: string
    closeOnBackdropClick?: boolean
    data?: any
    actions?: ModalAction[]
}

export interface ModalAction {
    text: string
    variant: Variant
    disabled?: boolean
    onClick?: () => void
}
