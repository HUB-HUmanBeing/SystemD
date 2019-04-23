//
// const map = L.map('map', {
//     center: [53, 13.4],
//     zoom: 5,
//     zoomControl: false,
//     zoomDelta: .25,
//     zoomSnap: .25
// });
//
// let isEnabled = false;
// disableMap();
//
// L.control.zoom({ position: 'topright' }).addTo(map);
//
// new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
//     attribution: `attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>`,
//     detectRetina: true
// }).addTo(map);
//
// new L.SwoopyArrow([56, 1], [52.52, 13.4], {
//     label: 'Hi, I am a swoopy arrow!',
//     labelFontSize: 16,
//     labelColor: '#64A7D9',
//     color: '#64A7D9',
//     labelClassName: 'swoopy-arrow',
//     arrowFilled: true,
//     opacity: 1,
//     minZoom: 2,
//     maxZoom: 10,
//     factor: .6,
//     iconAnchor: [75, 5],
//     iconSize: [85, 16],
//     weight: 2
// }).addTo(map);
//
// new L.SwoopyArrow([54.316365, 24.637743], [50.000512, 16.604392], {
//     html: '<marquee style="font-style: italic;"><h2>👉 You can also add custom html 👈</h2></marquee>',
//     color: '#FFAB2E',
//     opacity: 1,
//     minZoom: 2,
//     maxZoom: 10,
//     factor: .6,
//     iconAnchor: [0, 30],
//     iconSize: [90, 16],
//     weight: 2
// }).addTo(map);
//
//
// new L.SwoopyArrow([50, 2], [53, 7], {
//     label: 'I have a custom arrow head!',
//     labelFontSize: 16,
//     labelColor: '#039960',
//     color: '#039960',
//     opacity: 1,
//     arrowId: '#custom_arrow',
//     labelClassName: 'swoopy-arrow',
//     minZoom: 2,
//     maxZoom: 10,
//     factor: .6,
//     iconAnchor: [65, -5],
//     iconSize: [150, 18],
//     weight: 2
// }).addTo(map);
//
//
// const activateBtn = document.querySelector('.activate-btn');
// activateBtn.addEventListener('click', () => {
//     if (isEnabled) {
//         activateBtn.innerHTML = 'Activate Map';
//         disableMap()
//     } else {
//         activateBtn.innerHTML = 'Deactivate Map';
//         enableMap()
//     };
//     isEnabled = !isEnabled;
// });
//
// function disableMap() {
//     map.dragging.disable();
//     map.touchZoom.disable();
//     map.doubleClickZoom.disable();
//     map.scrollWheelZoom.disable();
//     map.boxZoom.disable();
//     map.keyboard.disable();
//     if (map.tap) map.tap.disable();
//     document.getElementById('map').style.cursor='default';
// }
//
// function enableMap() {
//     map.dragging.enable();
//     map.touchZoom.enable();
//     map.doubleClickZoom.enable();
//     map.scrollWheelZoom.enable();
//     map.boxZoom.enable();
//     map.keyboard.enable();
//     if (map.tap) map.tap.enable();
//     document.getElementById('map').style.cursor='grab';
// }
//
//
