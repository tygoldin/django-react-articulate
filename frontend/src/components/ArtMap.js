import {useEffect, useRef, useState} from "react";
import GoogleMapReact from 'google-map-react';
import {Bank2} from 'react-bootstrap-icons';

export function ArtMap(props) {
    const mapRef = useRef();

    const [center, setCenter] = useState({
        lat: 48.20423030107086,
        lng: 16.361830285441805})
    const [zoom, setZoom] = useState(11)

    const [bounds, setBounds] = useState([]);

    const [data, setData] = useState({})

    useEffect(() => {
        fetch('/api/artworks/').then(response => response.json())
            .then(data => setData(data));
    }, [])

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{key: 'AIzaSyBKOMmCvABFy3nIvY5vf36hN4fuRfMHsmg'}}
                defaultCenter={center}
                defaultZoom={11}
                yesIWantToUseGoogleMapApiInternals
                onChange={({ zoom, bounds }) => {
                    setZoom(zoom);
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat
                    ]);
                }}
                onGoogleApiLoaded={({ map }) => {
                    mapRef.current = map;
                }}
            >
                <Location
                    lat={48.20423030107086}
                    lng={16.361830285441805}
                    zoom={zoom}
                    location= "Kunsthistorisches Museum"
                    children={data}
                />
            </GoogleMapReact>
        </div>
    );
}

function Location(props) {

    useEffect(() => {
        console.log(props.children)
    }, [props.children])

    useEffect(() => {
        console.log(props.zoom);
    }, [props.zoom])

    return (
        <>
            {props.zoom > 18 ?
                <div>
                    <div className="center-circle icon-background light-padding">
                        {
                            props.zoom > 19 ? (
                            props.children.map(object => {
                                return <div key = {object.id} className="circle">
                                           <div>{object.title}</div>
                                       </div>
                            })) : null
                        }
                        <img src='https://upload.wikimedia.org/wikipedia/commons/0/00/Maria-Theresien-Platz_Kunsthistorisches_Museum_Wien_2010.jpg'
                             alt="museum"
                             style={{width: props.zoom * 10 - 100}}/>
                        <div style={{"color":"black"}}>{props.location}</div>
                    </div>

                </div>

                : <Bank2 className="icon-background" color="black" size={props.zoom*2} />}
        </>
    )
}

function ArtCard(props) {
    const [data, setData] = useState({})

    useEffect(() => {
        fetch('/api/artworks/').then(response => response.json())
            .then(data => setData(data[0]));
    }, [])

    return (
        <div style={{"color": "black", "backgroundColor":"white", "height":"50px", "width":"100px"}}>
            <a href={data.url}>{data.title}</a>
        </div>
    )
}