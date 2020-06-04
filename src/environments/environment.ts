// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBuR5_eDmJZuIXAYztNZmiHEXG5neSgO9o",
    authDomain: "freethyme-269222.firebaseapp.com",
    databaseURL: "https://freethyme-269222.firebaseio.com",
    projectId: "freethyme-269222",
    storageBucket: "freethyme-269222.appspot.com",
    messagingSenderId: "182621995345",
    appId: "1:182621995345:web:433cc7c2bfb4dcf352d370",
    measurementId: "G-9XQ8VD95T7",
  },
  googleCal: {
    apiKey: "AIzaSyBuR5_eDmJZuIXAYztNZmiHEXG5neSgO9o",
    clientId:
      "182621995345-4hu18t2bf0bc4636dqln5gt4scbtlqk0.apps.googleusercontent.com",
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
    scope: "https://www.googleapis.com/auth/calendar",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
