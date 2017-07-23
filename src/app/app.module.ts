import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AgmCoreModule} from '@agm/core';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PerfectScrollbarModule , PerfectScrollbarConfigInterface} from 'angular2-perfect-scrollbar';

import { AppComponent } from './app.component';
import {SharedModule} from './modules/shared/shared.modules';
import {FooterMenuComponent} from './components/footer-menu/footer-menu.component';
import {MenuService} from './services/menu-service/menu.service';
import {ClusterListComponent} from './components/cluster-list/cluster-list.component';
import {ClusterItemComponent} from './components/cluster-list/cluster-item/cluster-item.component';
import {TargetItemComponent} from './components/cluster-list/target-item/target-item.component';
import {ESPMarkerService} from './services/espmarker-service/espmarker.service';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {TimeFilterComponent} from './components/time-filter/time-filter.component';
import {NouisliderModule} from 'ng2-nouislider';
import {MyDatePickerModule} from 'mydatepicker';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};


@NgModule({
  declarations: [
    AppComponent,
    FooterMenuComponent,
    SideMenuComponent,
    ClusterListComponent,
    ClusterItemComponent,
    TargetItemComponent,
    TimeFilterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    SharedModule,
    AgmCoreModule.forRoot(),
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    NouisliderModule,
    MyDatePickerModule
  ],
  providers: [
    MenuService,
    ESPMarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
