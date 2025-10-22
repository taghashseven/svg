import {state , SVGGlobal , circlePropers , Modes } from "./state.js";
import {generatePolygonPoints, getMousePositionWithCTM , getTranslate} from "./utils/helperfunction.js";


function applyGlobalStyles(el, props ,  extra = {}) {
  
  
  for (let [key, val] of Object.entries(SVGGlobal)) {
    el.setAttribute(key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`), val);
  }
  
 
  for (let [key, val] of Object.entries(extra)) {
    el.setAttribute(key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`), val);
  }
  return el;
}



function draggable(el , resize) {

  el.drag = false 
  
  el.style.pointerEvents = "all";

  el.onMouseLeftButtonDown(e => {
    if(state.mode == Modes.ADD) return
    el.drag = true
    document.body.style.userSelect = "none";
    state.currentElement = el
  })
  .onMouseEnter(e => {
    if(state.mode == Modes.ADD) return
    state.mode == Modes.SELECT && state.mouse("move")
  })
  .onMouseLeave(e => {
    if(state.mode == Modes.ADD) return
    state.mode == Modes.SELECT && state.mouse("default")
  })
  .onMouseMove( (event)=> {
    if(!el.drag) return
    state.mouse("move")
    resize(event)
  })
  .onMouseLeftButtonUp(e => {
    el.drag = false
    // state.mode == Modes.SELECT && state.mouse("default")
    // state.mode == Modes.ADD && state.mouse("crosshair")
    document.body.style.userSelect = "";
  })

  // this needs to be fixed , it solving a problem when i drag some times the up button is not fired 
  window.addEventListener("mouseup", () => {
  if (el.drag) {
    el.drag = false;
    document.body.style.userSelect = "";
    if (state.mode === Modes.SELECT) state.mouse("default");
    if (state.mode === Modes.ADD) state.mouse("crosshair");
  }
});


}

function circle(cx, cy, extra = {}) {


  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", cx);
  el.setAttribute("cy", cy);
  el.setAttribute("r", 0);

  // Apply global and custom styles
  applyGlobalStyles(el, extra = {...circlePropers});

  draggable(el , (e) => {
    const cx = parseFloat(el.getAttribute("cx")) || 0;
    const cy = parseFloat(el.getAttribute("cy")) || 0;
    el.setAttribute("cx", cx + e.movementX);
    el.setAttribute("cy", cy + e.movementY);
  })

  return el;
}



function rect(x, y,  extra = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("width", 2);
  el.setAttribute("height", 2);

  draggable(el , (e) => {
    const x = parseFloat(el.getAttribute("x")) || 0;
    const y = parseFloat(el.getAttribute("y")) || 0;
    el.setAttribute("x", x + e.movementX);
    el.setAttribute("y", y + e.movementY);
  })

  
  return applyGlobalStyles(el, extra);
}

function line(x1, y1 , extra = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x1);
  el.setAttribute("y2", y1);

  draggable(el , (e) => {
    const x1 = parseFloat(el.getAttribute("x1")) || 0;
    const y1 = parseFloat(el.getAttribute("y1")) || 0;
    const x2 = parseFloat(el.getAttribute("x2")) || 0;
    const y2 = parseFloat(el.getAttribute("y2")) || 0;

    el.setAttribute("x1", x1 + e.movementX);
    el.setAttribute("x2", x2 + e.movementX);
    el.setAttribute("y1", y1 + e.movementY);
    el.setAttribute("y2", y2 + e.movementY);
  })

  return applyGlobalStyles(el, extra);
}



