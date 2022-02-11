import {useEffect, useRef, useState} from "react";
import GoogleMapReact from 'google-map-react';
import {Bank2, XSquare} from 'react-bootstrap-icons';
import {Slider} from "@mui/material";
import {CSSTransition} from 'react-transition-group';

export function ArtMap(props) {
    const mapRef = useRef();

    const [center, setCenter] = useState()
    const [zoom, setZoom] = useState(11)

    const [rangeValues, setRangeValues] = useState([200, 2000])

    const [bounds, setBounds] = useState([]);

    const [data, setData] = useState([])

    const [artPopup, setArtPopup] = useState({});

    const [locationPopup, setLocationPopup] = useState({});

    const defaultMapOptions = {
        fullscreenControl: false,
    };

    useEffect(() => {
        fetch('/api/artworks/').then(response => response.json())
            .then(data => setData(data));
    }, [])

    return (
        <div className = "map-container" style={{ height: '100vh', width: '100%' }}>
            {/*<div className = {"side-bar"}></div>*/}
            <div className = "btm-slider">
                <div style={{"width":"80%", "pointerEvents":"auto"}}>
                    <Slider value={rangeValues}
                            valueLabelDisplay = "on"
                            valueLabelFormat = {(value) => {return value + " CE"}}
                            onChange={(e, val) => setRangeValues(val)}
                            min={200}
                            max={2000}/>
                </div>
            </div>

            <CSSTransition
                in={artPopup && Object.keys(artPopup).length !== 0}
                timeout={200}
                classNames="my-node">

                <>
                    {artPopup && Object.keys(artPopup).length !== 0 ?
                        <div className = "art-popup">
                            <div className = "popup-header-cntr">
                                <div className = "popup-header">
                                    <div className = "popup-title">{artPopup.title}</div>
                                    <XSquare onClick = {() => setArtPopup({})}
                                             cursor = "pointer"
                                             color = "black"
                                             size={16} />
                                </div>
                                <hr style={{"width":"100%", "height":"2px"}}/>
                            </div>

                            <div className = "art-popup-cntr">
                                <img key = {artPopup.id}
                                     className = "art-popup-img"
                                     src = {artPopup && Object.keys(artPopup).length !== 0 ? ('https://www.wga.hu/detail/' + artPopup.url.split("/html/").pop().slice(0, -4) + "jpg") : null}
                                     alt = {artPopup.title}/>
                                <div className = "art-popup-text">Description</div>
                                <div className = "art-popup-text">Author: {artPopup.author}</div>
                                <div className = "art-popup-text">Born-Died: {artPopup.born_died}</div>
                                <div className = "art-popup-text">Date: {artPopup.date}</div>
                                <div className = "art-popup-text">Technique: {artPopup.technique}</div>
                                <div className = "art-popup-text">Location: {artPopup.location}</div>
                                <div className = "art-popup-text">Form: {artPopup.form}</div>
                                <div className = "art-popup-text">Type: {artPopup.type}</div>
                                <div className = "art-popup-text">School: {artPopup.school}</div>
                                <div className = "art-popup-text">Description</div>
                                <div className = "art-popup-text">Author: {artPopup.author}</div>
                                <div className = "art-popup-text">Born-Died: {artPopup.born_died}</div>
                                <div className = "art-popup-text">Date: {artPopup.date}</div>
                                <div className = "art-popup-text">Technique: {artPopup.technique}</div>
                                <div className = "art-popup-text">Location: {artPopup.location}</div>
                                <div className = "art-popup-text">Form: {artPopup.form}</div>
                                <div className = "art-popup-text">Type: {artPopup.type}</div>
                                <div className = "art-popup-text">School: {artPopup.school}</div>
                                <div className = "art-popup-text">Description</div>
                                <div className = "art-popup-text">Author: {artPopup.author}</div>
                                <div className = "art-popup-text">Born-Died: {artPopup.born_died}</div>
                                <div className = "art-popup-text">Date: {artPopup.date}</div>
                                <div className = "art-popup-text">Technique: {artPopup.technique}</div>
                                <div className = "art-popup-text">Location: {artPopup.location}</div>
                                <div className = "art-popup-text">Form: {artPopup.form}</div>
                                <div className = "art-popup-text">Type: {artPopup.type}</div>
                                <div className = "art-popup-text">School: {artPopup.school}</div>
                            </div>
                        </div> : null}
                </>
            </CSSTransition>

            <CSSTransition
                in={locationPopup && Object.keys(locationPopup).length !== 0}
                timeout={200}
                classNames="my-node">
                <>
                    {locationPopup && Object.keys(locationPopup).length !== 0 ?
                        <div className = "location-popup">
                            <div className = "popup-header-cntr">
                                <div className = "popup-header">
                                    <div className = "popup-title">{locationPopup.location}</div>
                                    <XSquare onClick = {() => setLocationPopup({})}
                                             cursor = "pointer"
                                             color = "black"
                                             size={16} />
                                </div>
                                <hr style={{"width":"100%", "height":"2px"}}/>
                            </div>

                            <div className = "location-popup-art-cntr">
                                {
                                    locationPopup.children.map((object, i) => {
                                        console.log(parseInt(object.timeframe.substring(0,4)) > rangeValues[0] &&
                                            parseInt(object.timeframe.slice(-4)) < rangeValues[1])
                                        if (parseInt(object.timeframe.substring(0,4)) > rangeValues[0] &&
                                            parseInt(object.timeframe.slice(-4)) < rangeValues[1])
                                            return <div key = {i}>
                                                <img className = "location-popup-art-img"
                                                     src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                     alt = {object.title}
                                                     onClick = {() => setArtPopup(object)}/>
                                                <div className = "location-popup-art-text">{object.title}</div>
                                            </div>
                                    })
                                }
                            </div>
                        </div> : null}
                </>
            </CSSTransition>

            <GoogleMapReact
                bootstrapURLKeys={{key: 'AIzaSyBKOMmCvABFy3nIvY5vf36hN4fuRfMHsmg'}}
                defaultCenter={
                    {
                    lat: 48.20423030107086,
                    lng: 16.361830285441805
                    }
                }
                center={center}
                defaultZoom={11}
                zoom={zoom}
                yesIWantToUseGoogleMapApiInternals
                onChange={({ zoom, bounds, center }) => {
                    setZoom(zoom);
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat
                    ]);
                    setCenter(center);
                }}
                onGoogleApiLoaded={({ map }) => {
                    mapRef.current = map;
                }}

                options={defaultMapOptions}
            >
                <Location
                    lat={48.20423030107086}
                    lng={16.361830285441805}
                    rangeValues={rangeValues}
                    zoom={zoom}
                    location= "Kunsthistorisches Museum, Vienna"
                    children={[...data, ...data, ...data]}
                    setZoom={setZoom}
                    setCenter={setCenter}
                    setArtPopup={setArtPopup}
                    setLocationPopup={setLocationPopup}
                />
            </GoogleMapReact>
        </div>
    );
}

