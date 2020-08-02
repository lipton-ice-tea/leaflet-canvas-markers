> 一 A JavaScript Integrated [Leaflet](https://github.com/Leaflet/Leaflet) Map API

# Leaflet-canvas-markers
Adding all images to one canvas, together with the base L.CircleMarker!
And you can create a direction arrow just by pointing to the previous waypoint.

## Demo
[Live Demo >>](https://lipton-ice-tea.github.io/leaflet-canvas-markers/)
## Base Usage
```javascript
const map = L.map('map', {preferCanvas: true}).setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.canvasMarker(L.latLng(51.495, -0.06), {
    radius: 20,
    img: {
        url: 'icon.png',    //image link
        size: [40, 40],     //image size ( default [40, 40] )
        rotate: 10,         //image base rotate ( default 0 )
        offset: { x: 0, y: 0 }, //image offset ( default { x: 0, y: 0 } )
    },
}).addTo(map);
```
## Direction Arrow
You can specify the previous point (prevLatlng: latlng). The picture will automatically show the direction of movement.
```javascript
const map = L.map('map', {preferCanvas: true}).setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.canvasMarker(L.latLng(51.495, -0.06), {
    radius: 20,
    prevLatlng: L.latLng(51.503, -0.09),    //previous point
    img: {
        url: 'arrow.png',
        size: [40, 40],
        rotate: 0,
    },
}).addTo(map);
```

## Options
| Option | Type | Description |
| --- | --- | --- |
| `img` | `Object` | Image properties |
| `prevLatlng` | `LatLng` | The coordinates of the previous point. If indicated - The image automatically shows the direction |

## Options img
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `String` |     | Image link |
| `size` | `Array` | `[40, 40]` | Image size in map |
| `rotate` | `Number` | `0` | Image rotate in map |
| `offset` | `Object` | `{ x: 0, y: 0 }` | Image offset in Canvas |