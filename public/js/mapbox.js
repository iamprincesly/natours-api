/* eslint-disable */

export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiaWFtcHJpbmNlc2x5IiwiYSI6ImNrdG93eDUxaTBoMWYyb3BuNW8zMXF2YnEifQ.QQDI6VVCD0_dfETn2FnyYw';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/iamprincesly/cktox22t71ohy18n6sjxru4ov',
        scrollZoom: false,
        // center: [-117.48706580201055, 34.74319862831102],
        // zoom: 1,
        // interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({ offset: 30 })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            right: 100,
            left: 100,
        },
    });
};
