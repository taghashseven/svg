import { state , stateProxy } from '../state.js';


window.update = (attr , value) => {
  if(state.currentElement.tagName == "g"){
    state.currentElement.querySelector("text")
      .setAttribute(attr , value)
      state.properties.text[attr] = value
      return 
  }
  if(state.currentElement){
    state.currentElement.setAttribute(attr , value)
  }
}

window.updateTransform = (attr , value) => {
  if(state.currentElement){
    switch (attr) {
      case 'rotate':
        state.currentElement.setAttribute('transform' , `rotate(${value})`)
        break;
      case 'scale':
        state.currentElement.setAttribute('transform' , `scale(${value})`)
        break;
      case 'skewX':
        state.currentElement.setAttribute('transform' , `skewX(${value})`)
        break;
      case 'skewY':
        state.currentElement.setAttribute('transform' , `skewY(${value})`)
        break;
    }
  }
}


const shapePropertiesTemplate = () => {
  const tag = state.currentElement?.tagName;

  console.log("tag 22 "  , tag)

  const templates = {
    circle: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Center X</label>
          <input id="input-cx" type="number" value="${state?.currentElement?.getAttribute('cx') || 0}"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            oninput="update('cx' , this.value)"
            >
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Center Y</label>
          <input id="input-cy" type="number" value="${state?.currentElement?.getAttribute('cy') || 0}"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            oninput="update('cy' , this.value)"
            >
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Radius</label>
          <input id="input-r" type="number" value="${state?.currentElement?.getAttribute('r') || 50}"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            oninput="update('r' , this.value)">
        </div>
      </div>
    `,

    rect: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">X</label>
          <input id="input-x" type="number" value="${state?.currentElement?.getAttribute('x') || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('x' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Y</label>
          <input id="input-y" type="number" value="${state?.currentElement?.getAttribute('y') || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('y' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Width</label>
          <input id="input-width" type="number" value="${state?.currentElement?.getAttribute('width') || 100}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('width' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Height</label>
          <input id="input-height" type="number" value="${state?.currentElement?.getAttribute('height') || 100}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('height' , this.value)">
        </div>
      </div>
    `,

    ellipse: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Center X</label>
          <input id="input-cx" type="number" value="${state?.currentElement?.getAttribute('cx') || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('cx' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Center Y</label>
          <input id="input-cy" type="number" value="${state?.currentElement?.getAttribute('cy') || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('cy' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Radius X</label>
          <input id="input-rx" type="number" value="${state?.currentElement?.getAttribute('rx') || 50}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('rx' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Radius Y</label>
          <input id="input-ry" type="number" value="${state?.currentElement?.getAttribute('ry') || 30}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('ry' , this.value)">
        </div>
      </div>
    `,

    line: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">X1</label>
          <input id="input-x1" type="number" value="${state?.currentElement?.getAttribute('x1') || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('x1' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Y1</label>
          <input id="input-y1" type="number" value="${state?.currentElement?.getAttribute('y1') || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('y1' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">X2</label>
          <input id="input-x2" type="number" value="${state?.currentElement?.getAttribute('x2') || 100}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('x2' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Y2</label>
          <input id="input-y2" type="number" value="${state?.currentElement?.getAttribute('y2') || 100}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('y2' , this.value)">
        </div>
      </div>
    `,

    polygon: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Center X</label>
          <input id="input-cx" type="number" value="${state?.currentElement?.centerX || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('cx' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Center Y</label>
          <input id="input-cy" type="number" value="${state?.currentElement?.centerY || 0}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('cy' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Radius</label>
          <input id="input-radius" type="number" value="${state?.currentElement?.radius || 50}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('radius' , this.value)">
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Sides</label>
          <input id="input-sides" type="number" min="3" value="${state.currentElement?.sides || 5}" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          oninput="update('sides' , this.value)">
        </div>
      </div>
    `,

 
    // for text
    g: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">X</label>
          <input id="input-x" type="number"
            value="${state?.currentElement?.getAttribute('transform')?.match(/(\d+)/g)[0] || 0}"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            oninput="update('x', this.value)">
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Y</label>
          <input id="input-y" type="number"
            value="${state?.currentElement?.getAttribute('transform')?.match(/(\d+)/g)[1] || 0}"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            oninput="update('y', this.value)">
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Font Size</label>
          <input id="input-font-size" type="number"
            value="${state?.currentElement?.querySelector('text')?.getAttribute('font-size') || 16}"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            oninput="update('font-size', this.value)">
        </div>


        <div>
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Font Family</label>
        <select id="input-font-family"
          class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          onchange="update('font-family', this.value)">
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Roboto">Roboto</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Open Sans">Open Sans</option>
          
        </select>
      </div>

              <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Text Alignment</label>
          <select id="input-text-align"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            onchange="update('text-anchor', this.value)">
            <option value="start">Left</option>
            <option value="middle">Center</option>
            <option value="end">Right</option>
          </select>
        </div>


        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Text Content</label>
          <textarea id="input-text-content"
            class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            rows="3"
            value="${state?.currentElement?.querySelector('text')?.textContent || ''}"
            oninput="|| "}>
            ${state?.currentElement?.querySelector('text')?.textContent || ''}
            </textarea>
        </div>
      </div>
    `,


    path: /*html*/ `
      <div class="space-y-3 shapes-properties">
        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Path Data (d)</label>
          <textarea id="input-d" class="property-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" rows="3">${state.currentElement?.getAttribute('d') || ''}</textarea>
        </div>
      </div>
    `,
  };

  return templates[tag] || `<div class="text-gray-400 italic">No editable properties for this shape</div>`;
};


