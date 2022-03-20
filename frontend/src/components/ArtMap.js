import {useEffect, useRef, useState} from "react";
import GoogleMapReact from 'google-map-react';
import {
    Bank2,
    BarChart,
    Dice3,
    Globe,
    Grid3x3,
    Map,
    MapFill, Moon,
    Person,
    PersonBadge, PersonCircle,
    PersonFill,
    XSquare
} from 'react-bootstrap-icons';
import {Slider} from "@mui/material";
import {CSSTransition} from 'react-transition-group';
import useSupercluster from "use-supercluster";


const Marker = ({ children }) => children;

const styles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
]

export function ArtMap(props) {
    const mapRef = useRef();

    const [center, setCenter] = useState()
    const [zoom, setZoom] = useState(11)

    const [rangeValues, setRangeValues] = useState([200, 2000])

    const [bounds, setBounds] = useState([]);

    const [data, setData] = useState([])

    const [artPopup, setArtPopup] = useState({});

    const [locationPopup, setLocationPopup] = useState({});

    const [points, setPoints] = useState([]);

    const [nightMode, setNightMode] = useState(false);

    const defaultMapOptions = {
        fullscreenControl: false,
        styles: nightMode ? styles : null
    };


    const {clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 75, maxZoom: 17}
    });

    useEffect(() => {
        fetch('/api/location_list/').then(response => response.json())
            .then(data => {
                setData(data)
                const cluster_points = data.map(object => (
                    {
                        type: "Feature",
                        key: object.location,
                        properties: {cluster: false, location: object.location},
                        geometry: {
                            type: "Point",
                            coordinates: [
                                parseFloat(object.lng),
                                parseFloat(object.lat)
                            ]
                        }
                    }
                ));
                setPoints(cluster_points);
            });
    }, [])

    return (
        <div className = "map-container" style={{ height: '100vh', width: '100%' }}>
            {/*<div className = {"side-bar"}></div>*/}
            <div className = "btm-slider">
                <div style={{"width":"100%", "pointerEvents":"auto"}}>
                    <Slider value={rangeValues}
                            valueLabelDisplay = "on"
                            valueLabelFormat = {(value) => {return value + " CE"}}
                            onChange={(e, val) => setRangeValues(val)}
                            min={200}
                            max={2000}/>
                </div>
            </div>
            <div className = "switch-view">
                <Bank2 size={24} color={"black"}/>
                <PersonFill size={24} color={"black"}/>
            </div>
            <div className = "sidenav">
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <PersonCircle className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Account
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <Globe className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Google Maps
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <BarChart className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Analytics
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <Grid3x3 className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Recommended
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <Dice3 className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Random Artwork
                    </div>
                </div>
                <div className="sidenav-bar" onClick={() => setNightMode(!nightMode)}>
                    <div className="sidenav-icon-cntr">
                        <Moon className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Night Mode
                    </div>
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
                                        if (parseInt(object.timeframe.substring(0,4)) > rangeValues[0] &&
                                            parseInt(object.timeframe.slice(-4)) < rangeValues[1]) {
                                            return <div key = {i}>
                                                <img className = "location-popup-art-img"
                                                     src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                     alt = {object.title}
                                                     onClick = {() => setArtPopup(object)}/>
                                                <div className = "location-popup-art-text">{object.title}</div>
                                            </div>
                                        }

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
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const {
                        cluster: isCluster,
                        point_count: pointCount
                    } = cluster.properties;

                    if (isCluster) {
                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                lat={latitude}
                                lng={longitude}
                            >
                                <div
                                    className="cluster-marker"
                                    style={{
                                        width: `${10 + (pointCount / points.length) * 20}px`,
                                        height: `${10 + (pointCount / points.length) * 20}px`
                                    }}
                                    onClick={() => {
                                        const expansionZoom = Math.min(
                                            supercluster.getClusterExpansionZoom(cluster.id)
                                        );
                                        mapRef.current.setZoom(expansionZoom);
                                        mapRef.current.panTo({ lat: latitude, lng: longitude });
                                    }}
                                >
                                    {pointCount}
                                </div>
                            </Marker>
                        );
                    }

                    return (<Location
                        lat={latitude}
                        lng={longitude}
                        key={cluster.properties.location}
                        bounds={bounds}
                        rangeValues={rangeValues}
                        zoom={zoom}
                        location= {cluster.properties.location}
                        children={[]}
                        setZoom={setZoom}
                        setCenter={setCenter}
                        setArtPopup={setArtPopup}
                        setLocationPopup={setLocationPopup}
                        nightMode={nightMode}
                    />);

                })}

            </GoogleMapReact>
        </div>
    );
}

function Location(props) {
    const [artworks, setArtworks] = useState([]);

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (props.zoom > 17 &&
            props.lat > props.bounds[1] &&
            props.lat < props.bounds[3] &&
            props.lng > props.bounds[0] &&
            props.lng < props.bounds[2]
        ){
            fetch(`/api/artwork_list?location=${encodeURIComponent(props.location)}`,
                {method: "GET"}).then(response => response.json())
                .then(data => {
                    setArtworks(data);
                });
        } else {
            setShow(false);
        }
    }, [props.zoom, props.bounds])

    return (
        <>
            {show ?
                <div className="location-card">
                    <div className="location-header">
                        <Bank2 color={"black"}
                               size={32}
                               onClick={() => {
                                   setShow(false);
                               }}/>
                        <div className="location-text">{props.location}</div>
                    </div>
                    <hr/>
                    <div className="location-art-cntr">
                        {
                            artworks.map((object, i) => {
                                if (i > 5) return;
                                if (parseInt(object.timeframe.substring(0,4)) > props.rangeValues[0] &&
                                    parseInt(object.timeframe.slice(-4)) < props.rangeValues[1])
                                return <div key = {object.id}>
                                            <img className = "location-art-img"
                                                 src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                 alt = {object.title}
                                                 onClick = {() => props.setArtPopup(object)}/>
                                        </div>
                            })
                        }
                    </div>
                    <hr/>
                    <div className="location-info">
                        <div className = "location-info-text">{artworks.length} Images Available</div>
                        <button className = "location-explore" onClick={() => props.setLocationPopup(
                            {
                                location: props.location,
                                children: artworks
                            }
                        )}>Explore Art</button>
                    </div>

                </div>
                : <div className="location-cntr">
                    {props.zoom > 13 ? <div style={{"color": props.nightMode ? "white" : "black"}} className="location-tooltip">{props.location}</div> : null}
                    <Bank2 className="icon-background"
                         color={props.nightMode ? "white" : "black"}
                         cursor = "zoom-in"
                         size={props.zoom*2}
                         onClick={() => {
                             if (props.zoom < 18) {
                                 props.setZoom(18);
                             }
                             props.setCenter({lat: props.lat - .0007, lng: props.lng + .00115});
                             setShow(true);
                         }} />
                  </div>}
        </>
    )
}