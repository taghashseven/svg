import {state , SVGGlobal , circlePropers , Modes } from "./state.js";
import {generatePolygonPoints, getMousePositionWithCTM} from "./utils/helperfunction.js";


function applyGlobalStyles(el, props ,  extra = {}) {
  
  
  for (let [key, val] of Object.entries(SVGGlobal)) {
    el.setAttribute(key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`), val);
  }
  
 
  for (let [key, val] of Object.entries(extra)) {
    el.setAttribute(key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`), val);
  }
  return el;
}

SVGGeometryElement.prototype.applyCommonBehavior = function(callback) {

    const el = this;
    el.dragg = false

    el.style.pointerEvents = "all";

    el.onMouseLeftButtonDown(e => {
        if( state.mode === Modes.ADD) return 
        el.dragg = true 
    });

    el.onMouseLeftButtonUp(e => {
        el.dragg = false 
    });

    el.addEventListener("mouseenter", () => {
      if (state.mode === Modes.SELECT) {
        state.mouse("move");
      }
    });

    el.addEventListener("mouseleave", () => {
      state._emit("mouseleave", el);
      state.mode == Modes.SELECT && state.mouse("default")
      state.mode == Modes.ADD && state.mouse("crosshair")
    
    });

    el.onMouseMove(e => {
      if(el.dragg) {
        callback(e);
      }
    });

    return el;

};

function circle(cx, cy, extra = {}) {


  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", cx);
  el.setAttribute("cy", cy);
  el.setAttribute("r", 0);

  // Apply global and custom styles
  applyGlobalStyles(el, extra = {...circlePropers});
  el.dragg = false 
  el.addEventListener("mouseenter", () => {
    state._emit("mouseenter", el);
    if(state.mode === Modes.SELECT) {
      state.mouse("move")
    } 
  })
  // fix for mouse enter to allow trigger 
  el.style.pointerEvents = "all";

  el.addEventListener("mouseleave", () => {
    state._emit("mouseleave", el);
    state.mode == Modes.SELECT && state.mouse("default")
    state.mode == Modes.ADD && state.mouse("crosshair")
  })

  el.onMouseLeftButtonDown(e => {
    if( state.mode === Modes.ADD) return 
    el.dragg = true 
  });

  el.onMouseLeftButtonUp(e => {
    if( state.mode === Modes.ADD) return 
    el.dragg = false 
  });

  el.onMouseMove(e => {
    if(el.dragg) {
      const pos = getMousePositionWithCTM(state.svg, e);
      el.setAttribute("cx", pos.x.toFixed(0));
      el.setAttribute("cy", pos.y.toFixed(0));
    }
  });

  return el;
}






function rect(x, y,  extra = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("width", 2);
  el.setAttribute("height", 2);
  return applyGlobalStyles(el, extra);
}

function line(x1, y1 , extra = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1);
  el.setAttribute("y1", y1);
  el.setAttribute("x2", x1);
  el.setAttribute("y2", y1);
  return applyGlobalStyles(el, extra);
}

function text(x, y, extra = {}) {


  function updateBox(){
    let box = el.getBBox();
    rect.setAttribute("x", box.x+2);
    rect.setAttribute("y", box.y+2);
    rect.setAttribute("width", box.width+2);
    rect.setAttribute("height", box.height+2)
  }

  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const g  = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("fill", "none");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 1);

  g.appendChild(rect);
  g.appendChild(el);
  state.svg.appendChild(g);
  g.setAttribute("transform", `translate(${x} ${y})`);

  el.setAttribute("x", 0);
  el.setAttribute("y", 0);
  el.setAttribute("dy", "0");
  el.setAttribute("font-size", "24");

  let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");


  updateBox()


  
  
  let span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  span.setAttribute("x", 0);
  span.setAttribute("dy", "1.2em");
  span.setAttribute("font-size", "24");
  span.textContent = "Jonah mudzingwa";

  el.spans = [span];
  el.spanIndex = 0;

  el.appendChild(span);

  document.addEventListener("keydown", e => {

    // if its not current return 
    if(state.currentElement !== g) return
    
    if(/^[a-zA-Z0-9]$/.test(e.key)){
      console.log("key donw ", e.key)
      el.spans[el.spanIndex].textContent += e.key
    }

    if(e.key === "Enter"){
      let span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      span.setAttribute("x", 0);
      span.setAttribute("dy", "1.2em");
      span.setAttribute("font-size", "24");
      el.spans.push(span);
      el.spanIndex = el.spans.length - 1;
      el.appendChild(span);
    }
  
    if(e.key === "Backspace"){
        //if span is empty remove it
        if(el.spans[el.spanIndex].textContent.length === 0){
          el.spans[el.spanIndex].remove();
          el.spanIndex = el.spans.length - 1;
        }else{
          el.spans[el.spanIndex].textContent = el.spans[el.spanIndex].textContent.slice(0, -1)
        }
    }



    updateBox()

  });

  g.addEventListener( "mouseenter", e => {
     if(state.mode == Modes.ADD) return 
     state.svg.style.cursor = "move";
  })

  g.addEventListener( "mouseleave", e => {
    if(state.mode == Modes.ADD){
      state.svg.style.cursor = "default";
    }
    else {
      state.svg.style.cursor = "pointer";
    }
    drag = false
  })

  g.addEventListener( "mousemove", e => {
    if(state.mode == Modes.ADD) return 
    if(g !== state.currentElement) return 
    if(!drag) return
    const ctm = g.getCTM();
    g.setAttribute("transform", `translate(${state.x} ${state.y})`);
  })

  let drag = false

  g.addEventListener( "mousedown", e => {
    drag = true
  })

  g.addEventListener( "mouseup", e => {
    drag = false
  })

  g.style.pointerEvents = "all";

  return g
}

function draggable(el , resize) {
  
  el.style.pointerEvents = "all";

  el.onMouseLeftButtonDown(e => {
    if(state.mode == Modes.ADD) return
    el.drag = true
    state.mouse("move")
  }).onMouseMove( (event)=> {
    if(!el.drag) return
    resize(event)
  })
  .onMouseLeftButtonUp(e => {
    el.drag = false
    state.mode == Modes.SELECT && state.mouse("default")
    state.mode == Modes.ADD && state.mouse("crosshair")
  })


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

  el.applyCommonBehavior(e =>{
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