const stylePropertiesTemplate = () => {
  const el = state.currentElement;
  if (!el) return "";

  const fill = el.getAttribute("fill") || "#6366f1";
  const stroke = el.getAttribute("stroke") || "#000000";
  const strokeWidth = el.getAttribute("stroke-width") || 1;
  const opacity = (el.getAttribute("opacity") || 1) * 100;

  return /*html*/ `
    <div class="space-y-3 style-properties border-t border-gray-200 pt-4 mt-4">
      <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Style</h3>

      <div>
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Fill Color</label>
        <div class="flex items-center space-x-2">
          <input id="input-fill-color" 
            type="color" 
            class="property-input h-10 w-20 border border-gray-300 rounded-md cursor-pointer" 
            value="${state.currentElement?.getAttribute('fill') || '#6366f1'}" 
            oninput="update('fill' , this.value)"
          >
          <input id="input-fill-text" 
            type="text" 
            class="property-input flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" 
            value="${state.currentElement?.getAttribute('fill') || '#6366f1'}" 
                oninput="update('fill' , this.value)"
          >
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Stroke Color</label>
        <div class="flex items-center space-x-2">
          <input id="input-stroke-color" 
            type="color" class="property-input h-10 w-20 border border-gray-300 rounded-md cursor-pointer" 
            oninput="update('stroke' , this.value)"
            value="${stroke}">
          <input id="input-stroke-text" 
            type="text" 
            oninput="update('stroke' , this.value)"
            class="property-input flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" 
            value="${stroke}">
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Stroke Width</label>
        <input id="input-stroke-width" 
          type="range" 
          class="property-input w-full" 
          min="0" max="10" 
          oninput="update('stroke-idth' , this.value)"
          value="${strokeWidth}">
      </div>

      <div>
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Opacity</label>
        <input id="input-opacity" 
          type="range" 
          class="property-input w-full" 
          min="0" max="100" 
          oninput="update('opacity' , this.value)"
          value="${opacity}">
      </div>
    </div>
  `;
};



const transformPropertiesTemplate = () => {
  const el = state.currentElement;
  if (!el) return "";

  // Parse existing transform (if any)
  const transform = el.getAttribute("transform") || "";
  const extract = (name, def = 0) => {
    const match = transform.match(new RegExp(`${name}\\(([^)]+)\\)`));
    return match ? parseFloat(match[1]) : def;
  };

  const rotation = extract("rotate", 0);
  const scaleX = extract("scale\\(([^,]+)", 1); // first value
  const scaleY = transform.includes("scale(")
    ? parseFloat((transform.match(/scale\([^,]+,([^)]+)\)/) || [])[1]) || scaleX
    : scaleX;
  const skewX = extract("skewX", 0);
  const skewY = extract("skewY", 0);

  return /*html*/ `
    <div id="transform-tab" class="tab-content">
      <div class="space-y-3 transform-properties border-t border-gray-200 pt-4 mt-4">
        <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Transform</h3>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Rotation</label>
          <div class="flex gap-2 items-center">
            <input id="input-rotate" type="number" class="property-input w-16 border px-2" value="${rotation}"
              oninput="updateTransform('rotate', this.value)">
            <input id="range-rotate" type="range" class="property-input flex-1" min="0" max="360" value="${rotation}"
              oninput="updateTransform('rotate', this.value)">
          </div>
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Scale X</label>
          <input id="input-scale-x" type="range" class="property-input w-full" min="0" max="200" value="${scaleX * 100}"
            oninput="updateTransform('scaleX', this.value / 100)">
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Scale Y</label>
          <input id="input-scale-y" type="range" class="property-input w-full" min="0" max="200" value="${scaleY * 100}"
            oninput="updateTransform('scaleY', this.value / 100)">
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Skew X</label>
          <input id="input-skew-x" type="range" class="property-input w-full" min="-45" max="45" value="${skewX}"
            oninput="updateTransform('skewX', this.value)">
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Skew Y</label>
          <input id="input-skew-y" type="range" class="property-input w-full" min="-45" max="45" value="${skewY}"
            oninput="updateTransform('skewY', this.value)">
        </div>
      </div>
    </div>
  `;
};


