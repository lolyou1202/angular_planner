import { Injectable, signal, effect } from '@angular/core'
import {
    FilterState,
    FilterStateValue
} from '../models/filter.model'

const FILTER_STORAGE_KEY = 'app_filters'

@Injectable({ providedIn: 'root' })
export class FilterStateService {
    private readonly _state = signal<FilterState>(
        this._loadFromStorage()
    )
    private readonly _modalState = signal<FilterState>({})

    readonly state = this._state.asReadonly()
    readonly modalState = this._modalState.asReadonly()

    constructor() {
        // Сохраняем изменения в localStorage при каждом изменении состояния
        effect(() => {
			console.log(this._state())
            this._saveToStorage(this._state())
        })
    }

    setState(state: FilterState): void {
        this._state.set(state)
    }

    setStateByKey(key: string, value: FilterStateValue): void {
        this._state.update(current => ({
            ...current,
            [key]: value
        }))
    }

    setModalState(state: FilterState): void {
        this._modalState.set(state)
    }

    setModalStateByKey(
        key: string,
        value: FilterStateValue
    ): void {
        this._modalState.update(current => ({
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
            localStorage.setItem(
                FILTER_STORAGE_KEY,
                JSON.stringify(state)
            )
        } catch (error) {
            console.error(
                'Ошибка при сохранении фильтров в localStorage:',
                error
            )
        }
    }

    private _loadFromStorage(): FilterState {
        try {
            const stored = localStorage.getItem(
                FILTER_STORAGE_KEY
            )
            return stored ? JSON.parse(stored) : {}
        } catch (error) {
            console.error(
                'Ошибка при загрузке фильтров из localStorage:',
                error
            )
            return {}
        }
    }
}
