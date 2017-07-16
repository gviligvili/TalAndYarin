import { Component, OnInit } from '@angular/core';
import {MenuService} from "../../services/menu-service/menu.service";
import {MenuState} from "../../services/menu-service/menu-state.enum";

@Component({
  selector: 'footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.scss']
})
export class FooterMenuComponent {
  menuStateEnum = MenuState;

  constructor(private menuService: MenuService) {}

  changeMenuState(newState: MenuState) {
    this.menuService.setMenuState(newState);
  }
}
