import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SharedModule} from './modules/shared/shared.modules';
import {AgmCoreModule} from '@agm/core';
import {FooterMenuComponent} from './components/footer-menu/footer-menu.component';
import {MenuService} from './services/menu-service/menu.service';
import {SideMenuComponent} from './components/side-menu/side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterMenuComponent,
    SideMenuComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AgmCoreModule.forRoot()
  ],
  providers: [
    MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
