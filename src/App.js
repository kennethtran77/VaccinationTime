import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

import Info from './components/Info';

import './App.css';

import clinicsData from './data/covid-19-immunization-clinics.json';

import { mapContainerStyle, libraries, center, options } from './static';

function App() {
  // Load Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries
  })

  // Hooks for state
  const [searchValue, setSearchValue] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Store ref
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Pan to the given coordinates
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
  }, []);

  if (!isLoaded || loadError) return '';

  // handle function for search bar
  const handleSearch = e => {
    e.preventDefault();

    for (let i = 0; i < clinicsData.features.length; i++) {
      let clinic = clinicsData.features[i];

      if (clinic.properties.locationName.toLowerCase() === searchValue.trim().toLowerCase()) {
        panTo({
          lat: clinic.geometry.coordinates[1],
          lng: clinic.geometry.coordinates[0]
        });
        setSelectedClinic(clinic);
        return;
      }
    };

    panTo(center);
    setSelectedClinic(null);
  };

  return (
    <div id='app'>
      <div id='mainbar'>
        <h1 id="title">VaccinationTime</h1>
        <form id="search-form" onSubmit={handleSearch}>
          <input
            list="clinics" id="search-bar" name="search-bar" placeholder='Search vaccination locations'
            value={searchValue} onChange={e => setSearchValue(e.target.value)}
          />
          <datalist id='clinics'>
            { clinicsData.features.map((clinic, key) => <option key={key} value={clinic.properties.locationName } />) }
          </datalist>
          <button type="submit"><i className="fa fa-search"></i></button>
        </form>
      </div>
      <div id='map'>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          options={options}
          onLoad={onMapLoad}>
            {clinicsData.features.map((clinic) => (
                <Marker
                    key={clinic.properties['_id']}
                    position={{
                        lat: clinic.geometry.coordinates[1],
                        lng: clinic.geometry.coordinates[0]
                    }}
                    onClick={() => setSelectedClinic(clinic)}
                />)
            )}

            { selectedClinic && selectedClinic.properties['locationName'] && (
                <Info
                  position={{
                    lat: selectedClinic.geometry.coordinates[1],
                    lng: selectedClinic.geometry.coordinates[0]
                  }}
                  resetClinic={() => setSelectedClinic(null)}
                  selectedClinic={selectedClinic}
                />
            )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;
