import {useEffect, useState} from "react";
import {CSSTransition} from "react-transition-group";
import {ArrowLeft, ArrowLeftSquare, ArrowRight, ArrowRightSquare} from "react-bootstrap-icons";

export function RecommendationPage(props) {
    const [topRecs, setTopRecs] = useState([]);
    const filteredTopRecs = topRecs.filter(object => props.checkFilters(object));
    const [index, setIndex] = useState(0)


    useEffect(() => {
        fetch(`api/get_user_recommendations/`,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTopRecs(data);
            });
    }, [])

    return (
        <CSSTransition
            in={props.showRecPage}
            timeout={200}
            classNames="my-node">
            <>
                {props.showRecPage ?
                    <div className={props.showRecPage ? "overlay-page" : null}>
                        <div className="page-scrollable">
                            <div className="recommendation-content">
                                <hr />
                                <div className="recommendation-title">Top Recommendations</div>
                                <hr />
                                <div className="recommendation-arrow-cntr">
                                    {
                                        index > 0 ?
                                        <ArrowLeftSquare size={16}
                                                         color={"black"}
                                                         onClick={() => setIndex(index - 6)}
                                                         style={{"cursor":"pointer"}}/> : null
                                    }
                                    <div className = "location-popup-art-cntr">
                                        {
                                            filteredTopRecs.slice(index, index + 6).map((object, i) => {
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
                                    {   index < filteredTopRecs.length - 6 ?
                                        <ArrowRightSquare size={16}
                                                          color={"black"}
                                                          onClick={() => setIndex(index + 6)}
                                                          style={{"cursor":"pointer"}}/> : null
                                    }
                                </div>
                                <hr />
                                <div className="recommendation-title">Recommendations By Time Period</div>
                                <hr />
                                <Timeline rangeValues={props.rangeValues}
                                          checkFilters={props.checkFilters}
                                          setArtPopup={props.setArtPopup}/>
                            </div>
                        </div>
                    </div> : null}
            </>

        </CSSTransition>
    )
}

export function Timeline(props) {

    const [timeframes, setTimeframes] = useState([]);


    useEffect(() => {
        let start_date = 200;
        let times = []
        while (start_date < 1900) {
            times.push((start_date + 1).toString().padStart(4, '0') + '-' + (start_date + 50).toString().padStart(4, '0'));
            start_date+=50;
        }
        setTimeframes(times);
    }, [])

    return (
        <div className="timeline-column">
            <div className="vl"></div>
            {timeframes.map((timeframe) => {
                return <>
                          {parseInt(timeframe.substring(0,4)) > props.rangeValues[0] &&
                           parseInt(timeframe.slice(-4)) <= props.rangeValues[1] ?
                              <>
                                  <TimelinePoint timeframe={timeframe}
                                                 checkFilters={props.checkFilters}
                                                 setArtPopup={props.setArtPopup}/>
                                  <div className="vl"></div>
                              </> : null}
                       </>
            })}
        </div>
    )

}

const timePeriods = {
    '0201-0250': 'Ancient', '0251-0300': 'Ancient', '0301-0350': 'Ancient', '0351-0400': 'Ancient', '0401-0450': 'Medieval',
    '0451-0500': 'Medieval', '0501-0550': 'Medieval', '0551-0600': 'Medieval', '0601-0650': 'Medieval', '0651-0700': 'Medieval',
    '0701-0750': 'Medieval', '0751-0800': 'Medieval', '0801-0850': 'Medieval','0851-0900': 'Medieval', '0901-0950': 'Medieval',
    '0951-1000': 'Medieval', '1001-1050': 'Medieval', '1051-1100': 'Medieval', '1101-1150': 'Medieval', '1151-1200': 'Medieval',
    '1201-1250': 'Medieval', '1251-1300': 'Medieval', '1301-1350': 'Medieval', '1351-1400': 'Medieval',
    '1401-1450': 'Renaissance', '1451-1500': 'Renaissance', '1501-1550': 'Renaissance', '1551-1600': 'Renaissance, Mannerism',
    '1601-1650': 'Baroque', '1651-1700': 'Baroque', '1701-1750': 'Baroque, Rococo', '1751-1800': 'Rococo, Neoclassicism, Romanticism',
    '1801-1850': 'Neoclassicism, Romanticism', '1851-1900': 'Realism'
}
export function TimelinePoint(props) {
    const [timelineArtworks, setTimelineArtworks] = useState([]);
    const filteredArtworks = timelineArtworks.filter(object => props.checkFilters(object));
    const [index, setIndex] = useState(0)

    useEffect(() => {
        fetch(`/api/get_user_recommendations_time_period?timeframe=${encodeURIComponent(props.timeframe)}`,
            {method: "GET"}).then(response => response.json())
            .then(data => {
                setTimelineArtworks(data);
            });
    }, [])

    return (
        <div className="timeline-point">
            <div className="timeline-text">
                {props.timeframe} <br />
                <div className="timeline-period">{timePeriods[props.timeframe]}</div>
            </div>
            <div className="timeline-arrow-cntr">
                {index > 0 ? <ArrowLeftSquare size={16}
                                 color={"black"}
                                 onClick={() => setIndex(index - 6)}
                                 style={{"cursor":"pointer"}}/> : null}
                {index < filteredArtworks.length - 6 ? <ArrowRightSquare size={16}
                                  color={"black"}
                                  onClick={() => setIndex(index + 6)}
                                  style={{"cursor":"pointer"}}/> : null}
            </div>
            <div className = "location-popup-art-cntr">
                {
                    filteredArtworks.slice(index, index + 6).map((object, i) => {
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
    )
}