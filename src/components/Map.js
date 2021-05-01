import React from 'react';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-map';

function Map() {
    return(
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{
                lat: 43.651890,
                lng: -79.381706
            }}   
        />
    )
}

export const WrappedMap = withScriptjs(withGoogleMap(Map));