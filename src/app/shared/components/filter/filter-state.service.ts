import { Injectable, signal, computed, effect } from '@angular/core'
import { FilterState } from './filter.model'

const FILTER_STORAGE_KEY = 'app_filters'

@Injectable()
export class FilterStateService {
    private readonly _state = signal<FilterState>(this._loadFromStorage())

    readonly state = this._state.asReadonly()

    readonly entries = computed(() =>
        Object.entries(this._state())
    )

    constructor() {
        // Сохраняем изменения в localStorage при каждом изменении состояния
        effect(() => {
            this._saveToStorage(this._state())
        })
    }

    set(key: string, value: any): void {
        this._state.update(current => ({
            ...current,
            [key]: value
        }))
    }

    delete(key: string): void {
        this._state.update(current => {
            const newState = { ...current }
            delete newState[key]
            return newState
        })
    }

    clear(): void {
        this._state.set({})
    }

    private _saveToStorage(state: FilterState): void {
        try {
            localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state))
        } catch (error) {
            console.error('Ошибка при сохранении фильтров в localStorage:', error)
        }
    }

    private _loadFromStorage(): FilterState {
        try {
            const stored = localStorage.getItem(FILTER_STORAGE_KEY)
            return stored ? JSON.parse(stored) : {}
        } catch (error) {
            console.error('Ошибка при загрузке фильтров из localStorage:', error)
            return {}
        }
    }
}
