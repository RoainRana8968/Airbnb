const coordinates = Array.isArray(listing) ? listing : JSON.parse(listing);
const map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
console.log(coordinates[0]);
console.log(coordinates[1]);
    L.marker([coordinates[1], coordinates[0]])
        .addTo(map)
        .bindPopup('<h2>location where u are currently at</h2>')
        .openPopup();