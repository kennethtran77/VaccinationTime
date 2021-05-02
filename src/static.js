// Map Options
export const libraries = ["places"];

export const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}

export const center = {
  lat: 43.651890,
  lng: -79.381706
}

export const options = {
  disableDefaultUI: true,
  zoomControl: true
}

// Helper functions
export const formatMin = (minutes) => {
  if (minutes || minutes === 0) {
    let hours = minutes / 60;
    let rhours = Math.floor(hours);
    var newMinutes = Math.round((hours - rhours) * 60);
    return `${rhours}h${newMinutes}m`;
  } else {
    return 'N/A';
  }
}