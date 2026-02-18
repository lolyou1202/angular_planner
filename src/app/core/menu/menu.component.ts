import {
    Component,
    inject,
    AfterViewInit,
    ChangeDetectionStrategy,
    ViewChild,
    signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkMenuModule, CdkMenu } from '@angular/cdk/menu'
import { OVERLAY_CONFIG, OVERLAY_REF } from '../overlay/overlay.tokens'
import { MenuConfig, MenuItem, MenuRef } from './menu.model'

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, CdkMenuModule],
    templateUrl: 'menu.component.html',
    styleUrl: 'menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements AfterViewInit {
    @ViewChild(CdkMenu, { static: false })
    private readonly _cdkMenu!: CdkMenu

    private readonly _menuRef = inject<MenuRef>(OVERLAY_REF)
    protected readonly config = inject<MenuConfig>(OVERLAY_CONFIG)

    public readonly isOpen = signal<boolean>(false)

    public ngAfterViewInit(): void {
        this.isOpen.set(true)
        setTimeout(() => this._cdkMenu.focusFirstItem())
    }

    public onItemClick(item: MenuItem): void {
        if (!item.disabled) {
            item.action?.()
        }
    }

    public close(): void {
        this.isOpen.set(false)
        this._menuRef.close()
    }
}