// Helper to maintain and apply transforms
function updateTransform(type, value) {
  const el = state.currentElement;
  if (!el) return;

  // Get current transform
  const transform = el.getAttribute("transform") || "";

  // Extract existing transforms
  const extract = (name, def = 0) => {
    const match = transform.match(new RegExp(`${name}\\(([^)]+)\\)`));
    return match ? match[1] : def;
  };

  let rotate = parseFloat(extract("rotate", 0));
  let scaleX = parseFloat((extract("scale", "1,1") + "").split(",")[0]);
  let scaleY = parseFloat((extract("scale", "1,1") + "").split(",")[1]);
  if (isNaN(scaleY)) scaleY = scaleX;
  let skewX = parseFloat(extract("skewX", 0));
  let skewY = parseFloat(extract("skewY", 0));

  // Update the relevant one
  switch (type) {
    case "rotate": rotate = parseFloat(value) || 0; break;
    case "scaleX": scaleX = parseFloat(value) || 1; break;
    case "scaleY": scaleY = parseFloat(value) || 1; break;
    case "skewX": skewX = parseFloat(value) || 0; break;
    case "skewY": skewY = parseFloat(value) || 0; break;
  }

  // Apply new transform
  el.setAttribute(
    "transform",
    `rotate(${rotate}) scale(${scaleX},${scaleY}) skewX(${skewX}) skewY(${skewY})`
  );

  // Optional: notify your reactive UI system
  if (state.emit) state.emit("transformChange", { rotate, scaleX, scaleY, skewX, skewY });
}


class Properties extends HTMLElement {
    constructor() {
        super();
        this.selectTool = null;
        this.selectedShape = null;
        this.tab = "shape" 
    }

    connectedCallback() {
        this.render();
        state.on("selectedElement", () => this.render());
        state.on("x" , ()=> this.render())
        state.on('mode', ()=>{
            () => this.render()
            console.log("mode changed ..........")
        });
        state.on('shapeTypeSelected' , () => this.render())

      window.switchTab = (tabName) => {
        this.tab = tabName;
        this.render();
      }

    }

    render() {
        // optional re-render logic later

        this.innerHTML = /*html*/ `
        <!-- Properties Panel -->
        <aside class="w-64 bg-white shadow-xl z-10 glass-effect">
            <div class="p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-edit mr-2 text-indigo-600"></i>
                    Properties
                </h2>

                <!-- Tabs -->
                <div class="flex mb-4 border-b border-gray-200">
                    <button class="tab-button px-4 py-2 text-sm font-medium text-indigo-600 ${this.tab === 'shape' ? 'active' : ''}" onclick="switchTab('shape')">
                        Shape
                    </button>
                    <button class="tab-button px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 ${this.tab === 'style' ? 'active' : ''}" onclick="switchTab('style')">
                        Style
                    </button>
                    <button class="tab-button px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 ${this.tab === 'transform' ? 'active' : ''}" onclick="switchTab('transform')">
                        Transform
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="space-y-4 properties-panel">

                    <!-- Shape Properties -->
                    <div id="shape-tab" class="tab-content ${this.tab === 'shape' ? '' : 'hidden'}">
                        ${
                            !state.currentElement && `<p class="element_name text-sm font-medium text-gray-700 mb-3">No element selected</p>`
                        }

                        ${ shapePropertiesTemplate() }

                    </div>

                    <!-- Style Properties -->
                    <div id="style-tab" class="tab-content ${this.tab === 'style' ? '' : 'hidden'}">
                        ${
                            !state.currentElement && `<p class="element_name text-sm font-medium text-gray-700 mb-3">No element selected</p>`
                        }
                        ${
                            stylePropertiesTemplate()
                        }
                    </div>

                    <!-- Transform Properties -->
                    <div id="transform-tab" class="tab-content ${this.tab === 'transform' ? '' : 'hidden'}">
                        ${
                            !state.currentElement && `<p class="element_name text-sm font-medium text-gray-700 mb-3">No element selected</p>`
                        }
                        ${
                            transformPropertiesTemplate()
                        }
                    </div>

                </div>

                <!-- Actions -->
                <div class="mt-6 pt-4 border-t border-gray-200">
                    <button class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <i class="fas fa-trash mr-2"></i>
                        Delete Element
                    </button>
                </div>
            </div>
        </aside>
        `;


    }


    
}

customElements.define('properties-component', Properties);
