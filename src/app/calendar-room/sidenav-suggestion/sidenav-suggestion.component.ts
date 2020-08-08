import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav-suggestion',
  templateUrl: './sidenav-suggestion.component.html',
  styleUrls: ['./sidenav-suggestion.component.scss']
})
export class SidenavSuggestionComponent implements OnInit {
  @Input() votesFT: any;
  @Input() meetingTimes: Array<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
