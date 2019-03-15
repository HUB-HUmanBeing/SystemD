self.addEventListener("push", e => {
    const data = e.data.json()
    //console.log("push recived",data)
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/images/favicons/favicon-196.png",
        badge: "/images/favicons/favicon-96.png",
        tag: data.body,
        vibrate: [100, 100, 200, 100, 300],
        sound: "/sounds/just-like-that.mp3",
        actions: [{
            title: data.action,
            action: "See on website",
            icon: "/images/icon/go.png"
        }]
    });
});
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'go') {
        clients.openWindow("/")
    }
}, false);
