import {useEffect, useRef, useState} from "react";
import GoogleMapReact from 'google-map-react';
import {
    Bank2,
    BarChart,
    Dice3, FilterLeft,
    Globe,
    Grid3x3,
    BoxArrowRight,
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
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {ArtPopup} from "./ArtPopup";
import {LocationPopup} from "./LocationPopup";
import {RecommendationPage} from "./RecommendationPage";
import MultipleSelectChip from "./MultipleSelectChip";
import {AnalyticsPage} from "./AnalyticsPage";
import Cookies from "js-cookie";
import {UserAnalyticsPage} from "./UserAnalyticsPage";


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
    const [zoom, setZoom] = useState(1)

    const [rangeValues, setRangeValues] = useState([200, 1900])

    const [bounds, setBounds] = useState([]);

    const [data, setData] = useState([])

    const [artPopup, setArtPopup] = useState({});

    const [locationPopup, setLocationPopup] = useState({});

    const [points, setPoints] = useState([]);

    const [nightMode, setNightMode] = useState(false);

    const [showRecPage, setRecPage] = useState(false);

    const [showAnalyticsPage, setAnalyticsPage] = useState(false);

    const [showUserAnalyticsPage, setUserAnalyticsPage] = useState(false);

    const [form, setForm] = useState([]);
    const [type, setType] = useState([]);
    const [school, setSchool] = useState([]);
    const [technique, setTechnique] = useState([]);

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

    useEffect(() => {
    }, [form, type, school, technique])

    function checkFilters(artwork) {
        if (form.length > 0 && !form.includes(artwork.form)){
            return false;
        }
        if (type.length > 0 && !type.includes(artwork.type)){
            return false;
        }
        if (school.length > 0 && !school.includes(artwork.school)){
            return false;
        }
        if (artwork.timeframe && artwork.timeframe.length > 0) {
            if (parseInt(artwork.timeframe.substring(0,4)) > rangeValues[0] &&
                parseInt(artwork.timeframe.slice(-4)) <= rangeValues[1]){
            } else {
                return false;
            }
        }
        if (technique.length > 0) {
            for (let i = 0; i < technique.length; i++) {
                if (artwork.technique.toLowerCase().includes(technique[i].toLowerCase())) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

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
                            max={1900}/>
                </div>
            </div>
            {/*<div className = "switch-view">*/}
            {/*    <Bank2 size={24} color={"black"}/>*/}
            {/*    <PersonFill size={24} color={"black"}/>*/}
            {/*</div>*/}
            <div className = "sidenav">
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <PersonCircle className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text"
                         onClick={() => {
                             setRecPage(false);
                             setAnalyticsPage(false);
                             setUserAnalyticsPage(!showUserAnalyticsPage);
                         }}>
                        Account
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <Globe className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text"
                         onClick={() => {
                             setRecPage(false);
                             setAnalyticsPage(false);
                             setUserAnalyticsPage(false);
                         }}>
                        Google Maps
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <BarChart className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text"
                         onClick={() => {
                             setAnalyticsPage(!showAnalyticsPage);
                             setUserAnalyticsPage(false);
                             setRecPage(false);
                         }}>
                        Analytics
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <Grid3x3 className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text"
                         onClick={() => {
                             setRecPage(!showRecPage);
                             setAnalyticsPage(false);
                             setUserAnalyticsPage(false);
                         }}>
                        Recommended
                    </div>
                </div>
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <BoxArrowRight className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text"
                         onClick={() => {
                             fetch(`api/logout_user/`, {
                                 method: 'POST',
                                 headers: {
                                     'Accept': 'application/json',
                                     'Content-Type': 'application/json',
                                     'X-CSRFToken': Cookies.get('csrftoken')
                                 },
                             }).then(() => {
                                 window.location.reload();
                             })
                         }}>
                        Logout
                    </div>
                </div>
                {/*<div className="sidenav-bar" onClick={() => setNightMode(!nightMode)}>*/}
                {/*    <div className="sidenav-icon-cntr">*/}
                {/*        <Moon className="sidenav-icon" size={20} color={"black"} />*/}
                {/*    </div>*/}
                {/*    <div className="sidenav-text">*/}
                {/*        Night Mode*/}
                {/*    </div>*/}
                {/*</div>*/}
                <hr className="side-nav-divider" />
                <div className="sidenav-bar">
                    <div className="sidenav-icon-cntr">
                        <FilterLeft className="sidenav-icon" size={20} color={"black"} />
                    </div>
                    <div className="sidenav-text">
                        Filters
                    </div>
                </div>
                <div className="filter-list">
                    <MultipleSelectChip name="Form"
                                        names={[
                                            "architecture", "ceramics", "furniture", "glassware", "graphics",
                                            "illumination", "metalwork", "mosaic", "others", "painting", "sculpture",
                                            "stained-glass", "tapestry"
                                        ]}
                                        setFields={setForm}/>
                    <MultipleSelectChip name="Type"
                                        names={[
                                            "genre", "historical", "interior", "landscape", "mythological", "other",
                                            "portrait", "religious", "still-life", "study"
                                        ]}
                                        setFields={setType}/>
                    <MultipleSelectChip name="School"
                                        names={[
                                            "American", "Austrian", "Belgian", "Catalan", "Danish", "Dutch",
                                            "English", "Finnish", "Flemish", "French", "German", "Greek", "Hungarian",
                                            "Irish", "Italian", "Netherlandish", "Other", "Portuguese", "Russian",
                                            "Scottish", "Spanish", "Swedish", "Swiss"
                                        ]}
                                        setFields={setSchool}/>
                    <MultipleSelectChip name="Technique"
                                        names={[
                                            "Fresco", "Oil on Canvas", "Oil on Plaster", "Oil on Panel", "Oil on Wood",
                                            "Etching", "Stained Glass", "Oil on Oak Panel", "Ink", "Watercolour",
                                            "Black Chalk", "Pencil", "Lithograph", "Pencil", "Wood", "Pen", "Photo",
                                            "Sandstone", "Bronzed Plaster", "Carved Limewood", "Stone", "Sardonyx",
                                            "Tempera", "Marble", "Manuscript", "Lead", "Poplar", "Tapestry",
                                            "Engraving", "Bronze", "Alabaster", "Gold", "Panel", "Mosaic", "Metalpoint",
                                            "Incunable", "Boxwood", "Oak", "Drawing", "Glass", "Earthenware", "Crayon",
                                            "Copper", "Travertine", "Wax", "Stucco", "Plaster", "Grisaille", "Silver",
                                            "Lapis Lazuli", "Poryphry", "Ivory", "Mural", "Porcelain", "Terracotta",
                                            "Intarsia", "Parchment", "Pine"
                                        ]}
                                        setFields={setTechnique}/>
                </div>
            </div>


            <RecommendationPage showRecPage={showRecPage}
                                checkFilters={checkFilters}
                                setArtPopup={setArtPopup}
                                rangeValues={rangeValues}/>

            <AnalyticsPage checkFilters={checkFilters}
                           showAnalyticsPage={showAnalyticsPage}
                           form={form}
                           type={type}
                           school={school}
                           technique={technique}
                           rangeValues={rangeValues}
                           setArtPopup={setArtPopup}/>

            <UserAnalyticsPage checkFilters={checkFilters}
                           showUserAnalyticsPage={showUserAnalyticsPage}
                           form={form}
                           type={type}
                           school={school}
                           technique={technique}
                           rangeValues={rangeValues}
                           setArtPopup={setArtPopup}/>

            <ArtPopup
                artPopup = {artPopup}
                setArtPopup = {setArtPopup}
                rangeValues = {rangeValues}
                setLocationPopup = {setLocationPopup}
                zoom={zoom}
                setZoom={setZoom}
                setCenter={setCenter}
                setShowRecPage={setRecPage}
                checkFilters={checkFilters}
            />

            <LocationPopup
                locationPopup = {locationPopup}
                setLocationPopup = {setLocationPopup}
                rangeValues = {rangeValues}
                setArtPopup = {setArtPopup}
                checkFilters = {checkFilters}
            />

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
                    if (longitude == 0 && latitude == 0){
                        return
                    }
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
                        checkFilters = {checkFilters}
                    />);

                })}

            </GoogleMapReact>
        </div>
    );
}

function Location(props) {
    const [artworks, setArtworks] = useState([]);
    const filteredItems = artworks.filter(artwork => props.checkFilters(artwork))

    const [show, setShow] = useState(false);


    useEffect(() => {
        if (props.zoom > 17 &&
            props.lat > props.bounds[1] &&
            props.lat < props.bounds[3] &&
            props.lng > props.bounds[0] &&
            props.lng < props.bounds[2]
        ){
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
                            filteredItems.map((object, i) => {
                                if (i > 5) return;
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
                             fetch(`/api/artwork_list?location=${encodeURIComponent(props.location)}`,
                                 {method: "GET"}).then(response => response.json())
                                 .then(data => {
                                     setArtworks(data);
                             });
                             setShow(true);
                         }} />
                  </div>}
        </>
    )
}