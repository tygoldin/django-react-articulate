import {useEffect, useRef, useState} from "react";
import {ClipboardData, PieChart, QuestionCircle, QuestionSquare, Shuffle, XSquare} from "react-bootstrap-icons";
import Zoom from "react-medium-image-zoom";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import {CSSTransition} from "react-transition-group";
import {hslToRgb, Tooltip, Slider} from "@mui/material";
import Plot from "react-plotly.js";
import Cookies from 'js-cookie';

export function ArtPopup(props) {

    const [artRecs, setArtRecs] = useState([]);
    const filteredItems = artRecs.filter(artwork => props.checkFilters(artwork))
    const [shuffle, setShuffle] = useState(true);
    const [color1, setColor1] =  useState("hsl(0,0,0)");
    const [color2, setColor2] =  useState("hsl(0,0,0)");
    const [color3, setColor3] =  useState("hsl(0,0,0)");
    const [color4, setColor4] =  useState("hsl(0,0,0)");
    const [color5, setColor5] =  useState("hsl(0,0,0)");
    const [colorWeights, setColorWeights] = useState([]);
    const myRef = useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView();

    const marks = [
        {
            value: 0,
            label: 'N/A'
        },
        {
            value: 1,
            label: '1',
        },
        {
            value: 2,
            label: '2',
        },
        {
            value: 3,
            label: '3',
        },
        {
            value: 4,
            label: '4',
        },
        {
            value: 5,
            label: '5',
        },
    ];

    const [isZoomed, setZoom] = useState(false);
    const [rating, setRating] = useState(3);

    const handleChange = (event, newValue) => {
        console.log(newValue)
        fetch(`api/update_rating/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: JSON.stringify({
                artwork_id: props.artPopup.id,
                rating: newValue
            }),
        })
        setRating(newValue);
    };

    useEffect(() => {
        setRating(-1);
        if (props.artPopup && props.artPopup.id) {
            fetch(`/api/update_views/`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken')
                    },
                    body: JSON.stringify({
                        artwork_id: props.artPopup.id
                    })}).then(response => response.json())
                        .then(data => {

                        });
            fetch(`api/get_rating?artwork_id=${encodeURIComponent(props.artPopup.id)}`,
                {method: "GET"}).then(response => response.json())
                .then(data => {
                    setRating(data);
                });

            fetch(`api/get_recommendations?artwork_id=${encodeURIComponent(props.artPopup.id)}`,
                {method: "GET"}).then(response => response.json())
                .then(data => {
                    setArtRecs(data);
                });
            let hsl = ""
            let weights = [];
            let other = 1;
            if (props.artPopup && props.artPopup.color_1) {
                hsl = JSON.parse(props.artPopup.color_1)
                setColor1('hsl(' + hsl[0] + ',' + hsl[1]*100/255 + '%,' + hsl[2]*100/255 + '%)');
                weights.push(hsl[3]);
                other = other - hsl[3];
            }
            if (props.artPopup && props.artPopup.color_2) {
                hsl = JSON.parse(props.artPopup.color_2)
                setColor2('hsl(' + hsl[0] + ',' + hsl[1]*100/255 + '%,' + hsl[2]*100/255 + '%)');
                weights.push(hsl[3]);
                other = other - hsl[3];
            }
            if (props.artPopup && props.artPopup.color_3) {
                hsl = JSON.parse(props.artPopup.color_3)
                setColor3('hsl(' + hsl[0] + ',' + hsl[1]*100/255 + '%,' + hsl[2]*100/255 + '%)');
                weights.push(hsl[3]);
                other = other - hsl[3];
            }
            if (props.artPopup && props.artPopup.color_4) {
                hsl = JSON.parse(props.artPopup.color_4)
                setColor4('hsl(' + hsl[0] + ',' + hsl[1]*100/255 + '%,' + hsl[2]*100/255 + '%)');
                weights.push(hsl[3]);
                other = other - hsl[3];
            }
            if (props.artPopup && props.artPopup.color_5) {
                hsl = JSON.parse(props.artPopup.color_5)
                setColor5('hsl(' + hsl[0] + ',' + hsl[1]*100/255 + '%,' + hsl[2]*100/255 + '%)');
                weights.push(hsl[3]);
                other = other - hsl[3];
            }
            setColorWeights([...weights, other])
        }
    }, [props.artPopup, shuffle])

    return (
        <CSSTransition
            in={props.artPopup && Object.keys(props.artPopup).length !== 0}
            timeout={200}
            classNames="my-node">

            <>
                {props.artPopup && Object.keys(props.artPopup).length !== 0 ?
                    <div className = "art-popup">
                        <div className = "popup-header-cntr">
                            <div className = "popup-header">
                                <div className = "popup-title">{props.artPopup.title}</div>
                                <XSquare onClick = {() => props.setArtPopup({})}
                                         cursor = "pointer"
                                         color = "black"
                                         size={16} />
                            </div>
                            <hr style={{"width":"100%", "height":"2px"}}/>
                        </div>

                        <div className = "art-popup-cntr">
                            <Zoom>
                                <img key = {props.artPopup.id}
                                     className = "art-popup-img"
                                     src = {props.artPopup && Object.keys(props.artPopup).length !== 0 ? ('https://www.wga.hu/detail/' + props.artPopup.url.split("/html/").pop().slice(0, -4) + "jpg") : null}
                                     alt = {props.artPopup.title}
                                     ref={myRef}/>
                            </Zoom>
                            <hr className="less_thick_hr"/>
                            <div className="rating-slider">
                                {rating == -1 ? null :
                                <Slider defaultValue={3}
                                        value={rating}
                                        onChangeCommitted={handleChange}
                                        size="small"
                                        step={1}
                                        min={0}
                                        max={5}
                                        marks={marks}
                                />}
                            </div>
                            <hr className="less_thick_hr"/>
                            {props.artPopup.descriptions && props.artPopup.descriptions.length > 0 ?
                                <><div className = "art-popup-text"><b>Description:</b></div>
                                <div className = "art-popup-text"> {props.artPopup.descriptions}</div>
                                <hr className="less_thick_hr"/></> : null }
                            <div className = "art-popup-info">
                                <b className = "art-popup-text">Author</b><div className = "art-popup-text"> {props.artPopup.author}</div>
                                <b className = "art-popup-text">Born-Died</b><div className = "art-popup-text">{props.artPopup.born_died}</div>
                                <b className = "art-popup-text">Date</b><div className = "art-popup-text"> {props.artPopup.date}</div>
                                <b className = "art-popup-text">Technique</b><div className = "art-popup-text"> {props.artPopup.technique}</div>
                                <b className = "art-popup-text">Location</b>
                                <div className = "art-popup-text location-link"
                                     onClick={
                                         () =>
                                             (
                                             fetch(`/api/artwork_list?location=${encodeURIComponent(props.artPopup.location)}`,
                                                 {method: "GET"}).then(response => response.json())
                                                 .then(data => {
                                                     props.setLocationPopup(
                                                         {
                                                             location: props.artPopup.location,
                                                             children: data
                                                         }

                                                     )
                                                     if (props.zoom < 18) {
                                                         props.setZoom(18);
                                                     }
                                                     props.setCenter({lat: props.artPopup.lat - .0007, lng: props.artPopup.lng + .00115});
                                                 })
                                             )
                                     }> {props.artPopup.location}</div>
                                <b className = "art-popup-text">Form</b><div className = "art-popup-text">{props.artPopup.form}</div>
                                <b className = "art-popup-text">Type</b><div className = "art-popup-text"> {props.artPopup.type}</div>
                                <b className = "art-popup-text">School</b><div className = "art-popup-text"> {props.artPopup.school}</div>
                                <b className = "art-popup-text">Color Palette</b>
                                <div className = "color-palette-cntr">
                                    <Tooltip title={hslToRgb(color1)} arrow
                                             placement="top">
                                        <div className="color-palette"
                                             style={{backgroundColor: color1}}/>
                                    </Tooltip>
                                    <Tooltip title={hslToRgb(color2)} arrow
                                             placement="top">
                                        <div className="color-palette"
                                             style={{backgroundColor: color2}}/>
                                    </Tooltip>
                                    <Tooltip title={hslToRgb(color3)} arrow
                                             placement="top">
                                        <div className="color-palette"
                                             style={{backgroundColor: color3}}/>
                                    </Tooltip>
                                    <Tooltip title={hslToRgb(color4)} arrow
                                             placement="top">
                                        <div className="color-palette"
                                             style={{backgroundColor: color4}}/>
                                    </Tooltip>
                                    <Tooltip title={hslToRgb(color5)} arrow
                                             placement="top">
                                        <div className="color-palette"
                                             style={{backgroundColor: color5}}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Click for Color Palette Breakdown" arrow
                                             placement="top">
                                        <ClipboardData size={20}
                                                       color="black"
                                                       style={{cursor: "pointer"}}
                                                       onClick={() => setZoom(true)} />
                                    </Tooltip>
                                </div>
                                <ControlledZoom isZoomed={isZoomed}
                                                onZoomChange={() => setZoom(false)}
                                                zoomMargin={0}>
                                    {isZoomed ?
                                        <Plot data={[
                                            {
                                                values: colorWeights,
                                                labels: [
                                                    hslToRgb(color1),
                                                    hslToRgb(color2),
                                                    hslToRgb(color3),
                                                    hslToRgb(color4),
                                                    hslToRgb(color5),
                                                    'other colors'
                                                ],
                                                type: 'pie',
                                                marker: {
                                                    colors: [
                                                        hslToRgb(color1),
                                                        hslToRgb(color2),
                                                        hslToRgb(color3),
                                                        hslToRgb(color4),
                                                        hslToRgb(color5),
                                                        'grey'
                                                    ]
                                                }
                                            }
                                        ]}
                                              layout={{width: 500, height: 500,
                                                  margin: {
                                                      b: 160,
                                                  },
                                                  title: "Color Palette Breakdown",
                                                  paper_bgcolor: 'rgba(0,0,0,0)',
                                                  plot_bgcolor: 'rgba(0,0,0,0)'}}
                                        />
                                        : <></>}
                                </ControlledZoom>
                            </div>
                            <hr className="less_thick_hr"/>
                            <div className="rec-title">
                                <b className="art-popup-rec-text">Recommendations</b>
                                <Tooltip title="Find New Recommendations" arrow
                                         placement="top">
                                    <Shuffle color="black"
                                             size={24}
                                             cursor="pointer"
                                             onClick={() => setShuffle(!shuffle)}/>
                                </Tooltip>
                                <Tooltip title="Recommendations based on ML clustering" arrow
                                    placement="top">
                                    <QuestionCircle color="black"
                                                    size={24}
                                                    cursor="help"/>
                                </Tooltip>
                            </div>
                            <hr className="less_thick_hr"/>
                            <div className="art-popup-rec-cntr">
                                {
                                    filteredItems ?
                                    filteredItems.map((object, i) => {
                                    if (i > 9) return;
                                        return <div key = {i}>
                                            <img className = "location-popup-art-img"
                                                 src = {'https://www.wga.hu/detail/' + object.url.split("/html/").pop().slice(0, -4) + "jpg"}
                                                 alt = {object.title}
                                                 onClick = {() => {
                                                     props.setArtPopup(object);
                                                     executeScroll();
                                                 }}/>
                                            <div className = "location-popup-art-text">{object.title}</div>
                                        </div>}) : null
                                }
                            </div>

                        </div>
                    </div> : null}
            </>
        </CSSTransition>
    )

}