import {
    Component,
    inject,
    signal,
    OnInit,
    computed
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ModalService } from '../../../../core/services/modal.service'
import { BadgeComponent } from '../../badge/badge.component'
import { FilterService } from '../filter.service'
import {
    FilterConfig,
    FilterConfigOption
} from '../filter.model'

@Component({
    selector: 'app-filter-modal',
    standalone: true,
    templateUrl: './filter-modal.component.html',
    styleUrl: './filter-modal.component.scss',
    imports: [CommonModule, FormsModule, BadgeComponent]
})
export class FilterModalComponent implements OnInit {
    // Для получения данных, переданных в модальное окно,
    // мы полагаемся на то, что они будут установлены через Object.assign в modal.component.ts
    // Поэтому мы объявляем свойства, которые будут заполнены извне
    filterService!: FilterService;

    private modalRef = inject(ModalService);

    // Локальные состояния для UI
    readonly selectedFilters = signal<Record<string, any>>({})

    // Конфигурации
    readonly configs = computed(() =>
        this.filterService.configsList()
    )

    // Вычисляемые состояния
    readonly hasSelectedFilters = computed(() => {
        const selected = this.selectedFilters()
        return Object.values(selected).some(value => {
            if (Array.isArray(value)) return value.length > 0
            if (typeof value === 'object')
                return Object.values(value).some(v => v != null)
            return (
                value !== undefined &&
                value !== null &&
                value !== false
            )
        })
    })

    readonly selectedCount = computed(() => {
        const selected = this.selectedFilters()
        let count = 0

        Object.values(selected).forEach(value => {
            if (Array.isArray(value)) {
                count += value.length
            } else if (
                value !== undefined &&
                value !== null &&
                value !== false
            ) {
                count += 1
            }
        })

        return count
    })

    ngOnInit(): void {
        // Инициализируем выбранные фильтры из pending состояния
        const pending = this.filterService.pendingFilters()
        this.selectedFilters.set({ ...pending })
    }

    // Обработчики выбора
    toggleOption(
        config: FilterConfig,
        option: FilterConfigOption
    ): void {
        const current = this.selectedFilters()[config.key]

        if (config.multiple) {
            this.toggleMultiSelect(config, option.value)
        } else {
            this.toggleSingleSelect(config, option.value)
        }
    }

    private toggleMultiSelect(
        config: FilterConfig,
        value: any
    ): void {
        const current = this.selectedFilters()[config.key] || []
        const currentArray = Array.isArray(current)
            ? current
            : []

        const newValue = currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value]

        this.updateSelectedFilter(config.key, newValue)
    }

    private toggleSingleSelect(
        config: FilterConfig,
        value: any
    ): void {
        const current = this.selectedFilters()[config.key]
        const newValue = current === value ? undefined : value
        this.updateSelectedFilter(config.key, newValue)
    }

    private updateSelectedFilter(key: string, value: any): void {
        this.selectedFilters.update(current => ({
            ...current,
            [key]: value
        }))
    }

    // Проверка выбранности
    isOptionSelected(
        config: FilterConfig,
        option: FilterConfigOption
    ): boolean {
        const value = this.selectedFilters()[config.key]

        if (config.multiple) {
            return (
                Array.isArray(value) &&
                value.includes(option.value)
            )
        }

        return value === option.value
    }

    // Действия модального окна
    applyFilters(): void {
        // Сохраняем выбранные фильтры в pending состояние
        const selected = this.selectedFilters()
        Object.entries(selected).forEach(([key, value]) => {
            this.filterService.setPendingFilter(key, value)
        })

        // Применяем pending фильтры
        this.filterService.applyPending()

        this.modalRef.close()
    }

    resetFilters(): void {
        this.selectedFilters.set({})
    }

    cancel(): void {
        // Сбрасываем pending изменения
        this.filterService.discardPending()
        this.modalRef.close()
    }

    // Вспомогательные методы
    getFilterGroup(config: FilterConfig): {
        label: string
        options: FilterConfigOption[]
    } {
        return {
            label: config.label,
            options: config.options || []
        }
    }

    trackByKey(index: number, config: FilterConfig): string {
        return config.key
    }

    trackByOptionValue(
        index: number,
        option: FilterConfigOption
    ): any {
        return option.value
    }
}
