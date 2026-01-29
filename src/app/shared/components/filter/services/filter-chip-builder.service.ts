import { Injectable } from '@angular/core'
import {
    FilterChip,
    FilterConfig,
    FilterConfigOption,
    FilterConfigType,
    FilterStateValue
} from '../models/filter.model'

@Injectable({ providedIn: 'root' })
export class FilterChipBuilder {
    build(
        config: FilterConfig,
        value: FilterStateValue
    ): FilterChip {
        return {
            key: config.key,
            label: config.label,
            displayValue: this._formatDisplayValue({
                configType: config.type,
                configOptions: config.options || [],
                value
            })
        }
    }

    private _formatDisplayValue({
        configType,
        configOptions,
        value
    }: {
        configType: FilterConfigType
        configOptions: FilterConfigOption[]
        value: FilterStateValue
    }): string {
        switch (configType) {
            case 'multiselect':
                return this._formatMultiselect({
                    configOptions,
                    value
                })

            case 'range':
                return this._formatRange({ value })

            case 'boolean':
                return this._formatBoolean({ value })

            case 'string':
                return this._formatString({
                    configOptions,
                    value
                })

            default:
                return ''
        }
    }

    private _formatMultiselect({
        configOptions,
        value
    }: {
        configOptions: FilterConfigOption[]
        value: FilterStateValue
    }): string {
        if (!Array.isArray(value)) {
            return ''
        }
        return value
            .map(v =>
                this._findOptionLabel({
                    configOptions,
                    value: v
                })
            )
            .filter(Boolean)
            .join(', ')
    }

    private _formatRange({
        value
    }: {
        value: FilterStateValue
    }): string {
        if (
            typeof value !== 'object' ||
            !('from' in value) ||
            !('to' in value)
        ) {
            return ''
        }

        return `${value.from} — ${value.to}`
    }

    private _formatBoolean({
        value
    }: {
        value: FilterStateValue
    }): string {
        if (typeof value !== 'boolean') {
            return ''
        }
        return value ? 'Да' : 'Нет'
    }

    private _formatString({
        configOptions,
        value
    }: {
        configOptions: FilterConfigOption[]
        value: FilterStateValue
    }): string {
        if (typeof value !== 'string') {
            return ''
        }

        if (configOptions) {
            const optionLabel = this._findOptionLabel({
                configOptions,
                value
            })
            if (optionLabel) {
                return optionLabel
            }
        }

        return ''
    }

    private _findOptionLabel({
        configOptions,
        value
    }: {
        configOptions: FilterConfigOption[]
        value: string
    }): string | null {
        const option = configOptions.find(
            opt => opt.value === value
        )

        return option?.label || null
    }
}
