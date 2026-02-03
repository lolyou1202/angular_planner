import {
    ApplicationConfig,
    provideZoneChangeDetection,
    LOCALE_ID
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app-routing.module'
import { registerLocaleData } from '@angular/common'
import localeRu from '@angular/common/locales/ru'

registerLocaleData(localeRu)

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        { provide: LOCALE_ID, useValue: 'ru' }
    ]
}
