import {Component, Input, OnInit} from '@angular/core';
import {Target} from "../../../interfaces/target.interface";

@Component({
  selector: 'target-item',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss']
})
export class TargetItemComponent implements OnInit {

  @Input() target: Target;

  constructor() { }

  ngOnInit() {}

}
