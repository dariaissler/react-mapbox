import React, {useState, useEffect} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room} from '@material-ui/icons';
import './App.css';
import axios from 'axios';
import {format} from 'timeago.js';
import {Register} from './components/Register';
import {Login } from './components/Login';


function App() {
  const storage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(storage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 53.0000,
    longitude: 9.0000,
    zoom: 3
  });

useEffect(() => {
  const getPins = async () => {
    try {
      const res = await axios.get('/pins');
      setPins(res.data);
    }catch (err) {
      console.log(err);
    }
  };
  getPins();
}, []);

const handleMarkerClick = (id, lat, lng) => {
  setCurrentPlaceId(id);
  setViewport({...viewport, latitude: lat, longitude: lng });
}
const handleAddClick = (e) => {
  e.preventDefault();
  const [lng, lat] = e.lngLat;
    setNewPlace({
      lat, 
      lng
    });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  const newPin = {
    username: currentUser,
    title,
    desc,
    lat: newPlace.lat,
    lng: newPlace.lng
  };
  try {
    const res = await axios.post("/pins", newPin);
    setPins([...pins, res.data]);
    setNewPlace(null);
  }catch(err) {
    console.log(err);
  }
};

const handleLogout = () => {
  storage.removeItem("user");
  setCurrentUser(null);
};

  return (
    <>
        <ReactMapGL
          {...viewport}
          transitionDuration="200"
          onDblClick={handleAddClick}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={nextViewport => setViewport(nextViewport)}
        >
          {pins.map(p => (
          <>
          <Marker key={p.lat + p.lng}
                  latitude={p.lat} 
                  longitude={p.lng} 
                  offsetLeft={-viewport.zoom * 5} 
                  offsetTop={-viewport.zoom * 10}>
              <Room style={{fontSize: viewport.zoom * 10, 
                          color: p.username === currentUser ? 'orangered' : 'indigo'}}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.lng)}
              />
          </Marker>

          { p._id === currentPlaceId &&
          <Popup  latitude={p.lat}
                  longitude={p.lng}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
          >
          <div className="card">
              <h4 className="place">{p.title}</h4>
              <p className="desc">{p.desc}</p>
              <p className="username">Created by  - <strong>{p.username}</strong></p>
              <p className="date">{format(p.createdAt)}</p>
          </div> 
          </Popup> 
          } 
          </> ))
          }
          { newPlace && 
          <Popup  latitude={newPlace.lat}
                  longitude={newPlace.lng}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => setNewPlace(null)}>
          <div>
              <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input onChange={(e) => setTitle(e.target.value)}
                         placeholder="Name of the place"/>
                  <label>Description</label>
                  <textarea onChange={(e) => setDesc(e.target.value)}
                            placeholder="Write smth about it.."/>
                  <button className="submit-btn" type="submit">Add mark</button>
              </form>
          </div>
          </Popup>  
          }
          { currentUser ? <button onClick={handleLogout}
                                  className="btn logout">Log Out</button>
                        : <div className="auth-btn">
                            <button onClick={() => setShowLoginForm(true)}
                                    className="btn login">Log In</button>
                            <button onClick={() => setShowRegisterForm(true)}
                                    className="btn register">Create an account</button>
                          </div>
          }
          { showRegisterForm &&  <Register setShowRegisterForm={setShowRegisterForm}/> }
          { showLoginForm && <Login setCurrentUser={setCurrentUser}
                                    storage={storage}
                                    setShowLoginForm={setShowLoginForm}/> }
        </ReactMapGL>
    </>
  )
};

export default App;
