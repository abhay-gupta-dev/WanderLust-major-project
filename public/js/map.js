document.addEventListener("DOMContentLoaded", () => {

    const map = new maplibregl.Map({
        container: "map",
        style: {
            version: 8,
            sources: {
                "osm": {
                    type: "raster",
                    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    tileSize: 256,
                    attribution: "© OpenStreetMap contributors"
                }
            },
            layers: [{
                id: "osm-layer",
                type: "raster",
                source: "osm"
            }]
        },
        center: coordinates,
        zoom: 12
    });

    map.addControl(new maplibregl.NavigationControl());

    // ✅ Custom house marker
    const el = document.createElement("div");
    el.innerHTML = `
        <div style="
            background: #fe424d;
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 5px;
        ">
            🏠 Book here
        </div>
    `;

    // ✅ Marker with popup
    new maplibregl.Marker({ element: el })
        .setLngLat(coordinates)
        .setPopup(
            new maplibregl.Popup({ offset: 25 })
                .setHTML(`
                    <div style="padding: 5px;">
                        <h6 style="margin: 0 0 5px;">${listingTitle}</h6>
                        <p style="margin: 0; color: #555; font-size: 13px;">📍 ${listingLocation}</p>
                        <p style="margin: 5px 0 0; color: #fe424d; font-weight: bold;">Exact location shared after booking</p>
                    </div>
                `)
        )
        .addTo(map);

});