// getUserLocation.js
export default async function getLocation() {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number' ||
            isNaN(latitude) ||
            isNaN(longitude)
          ) {
            throw new Error('Invalid latitude or longitude provided');
          }

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'cropgenweb/1.0 (youremail@example.com)',
              },
            }
          );

          const data = await response.json();

          if (data.address) {
            resolve({
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                'Unknown City',
              state: data.address.state || 'Unknown State',
            });
          } else {
            reject('Location not found');
          }
        } catch (err) {
          reject(err.message);
        }
      },
      (error) => reject(error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}
