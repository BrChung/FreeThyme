import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, combineLatest, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  room: Observable<any>;
  roomDoc: AngularFirestoreDocument<any>;
  roles = {
    owner: 1,
    admin: 2,
    member: 3,
    viewer: 4,
  };

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  getRoomDetails(roomID: any) {
    this.roomDoc = this.afs.doc(`rooms/${roomID}`);
    this.room = this.roomDoc.valueChanges();
    return this.room;
  }

  async createRoom(data: any) {
    const user = await this.afAuth.auth.currentUser;
    const docData = this.convertToMins(data);
    return this.afs
      .collection("rooms")
      .add({
        ...docData,
        memberCount: 1,
        owner: user.uid,
        publicVisibility: false,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then((docRef) => {
        this.setMember(docRef.id, user.uid, user.displayName, "owner");
      })
      .catch((error) => console.error("Error Adding Document: ", error));
  }

  /* Retrieve Rooms that the user is a member of
      First pipe authState to query all subcollections in afs with uid.
      Once membership documents are retrieved, temporarily store roomIDs in hash and retrieve each doc
      Finally return a merged object with room and membership data based on roomID
  */
  getRooms() {
    let rooms: any;
    const joinKeys = {};
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          try {
            return this.afs
              .collectionGroup("members", (ref) =>
                ref.where("uid", "==", user.uid).orderBy("lastAccessed")
              )
              .valueChanges()
              .pipe(
                switchMap((m) => {
                  rooms = m;
                  const roomIDs = Array.from(
                    new Set(m.map((member: any) => member["roomID"]))
                  );
                  // Firestore Room Doc Reads
                  const roomDocs = roomIDs.map((id) =>
                    this.afs.doc(`rooms/${id}`).snapshotChanges()
                  );
                  return roomDocs.length ? combineLatest(roomDocs) : of([]);
                }),
                map((arr: any[]) => {
                  arr.forEach(
                    (room) =>
                      (joinKeys[(<any>room).payload.id] = room.payload.data())
                  );
                  rooms = rooms.map((room: any) => {
                    return { ...room, room: joinKeys[room["roomID"]] };
                  });
                  return rooms;
                })
              );
          } catch (error) {
            console.error("Error Reading Documents: ", error);
          }
        } else {
          return [];
        }
      })
    );
  }

  async setMember(
    roomID: string,
    uid: string,
    nickname: string,
    role = "viewer"
  ) {
    return this.afs
      .collection("rooms/" + roomID + "/members")
      .doc(uid)
      .set({
        uid,
        roomID,
        nickname,
        favorite: false,
        roles: this.getRoles(role),
        combined: this.roles[role] + "_" + nickname,
        addedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        lastAccessed: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .catch((error) => console.error("Error Adding Document: ", error));
  }

  getRoles(role: string) {
    const viewer = true;
    const member = role === "member" || role === "admin" || role === "owner";
    const admin = role === "admin" || role === "owner";
    return {
      viewer,
      member,
      admin,
    };
  }

  // Convert hours and mins to minutes, ES6 destructing
  convertToMins({ hours, mins, ...docData }) {
    return { ...docData, meetingLength: hours * 60 + mins };
  }
}
