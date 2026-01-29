import { Injectable, signal } from '@angular/core'
import { FilterConfig } from '../models/filter.model'

@Injectable()
export class FilterConfigService {
    private readonly _configs = signal<FilterConfig[]>([])

    readonly configs = this._configs.asReadonly()

    set(configs: FilterConfig[]): void {
        this._configs.set(configs)
    }

    get(key: string): FilterConfig | undefined {
        return this._configs().find(c => c.key === key)
    }
}
