App.info({
    id: 'com.systemd.systemd',
    name: 'System-D',
    version: "0.1.2",
    description: 'Encrypted platform for collaborative and free projects',
    author: 'System-d team',
    email: 'rbanquo@protonmail.com',
    website: 'https://www.system-d.org/'
});

App.icons({
    'android_mdpi': 'public/android/mipmap-mdpi/ic_launcher.png',
    'android_hdpi': 'public/android/mipmap-hdpi/ic_launcher.png',
    'android_xhdpi': 'public/android/mipmap-xhdpi/ic_launcher.png',
    'android_xxhdpi': 'public/android/mipmap-xxhdpi/ic_launcher.png',
    'android_xxxhdpi': 'public/android/mipmap-xxxhdpi/ic_launcher.png',
    // More screen sizes and platforms...
});
 App.launchScreens({
    android_mdpi_portrait: 'public/android/large-480.png',
    android_hdpi_portrait: 'public/android/large-800.png',
    android_xhdpi_portrait: 'public/android/large-1280.png',
    android_xxhdpi_portrait: 'public/android/xlarge-1600.png',
    android_xxxhdpi_portrait: 'public/android/xxlarge-1920.png',
 })
App.setPreference('BackgroundColor', '#263238');
App.setPreference('Orientation', 'portrait');
App.setPreference('loadUrlTimeoutValue', '60000');
App.setPreference('android-targetSdkVersion', '29', "android");

App.accessRule('*');
App.accessRule('http://*');
App.accessRule('https://*');
App.accessRule('http://*', { type: 'navigation' });
App.accessRule('https://*', { type: 'navigation' });
App.accessRule('https://*', {type: "intent"});
App.accessRule('https://www.system-d.org/*');
App.accessRule('https://www.asset.system-d.org/*');
App.accessRule('blob:*', {type: "intent"});
App.accessRule('blob:*', {type: "navigation"});
App.accessRule('data:*', {type: "intent"});
App.accessRule('data:*', {type: "navigation"});
App.accessRule('geo:*', {type: "intent"});
//App.accessRule('*', { type: "intent" });

App.accessRule('http://localhost:*');
App.accessRule('https://raw.githubusercontent.com/HUB-HUmanBeing/SystemD/master/public/news/newsFeed.json', {type: 'navigation'});
// App.accessRule('https://*', { type: 'navigation' });
App.accessRule('*.openstreetmap.org/*', {type: 'navigation'});
App.accessRule('*.tile.openstreetmap.com/*', {type: 'navigation'});
App.accessRule('*.tile.openstreetmap.com/*', {type: 'navigation'});
App.accessRule('https://server.arcgisonline.com/*', {type: 'navigation'});
App.accessRule('http://a.tiles.mapbox.com/*', {type: 'navigation'});
App.accessRule('https://liberapay.com/robinBanquo/donate', {type: 'navigation'});
App.accessRule('https://liberapay.com/robinBanquo/donate', {type: 'intent'});
App.accessRule('https://api.tiles.mapbox.com/*', {type: 'navigation'});
App.accessRule('https://placeholdit.imgix.net/*', {type: 'navigation'});
App.accessRule('https://framapiaf.org/*', {type: 'intent'});
App.accessRule('https://www.facebook.com/*', {type: 'intent'});
App.accessRule('https://twitter.com/*', {type: 'intent'});
App.accessRule('https://riot.im/*', {type: 'intent'});
App.accessRule('https://github.com/*', {type: 'intent'});

App.addResourceFile("cordova-build-override/google-services.json", "app/google-services.json", "android")

App.appendToConfig(`
    <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
        <application android:usesCleartextTraffic="true">
            <trust-anchors>            
              <certificates src="system" />        
            </trust-anchors> 
        </application>
    </edit-config>
`);

