import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { combineLatest, of } from "rxjs";
import { switchMap, map, delay } from "rxjs/operators";
import * as firebase from "firebase/app";
import { AuthService } from "./auth.service";
import {
  differenceInMinutes,
  addMinutes,
  closestTo,
  addDays,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
  roundToNearestMinutes,
  isSameHour,
  subHours,
} from "date-fns";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private auth: AuthService
  ) {}

  getRoomDoc(roomID: any) {
    const roomDoc = this.afs.doc(`rooms/${roomID}`);
    const room = roomDoc.valueChanges();
    return room;
  }

  getMemberDoc(roomID: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const memberDoc = this.afs.doc(`rooms/${roomID}/members/${user.uid}`);
          const member = memberDoc.valueChanges();
          return member;
        }
      })
    );
  }

  getCalData(roomID: string) {
    let merged = {};
    return this.afs
      .doc(`rooms/${roomID}/entire-cal/merged`)
      .valueChanges()
      .pipe(
        switchMap((m) => {
          merged = m;
          return this.getIndividualCal(roomID);
        }),
        map((individual) => {
          return { ...merged, individual };
        })
      );
  }

  getIndividualCal(roomID: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        return this.afs
          .doc(`rooms/${roomID}/calendars/${user.uid}`)
          .valueChanges();
      })
    );
  }

  getMembers(roomID: string) {
    let members = [];
    const joinKeys = {};
    const collectionRef = this.afs.collection(`rooms/${roomID}/members`);
    return collectionRef.valueChanges().pipe(
      switchMap((m) => {
        members = m;
        const uids = Array.from(new Set(m.map((member: any) => member["uid"])));
        // Firestore Room Doc Reads
        const userDocs = uids.map((uid) =>
          this.afs.doc(`users/${uid}`).valueChanges()
        );
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map((arr: any[]) => {
        arr.forEach((user) => (joinKeys[<any>user.uid] = user));
        members = members.map((member: any) => {
          return { ...member, user: joinKeys[member["uid"]] };
        });
        return members;
      })
    );
  }

  async addEvent(
    calID: string,
    title: string,
    start: Date,
    end: Date,
    description?: string,
    location?: string
  ) {
    const event = {
      start: firebase.firestore.Timestamp.fromDate(new Date(start)),
      end: firebase.firestore.Timestamp.fromDate(new Date(end)),
      title,
      description,
      location,
    };
    const user = await this.auth.getCurrentUser();
    if (user) {
      return this.afs
        .doc(`rooms/${calID}/calendars/${user.uid}`)
        .set(
          {
            ft_events: firebase.firestore.FieldValue.arrayUnion(event),
          },
          { merge: true }
        )
        .catch((error) => console.error("Error Adding Document: ", error));
    }
  }

  async changeFavorite(state: boolean, roomID: string) {
    const user = await this.auth.getCurrentUser();
    if (user) {
      const memDoc = this.afs.doc(`rooms/${roomID}/members/${user.uid}`);
      return memDoc.set({ favorite: !state }, { merge: true });
    }
  }

  async createRoom(data: any) {
    const user = await this.auth.getCurrentUser();
    if (user) {
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
          return docRef.id;
        })
        .catch((error) => console.error("Error Adding Document: ", error));
    }
  }

  async addBusyTimes(
    busyTimes: Array<any>,
    calID: string,
    calendarType: string
  ) {
    busyTimes.map((x) => {
      x.start = firebase.firestore.Timestamp.fromDate(new Date(x.start));
      x.end = firebase.firestore.Timestamp.fromDate(new Date(x.end));
    });
    const user = await this.auth.getCurrentUser();
    if (user) {
      var updateValue = {};
      updateValue[calendarType] = busyTimes;
      return this.afs
        .doc(`rooms/${calID}/calendars/${user.uid}`)
        .set(updateValue, { merge: true })
        .catch((error) => console.error("Error Adding Document: ", error));
    }
  }

  /**
   * Function finds suggested meeting times based on freetime
   * @param calID Unique ID for Calendar
   * @param preferredHours Array of preferred hours
   * @return Observable<Array>
   */

  getSuggestedMeetingTimes(calID: string, preferredHours: Array<number>) {
    let freeTime = [];
    const documentRef = this.afs.doc(`rooms/${calID}/entire-cal/freetime`);
    return documentRef.valueChanges().pipe(
      switchMap((doc) => {
        freeTime = doc["events"].map((value) => ({
          start: value.start.toDate(),
          end: value.end.toDate(),
        }));
        const calendarDoc = this.afs.doc(`rooms/${calID}`).valueChanges();
        return calendarDoc ? combineLatest(calendarDoc) : of([]);
      }),
      map((doc) => {
        console.time("Calculate FreeTime");
        let meetingTimes = [];
        let suggested = [];
        let lookupDates = [];
        const meetingLength = doc[0]["meetingLength"];
        for (const event of freeTime) {
          if (isBefore(new Date(), event.end)) {
            for (
              let i = roundToNearestMinutes(event.start, { nearestTo: 15 });
              i < event.end;
              i = addMinutes(i, meetingLength)
            ) {
              if (
                addMinutes(i, meetingLength) < event.end &&
                isAfter(i, new Date())
              )
                meetingTimes.push(i);
            }
          }
        }
        for (
          let i = new Date();
          i < addDays(new Date(), 7);
          i = addDays(i, 1)
        ) {
          for (const hour of preferredHours) {
            lookupDates.push(setMinutes(setHours(i, hour), 0));
          }
        }
        for (const date of lookupDates) {
          const foundStart = closestTo(date, meetingTimes);
          suggested.push({
            start: foundStart,
            end: addMinutes(foundStart, meetingLength),
          });
        }
        return suggested.filter(
          (item, index, self) =>
            index === self.findIndex((t) => isSameHour(t.start, item.start))
        );
      })
    );
  }

  /*
    Gets the list of suggested times that have votes
  */
  getVotesFT(calID) {
    let votedTimesData = {};
    const docRef = this.afs.doc(`rooms/${calID}/entire-cal/votes`);
    return docRef.valueChanges().pipe(
      switchMap((doc) => {
        // console.log(doc)

        // If votes in firebase exists and is not empty,
        // then send the calendar-room document to the map
        if (doc !== undefined && Object.keys(doc).length !== 0) {
          votedTimesData = doc;
          return this.afs.doc(`rooms/${calID}`).valueChanges();
        } else {
          // Sends an empty document to the map when votes does not exist
          return of({});
        }
      }),
      // This received the calendar-room ref and gets the meeting length
      map((calDoc) => {
        // If document it receives is not empty, then grab the meeting length
        if (Object.keys(calDoc).length !== 0) {
          votedTimesData["meetingLength"] = calDoc["meetingLength"];
        }
        console.log("Data provided to Calendar-Room.ts: ", votedTimesData);
        return votedTimesData;
      })
    );
  }

  /*
    Combines the suggestion free time and the suggestions
    with votes to update the front-end
  */
  combineSuggestions(calID, suggestedFT, votesFT) {
    console.log(
      "Trying to combine votes + suggestions: ",
      calID,
      suggestedFT,
      votesFT
    );

    // Convert votes to an array
    let newVotesFT = Object.entries(votesFT.votedTimes).map((el) => ({
      start: new Date(el[0]),
      end: addMinutes(Date.parse(el[0]), votesFT.meetingLength),
      UIDs: el[1]["UIDs"],
      profileImages: el[1]["profileImages"],
      count: el[1]["count"],
    }));

    newVotesFT.sort((a, b) => (a.count > b.count ? -1 : 1));
    newVotesFT = newVotesFT.filter((obj) => obj.end > subHours(new Date(), 1));
    // We compare the start times of all of the suggestedFT with the newVotesFT
    // To remove duplicates in the suggestedFT array
    for (const [suggestedIndex, suggestedObj] of suggestedFT.entries()) {
      // console.log(suggestedIndex, suggestedObj)
      for (const [votesIndex, votesObj] of newVotesFT.entries()) {
        console.log(suggestedObj.start, " vs ", votesObj.start);
        if (suggestedObj.start.getTime() === votesObj.start.getTime()) {
          console.log("WE ARE THE SAME: ", suggestedObj.start, votesObj.start);
          suggestedFT.splice(suggestedIndex, 1);
          break;
        }
      }
    }
    // Votes should be returned first, and then the other suggested times
    return newVotesFT.concat(suggestedFT);
  }

  /* Retrieve Rooms that the user is a member of
      First pipe authState to query all subcollections in afs with uid.
      Once membership documents are retrieved, temporarily store roomIDs in hash and retrieve each doc
      Finally return a merged object with room and membership data based on roomID
  */
  getRooms() {
    let rooms: any;
    const joinKeys = {};
    // Pipe takes input: whoever is logged in at the moment and turns it into desired output
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          try {
            return this.afs
              .collectionGroup("members", (ref) =>
                ref.where("uid", "==", user.uid).orderBy("lastAccessed", "desc")
              )
              .valueChanges()
              .pipe(
                delay(250), //Firebase Rule violated if query ran before database is updated
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
                  rooms = rooms.map((member: any) => {
                    return { ...member, room: joinKeys[member["roomID"]] };
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

  async addVoteTime(startTime: string, roomID: string) {
    const user = await this.auth.getCurrentUser();
    if (user) {
      try {
        return this.afs
          .collection("rooms/" + roomID + "/entire-cal")
          .doc("votes")
          .set(
            {
              votedTimes: {
                [startTime]: {
                  UIDs: firebase.firestore.FieldValue.arrayUnion({
                    uid: user.uid,
                    nickname: user.displayName,
                  }),
                  profileImages: firebase.firestore.FieldValue.arrayUnion({
                    [user.uid]: user.photoURL,
                  }),
                  count: firebase.firestore.FieldValue.increment(1),
                },
              },
            },
            { merge: true }
          )
          .catch((error) => console.error("Error Updating Document: ", error));
      } catch (error) {
        console.error("Error with Voting: ", error);
      }
    } else {
      console.error("Not signed in");
    }
  }

  async removeVoteTime(startTime: string, roomID: string) {
    const user = await this.auth.getCurrentUser();
    if (user) {
      try {
        return this.afs
          .collection("rooms/" + roomID + "/entire-cal")
          .doc("votes")
          .set(
            {
              votedTimes: {
                [startTime]: {
                  UIDs: firebase.firestore.FieldValue.arrayRemove({
                    uid: user.uid,
                    nickname: user.displayName,
                  }),
                  profileImages: firebase.firestore.FieldValue.arrayRemove({
                    [user.uid]: user.photoURL,
                  }),
                  count: firebase.firestore.FieldValue.increment(-1),
                },
              },
            },
            { merge: true }
          )
          .catch((error) => console.error("Error Updating Document: ", error));
      } catch (error) {
        console.error("Error with un-Voting: ", error);
      }
    } else {
      console.error("Not signed in");
    }
  }
}
