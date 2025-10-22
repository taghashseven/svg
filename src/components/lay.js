import {state, stateProxy} from "../state.js";

class lay extends HTMLElement {
    constructor() {
        super();
        this.render();
        state.on("shapes", () => this.render());
        
        // Bind methods to maintain 'this' context
        this.moveLayerUp = this.moveLayerUp.bind(this);
        this.moveLayerDown = this.moveLayerDown.bind(this);
        this.deleteLayer = this.deleteLayer.bind(this);
        this.clearAllLayers = this.clearAllLayers.bind(this);
        this.selectLayer = this.selectLayer.bind(this);
        window.onclick =  (element)=> {
            // state.currentElement = element
        }
    }

    render() {
        const hasShapes = state.shapes && state.shapes.length > 0;
        
        this.innerHTML = /*html*/ `
            <div class="layers-panel">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <i class="fas fa-layer-group mr-2 text-indigo-600"></i>
                    Layers
                </h3>
                
                ${hasShapes ? /*html*/ `
                    <div class="space-y-2 max-h-64 overflow-y-auto">
                        ${[...state.svg.children].map((shape, index) => /*html*/ `
                            <div class="layer-item group flex items-center justify-between py-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md" 
                                 data-index="${index}"
                                 >
                                <div class="flex items-center space-x-3">
                                    <div class="shape-icon-container w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md group-hover:bg-white transition-colors">
                                        ${this.getShapeIcon(shape.tagName)}
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-800">${this.getShapeName(shape.tagName)}</div>
                                        <div class="text-xs text-gray-500">${shape.tagName.toLowerCase()}</div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button class="layer-action p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors move-up-btn" 
                                            data-index="${index}"
                                            ${index === 0 ? 'disabled' : ''}>
                                        <i class="fas fa-arrow-up text-xs"></i>
                                    </button>
                                    <button class="layer-action p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors move-down-btn" 
                                            data-index="${index}"
                                            ${index === state.shapes.length - 1 ? 'disabled' : ''}>
                                        <i class="fas fa-arrow-down text-xs"></i>
                                    </button>
                                    <button class="layer-action p-1 text-gray-400 hover:text-red-600 rounded transition-colors delete-btn" 
                                            data-index="${index}">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : /*html*/ `
                    <div class="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <i class="fas fa-shapes text-3xl text-gray-400 mb-3"></i>
                        <p class="text-sm text-gray-500">No shapes added yet</p>
                        <p class="text-xs text-gray-400 mt-1">Add shapes from the toolbar above</p>
                    </div>
                `}
                
                ${hasShapes ? /*html*/ `
                    <div class="mt-4 pt-3 border-t border-gray-200">
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Total layers: ${state.shapes.length}</span>
                            <button class="clear-all-btn text-red-500 hover:text-red-700 transition-colors">
                                <i class="fas fa-trash mr-1"></i>
                                Clear All
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Layer selection
        this.querySelectorAll('.layer-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger selection if clicking action buttons
                if (!e.target.closest('.layer-action')) {
                    this.selectLayer(parseInt(item.dataset.index));
                }
            });
        });

        // Move up buttons
        this.querySelectorAll('.move-up-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.moveLayerUp(parseInt(btn.dataset.index));
            });
        });

        // Move down buttons
        this.querySelectorAll('.move-down-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.moveLayerDown(parseInt(btn.dataset.index));
            });
        });

        // Delete buttons
        this.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLayer(parseInt(btn.dataset.index));
            });
        });

        // Clear all button
        const clearAllBtn = this.querySelector('.clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', this.clearAllLayers);
        }
    }

    getShapeIcon(tagName) {
        const icons = {
            'rect': '<i class="fas fa-square text-indigo-600"></i>',
            'circle': '<i class="fas fa-circle text-green-600"></i>',
            'ellipse': '<i class="fas fa-oval text-blue-600"></i>',
            'line': '<i class="fas fa-minus text-purple-600"></i>',
            'polygon': '<i class="fas fa-draw-polygon text-yellow-600"></i>',
            'polyline': '<i class="fas fa-wave-square text-pink-600"></i>',
            'path': '<i class="fas fa-project-diagram text-red-600"></i>',
            'text': '<i class="fas fa-font text-gray-600"></i>'
        };
        
        return icons[tagName.toLowerCase()] || '<i class="fas fa-shape text-gray-400"></i>';
    }

    getShapeName(tagName) {
        const names = {
            'rect': 'Rectangle',
            'circle': 'Circle',
            'ellipse': 'Ellipse',
            'line': 'Line',
            'polygon': 'Polygon',
            'polyline': 'Polyline',
            'path': 'Path',
            'text': 'Text'
        };
        
        return names[tagName.toLowerCase()] || tagName;
    }

    selectLayer(index) {
        // Remove selection from all layers
        this.querySelectorAll('.layer-item').forEach(item => {
            item.classList.remove('border-indigo-500', 'bg-indigo-100', 'ring-2', 'ring-indigo-200');
            item.classList.add('border-gray-200', 'bg-white');
        });
        
        // Add selection to clicked layer
        const selectedItem = this.querySelector(`[data-index="${index}"]`);
        if (selectedItem) {
            selectedItem.classList.remove('border-gray-200', 'bg-white');
            selectedItem.classList.add('border-indigo-500', 'bg-indigo-100', 'ring-2', 'ring-indigo-200');
        }
        
        // Dispatch custom event for layer selection
        this.dispatchEvent(new CustomEvent('layerSelected', {
            detail: { index, shape: state.shapes[index] },
            bubbles: true
        }));
    }

    moveLayerUp(index) {
        if (index > 0 && state.shapes) {
            const temp = state.shapes[index];
            state.shapes[index] = state.shapes[index - 1];
            state.shapes[index - 1] = temp;
            state._emit("shapes");
            
            // Re-select the moved layer
            setTimeout(() => this.selectLayer(index - 1), 10);
        }
    }

    moveLayerDown(index) {
        if (state.shapes && index < state.shapes.length - 1) {
            const temp = state.shapes[index];
            state.shapes[index] = state.shapes[index + 1];
            state.shapes[index + 1] = temp;
            state._emit("shapes");
            
            // Re-select the moved layer
            setTimeout(() => this.selectLayer(index + 1), 10);
        }
    }

    deleteLayer(index) {
        if (state.shapes && index >= 0 && index < state.shapes.length) {
            let el = state.shapes[index];
            state.svg.removeChild(el);
           stateProxy.shapes = state.shapes.filter((_, i) => i !== index);
        }
    }

    clearAllLayers() {
        if (state.shapes && state.shapes.length > 0) {
            if (confirm('Are you sure you want to clear all layers?')) {
                state.shapes.length = 0;
                state._emit("shapes");
            }
        }
    }
}

customElements.define('lay-component', lay);