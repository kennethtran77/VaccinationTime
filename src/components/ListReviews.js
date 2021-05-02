import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

import { formatMin } from '../static';

function ListReviews(props) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch the reviews data from the API when this ListReviews component is mounted
        fetch('/review?' + new URLSearchParams({
            address: props.clinic.properties.address
        }))
        .then(res => res.text())
        .then(text => {
          try {
              const data = JSON.parse(text);
              setReviews(data);

              // Used to force this component to rerender when the user leaves a new review
              // eslint-disable-next-line
              let update = props.update;
          } catch (err) { }
        })
        .catch(err => console.log(err));
    }, [props.update, props.clinic.properties.address])

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
            <hr/>
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
                            <td>{ key }</td>
                            <td>{ formatMin(parseInt(review["WaitTime"])) }</td>
                            <td className="span-width">{ review["Comments"] }</td>
                        </tr>
                    ))
                    }
                  </tbody>
              </table>
            </div>
            <div className="v-spacing"></div>
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