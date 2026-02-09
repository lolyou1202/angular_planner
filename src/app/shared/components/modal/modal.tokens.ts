import { InjectionToken } from '@angular/core'
import { Type } from '@angular/core'
import { ModalRef } from './modal.model'
import { ModalComponentConfig } from './modal.model'

/**
 * Токен для передачи данных в динамически создаваемый компонент модального окна.
 */
export const MODAL_DATA = new InjectionToken<Record<string, unknown>>(
    'MODAL_DATA'
)

/**
 * Токен для передачи ModalRef в динамически создаваемый компонент модального окна.
 */
export const MODAL_REF = new InjectionToken<ModalRef>('MODAL_REF')

/**
 * Токен для передачи конфигурации модального окна в ModalComponent.
 */
export const MODAL_CONFIG = new InjectionToken<ModalComponentConfig<unknown>>(
    'MODAL_CONFIG'
)

/**
 * Токен для передачи дочернего компонента в ModalComponent.
 */
export const MODAL_CHILD_COMPONENT = new InjectionToken<Type<unknown>>(
    'MODAL_CHILD_COMPONENT'
)