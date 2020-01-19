App.info({
    id: 'com.meteor.systemd',
    name: 'System-D',
    version: "0.0.7",
    description: 'Encrypted platform for collaborative and free projects',
    author: 'System-d team',
    email: 'rbanquo@protonmail.com',
    website: 'https://www.system-d.org/'
});

App.icons({
    'android_mdpi': 'public/android/Icon-48.png',
    'android_hdpi': 'public/android/Icon-72.png',
    'android_xhdpi': 'public/android/Icon-96.png',
    'android_xxhdpi': 'public/android/Icon-144.png',
    'android_xxxhdpi': 'public/android/Icon-192.png',
    // More screen sizes and platforms...
});
App.launchScreens({
    android_mdpi_portrait: 'public/android/large-480.png',
    android_hdpi_portrait: 'public/android/large-800.png',
    android_xhdpi_portrait: 'public/android/large-1280.png',
    android_xxhdpi_portrait: 'public/android/large-1280.png',
    android_xxxhdpi_portrait: 'public/android/large-1280.png',
})
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('Orientation', 'portrait');
//App.setPreference('StatusBarBackgroundColor', '#263238');


// App.accessRule('*');
// App.accessRule('http://*');
App.accessRule('https://*');
App.accessRule('https://raw.githubusercontent.com/HUB-HUmanBeing/SystemD/master/public/news/newsFeed.json', { type: 'navigation' });
// App.accessRule('https://*', { type: 'navigation' });
App.accessRule('*.openstreetmap.org/*', { type: 'navigation' });
App.accessRule('*.tile.openstreetmap.com/*', { type: 'navigation' });
App.accessRule('*.tile.openstreetmap.com/*', { type: 'navigation' });
App.accessRule('https://server.arcgisonline.com/*', { type: 'navigation' });
App.accessRule('http://a.tiles.mapbox.com/*', { type: 'navigation' });
App.accessRule('https://api.tiles.mapbox.com/*', { type: 'navigation' });
App.accessRule('https://placeholdit.imgix.net/*', { type: 'navigation' });
