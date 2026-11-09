BasicX — combined NSEP + NSEC starter web app

Contents
- www/index.html: BasicX home screen / subject selector
- www/nsep.html: original NSEP Physics app (kept intact)
- www/nsec.html: original NSEC Chemistry app (kept intact)
- www/assets/: BasicX logo and app icons
- www/manifest.webmanifest + www/sw.js: installable web-app shell

IMPORTANT
1. Keep nsep.html and nsec.html in the same folder as index.html.
2. For the existing Capacitor Android project, copy the CONTENTS of this www folder into the project's configured webDir (often named www), after making a backup.
3. Do not delete the Android project files, package.json, capacitor.config.*, or GitHub workflow.
4. For desktop use, deploy the www folder to an HTTPS static host (e.g. GitHub Pages) or open index.html in a browser. PWA install is available when served over HTTPS.
5. The subject pages are preserved as separate HTML documents so their NSEP and NSEC local progress keys remain separate.

This is an integration shell. Test both subjects, audio, progress, backup/restore and desktop/mobile layouts before publishing a release APK.
