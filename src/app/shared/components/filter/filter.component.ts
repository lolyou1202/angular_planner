import {
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    input,
    output
} from '@angular/core'
import { BorderGroupComponent } from '../border-group/border-group.component'
import { BorderGroupChildComponent } from '../border-group-child/border-group-child.component'
import { ChipComponent } from '../chip/chip.component'
import { ModalService } from '../modal/services/modal.service'
import { FilterChip, FilterConfig } from './models/filter.model'
import { FilterService } from './services/filter.service'
import { FilterModalComponent } from './filter-modal/filter-modal.component'

@Component({
    selector: 'app-filter',
    standalone: true,
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    imports: [
        BorderGroupComponent,
        BorderGroupChildComponent,
        ChipComponent
    ],
    providers: [ModalService, FilterService]
})
export class FilterComponent implements OnInit, OnDestroy {
    private _modalService = inject(ModalService)
    private _filterService = inject(FilterService)

    // Входящие сигналы
    configs = input<FilterConfig[]>([])
    filterModalTitle = input('Фильтры')
    showFilterCount = input(true)
    compactMode = input(false)

    // Вычисляемые сигналы
    readonly chips = computed(() =>
        this._filterService.filterChips()
    )
    readonly activeCount = computed(() =>
        this._filterService.activeFiltersCount()
    )
    readonly hasActiveFilters = computed(
        () => this.activeCount() > 0
    )

    // Outputs
    chipRemoved = output<string>()
    filterModalOpened = output<void>()
    filtersCleared = output<void>()
    filtersApplied = output<void>()

    ngOnInit(): void {
        this._filterService.resetModalFilters()
        this._filterService.setConfigs(this.configs())
    }

    ngOnDestroy(): void {
        this._closeModal()
    }

    // Открытие модального окна
    onOpenFilterModal(): void {
        this._filterService.resetModalFilters()

        this._modalService.open(FilterModalComponent, {
            title: this.filterModalTitle(),
            data: {
                filterService: this._filterService
            },
            actions: [
                {
                    variant: 'white-bordered',
                    text: 'Сбросить',
                    onClick: () => this.resetFilters()
                },
                {
                    variant: 'primary',
                    text: 'Применить',
                    onClick: () => this.applyFilters()
                }
            ]
        })

        this.filterModalOpened.emit()
    }

    // Действия модального окна
    applyFilters(): void {
        // Применяем pending фильтры
        this._filterService.applyModalFilters()
        this._modalService.close()
    }

    resetFilters(): void {
        this._filterService.resetModalFilters()
    }

    // Удаление чипса
    onRemoveChip(chip: FilterChip): void {
        this._filterService.clearFilter(chip.key)
        this.chipRemoved.emit(chip.key)
    }

    // Очистка всех фильтров
    onClearAllFilters(): void {
        this._filterService.clearAll()
        this._filterService.resetModalFilters()
        this.filtersCleared.emit()
    }

    // Закрытие модального окна
    private _closeModal(): void {
        this._modalService.close()
    }
}
