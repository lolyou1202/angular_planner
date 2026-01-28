import { Injectable } from '@angular/core'
import {
    FilterChip,
    FilterConfig,
    FilterConfigOption,
    FilterConfigType,
    FilterStateValue
} from './filter.model'

@Injectable()
export class FilterChipBuilder {
    build(
        config: FilterConfig,
        value: FilterStateValue
    ): FilterChip {
        return {
            type: config.key,
            label: config.label,
            displayValue: this.formatDisplayValue({
                configType: config.type,
                configOptions: config.options || [],
                value
            })
        }
    }

    private formatDisplayValue({
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
                return this.formatMultiselect({
                    configOptions,
                    value
                })

            case 'range':
                return this.formatRange({ value })

            case 'boolean':
                return this.formatBoolean({ value })

            case 'string':
                return this.formatString({
                    configOptions,
                    value
                })

            default:
                return ''
        }
    }

    private formatMultiselect({
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
                this.findOptionLabel({
                    configOptions,
                    value: v
                })
            )
            .filter(Boolean)
            .join(', ')
    }

    private formatRange({
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

    private formatBoolean({
        value
    }: {
        value: FilterStateValue
    }): string {
        if (typeof value !== 'boolean') {
            return ''
        }
        return value ? 'Да' : 'Нет'
    }

    private formatString({
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
            const optionLabel = this.findOptionLabel({
                configOptions,
                value
            })
            if (optionLabel) {
                return optionLabel
            }
        }

        return ''
    }

    private findOptionLabel({
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
