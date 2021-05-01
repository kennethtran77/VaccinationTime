import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

import './App.css';

import clinicsData from './data/covid-19-immunization-clinics.json';

const libraries = ["places"];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}
const center = {
  lat: 43.651890,
  lng: -79.381706
}
const options = {
  disableDefaultUI: true,
  zoomControl: true
}

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Store ref
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Load API
  useLoadScript({
    googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries
  })

  // Pan to the given coordinates
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
  }, []);

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

  const handleCreateReview = e => {
    e.preventDefault();
    // alert(selectedClinic.properties.locationName);
  }

  const handleListReviews = e => {
    e.preventDefault();
    alert(selectedClinic.properties.locationName);
  }

  return (
    <div>
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
                <InfoWindow
                    position={{
                        lat: selectedClinic.geometry.coordinates[1],
                        lng: selectedClinic.geometry.coordinates[0]
                    }}
                    onCloseClick={() => {
                        setSelectedClinic(null);
                    }} >
                    <div>
                        <h2>{selectedClinic.properties.locationName }</h2>
                        <h3>{selectedClinic.properties.address}</h3>
                        <p>{selectedClinic.properties.info}</p>
                        <div className="flex">
                            <button onClick={handleCreateReview} className='margin-right'>Create Review</button>
                            <button onClick={handleListReviews} className='margin-right'>List Reviews</button>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
      </div>
      <div id='content'>

      </div>
    </div>
  );
}

export default App;
