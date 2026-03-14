# Valet App (React Native / Expo)

Valet app built with **React Native** and **Expo** so you can build and submit to the **iOS App Store** and **Google Play Store**.

## Features

- **Search bar** – Search by ticket number, name, license plate, or make
- **Sort** – Button with up/down arrows; opens menu: Arrival Time (Asc/Desc), Ticket Number (Asc/Desc)
- **Status filter** – All Vehicles, Parked, Requested, Retrieving, Retrieved, Out
- **Vehicle list** – Shows only vehicles matching the selected status and search
- **Empty state** – “No vehicles match your search or filter.” when there are no results
- **Green FAB** – Bottom right, white car icon (add vehicle / main action)

## Run locally

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

## Build for the App Store (iOS) and Google Play (Android)

1. **Install EAS CLI and log in**

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure the project**

   - In `app.json`, set your own `bundleIdentifier` (iOS) and `package` (Android), e.g. `com.yourcompany.valetapp`.
   - Optional: add an app icon and splash screen under `assets/` and reference them in `app.json` (see [Expo config](https://docs.expo.dev/guides/app-icons/)).

3. **Create an EAS project** (first time only)

   ```bash
   eas build:configure
   ```

   This creates `eas.json`. You can keep the default build profiles.

4. **Build for stores**

   - **iOS (App Store):**
     ```bash
     eas build --platform ios --profile production
     ```
     Then use [EAS Submit](https://docs.expo.dev/submit/introduction/) or download the build and submit via App Store Connect.

   - **Android (Google Play):**
     ```bash
     eas build --platform android --profile production
     ```
     Then submit the AAB to Google Play Console or use `eas submit`.

5. **Submit with EAS (optional)**

   ```bash
   eas submit --platform ios --latest
   eas submit --platform android --latest
   ```

You need **Apple Developer** and **Google Play** accounts for store submission. Expo’s docs cover [building](https://docs.expo.dev/build/introduction/) and [submitting](https://docs.expo.dev/submit/introduction/) in more detail.

## Project structure

- `App.js` – App entry, renders `ValetScreen`
- `src/screens/ValetScreen.js` – Main valet UI (search, sort, filter, list, FAB)
- `src/data/vehicles.js` – Mock vehicles, status/sort options, helpers

The old web files (`index.html`, `styles.css`, and the previous `app.js` logic) have been replaced by this React Native app.
