import {
    Injectable,
    computed,
    inject,
    signal
} from '@angular/core'
import {
    FilterChip,
    FilterConfig,
    FilterState,
    FilterStateValue
} from './filter.model'
import { FilterStateService } from './filter-state.service'
import { FilterConfigService } from './filter-config.service'
import { FilterChipBuilder } from './filter-chip-builder.service'

@Injectable({
    providedIn: 'root'
})
export class FilterService<T = any> {
    // Сигналы состояния
    private readonly _state = inject(FilterStateService)
    private readonly _configs = inject(FilterConfigService)
    private readonly _chipBuilder = inject(FilterChipBuilder)

    private readonly _data = signal<T[]>([])
    private readonly _pendingFilters = signal<FilterState>({})

    // Публичные API
    readonly filters = this._state.state
    readonly configsList = this._configs.configs
    readonly data = this._data.asReadonly()
    readonly pendingFilters = this._pendingFilters.asReadonly()

    // Вычисляемые сигналы
    readonly activeFilters = computed(() => {
        return this._state
            .entries()
            .filter(([_, value]) =>
                this._isFilterValueActive(value)
            )
    })

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

    readonly hasPendingChanges = computed(() => {
        const current = this.filters()
        const pending = this._pendingFilters()

        const currentKeys = Object.keys(current)
        const pendingKeys = Object.keys(pending)

        if (currentKeys.length !== pendingKeys.length)
            return true

        for (const key of currentKeys) {
            if (
                JSON.stringify(current[key]) !==
                JSON.stringify(pending[key])
            ) {
                return true
            }
        }

        return false
    })

    // Публичные методы
    setData(data: T[]): void {
        this._data.set(data)
    }

    setConfigs(configs: FilterConfig[]): void {
        this._configs.set(configs)
    }

    setFilter(key: string, value: any): void {
        this._state.set(key, value)
    }

    setPendingFilter(
        key: string,
        value: FilterStateValue
    ): void {
        this._pendingFilters.update(current => ({
            ...current,
            [key]: value
        }))
    }

    clearFilter(key: string): void {
        this._state.delete(key)
    }

    clearAll(): void {
        this._state.clear()
    }

    // Методы для работы с модальным окном
    saveToPending(): void {
        this._pendingFilters.set(this.filters())
    }

    applyPending(): void {
        const pending = this._pendingFilters()
        Object.entries(pending).forEach(([key, value]) => {
            this._state.set(key, value)
        })
        this._pendingFilters.set({})
    }

    discardPending(): void {
        this._pendingFilters.set({})
    }

    resetPendingToCurrent(): void {
        this._pendingFilters.set(this.filters())
    }

    clearSavedFilters(): void {
        this._state.clear()
    }

    // Приватные методы
    private _isFilterValueActive(
        value: FilterStateValue
    ): boolean {
        if (value === undefined || value === null) {
            return false
        }
        if (typeof value === 'string') {
            return value.trim().length > 0
        }
        if (typeof value === 'number') {
            return !isNaN(value)
        }
        if (typeof value === 'boolean') {
            return true
        }
        if (value instanceof Date) {
            return !isNaN(value.getTime())
        }
        if (Array.isArray(value)) {
            return value.length > 0
        }
        if (typeof value === 'object') {
            return Object.values(value).some(
                v => v !== undefined && v !== null
            )
        }
        return true
    }
}
