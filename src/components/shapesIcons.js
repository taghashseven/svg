import { stateProxy ,  state} from "../state.js";

// toolbar-component.js
class ShapeIcons extends HTMLElement {

     constructor() {
        super();
        this.selectedTool = null; // internal state
        this.selectedShape = null; // internal state

    }

    // internal state


   connectedCallback() {
    
    this.innerHTML = /*html*/ `
      <div class="shapes-container mb-2 text-gray-700 font-medium flex  justify-center bg-white px-4 py-2 rounded-lg shadow-sm *:cursor-pointer ">
            <!-- Text Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer  active:scale-95 transition-all duration-150" data-name="Text">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <text x="12" y="12" font-size="12" text-anchor="middle" font-size="24">T</text>
                </svg>
            </span>

            <!-- Circle Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer      active:scale-95 transition-all duration-150" data-name="Circle">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#6366f1" stroke-width="2"/>
                </svg>
            </span>

            <!-- Ellipse Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer     active:scale-95 transition-all duration-150" data-name="Ellipse">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" stroke="#10b981" stroke-width="2"/>
                </svg>
            </span>

            <!-- Line Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer  active:scale-95 transition-all duration-150" data-name="Line">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <line x1="4" y1="12" x2="20" y2="12" stroke="#f59e0b" stroke-width="2"/>
                </svg>
            </span>

            <!-- Path Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer   active:scale-95 transition-all duration-150" data-name="Path">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M4 4 L20 4 L12 20" fill="none" stroke="#ef4444" stroke-width="2"/>
                </svg>
            </span>

            <!-- Polygon Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer  active:scale-95 transition-all duration-150" data-name="Polygon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <polygon  points="12 2 22 9 18 22 6 22 2 9"  fill="none"  stroke="#fbbf24"  stroke-width="2"/>
                </svg>
                <input value="3" class="w-6 text-center bg-transparent"  id="polygon-sides" />
            </span>

            <!-- Rectangle Tool -->
            <span class="flex items-center px-3 py-2 mx-2 bg-gray-200 rounded-md cursor-pointer   active:scale-95 transition-all duration-150" data-name="Rectangle">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="12" fill="none" stroke="#8b5cf6" stroke-width="2"/>
                </svg>
        </div>
            
    `;

    this.querySelector("#polygon-sides").addEventListener('change', () => {
        stateProxy.polygonSides = this.querySelector("#polygon-sides").value
    }) ;


    [...this.querySelector(".shapes-container").children]
    .forEach(node => {
        node.addEventListener('click', () => {
            this.select(node.dataset.name)
        })
    } );


  }


/**
 * Selects a shape and triggers a custom event.
 * @param {string} shape The name of the shape to select.
 * @example
 * const shapeIcons = new ShapeIcons();
 * shapeIcons.select('rectangle');
 */
   select(shape) {
        this.selectedShape = shape;
        this.dispatchEvent(new CustomEvent('onShapeSelected', {
            detail: { selectedShape: this.selectedShape },
            bubbles: true,
            composed: true
        }));

        [...this.querySelector(".shapes-container").children]
        .forEach(node => {
            node.classList.remove('bg-gray-500')
            node.classList.add('bg-gray-200')
        });
        this.querySelector(`[data-name="${shape}"]`).classList.add('bg-gray-500');
    }

  

   
}

customElements.define('shapes-component', ShapeIcons);