function Location(props) {

    return (
        <>
            {props.zoom > 17 ?
                <div className="location-card">
                    <div className="location-header">
                        <Bank2 color="black"
                               size={32}/>
                        <div className="location-text">{props.location}</div>
                    </div>
                    <hr/>
                    <div className="location-art-cntr">
                        {
                            props.children.map(object => {
                                if (parseInt(object.timeframe.substring(0,4)) > props.rangeValues[0] &&
                                    parseInt(object.timeframe.slice(-4)) < props.rangeValues[1])
                                return <div>
                                            <img key = {object.id}
                                                 className = "location-art-img"
                                                 src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                 alt = {object.title}
                                                 onClick = {() => props.setArtPopup(object)}/>
                                        </div>
                            })
                        }
                    </div>
                    <hr/>
                    <div className="location-info">
                        <div className = "location-info-text">{props.children.length} Images Available</div>
                        <button className = "location-explore" onClick={() => props.setLocationPopup(
                            {
                                location: props.location,
                                children: [...props.children, ...props.children, ...props.children, ...props.children, ...props.children]
                            }
                        )}>Explore Art</button>
                    </div>

                </div>
                : <Bank2 className="icon-background"
                         color="black"
                         cursor = "zoom-in"
                         size={props.zoom*2}
                         onClick={() => {
                             props.setZoom(18);
                             props.setCenter({lat: props.lat - .0007, lng: props.lng + .00115});
                         }} />}
        </>
    )
}

// function ArtCard(props) {
//     const [data, setData] = useState({})
//
//     useEffect(() => {
//         fetch('/api/artworks/').then(response => response.json())
//             .then(data => setData(data[0]));
//     }, [])
//
//     return (
//         <div style={{"color": "black", "backgroundColor":"white", "height":"50px", "width":"100px"}}>
//             <a href={data.url}>{data.title}</a>
//         </div>
//     )
// }