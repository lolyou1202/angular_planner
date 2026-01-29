import { Injectable, computed, inject } from '@angular/core'
import {
    FilterChip,
    FilterConfig,
    FilterStateValue
} from '../models/filter.model'
import { FilterStateService } from './filter-state.service'
import { FilterConfigService } from './filter-config.service'
import { FilterChipBuilder } from './filter-chip-builder.service'

@Injectable({ providedIn: 'root' })
export class FilterService {
    // Сигналы состояния
    private readonly _state = inject(FilterStateService)
    private readonly _configs = inject(FilterConfigService)
    private readonly _chipBuilder = inject(FilterChipBuilder)

    // Публичные API
    readonly filters = this._state.state
    readonly modalFilters = this._state.modalState
    readonly configsList = this._configs.configs

    // Вычисляемые сигналы
    readonly activeFilters = computed(() =>
        Object.entries(this._state.state).filter(([key]) =>
            this.isFilterActive(key)
        )
    )

    readonly activeFiltersCount = computed(
        () => this.activeFilters().length
    )

    readonly filterChips = computed(() =>
        this.activeFilters()
            .map(([key, value]) => {
                const config = this._configs.get(key)
                return config
                    ? this._chipBuilder.build(config, value)
                    : null
            })
            .filter((chip): chip is FilterChip => chip !== null)
    )

    readonly hasModalFiltersChanges = computed(() => {
        const activeFilters = this.filters()
        const modalFilters = this.modalFilters()

        const activeFiltersKeys = Object.keys(activeFilters)
        const modalFiltersKeys = Object.keys(modalFilters)

        if (activeFiltersKeys.length !== modalFiltersKeys.length)
            return true

        for (const key of activeFiltersKeys) {
            if (
                JSON.stringify(activeFilters[key]) !==
                JSON.stringify(modalFilters[key])
            ) {
                return true
            }
        }

        return false
    })

    // Публичные методы
    setConfigs(configs: FilterConfig[]): void {
        this._configs.set(configs)
    }
	
    setFilterByKey(key: string, value: FilterStateValue): void {
        this._state.setStateByKey(key, value)
    }

    clearFilter(key: string): void {
        this._state.delete(key)
    }

    clearAll(): void {
        this._state.clear()
        this.discardModalFilters()
    }

    // Методы для работы с фильтрами модального окна
    applyModalFilters(): void {
        this._state.setState(this.modalFilters())
    }

    discardModalFilters(): void {
        this._state.setModalState({})
    }

    resetModalFilters(): void {
        this._state.setModalState(this.filters())
    }

    // Toggle методы для разных типов фильтров
    toggleBooleanFilter(key: string): void {
        const currentValue = this.filters()[key]

        if (currentValue) {
            this.clearFilter(key)
        } else {
            this._state.setModalStateByKey(key, currentValue)
        }
    }

    toggleMultiselectFilter(key: string, value: string): void {
        const currentValue = this.filters()[key]
        const config = this._configs.get(key)

        if (!config) return

        // Если значение уже есть в массиве - удаляем, иначе добавляем
        if (Array.isArray(currentValue)) {
            const index = currentValue.indexOf(value)
            if (index > -1) {
                const newArray = [...currentValue]
                newArray.splice(index, 1)

                if (newArray.length === 0) {
                    this.clearFilter(key)
                } else {
                    this._state.setModalStateByKey(key, newArray)
                }
            } else {
                this._state.setModalStateByKey(key, [
                    ...currentValue,
                    value
                ])
            }
        } else {
            this._state.setModalStateByKey(key, [value])
        }
    }

    toggleStringFilter(key: string, value: string): void {
        if (value.trim().length > 0) {
            this._state.setModalStateByKey(key, value)
        } else {
            this.clearFilter(key)
        }
    }

    // Проверка активного состояния фильтра
    isFilterActive(key: string): boolean {
        const value = this.filters()[key]

        if (value === undefined || value === null) {
            return false
        }
        if (typeof value === 'string') {
            return value.trim().length > 0
        }
        if (typeof value === 'boolean') {
            return true
        }
        if (Array.isArray(value)) {
            return value.length > 0
        }
        if (typeof value === 'object') {
            return Object.values(value).some(
                v => v !== undefined && v !== null
            )
        }
        return false
    }
}
