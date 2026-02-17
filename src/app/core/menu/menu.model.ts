import { OverlayBaseConfig, OverlayInstanceRef } from '../overlay/overlay.model'

export type MenuPosition = 'top' | 'bottom' | 'left' | 'right'
export type MenuScrollStrategy = 'noop' | 'block' | 'reposition' | 'close'
export type MenuItemVariant = 'danger' | 'warning' | 'success' | 'default'

export interface MenuItem {
    /** Текст пункта */
    label?: string
    /** Иконка (опционально) */
    icon?: string
    /** Отключён ли пункт */
    disabled?: boolean
    /** Вариант пункта */
    variant?: MenuItemVariant
    /** Обработчик клика */
    action?: () => void
}

export interface MenuConfig<T = unknown> extends OverlayBaseConfig<T> {
    /** Элемент, к которому привязывается меню */
    origin: HTMLElement
    /** Пункты меню */
    items: Array<MenuItem | 'separator'>
    /** Позиция меню */
    position?: MenuPosition
    /** Закрывать при клике вне меню (по умолчанию true) */
    closeOnClickOutside?: boolean
    /** Сдвигать меню, чтобы оно не выходило за границы экрана */
    push?: boolean
    /** Отступ от края экрана */
    viewportMargin?: number
    /** Стратегия скролла (строкой) */
    scrollStrategyType?: MenuScrollStrategy
    /** Минимальная ширина меню */
    minWidth?: string
    /** Максимальная высота (для скролла) */
    maxHeight?: string
    /** ARIA label */
    ariaLabel?: string
}

export interface MenuRef extends OverlayInstanceRef {
    updatePosition: () => void
    close: () => void
}