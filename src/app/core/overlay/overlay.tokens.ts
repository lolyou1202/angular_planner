import { InjectionToken, Type } from '@angular/core'
import { OverlayInstanceRef, OverlayBaseConfig } from './overlay.model'

/**
 * Токен для конфигурации оверлея.
 */
export const OVERLAY_CONFIG = new InjectionToken<OverlayBaseConfig>(
    'OVERLAY_CONFIG'
)

/**
 * Токен для публичного референса оверлея.
 */
export const OVERLAY_REF = new InjectionToken<OverlayInstanceRef>('OVERLAY_REF')

/**
 * Токен для дочернего компонента, который будет отображён внутри контейнера.
 */
export const OVERLAY_CHILD_COMPONENT = new InjectionToken<Type<unknown>>(
    'OVERLAY_CHILD_COMPONENT'
)

/**
 * Токен для данных, передаваемых в дочерний компонент.
 */
export const OVERLAY_DATA = new InjectionToken<unknown>('OVERLAY_DATA')