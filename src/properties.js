

function showPropertiesPanel() {
    console.log("showPropertiesPanel called for", selectedElement);
    if(!selectedElement) return;
     // Clear previous properties
    if(selectedElement.tagName === "line") {
        let div = document.getElementsByClassName("properties-panel")[0];
        div.innerHTML = /*html*/ `
            <div>
                <label class="block text-sm font-medium text-gray-700">Stroke Color</label>
                <input type="color" value="${selectedElement.getAttribute('stroke')}" onchange="selectedElement.setAttribute('stroke', this.value)" class="mt-1 block
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Stroke Width</label>
                <input type="number" value="${selectedElement.getAttribute('stroke-width')}" min="1" max="10" onchange="selectedElement.setAttribute('stroke-width', this.value)" class="mt-1 block
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
        `;
    } 

    if(selectedElement.tagName === "circle") {
        let div = document.getElementsByClassName("properties-panel")[0];
        div.innerHTML = /*html*/`
            <div>
                <label class="block text-sm font-medium text-gray-700">Fill Color</label>
                <input type="color" value="#667eea" onchange="selectedElement.setAttribute('fill', this.value)" class="mt-1 block
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Radius</label>
                <input type="number" value="${selectedElement.getAttribute('r')}" min="1" max="200" onchange="selectedElement.setAttribute('r', this.value)" class="mt-1 block  
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
        `;
    }
    else {
        // hide properties panel
    }
}
export { showPropertiesPanel };