function text(x, y, extra = {}) {
  const g  = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("fill", "none");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("rx", 5);

  function renderBoundingBox(){
    const bb = el.getBBox();
    rect.setAttribute("x", bb.x);
    rect.setAttribute("y", bb.y);
    rect.setAttribute("width", bb.width);
    rect.setAttribute("height", bb.height);
  }

  draggable(g    , (e) => {
    const {x , y } = getTranslate(g);
    g.setAttribute("transform", `translate(${x + e.movementX} ${y + e.movementY})`);
  })

  g.appendChild(rect);
  g.appendChild(el);
  state.svg.appendChild(g);
  g.setAttribute("transform", `translate(${x} ${y})`);

  el.setAttribute("x", 2);
  el.setAttribute("y", 2);
  el.setAttribute("xml:space", "preserve");
  el.setAttribute("dy", "0");


  let span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  span.setAttribute("x", 2);
  span.setAttribute("dy", "1.2em");

  el.spans = [span];
  el.spanIndex = 0;
  el.cursorIndex = 0

  el.appendChild(span);
  state.svg.setAttribute("tabindex", "0");
  state.svg.addEventListener("keydown", e => {

    // if its not current return 
    if(state.currentElement !== g) return
    
    if(/^[a-zA-Z0-9\t ]$/.test(e.key)){
      // if its white space 
      el.spans[el.spanIndex].textContent += e.key
      el.cursorIndex ++
    }

    if(e.key === "Enter"){
      let span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      span.setAttribute("x", 2);
      span.setAttribute("dy", "1.2em");
      el.spans.push(span);
      el.spanIndex = el.spans.length - 1;
      el.appendChild(span);
    }
  
    if(e.key === "Backspace"){
        //if span is empty remove it
         console.log("now at this place" , el.cursorIndex , el.spans.length)
        if(el.spans[el.spanIndex].textContent.length === 0 && el.spans.length > 1){
          el.spans.pop();
          el.spanIndex = el.spans.length - 1;
        }else{
          el.spans[el.spanIndex].textContent = el.spans[el.spanIndex].textContent.slice(0, -1)
          el.cursorIndex -- 
         
        }
    }
    renderBoundingBox()
    
  });

    let cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    el.showCursor = true
    el.isfocused = true 


  for (let [key , value ] of Object.entries(state.properties.text)) {
      el.setAttribute(key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`) , value)
  }

  return g
}



function ellipse(cx, cy,  extra = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  el.setAttribute("cx", cx);
  el.setAttribute("cy", cy);
  el.setAttribute("rx", 0);
  el.setAttribute("ry", 0);

  el.drag = false 
  draggable(el , (e) => {
      const cx = parseFloat(el.getAttribute("cx")) || 0;
      const cy = parseFloat(el.getAttribute("cy")) || 0;
      el.setAttribute("cx", cx + e.movementX);
      el.setAttribute("cy", cy + e.movementY);
  })

  return applyGlobalStyles(el, extra);
}

function path(x1 , y1 , extra = {}) {
  console.log("thaijd adkfjdlaj kdjf ajdkf jadkf jkl")
  const el = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  el.setAttribute("points", `${x1},${y1} `);
  return applyGlobalStyles(el, extra);
}


/**
 * Creates an SVG polygon element at the given position with the given radius.
 * The polygon should have at least 5 points.
 * @param {number} centerX - The x-coordinate of the center of the polygon.
 * @param {number} centerY - The y-coordinate of the center of the polygon.
 * @param {number} radius - The radius of the polygon.
 * @param {object} extra - Additional styles and properties to apply to the element.
 * @param {number} sides - The number of sides of the polygon.
 * @returns {SVGPolygonElement} - The created polygon element.
 */
function polygon( centerX , centerY , radius , sides ,  extra = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  // should have at least 5 points
  const points = generatePolygonPoints(centerX , centerY , radius , sides );
  el.setAttribute("points", points);
  el.sides = sides
  el.radius = radius
  el.centerX = centerX
  el.centerY = centerY

  draggable(el , e =>{
    el.centerY += e.movementY;
    el.centerX += e.movementX;
    const points = generatePolygonPoints(el.centerX , el.centerY , el.radius , sides );
    el.setAttribute("points", points);
  })

  return applyGlobalStyles(el, extra);
}

// moving 

SVGCircleElement.prototype.highlight = function() {
    const circle = this;
    const svg = circle.ownerSVGElement; // parent SVG
    if (!svg) return;

    const cx = () => parseFloat(circle.getAttribute("cx"));
    const cy = () => parseFloat(circle.getAttribute("cy"));
    const r = () => parseFloat(circle.getAttribute("r"));

    // Remove existing handles if any
    svg.querySelectorAll('.circle-handle').forEach(h => h.remove());

    // Create resize handle (right edge)
    const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    handle.setAttribute("r", 6);
    handle.setAttribute("fill", "red");
    handle.setAttribute("class", "circle-handle");
    handle.style.cursor = "ew-resize";
    svg.appendChild(handle);

    // Create drag overlay (invisible, on top of circle)
    const dragOverlay = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dragOverlay.setAttribute("cx", cx());
    dragOverlay.setAttribute("cy", cy());
    dragOverlay.setAttribute("r", r());
    dragOverlay.setAttribute("fill", "transparent");
    dragOverlay.style.cursor = "move";
    svg.appendChild(dragOverlay);

    const updatePositions = () => {
        handle.setAttribute("cx", cx() + r());
        handle.setAttribute("cy", cy());
        dragOverlay.setAttribute("cx", cx());
        dragOverlay.setAttribute("cy", cy());
        dragOverlay.setAttribute("r", r());
    };

    updatePositions();

    // --- Resize logic ---
    let resizing = false;
    handle.addEventListener("mousedown", e => {
        resizing = true;
        e.stopPropagation();
    });

    svg.addEventListener("mousemove", e => {
        if (!resizing) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        const newR = Math.max(0, svgP.x - cx());
        circle.setAttribute("r", newR);
        updatePositions();
    });

    svg.addEventListener("mouseup", () => resizing = false);

    // --- Drag logic ---
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragOverlay.addEventListener("mousedown", e => {
        dragging = true;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        offsetX = cx() - svgP.x;
        offsetY = cy() - svgP.y;
        e.stopPropagation();
    });

    svg.addEventListener("mousemove", e => {
        if (!dragging) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        circle.setAttribute("cx", svgP.x + offsetX);
        circle.setAttribute("cy", svgP.y + offsetY);
        updatePositions();
    });

    svg.addEventListener("mouseup", () => dragging = false);
};


export { circle, rect, line, text, ellipse  , polygon  , path};