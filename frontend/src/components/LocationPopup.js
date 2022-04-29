import {XSquare} from "react-bootstrap-icons";
import {CSSTransition} from "react-transition-group";
import {useEffect, useState} from "react";

export function LocationPopup(props) {

    return (
        <CSSTransition
            in={props.locationPopup && Object.keys(props.locationPopup).length !== 0}
            timeout={200}
            classNames="my-node">
            <>
                {props.locationPopup && Object.keys(props.locationPopup).length !== 0 ?
                    <div className = "location-popup">
                        <div className = "popup-header-cntr">
                            <div className = "popup-header">
                                <div className = "popup-title">{props.locationPopup.location}</div>
                                <XSquare onClick = {() => props.setLocationPopup({})}
                                         cursor = "pointer"
                                         color = "black"
                                         size={16} />
                            </div>
                            <hr style={{"width":"100%", "height":"2px"}}/>
                        </div>

                        <div className = "location-popup-art-cntr">
                            {
                                props.locationPopup.children.map((object, i) => {
                                    if (parseInt(object.timeframe.substring(0,4)) > props.rangeValues[0] &&
                                        parseInt(object.timeframe.slice(-4)) <= props.rangeValues[1]
                                        && props.checkFilters(object)) {
                                        return <div key = {object.id}>
                                            <img className = "location-popup-art-img"
                                                 src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                 alt = {object.title}
                                                 onClick = {() => props.setArtPopup(object)}/>
                                            <div className = "location-popup-art-text">{object.title}</div>
                                        </div>
                                    }

                                })
                            }
                        </div>
                    </div> : null}
            </>
        </CSSTransition>
    )
}