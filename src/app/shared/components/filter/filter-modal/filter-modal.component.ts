import {
    Component,
    inject,
    signal,
    OnInit,
    computed
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ModalService } from '../../modal/services/modal.service'
import { BadgeComponent } from '../../badge/badge.component'
import { FilterService } from '../services/filter.service'

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
    filterService!: FilterService

    private _modalService = inject(ModalService)

    // Локальные состояния для UI
    readonly selectedFilters = signal<Record<string, any>>({})

    // Конфигурации
    readonly configs = computed(() =>
        this.filterService.configsList()
    )

    ngOnInit(): void {
        // Инициализируем выбранные фильтры из pending состояния
        const pending = this.filterService.modalFilters()
        this.selectedFilters.set({ ...pending })
    }

    // Обработчики выбора
    selectFilter(): void {
        this.filterService.toggleMultiselectFilter(
            'priority',
            'low'
        )
    }
}
