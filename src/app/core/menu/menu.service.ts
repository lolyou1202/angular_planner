import { Injectable, ElementRef, Type } from '@angular/core'
import {
    OverlayConfig as CdkOverlayConfig,
    OverlayRef as CdkOverlayRef,
    ConnectionPositionPair,
    ScrollStrategy
} from '@angular/cdk/overlay'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { OverlayService } from '../overlay/overlay.service'
import { MenuComponent } from './menu.component'
import {
    MenuConfig,
    MenuRef,
    MenuPosition,
    MenuScrollStrategy
} from './menu.model'

@Injectable({ providedIn: 'root' })
export class MenuService extends OverlayService<MenuConfig, MenuRef> {
    protected createOverlayConfig(config: MenuConfig): CdkOverlayConfig {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(config.origin)
            .withPositions(this._getPositions(config.position ?? 'bottom'))
            .withPush(config.push ?? true)
            .withViewportMargin(config.viewportMargin ?? 8)
            .withDefaultOffsetY(4)

        return {
            hasBackdrop: config.closeOnBackdropClick ?? config.closeOnClickOutside ?? false,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            panelClass: this._buildClasses('app-menu-panel', config.panelClass),
            positionStrategy,
            scrollStrategy: this._createScrollStrategy(config.scrollStrategyType),
            width: config.width,
            minWidth: config.minWidth,
            maxHeight: config.maxHeight
        }
    }

    protected createOverlayInstance(
        cdkOverlayRef: CdkOverlayRef,
        overlayId: string
    ): MenuRef {
        const afterClosed$ = new Subject<void>()

        const instanceRef: MenuRef = {
            id: overlayId,
            afterClosed: afterClosed$.asObservable(),
            close: (): void => {
                afterClosed$.next()
                afterClosed$.complete()
                cdkOverlayRef.dispose()
            },
            updatePosition: () => cdkOverlayRef.updatePosition()
        }

        // Обработка Escape для меню
        cdkOverlayRef
            .keydownEvents()
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event.code === 'Escape' && this.getTopOverlayId() === overlayId) {
                    instanceRef.close()
                }
            })

        return instanceRef
    }

    protected getOverlayComponent(): Type<unknown> {
        return MenuComponent
    }

    /**
     * Открывает меню с переданными пунктами.
     * @param origin - элемент-триггер
     * @param config - конфигурация меню (обязательно поле items)
     */
    public openMenu<D = unknown>(
        origin: HTMLElement | ElementRef<HTMLElement>,
        config: Omit<MenuConfig<D>, 'origin'>
    ): MenuRef {
        const originElement = origin instanceof ElementRef ? origin.nativeElement : origin

        const menuConfig: MenuConfig<D> = {
            ...config,
            origin: originElement,
            push: true,
            closeOnBackdropClick: true,
            position: 'bottom',
            minWidth: '200px',
            scrollStrategyType: 'reposition',
            viewportMargin: 24
        }

        return super.open(MenuComponent, menuConfig)
    }

    private _createScrollStrategy(type?: MenuScrollStrategy): ScrollStrategy {
        const strategies = {
            noop: this.overlay.scrollStrategies.noop(),
            block: this.overlay.scrollStrategies.block(),
            close: this.overlay.scrollStrategies.close(),
            reposition: this.overlay.scrollStrategies.reposition()
        }
        return strategies[type ?? 'reposition']
    }

    private _getPositions(position: MenuPosition): ConnectionPositionPair[] {
        const positionsMap: Record<MenuPosition, ConnectionPositionPair[]> = {
            bottom: [
                { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
                { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
                { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }
            ],
            top: [
                { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
                { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
                { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
            ],
            left: [
                { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
                { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
                { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' }
            ],
            right: [
                { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
                { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
                { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' }
            ]
        }
        return positionsMap[position]
    }

    /**
     * Вспомогательный метод для построения массива классов.
     */
    private _buildClasses(
        ...classes: (string | string[] | undefined)[]
    ): string[] {
        return classes.flatMap(c => (Array.isArray(c) ? c : c ? [c] : []))
    }
}