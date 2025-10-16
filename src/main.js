
import "./events.js";   
import {state , stateProxy, Modes} from "./state.js";
import {circle, rect, line, text, ellipse ,  polygon  , path } from "./shapes.js";  
import { onShapeButtonClick , getMousePositionWithCTM  } from "./utils/helperfunction.js";
import "./initialsetup.js"
import { circleProperties , styleProperties , transformProperties } from "./components/cicleProperties.js";
import "./windowPollution.js";
import {generatePolygonPoints} from "./utils/helperfunction.js"

state.svg.onMouseLeftButtonDown(e => {
    if(state.mode === Modes.ADD && state.shapeTypeSelected) {
        let el;
        if(state.shapeTypeSelected === "Circle") {
            el = circle(state.x, state.y, {fill: 'blue', r: 5});
        } else if(state.shapeTypeSelected === "Rectangle") {
            el = rect(state.x, state.y, {stroke: 'black', 'stroke-width': 2, fill: 'none'});
        } else if(state.shapeTypeSelected === "Line") {
            el = line(state.x, state.y, {stroke: 'black', 'stroke-width': 2});
        } else if(state.shapeTypeSelected === "Text") {
            el = text(state.x, state.y, {fill: 'black', 'font-size': 16, 'font-family': 'Arial'});
        }else if(state.shapeTypeSelected === "Ellipse") {
            el = ellipse(state.x, state.y, {stroke: 'black', 'stroke-width': 2, fill: 'none'});
        }else if(state.shapeTypeSelected === "Polygon") {
            el = polygon( Number(state.x), Number(state.y), 5, state.polygonSides );
        }else if(state.shapeTypeSelected === "Path") {
            el = path(state.x, state.y, {stroke: 'black', 'stroke-width': 2});
        }
        state.svg.appendChild(el);
        stateProxy.currentElement = el;
        stateProxy.currentElementBeingDrawn = el;
        stateProxy.shapes = state.shapes.concat(el);


    }
});

state.svg.onMouseRightButtonClick(e => {
    stateProxy.mode = Modes.SELECT;
})

state.svg.onMouseMove(e => {
    stateProxy.x = getMousePositionWithCTM(state.svg, e).x.toFixed(0);
    stateProxy.y = getMousePositionWithCTM(state.svg, e).y.toFixed(0);
    if(state.mode === Modes.ADD && state.currentElementBeingDrawn) {
        if(state.shapeTypeSelected === "Circle") {
            // enlarge circle radius based on distance from center
            const cx = parseFloat(state.currentElementBeingDrawn.getAttribute('cx'));
            const cy = parseFloat(state.currentElementBeingDrawn.getAttribute('cy'));
            const r = Math.sqrt((state.x - cx) ** 2 + (state.y - cy) ** 2);
            state.currentElementBeingDrawn.setAttribute('r', r);
            
        } else if(state.shapeTypeSelected === "Rectangle") {
            const x = parseFloat(state.currentElementBeingDrawn.getAttribute('x'));
            const y = parseFloat(state.currentElementBeingDrawn.getAttribute('y'));
        
            //fixme :: handle when the width adn height are now negative 
        
            state.currentElementBeingDrawn.setAttribute('width', state.x - x );
            state.currentElementBeingDrawn.setAttribute('height', state.y - y);

        } else if(state.shapeTypeSelected === "Line") {
            const x1 = parseFloat(state.currentElementBeingDrawn.getAttribute('x1'));
            const y1 = parseFloat(state.currentElementBeingDrawn.getAttribute('y1'));
            state.currentElementBeingDrawn.setAttribute('x1', state.x);
            state.currentElementBeingDrawn.setAttribute('y1',  state.y);
        }else if(state.shapeTypeSelected === "Ellipse") {
            const cx = parseFloat(state.currentElementBeingDrawn.getAttribute('cx'));
            const cy = parseFloat(state.currentElementBeingDrawn.getAttribute('cy'));
            const rx = Math.abs(state.x - cx);
            const ry = Math.abs(state.y - cy);
            state.currentElementBeingDrawn.setAttribute('rx', rx);
            state.currentElementBeingDrawn.setAttribute('ry', ry);
        }else if(state.shapeTypeSelected === "Polygon") {
            let polygon = state.currentElementBeingDrawn
            let r = Math.sqrt((state.x - polygon.centerX) ** 2 + (state.y - polygon.centerY) ** 2);
            let points = generatePolygonPoints(polygon.centerX , polygon.centerY , r , polygon.sides )
            state.currentElementBeingDrawn.radius = r
            polygon.setAttribute("points",  points);
        } 
        
        
    }
});

state.svg.onMouseLeftButtonUp(e => {
    if(state.mode === Modes.ADD && state.currentElementBeingDrawn) {
        state.currentElementBeingDrawn = null;
    }
});

    // capture coordinates 
state.svg.onMouseMove(e => {
    const pos = getMousePositionWithCTM(state.svg, e);
    state.x = pos.x.toFixed(0);
    state.y = pos.y.toFixed(0);
})


document.querySelector("shapes-component").addEventListener("onShapeSelected" , e => {
    stateProxy.shapeTypeSelected = e.detail.selectedShape;
    stateProxy.mode = Modes.ADD
    console.log("shapeTypeSelected:", stateProxy.shapeTypeSelected);
})






function main(){

    let prevClass = "";

    state.on("mode", (mode) => {
        if(mode === Modes.ADD) {
            state.mouse("crosshair")
        }
        if (mode === Modes.EDIT) {
            state.mouse("text")
        }
        
    })

   
        

 
   
   
}


main();

