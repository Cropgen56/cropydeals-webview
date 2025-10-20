export default function makePolygonCoordinates(
  points,
  {minPoints = 4, precision = 6} = {},
) {
  if (!Array.isArray(points) || points.length === 0) return [];

  // Map and validate numbers
  const ring = points.map((p, i) => {
    // allow both objects {lat,lng} and arrays [lat, lng]
    let lat = null,
      lng = null;
    if (Array.isArray(p)) {
      // assume [lat, lng] or [lng, lat] ? you said your points are {lat,lng} so prefer explicit
      lat = Number(p[0]);
      lng = Number(p[1]);
    } else {
      lat = Number(p.lat);
      lng = Number(p.lng);
    }
    if (!isFinite(lat) || !isFinite(lng)) {
      throw new Error(
        `Invalid coordinate at index ${i}: lat=${p.lat}, lng=${p.lng}`,
      );
    }
    // Round to avoid tiny float diffs (optional)
    const factor = Math.pow(10, precision);
    return [
      Math.round(lng * factor) / factor,
      Math.round(lat * factor) / factor,
    ];
  });

  // Ensure closed ring (first === last)
  const first = ring[0];
  const last = ring[ring.length - 1];
  const equal = first[0] === last[0] && first[1] === last[1];
  if (!equal) ring.push([...first]);

  if (ring.length < minPoints) {
    throw new Error(
      `Polygon ring must have at least ${minPoints} coordinates (including closing point).`,
    );
  }

  return [ring]; // GeoJSON polygon coordinates = [ [ring] ]
}
