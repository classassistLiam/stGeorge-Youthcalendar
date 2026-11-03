ST GEORGE YOUTH — ANDROID PWA FIRST MILESTONE

WHAT IS INCLUDED
- index.html: existing St George Youth interface, preserved and prepared for installation
- manifest.webmanifest: Android install identity, launch and icon settings
- service-worker.js: caches the app shell and enables the app to reopen offline
- icons/: Android and Apple home-screen icons

DEPLOY TO GITHUB PAGES
1. Download and extract this ZIP on your Windows computer.
2. Open your existing St George Youth GitHub repository.
3. Upload index.html, manifest.webmanifest, service-worker.js, and the entire icons folder into the SAME folder where the main page is hosted.
4. If your current homepage file is named differently, back it up first. For this package, the PWA launch page is index.html. Keep the existing Code.gs and its deployed /exec URL unchanged.
5. Commit the changes and wait for GitHub Pages to publish.
6. Open the HTTPS GitHub Pages address in Chrome on Android. Refresh once, then use the Install app button if Chrome offers it. You can also use Chrome menu > Install app / Add to Home screen.

IMPORTANT
- Do not open index.html as a local file. PWA installation requires HTTPS (GitHub Pages provides HTTPS).
- Keep the manifest, service worker and icons at the same folder level/path shown in this package.
- The service worker caches the app shell only. It deliberately does NOT cache Apps Script requests or finance/election writes.
- Offline mode lets the app shell reopen and preserves existing device-local data. Google Sheets, Drive uploads, trivia sync and other cloud features still need internet.
- The Play Store version is a later step: after the PWA is live and tested, we can package the same HTTPS site as an Android Trusted Web Activity (TWA), configure domain verification, build a signed Android App Bundle and prepare the Play Console listing. This ZIP is not an APK/AAB.

TESTING
On Android Chrome: open the published HTTPS URL > menu > Install app. Confirm that the app launches without the normal browser address bar. Test online, then briefly enable Airplane mode and reopen it to check the cached shell. Turn connectivity back on before testing server sync.
