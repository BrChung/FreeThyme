# FreeThyme

FreeThyme is a web-application that makes it simple for individuals to coordinate and schedule events by inuitively finding free time on multiple calendars.

FreeThyme is built on a serverless architecture and hosted on the Firebase platform. The front end is built with Angular 9.0.4, a TypeScript-based web application framework. Backend code is written in Python 3.7.6 and is deployed on the Google Cloud Functions Python runtime.

## Preparing the Backend Development Environment

The Firebase CLI does not natively support deploying functions written in Python, supporting Node.js V8 instead. Python was chosen as our backend language of choice because of its simple syntax and ease of manipulation of datasets. Portability with the [previous FreeThyme](https://devpost.com/software/free-thyme) codebase (Flask Version) was also a major consideration.

Code for the Cloud Functions will be found in the ./functions directory. To deploying the function will need the Google Cloud SDK, installation instructions can be found [here](https://cloud.google.com/sdk/install).

Deploying the Cloud Function will need the following gcloud command:

```bash
gcloud functions deploy FUNCTION_NAME \
  --runtime python37 \
  --trigger-event providers/cloud.firestore/eventTypes/document.write \
  --trigger-resource projects/freethyme-269222/databases/(default)/documents/COLLECTION_NAME/{DOCUMENT_WILDCARD}
```

For more detail feel free to check the [doc](https://cloud.google.com/functions/docs/calling/cloud-firestore#functions_firebase_firestore-python).

## Preparing the Frontend Development Environment

All code related to the front end will be stored within

### Install Angular CLI

The Angular CLI is necessary in building and running the development environment. You may download it with the following command:

```bash
npm install -g @angular/cli
```

\*Note: For the command to work you will need to have installed the latest version of node and npm. They can be downloaded [here](https://nodejs.org/en/download/).

### Install Dependencies

Run `npm install` to install dependencies.

### Set Enviroment Variables

The web-application will not function without connecting to various API's. API keys can be generated from [Firebase](https://console.firebase.google.com/) and [GCP](https://console.developers.google.com/)

They will need to be set in the `./src/environments/environment.ts` file. Follow the syntax provided by the `environments.example.ts` file.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests (WIP)

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests (WIP)

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Deploying the Web-Application (WIP)

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
