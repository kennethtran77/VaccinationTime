import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

import { formatMin } from './static';

function ListReviews(props) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('/review?' + new URLSearchParams({
            address: props.clinic.properties.address
        }))
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console(err));
    }, [props.clinic.properties.address])

    return(
        <Popup
            trigger={<button className="button"> List Reviews </button>}
            modal
            nested
        >
        {close => (
          <div className="modal">
            <div className="header">
                <h1>Reviews</h1>
                <h3>{props.clinic.properties.locationName}</h3>
            </div>
            <div className="content">
              <table>
                  <tbody>
                    <tr>
                        <th>No.</th>
                        <th>Wait Time</th>
                        <th className="span-width">Comments</th>
                    </tr>
                    {
                    reviews.map((review, key) => (
                        <tr key={key}>
                            <th>{ key }</th>
                            <th>{ formatMin(parseInt(review["WaitTime"])) }</th>
                            <th className="span-width">{ review["Comments"] }</th>
                        </tr>
                    ))
                    }
                  </tbody>
              </table>
            </div>
            <div className="actions">
              <button
                className="button"
                onClick={() => close()}
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </Popup>
    );
}

export default ListReviews;