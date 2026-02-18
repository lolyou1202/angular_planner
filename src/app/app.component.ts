import { Component } from '@angular/core'
import { BorderGroupComponent } from './shared/components/border-group/border-group.component'
import { BorderGroupChildComponent } from './shared/components/border-group-child/border-group-child.component'
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BorderGroupComponent, BorderGroupChildComponent]
})
export class AppComponent {}
