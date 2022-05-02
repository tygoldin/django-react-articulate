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