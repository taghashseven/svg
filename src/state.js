const Modes = Object.freeze({
    SELECT: 'select',
    ADD: 'add', 
    EDIT : 'edit'
});


// svg-core.js
const SVGGlobal = {
  stroke: "#000",
  strokeWidth: 2,
  fill: "none", 
  circle : {
    stroke: "#000",
    strokeWidth: 2,
    fill: "#000",
  } , 
  rect : {
    stroke: "#000",
    strokeWidth: 2,
    fill: "none",
    width : 30,
    height : 30
  } , 
  line : {
    stroke: "#000",
    strokeWidth: 2,
    fill: "none",
  } , 
  text : {
    stroke: "#000",
    strokeWidth: 2,
    fill: "none",
  }
  
};

const circlePropers = {
  stroke: "#000",
  strokeWidth: 2,
  fill: "#000",
};


const state = {
    mode: Modes.SELECT, 
    x: 0,
    y: 0,
    currentElement: null, 
    shapeTypeSelected: null,
    currentElementBeingDrawn: null,
    svg: document.querySelector("svg"),
    shapes : [] ,
    polygonSides : 3 ,

    // internal event system
    _listeners: {},

    on(prop, callback) {
        console.log(prop )
        if (!this._listeners[prop]) this._listeners[prop] = [];
        this._listeners[prop].push(callback);
    },

    off(prop, callback) {
        if (!this._listeners[prop]) return;
        this._listeners[prop] = this._listeners[prop].filter(fn => fn !== callback);
    },

    _emit(prop, value) {
        if (!this._listeners[prop]) return;
        this._listeners[prop].forEach(fn => fn(value));
    }
};


const stateProxy = new Proxy(state, {
    set(target, prop, value) {
        target[prop] = value;
        // emit event for that property
        target._emit(prop, value);
        return true;
    }
});


state.mouse = (type)=> {
    switch(type) {
        case "move" : 
            state.svg.style.cursor = "move";
            console.log("mouse chaniging")
            break;
        case "pointer" : state.svg.style.cursor = "pointer";
        break;
        case "crosshair" : state.svg.style.cursor = "crosshair";
        break;
        case "text" : state.svg.style.cursor = "text";
        break;
        case "default" : state.svg.style.cursor = "default";
        break;
        
    }
}

document.state = state

export { state, stateProxy, Modes , SVGGlobal , circlePropers};