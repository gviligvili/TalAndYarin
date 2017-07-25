import {Component} from '@angular/core';
import {MenuService} from '../../services/menu-service/menu.service';
import {MenuState} from '../../services/menu-service/menu-state.enum';
import {animate, style, trigger, transition} from "@angular/animations";

// const showingStyle =

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('SlideDrawerAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          width: '0px',
          overflow: 'hidden'
        }),
        animate(200, style({
          opacity: 1,
          width: '350px',
}))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          width: '350px',
        }),
        animate(200, style({
          opacity: 0,
          width: '0px',
          overflow: 'hidden'
        }))
      ]),
    ])
  ]
})
export class SideMenuComponent {

  currMenuState: MenuState;
  showMenu: boolean;
  menuStateEnum = MenuState;

  constructor(private menuService: MenuService) {
    this.menuService.getMenuState$().subscribe((menuState: MenuState) => {
      this.currMenuState = menuState;
      this.showMenu = this.shouldShowMenu();
    });
  }

  shouldShowMenu(): boolean {
    const statesArr = [MenuState.CLUSTER_LIST, MenuState.ESP_FORM]
    return statesArr.indexOf(this.currMenuState) > -1;
  }
}
