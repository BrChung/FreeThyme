import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  room: Observable<any>;
  roomDoc: AngularFirestoreDocument<any>;
  roomId: string;

  constructor(public afs: AngularFirestore, public authService: AuthService) { }

  async createRoom() {
    // TODO: a Reference to the rooms collection
    const roomCollectionRef: AngularFirestoreCollection = this.afs.collection('rooms');
    // TODO: Generate an auto id
    let docRef = roomCollectionRef.add({});

    // TODO: Save the auto id to be used later
    let docId = docRef.getId();
    // let docId = docRef['__zone_symbol__value']['em']['path']['segments'][1];

    console.log("just made a room: ", docRef);
    console.log(docId);

  }

  // PUSHING DATA to cloud firestore --> should convert to a function that can be called
  // NEED to know which room and which user
  public updateRoomData(freeBusy) {
    console.log("in updateRoomData function")
    // Setting a reference
    const roomRef: AngularFirestoreDocument = this.afs.doc(`rooms/${this.roomId}/`);

    // === POTENTIAL OPTIMIZATION === //
    // Wasn't sure how to create this structure in a model
    const userCalendar = {}
    userCalendar[this.authService.userId] = {
      freeBusy
    }

    roomRef.set(userCalendar, {merge:true})

  }

  public getRoomDetails(roomID: any){
    this.roomDoc = this.afs.doc(`rooms/${roomID}`)
    this.room = this.roomDoc.valueChanges();
    return this.room;
  }

}
