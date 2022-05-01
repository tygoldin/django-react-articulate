import {useEffect, useState} from "react";
import {CSSTransition} from "react-transition-group";
import Plot from "react-plotly.js";
import Cookies from 'js-cookie';

export function AnalyticsPage(props) {
    const [keys, setKeys] = useState([]);
    const [values, setValues] = useState([]);

    const [artworks, setArtworks] = useState([]);
    const [selectedTimeframe, setSelectedTimeFrame] = useState('');

    useEffect(() => {
        fetch(`api/get_filtered_artworks_by_timeframe/`, {
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
                let data_count = {};
                let keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    data_count[keys[i]] = data[keys[i]]['id']
                }
                setKeys(Object.keys(data_count));
                setValues(Object.values(data_count));
            })
            .catch((error) => {
                console.error('Error:', error);
        });
        if (selectedTimeframe.length > 0) {
            getFilteredTimeframeArtworks(selectedTimeframe);
        }
    }, [props.form, props.type, props.school, props.technique])



    function getFilteredTimeframeArtworks(timeframe) {
        console.log(timeframe)
        fetch(`api/get_filtered_artworks_for_timeframe/`, {
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
                timeframe: timeframe
            }),
        })
        .then(response => response.json())
        .then(data => {
                console.log(artworks);
                setArtworks(data);
            })
        .catch((error) => {
                console.error('Error:', error);
        });
    }

    return (
        <CSSTransition
            in={props.showAnalyticsPage}
            timeout={200}
            classNames="my-node">
            <>
                {props.showAnalyticsPage ?
                    <div className="overlay-page overlay-over-timeline">
                        <div className="analytics-page-cntr">
                            <div />
                            <div>
                                <hr />
                                <div className="analytics-title">Time Series</div>
                                <hr />
                                <div className="analytics-content-cntr">
                                    <div>
                                        <div className="analytics-title margin-btm">{selectedTimeframe}</div>
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
                                    </div>
                                    <div>
                                        <Plot
                                            data={[
                                                {type: 'bar', x: keys, y: values},
                                            ]}
                                            layout={ {width: "100%", height: 500,
                                                      title: "# of Artworks by Timeframe"
                                            } }
                                            onClick={(params) => {
                                                getFilteredTimeframeArtworks(params.points[0]['x']);
                                                setSelectedTimeFrame(params.points[0]['x']);
                                            }}
                                        />
                                    </div>
                                </div>
                                <hr />
                            </div>

                        </div>

                    </div> : null}

            </>
        </CSSTransition>
    )
}