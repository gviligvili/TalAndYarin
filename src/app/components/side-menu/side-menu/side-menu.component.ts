import { Component } from '@angular/core';
import {MenuService} from "../../../services/menu-service/menu.service";
import {MenuState} from "../../../services/menu-service/menu-state.enum";

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  currMenuState: MenuState;
  menuStateEnum = MenuState;

  constructor(private menuService: MenuService) {
    this.menuService.getMenuState().subscribe((menuState: MenuState) => {
      this.currMenuState = menuState;
    });
  }
}
