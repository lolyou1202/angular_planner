export interface FilterChip {
    type: string // ключ фильтра (config.key)
    label: string // отображаемое имя фильтра
    displayValue: string // отформатированное значение для отображения
}
export type FilterConfigType =
    | 'string'
    | 'boolean'
    | 'multiselect'
    | 'range'

export interface FilterConfigOption {
    value: any
    label: string
}

export interface FilterConfig {
    key: string
    label: string
    type: FilterConfigType
    options?: FilterConfigOption[]
    multiple?: boolean
    from?: number
    to?: number
}

export type FilterStateValue =
    | string
    | boolean
    | string[]
    | { from: Date; to: Date }

export interface FilterState {
    [key: string]: FilterStateValue
}
