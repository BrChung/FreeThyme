import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CalendarService } from './services/calendar.service';
import { RoomService } from './services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'freethyme';
  constructor(public authService: AuthService, public roomService: RoomService, public calendarService: CalendarService){}
}
