import Plot from "react-plotly.js";
import {CSSTransition} from "react-transition-group";
import {ArrowLeftSquare, ArrowRightSquare} from "react-bootstrap-icons";
import {Timeline} from "./RecommendationPage";
import {useEffect, useState} from "react";


export function UserAnalyticsPage(props) {
    const [totalInteractions, setTotalInteractions] = useState(0);
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        fetch('/api/get_total_interactions')
            .then((response) => {return response.json()})
            .then((data) => {
                setTotalInteractions(data);
            }
        )
        fetch('/api/get_interacted_artworks/')
            .then((response) => {return response.json()})
            .then((data) => {
                setArtworks(data);
            })
    }, [])

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
                                <div style={{color: "black"}}>You have interacted with {totalInteractions} artworks.
                                </div>
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