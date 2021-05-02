import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

import Info from './components/Info';

import './App.css';

import clinicsData from './data/covid-19-immunization-clinics.json';

import { mapContainerStyle, libraries, center, options } from './static';

// Return an array of all clinic addresses
const initClinics = () => {
  let clinics = [];

  clinicsData.features.forEach(clinic => {
    clinics.push({
      'Address': clinic.properties.address
    });
  });

  return clinics;
}

function App() {
  // Load Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries
  })

  // Search bar hooks
  const [searchValue, setSearchValue] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Filter bar hooks
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [criteria, setCriteria] = useState('MAX');
  const [clinics, setClinics] = useState(initClinics());

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
  const search = () => {
    setClinics(initClinics());

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
    // Pan back to center
    panTo(center);
    setSelectedClinic(null);
  };

  // Filter markers based given a criteria and an upper bound on wait time
  const filter = () => {
    fetch('/filter?' + new URLSearchParams({
      criteria,
      bound: (parseInt(hours) * 60 + parseInt(minutes))
    }))
    .then(res => res.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            setClinics(data);
        } catch (err) { }
    })
    .catch(err => console.log(err));
  };

  // Return an array of markers for `clinics`
  const getMarkers = () => {
    let markers = []

    clinics.forEach((search, key) => {
      let clinic = clinicsData.features.find(element => element.properties.address === search['Address']);

      if (clinic) {
        markers.push(<Marker
            key={key}
            position={{
                lat: clinic.geometry.coordinates[1],
                lng: clinic.geometry.coordinates[0]
            }}
            onClick={() => setSelectedClinic(clinic)}
        />);
      }
    });

    return markers;
  }

  return (
    <div>
      <div id='mainbar'>
        <h1 className="title">VaccinationTime</h1>
        <div id="search-form">
          <input
            list="clinics" id="search-bar" name="search-bar" placeholder='Search vaccination locations' autoComplete='off'
            value={searchValue} onChange={e => setSearchValue(e.target.value)}
          />
          <datalist id='clinics'>
            { clinicsData.features.map((clinic, key) => <option key={key} value={clinic.properties.locationName } />) }
          </datalist>
          <button onClick={() => search()}><i className="fa fa-search"></i></button>
          <button onClick={() => setShowFilterBar(!showFilterBar)}><span>☰</span></button>
        </div>
      </div>
      { 
      // TODO - move filter into its own component
      showFilterBar && (
        <div id='filterbar'>
          <h3 className="title margin-right">Filter Criteria</h3>
            <label>
              Criteria
              <select value={criteria} onChange={e => setCriteria(e.target.value)} className='margin-right' >
                <option value="MAX">Longest Wait Time</option>
                <option value="AVG">Average Wait Time</option>
                <option value="MIN">Shortest Wait Time</option>
              </select>
            </label>
            <label>
                Hours
                <input type="number" min='0' max='12' value={hours} onChange={e => setHours(e.target.value)} className='margin-right' />
            </label>
            <label>
                Minutes
                <input type="number" min='0' max='60' value={minutes} onChange={e => setMinutes(e.target.value)} className='margin-right' />
            </label>
            <button onClick={() => filter()}><i className="fa fa-search"></i></button>
            <button onClick={() => setClinics(initClinics())}>⨉</button>
        </div>
      )}
      <div id='map'>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          options={options}
          onLoad={onMapLoad}>
            { // Render markers
              getMarkers()
            }

            { // Render Info component for the currently selected clinic
            selectedClinic && selectedClinic.properties['locationName'] && (
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
