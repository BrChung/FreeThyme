import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  room: Observable<any>;
  roomDoc: AngularFirestoreDocument<any>;

  constructor(public afs: AngularFirestore) { }

  getRoomDetails(roomID: any){
    this.roomDoc = this.afs.doc(`rooms/${roomID}`)
    this.room = this.roomDoc.valueChanges();
    return this.room;
  }
}
