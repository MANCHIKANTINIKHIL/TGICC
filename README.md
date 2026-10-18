# TGICC – Expo SDK 57 (offline Android app)

## Run (fresh extraction; use a short folder path with no spaces or brackets, e.g. C:\TGICC)
```
npm install
npx expo install --fix
npx expo start -c
```
`npx expo install --fix` is a separate step on purpose. It sets React, React Native and every Expo package
to the exact versions in Expo SDK 57's compatibility table and rewrites package.json with them.
Run it once after `npm install` (needs internet). Later installs of the same folder do not need it again.

No metro.config.js / babel.config.js is needed: Expo SDK 57 provides its defaults.
package-lock.json is created by npm on the first install.

## Build an installable APK
```
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```
