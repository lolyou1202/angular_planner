import { Injectable, Type, inject, OnDestroy, Injector } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import {
    Overlay,
    OverlayRef as CdkOverlayRef,
    OverlayConfig as CdkOverlayConfig
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { OverlayBaseConfig, OverlayInstanceRef } from './overlay.model'
import {
    OVERLAY_CONFIG,
    OVERLAY_REF,
    OVERLAY_CHILD_COMPONENT,
    OVERLAY_DATA
} from './overlay.tokens'

/**
 * Абстрактный сервис, инкапсулирующий общую логику работы с CDK Overlay.
 * C — тип конфигурации (расширяет OverlayBaseConfig)
 * R — тип публичного референса (реализует OverlayInstanceRef)
 */
@Injectable({ providedIn: 'root' })
export abstract class OverlayService<
    C extends OverlayBaseConfig,
    R extends OverlayInstanceRef
> implements OnDestroy {
    protected readonly injector = inject(Injector)
    protected readonly overlay = inject(Overlay)
    protected readonly destroy$ = new Subject<void>()

    /**
     * Стек открытых оверлеев.
     * Хранит CDK-ссылку для управления и публичный референс для внешнего API.
     */
    protected readonly overlayStack: Array<{
        id: string
        cdkOverlayRef: CdkOverlayRef
        instanceRef: R
    }> = []

    /** Создать конфигурацию CDK Overlay на основе пользовательской конфигурации. */
    protected abstract createOverlayConfig(config: C): CdkOverlayConfig

    /**
     * Создать публичный референс (R) для управления экземпляром.
     * @param cdkOverlayRef ссылка на overlay из CDK
     * @param overlayId уникальный идентификатор
     */
    protected abstract createOverlayInstance(
        cdkOverlayRef: CdkOverlayRef,
        overlayId: string
    ): R

    /** Компонент-контейнер, который будет использован для отображения дочернего компонента. */
    protected abstract getOverlayComponent(): Type<unknown>

    /** Генерация уникального идентификатора. */
    protected generateOverlayId(): string {
        return `overlay_${crypto.randomUUID()}`
    }

    /** Настройка обработчиков закрытия (backdrop, detach, escape). */
    protected setupCloseHandlers(
        cdkOverlayRef: CdkOverlayRef,
        instanceRef: R,
        config: C
    ): void {
        // Закрытие по клику на бэкдроп
        if (config.closeOnBackdropClick !== false) {
            cdkOverlayRef
                .backdropClick()
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => instanceRef.close())
        }

        // Обработка детача (когда overlay уничтожается)
        cdkOverlayRef
            .detachments()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const index = this.overlayStack.findIndex(
                    o => o.id === instanceRef.id
                )
                if (index !== -1) {
                    this.overlayStack.splice(index, 1)
                }
            })
    }

    /**
     * Открыть оверлей с указанным компонентом.
     * @param component компонент, который будет отображён внутри контейнера
     * @param config конфигурация оверлея
     * @param additionalProviders дополнительные провайдеры для инжектора (опционально)
     */
    public open<T>(
        component: Type<T>,
        config: C,
        additionalProviders: Array<{ provide: unknown; useValue: unknown }> = []
    ): R {
        const overlayId = this.generateOverlayId()
        const cdkOverlayConfig = this.createOverlayConfig(config)
        const cdkOverlayRef = this.overlay.create(cdkOverlayConfig)

        const instanceRef = this.createOverlayInstance(
            cdkOverlayRef,
            overlayId
        )

        // Инжектор для компонента-контейнера
        const overlayInjector = Injector.create({
            providers: [
                { provide: OVERLAY_CONFIG, useValue: config },
                { provide: OVERLAY_REF, useValue: instanceRef },
                { provide: OVERLAY_CHILD_COMPONENT, useValue: component },
                { provide: OVERLAY_DATA, useValue: config.data },
                ...additionalProviders
            ],
            parent: this.injector
        })

        const overlayPortal = new ComponentPortal(
            this.getOverlayComponent(),
            undefined,
            overlayInjector
        )

        cdkOverlayRef.attach(overlayPortal)

        this.overlayStack.push({
            id: overlayId,
            cdkOverlayRef,
            instanceRef
        })

        this.setupCloseHandlers(cdkOverlayRef, instanceRef, config)

        return instanceRef
    }

    /** Закрыть конкретный оверлей по ID. Если ID не указан, закрывается последний. */
    public close(overlayId?: string): void {
        if (overlayId) {
            const entry = this.overlayStack.find(o => o.id === overlayId)
            entry?.instanceRef.close()
        } else {
            this.closeLast()
        }
    }

    /** Закрыть последнее (верхнее) оверлейное окно. */
    public closeLast(): void {
        const last = this.overlayStack[this.overlayStack.length - 1]
        last?.instanceRef.close()
    }

    /** Закрыть все открытые оверлеи. */
    public closeAll(): void {
        // Идём с конца, чтобы закрывать в обратном порядке
        for (let i = this.overlayStack.length - 1; i >= 0; i--) {
            this.overlayStack[i].instanceRef.close()
        }
    }

    /** Количество активных оверлеев. */
    public getOverlayCount(): number {
        return this.overlayStack.length
    }

    /** ID текущего (верхнего) оверлея. */
    public getTopOverlayId(): string | null {
        return this.overlayStack.length > 0
            ? this.overlayStack[this.overlayStack.length - 1].id
            : null
    }

    /** Получить публичный референс оверлея по ID. */
    public getOverlayRef(overlayId: string): R | null {
        const entry = this.overlayStack.find(o => o.id === overlayId)
        return entry ? entry.instanceRef : null
    }

    public ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
        this.closeAll()
    }
}