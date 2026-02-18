import { Component, signal } from '@angular/core'
import { BorderGroupComponent } from './shared/components/border-group/border-group.component'
import { BorderGroupChildComponent } from './shared/components/border-group-child/border-group-child.component'
import { BadgeComponent } from "./shared/components/badge/badge.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BorderGroupComponent, BorderGroupChildComponent, BadgeComponent]
})
export class AppComponent {
	protected bageState = signal(false)

	protected toggle(): void {
		this.bageState.set(!this.bageState())
	}
}