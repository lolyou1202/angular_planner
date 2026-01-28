import {
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    input,
    output
} from '@angular/core'
import { BorderGroupComponent } from '../border-groupe/border-group.component'
import { BorderGroupChildComponent } from '../border-group-child/border-group-child.component'
import { ChipComponent } from '../chip/chip.component'
import { ModalService } from '../../../core/services/modal.service'
import { FilterChip } from './filter.model'
import { FilterService } from './filter.service'
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
    ]
})
export class FilterComponent<T = any>
    implements OnInit, OnDestroy
{
    private _modalService = inject(ModalService)
    private _filterService = inject(FilterService<T>)

    // Входящие сигналы
    filterModalTitle = input('Фильтры')
    showFilterCount = input(true)
    compactMode = input(false)

    // Локальное состояние
    private _modalRef: any

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
    chipRemoved = output<FilterChip>()
    filterModalOpened = output<void>()
    filtersCleared = output<void>()
    filtersApplied = output<void>()

    ngOnInit(): void {
        // Загружаем сохраненные фильтры и сохраняем их в pending при инициализации
        this._filterService.saveToPending()
    }

    ngOnDestroy(): void {
        this._closeModal()
    }

    // Открытие модального окна
    onOpenFilterModal(): void {
        this._filterService.saveToPending()

        this._modalRef = this._modalService.open(
            FilterModalComponent,
            {
                title: this.filterModalTitle(),
                hasActions: true,
                data: {
                    filterService: this._filterService
                }
            }
        )

        this.filterModalOpened.emit()
    }

    // Удаление чипса
    onRemoveChip(chip: FilterChip): void {
        this._filterService.clearFilter(chip.type)
        this.chipRemoved.emit(chip)
    }

    // Очистка всех фильтров
    onClearAllFilters(): void {
        this._filterService.clearAll()
        this._filterService.saveToPending()
        this.filtersCleared.emit()
    }

    // Закрытие модального окна
    private _closeModal(): void {
        if (this._modalRef) {
            this._modalRef.close()
            this._modalRef = null
        }
    }
}
