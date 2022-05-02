import Plot from "react-plotly.js";
import {CSSTransition} from "react-transition-group";
import {ArrowLeftSquare, ArrowRightSquare} from "react-bootstrap-icons";
import {Timeline} from "./RecommendationPage";
import {useEffect, useState} from "react";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";


export function UserAnalyticsPage(props) {
    const [userStats, setUserStats] = useState(0);
    const [artworks, setArtworks] = useState([]);
    const [pieField, setPieField] = useState('type');
    const [pieData, setPieData] = useState({});
    const [topCatField, setTopCatField] = useState('type');
    const [topCategories, setTopCategories] = useState([]);
    const [topCatFieldRating, setTopCatFieldRating] = useState('type');
    const [topCategoriesRating, setTopCategoriesRating] = useState([]);
    const [topTimeframeData, setTopTimeframeData] = useState({});
    const [topArtworkField, setTopArtworkField] = useState("rating");
    const [topArtworks, setTopArtworks] = useState([]);
    const [topLocationField, setTopLocationField] = useState("ratings");
    const [topLocations, setTopLocations] = useState([]);

    useEffect(() => {
        fetch('/api/get_total_interactions/')
            .then((response) => {return response.json()})
            .then((data) => {
                setUserStats(data);
            }
        )

    }, [])

    useEffect(() => {
        fetch(`api/get_interacted_artworks/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: JSON.stringify({
                forms: props.form,
                types: props.type,
                schools: props.school,
                techniques: props.technique
            }),
        })
            .then(response => response.json())
            .then(data => {
                setArtworks(data)
            })
    }, [props.form, props.school, props.type, props.technique])

    useEffect(() => {
        fetch(`api/get_interacted_artworks_by_field/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: JSON.stringify({
                forms: props.form,
                types: props.type,
                schools: props.school,
                techniques: props.technique,
                field: pieField
            }),
        })
            .then(response => response.json())
            .then(data => {
                setPieData(data);
            })
    }, [pieField, props.form, props.school, props.type, props.technique])

    useEffect(() => {
        fetch('api/get_top_categories_' + topCatField ,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopCategories(data.slice(0,5));
            });
    }, [topCatField])

    useEffect(() => {
        fetch('api/get_top_categories_by_rating_' + topCatFieldRating ,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopCategoriesRating(data.slice(0,5));
            });
    }, [topCatFieldRating])

    useEffect(() => {
        fetch('api/get_top_timeframes_by_views' + topCatFieldRating ,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopCategoriesRating(data.slice(0,5));
            });
    }, [topCatFieldRating])

    useEffect(() => {
        fetch('api/get_top_timeframes_by_views/',
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopTimeframeData(data);
            });
    }, [])

    useEffect(() => {
        fetch('api/get_top_artworks_by_' + topArtworkField,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopArtworks(data);
            });
    }, [topArtworkField])

    useEffect(() => {
        fetch('api/get_top_locations_by_' + topLocationField,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopLocations(data.slice(0,5));
            });
    }, [topLocationField])

    return (
        <CSSTransition
            in={props.showUserAnalyticsPage}
            timeout={200}
            classNames="my-node">
            <>
                {props.showUserAnalyticsPage ?
                    <div className="overlay-page overlay-over-timeline">
                        <div className="page-scrollable">
                            <div className="recommendation-content">
                                <hr />
                                <div className="recommendation-title">Overall Trends</div>
                                <hr />
                                <div style={{color: "black"}}>Most popular categories by <Select
                                    value={topCatField}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    className="select-smaller"
                                    onChange={(event) => {setTopCatField(event.target.value)}}
                                >
                                    <MenuItem value={"type"}>type</MenuItem>
                                    <MenuItem value={"form"}>form</MenuItem>
                                </Select></div>
                                {topCategories.map((item, index) => {
                                    return <div style={{color: "black"}}>{index + 1}. {item[topCatField]} ({item['popularity']})</div>
                                    }
                                )}
                                <div style={{color: "black"}}>Highest rated categories by <Select
                                    value={topCatFieldRating}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    className="select-smaller"
                                    onChange={(event) => {setTopCatFieldRating(event.target.value)}}
                                >
                                    <MenuItem value={"type"}>type</MenuItem>
                                    <MenuItem value={"form"}>form</MenuItem>
                                </Select></div>
                                {topCategoriesRating.map((item, index) => {
                                        return <div style={{color: "black"}}>{index + 1}. {item[topCatFieldRating]} ({item['avg_rating']})</div>
                                    }
                                )}
                                <hr />
                                <Plot
                                    data={[
                                        {type: 'bar', x: topTimeframeData['keys'], y: topTimeframeData['values']},
                                    ]}
                                    layout={{width: "100%", height: 500,
                                        title: "Most popular Timeframes",
                                        yaxis: {
                                            range: [topTimeframeData['values'] ? Math.min(...topTimeframeData['values']) - .01 : 0,
                                                    topTimeframeData['values'] ? Math.max(...topTimeframeData['values']) + .01 : 10]
                                        }
                                    }}
                                />
                                <hr />
                                <div style={{color: "black"}}>Top artworks by <Select
                                    value={topArtworkField}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    className="select-smaller"
                                    onChange={(event) => {setTopArtworkField(event.target.value)}}
                                >
                                    <MenuItem value={"rating"}>rating</MenuItem>
                                    <MenuItem value={"views"}>views</MenuItem>
                                </Select></div>
                                <br />
                                <div className = "analytics-art-cntr">

                                    {topArtworks.map((object, i) => {
                                        return <div key = {object.id}>
                                            <img className = "location-popup-art-img"
                                                 src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                 alt = {object.title + " (" + object[topArtworkField == "rating" ? "avg_rating" : "views"] + ")"}
                                                 onClick = {() => props.setArtPopup(object)}/>
                                            <div className = "location-popup-art-text">{object.title + " (" + object[topArtworkField == "rating" ? "avg_rating" : "views"] + ")"}</div>
                                        </div>
                                    })
                                    }
                                </div>
                                <br />
                                <div style={{color: "black"}}>Most popular locations by <Select
                                    value={topLocationField}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    className="select-smaller"
                                    onChange={(event) => {setTopLocationField(event.target.value)}}
                                >
                                    <MenuItem value={"ratings"}>rating</MenuItem>
                                    <MenuItem value={"views"}>views</MenuItem>
                                </Select></div>
                                {topLocations.map((item, index) => {
                                        return <div style={{color: "black"}}>{index + 1}. {item['location']} ({item[topLocationField == "ratings" ? "avg_rating" : "views"] ? item[topLocationField == "ratings" ? "avg_rating" : "views"].toLocaleString("en-US") : null})</div>
                                    }
                                )}
                                <hr />
                                <div className="recommendation-title">User Analytics</div>
                                <hr />
                                <div style={{color: "black"}}>
                                    Total interacted artworks: {userStats['total_interactions'] ? userStats['total_interactions'].toLocaleString() : null} <br />
                                    Total views: {userStats['total_views'] ? userStats['total_views'].toLocaleString("en-US") : null} <br />
                                    Average rating: {userStats['average_rating'] ? userStats['average_rating'].toFixed(2) : null}
                                </div>
                                <hr />
                                <div className="field-group">
                                    <div style={{color: "black"}}>Organize by </div>
                                    <Select
                                        value={pieField}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={(event) => {setPieField(event.target.value)}}
                                    >
                                        <MenuItem value={"type"}>type</MenuItem>
                                        <MenuItem value={"form"}>form</MenuItem>
                                        <MenuItem value={"school"}>school</MenuItem>
                                        <MenuItem value={"timeframe"}>timeframe</MenuItem>
                                    </Select>
                                </div>
                                <Plot data={[
                                    {
                                        values: pieData.values,
                                        labels: pieData.keys,
                                        type: 'pie',
                                        textposition: "inside",
                                        automargin: true
                                    }
                                ]}
                                      layout={{width: 500, height: 450,
                                          title: "Interacted Artworks by " + pieField.charAt(0).toUpperCase() + pieField.slice(1),
                                          paper_bgcolor: 'rgba(0,0,0,0)',
                                          plot_bgcolor: 'rgba(0,0,0,0)'}}
                                />
                                <hr />
                                <div className="recommendation-title">Interacted Artworks</div>
                                <hr />
                                <div className = "analytics-art-cntr">
                                    {artworks.map((object, i) => {
                                        return <div key = {object.id}>
                                            <img className = "location-popup-art-img"
                                                 src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                 alt = {object.title}
                                                 onClick = {() => props.setArtPopup(object)}/>
                                            <div className = "location-popup-art-text">{object.title}</div>
                                        </div>
                                    })
                                    }
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div> : null}
            </>
        </CSSTransition>
    )
}