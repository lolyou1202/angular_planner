import {
    Injectable,
    OnDestroy,
    Renderer2,
    RendererFactory2,
    inject
} from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Injectable()
export class DragGhostService implements OnDestroy {
    private readonly document = inject(DOCUMENT)

    private _renderer: Renderer2
    private _ghostElement: HTMLElement | null = null

    constructor(rendererFactory: RendererFactory2) {
        this._renderer = rendererFactory.createRenderer(null, null)
    }

    public createGhost(
        sourceElement: HTMLElement,
        clientX: number,
        clientY: number,
        offsetX: number,
        offsetY: number
    ): void {
        const rect = sourceElement.getBoundingClientRect()

        this._ghostElement = sourceElement.cloneNode(true) as HTMLElement

        this._renderer.addClass(this._ghostElement, 'ghost')

        this._renderer.setStyle(
            this._ghostElement,
            'left',
            `${clientX - offsetX}px`
        )
        this._renderer.setStyle(
            this._ghostElement,
            'top',
            `${clientY - offsetY}px`
        )
        this._renderer.setStyle(this._ghostElement, 'width', `${rect.width}px`)

        this._renderer.appendChild(this.document.body, this._ghostElement)
    }

    public updatePosition(
        clientX: number,
        clientY: number,
        offsetX: number,
        offsetY: number
    ): void {
        if (!this._ghostElement) return

        this._renderer.setStyle(
            this._ghostElement,
            'left',
            `${clientX - offsetX}px`
        )
        this._renderer.setStyle(
            this._ghostElement,
            'top',
            `${clientY - offsetY}px`
        )
    }

    public removeGhost(): void {
        if (this._ghostElement) {
            this._renderer.removeChild(this.document.body, this._ghostElement)
            this._ghostElement = null
        }
    }

    public ngOnDestroy(): void {
        this.removeGhost()
    }
}
