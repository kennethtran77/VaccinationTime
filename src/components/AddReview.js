import { useState } from 'react';
import Popup from 'reactjs-popup';

function AddReview(props) {
    const [email, setEmail] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [comment, setComment] = useState('');

    return(
        <Popup
            trigger={<button className="button"> Leave Review </button>}
            modal
            nested
            onClose={() => {
                setEmail('');
                setHours(0);
                setMinutes(0);
                setComment('');
            }}
        >
        {close => (
          <div className="modal">
            <div className="header">
                <h2>Leave Review</h2>
                <h3>{props.clinic.properties.locationName}</h3>
            </div>
            <hr/>
            <div className="content">
              <form>
                <strong>How long did you have to wait?</strong>
                <div className="flex">
                  <label className='margin-right'>
                      Hours
                      <br/>
                      <input type="number" min='0' max='12' value={hours} onChange={e => setHours(e.target.value)} />
                  </label>
                  <label>
                      Minutes
                      <br/>
                      <input type="number" min='0' max='60' value={minutes} onChange={e => setMinutes(e.target.value)} />
                  </label>
                </div>
                <div className="v-spacing"></div>
                <label>
                    <strong>Email</strong>
                    <br/>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <div className="v-spacing"></div>
                <label>
                    <strong>Leave any comments about your vaccination experience</strong>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} />
                </label>
              </form>
            </div>
            <div className="actions">
              <button
                className="button margin-right"
                onClick={() => {
                    if (email.trim() === '') {
                        alert('Please enter an email.');
                        return;
                    }
                    
                    // Convert waittime into minutes
                    const waittime = (parseInt(hours) * 60) + parseInt(minutes);

                    const data = {
                        email: email,
                        address: props.clinic.properties.address,
                        waittime: waittime,
                        comments: comment
                    };

                    // Make POST request using the express.js API
                    fetch('/review', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.text())
                    .then(res => {
                        alert(res);
                        close();
                    })
                    .catch((err) => {
                        alert('Error occurred');
                    })
                }}
              >
                  Post
              </button>
              <button
                className="button"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Popup>
    );
}

export default AddReview;