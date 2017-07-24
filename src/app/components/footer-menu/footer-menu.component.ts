import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../services/menu-service/menu.service';
import {MenuState} from '../../services/menu-service/menu-state.enum';

@Component({
  selector: 'footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.scss']
})
export class FooterMenuComponent {
  menuStateEnum = MenuState;
  currMenuState: MenuState;
  showDrawer: boolean;

  constructor(private menuService: MenuService) {
    this.menuService.getMenuState$().subscribe((state) => {
      this.currMenuState = state;
      this.showDrawer = this.showDrawerLogic();
    });
  }

  changeMenuState(newState: MenuState) {
    this.menuService.setMenuState(newState);
  }

  showDrawerLogic() {
      const statesArr = [MenuState.TIME_LINE];
      return statesArr.indexOf(this.currMenuState) > -1;
  }
}
