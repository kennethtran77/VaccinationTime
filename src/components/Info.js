import { useState, useEffect } from 'react';

import { InfoWindow } from '@react-google-maps/api';

import AddReview from './AddReview';
import ListReviews from './ListReviews';

import { formatMin } from '../static';

// A wrapper component around InfoWindow component
function Info(props) {
    const [waitTimeInfo, setWaitTimeInfo] = useState({});

    useEffect(() => {
        // Fetch the wait time data from the API when this Info component is mounted
        fetch('/waittime?' + new URLSearchParams({
            address: props.selectedClinic.properties.address
        }))
        .then(res => res.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                setWaitTimeInfo(data)
            } catch (err) { }
        })
        .catch(err => console.log(err));

        // Set the app's selected clinic to `null` on unmount
        return () => {
            // console.log(`unmounting: ${props.selectedClinic.properties.address}`);
            props.resetClinic();
        };
    }, [props, props.selectedClinic.properties.address, props.resetClinic]);

    return (
        <InfoWindow
            position={props.position}
            onCloseClick={props.resetClinic} >
            <div>
                <h2>{props.selectedClinic.properties.locationName }</h2>
                <h3>{props.selectedClinic.properties.address}</h3>
                <p>{props.selectedClinic.properties.info}</p>
                <h3>Average Wait Time: { formatMin(waitTimeInfo.avg) }</h3>
                <h3>Shortest Wait Time: { formatMin(waitTimeInfo.min) }</h3>
                <h3>Longest Wait Time: { formatMin(waitTimeInfo.max) }</h3>
                <div className="flex">
                    <AddReview clinic={props.selectedClinic} />
                    <div className='margin-right'></div>
                    <ListReviews clinic={props.selectedClinic} />
                </div>
            </div>
        </InfoWindow>
    );
}

export default Info;