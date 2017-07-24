import { Injectable } from '@angular/core';
import {MenuState} from './menu-state.enum';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class MenuService {

  menuState$ = new BehaviorSubject<MenuState>(null);

  setMenuState(newState: MenuState) {
    const oldValue = this.menuState$.getValue();

    // If it's the same, turn the flag off.
    if (oldValue === newState) {
      this.menuState$.next(null);
    } else {
      this.menuState$.next(newState);
    }
  }

  getMenuState$(): BehaviorSubject<MenuState> {
    return this.menuState$;
  }
}
