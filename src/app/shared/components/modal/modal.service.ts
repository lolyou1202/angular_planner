import { Injectable, Type, inject, OnDestroy, Injector } from '@angular/core'
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ModalComponent } from './modal.component'
import { ModalComponentConfig, ModalConfig, ModalRef } from './modal.model'
import { MODAL_CHILD_COMPONENT, MODAL_CONFIG, MODAL_REF } from './modal.tokens'

@Injectable({
    providedIn: 'root'
})
export class ModalService implements OnDestroy {
    private _injector = inject(Injector)
    private _overlay = inject(Overlay)
    private _destroy$ = new Subject<void>()

    // Хранилище всех активных модальных окон
    private _modalStack: Array<{
        id: string
        overlayRef: OverlayRef
        modalRef: ModalRef
    }> = []

    /** Открыть модальное окно с указанным компонентом */
    public open<T, D = unknown>(
        component?: Type<T>,
        config: ModalConfig<D> = {}
    ): ModalRef {
        // Генерируем уникальный ID для модального окна
        const modalId = this._generateModalId()

        // Создаем конфигурацию overlay с поддержкой стека
        const overlayConfig = this._createOverlayConfig(config)

        // Создаем overlay
        const overlayRef = this._overlay.create(overlayConfig)

        // Создаем объект ModalRef для управления модальным окном
        const modalRef = this._createModalRef(overlayRef, modalId)

        const modalInjector = Injector.create({
            providers: [
                {
                    provide: MODAL_CONFIG,
                    useValue: { ...config, modalId } as ModalComponentConfig<D>
                },
                { provide: MODAL_CHILD_COMPONENT, useValue: component },
                { provide: MODAL_REF, useValue: modalRef }
            ],
            parent: this._injector // Используем текущий инжектор как родительский
        })

        // Создаем portal для модального компонента
        const modalPortal = new ComponentPortal(
            ModalComponent,
            null,
            modalInjector
        )
        overlayRef.attach(modalPortal)

        // Сохраняем в стек
        this._modalStack.push({
            id: modalId,
            overlayRef,
            modalRef
        })

        // Настраиваем обработку закрытия
        this._setupCloseHandlers(overlayRef, modalRef, config)

        return modalRef
    }

    /** Закрыть конкретное модальное окно */
    public close(modalId?: string): void {
        if (modalId) {
            // Закрываем конкретное окно
            const index = this._modalStack.findIndex(m => m.id === modalId)
            if (index !== -1) {
                const { modalRef } = this._modalStack[index]
                modalRef.close()
            }
        } else {
            // Закрываем последнее окно (верхнее в стеке)
            this.closeLastModal()
        }
    }

    public closeLastModal(): void {
        if (this._modalStack.length > 0) {
            const lastModal = this._modalStack[this._modalStack.length - 1]
            lastModal.modalRef.close()
        }
    }

    /** Закрыть все модальные окна */
    public closeAll(): void {
        // Закрываем все окна в обратном порядке
        for (const modal of [...this._modalStack].reverse()) {
            modal.modalRef.close()
        }
    }

    /** Получить количество открытых модальных окон */
    public getModalCount(): number {
        return this._modalStack.length
    }

    /** Получить ID текущего (верхнего) модального окна */
    public getTopModalId(): string | null {
        return this._modalStack.length > 0
            ? this._modalStack[this._modalStack.length - 1].id
            : null
    }

    /** Получить ModalRef по ID */
    public getModalRef(modalId: string): ModalRef | null {
        const modal = this._modalStack.find(m => m.id === modalId)
        return modal ? modal.modalRef : null
    }

    public ngOnDestroy(): void {
        this._destroy$.next()
        this._destroy$.complete()
        this.closeAll()
    }

    private _generateModalId(): string {
        return `modal_${crypto.randomUUID()}`
    }

    private _createOverlayConfig(config: ModalConfig): OverlayConfig {
        const depth = this._modalStack.length

        // Формируем классы для backdrop
        const backdropClasses = ['app-modal-backdrop', `modal-depth-${depth}`]
        const configBackdropClasses = config.backdropClass
        if (configBackdropClasses) {
            if (Array.isArray(configBackdropClasses)) {
                backdropClasses.push(...configBackdropClasses)
            } else {
                backdropClasses.push(configBackdropClasses)
            }
        }

        // Формируем классы для panel
        const panelClasses = ['app-modal-panel', `modal-depth-${depth}`]
        const configPanelClasses = config.panelClass
        if (configPanelClasses) {
            if (Array.isArray(configPanelClasses)) {
                panelClasses.push(...configPanelClasses)
            } else {
                panelClasses.push(configPanelClasses)
            }
        }

        return {
            hasBackdrop: config.hasBackdrop ?? true,
            backdropClass: backdropClasses,
            panelClass: panelClasses,
            positionStrategy: this._overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            scrollStrategy: this._overlay.scrollStrategies.block(),
            width: config.width,
            height: config.height,
            maxWidth: config.maxWidth,
            maxHeight: config.maxHeight
        }
    }

    private _createModalRef(overlayRef: OverlayRef, modalId: string): ModalRef {
        const afterClosed$ = new Subject<void>()
        const modalRef: ModalRef = {
            close: () => {
                afterClosed$.next()
                afterClosed$.complete()
                overlayRef.dispose()

                // Удаляем из стека
                const index = this._modalStack.findIndex(m => m.id === modalId)
                if (index !== -1) {
                    this._modalStack.splice(index, 1)
                }
            },
            afterClosed: afterClosed$.asObservable(),
            id: modalId
        }
        return modalRef
    }

    private _setupCloseHandlers(
        overlayRef: OverlayRef,
        modalRef: ModalRef,
        config: ModalConfig
    ): void {
        // Закрытие по клику на бэкдроп
        if (config.closeOnBackdropClick !== false) {
            overlayRef
                .backdropClick()
                .pipe(takeUntil(this._destroy$))
                .subscribe(() => {
                    modalRef.close()
                })
        }

        // Обработка детача (когда overlay уничтожается)
        overlayRef
            .detachments()
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                // Удаляем из стека при детаче
                const index = this._modalStack.findIndex(
                    m => m.id === modalRef.id
                )
                if (index !== -1) {
                    this._modalStack.splice(index, 1)
                }
            })

        // Обработка клавиши Escape
        overlayRef
            .keydownEvents()
            .pipe(takeUntil(this._destroy$))
            .subscribe(event => {
                if (event.code === 'Escape') {
                    // Закрываем верхнее модальное окно
                    const topModalId = this.getTopModalId()
                    if (topModalId === modalRef.id) {
                        modalRef.close()
                    }
                }
            })
    }
}