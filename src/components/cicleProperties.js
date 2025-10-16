import { state , SVGGlobal , circlePropers  } from "../state.js";


function circleProperties() {

    let currentElement = state.currentElement
    const onCxChange = () => currentElement.setAttribute('cx', document.getElementById('input-cx').value)
    const onCyChange = () => currentElement.setAttribute('cy', document.getElementById('input-cy').value)
    const onRadiusChange = () => currentElement.setAttribute('r', document.getElementById('input-radius').value)

    window.updateCircleRadius = function updateCircleRadius() {
        let value = document.getElementById("input-r").value;
        if(value === "") return;
        state.currentElement.setAttribute('r', value);
    }

    window.updateCircleCx = function updateCircleCx() {
        let value = document.getElementById("input-cx").value;
        if(value === "") return;
        state.currentElement.setAttribute('cx', value);
    }

    window.updateCircleCy = function updateCircleCy() {
        let value = document.getElementById("input-cy").value;
        if(value === "") return;
        state.currentElement.setAttribute('cy', value);
    }


    const tag =  /*html*/ `
        <div class="flex flex-col gap-2">
            <div>
                <label class="block text-sm font-medium text-gray-700">CXt</label>
                <input type="number" value="${currentElement?.getAttribute('cx') || 0}"  class="mt-1 block
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                id="input-cx"
                oninput="updateCircleCx()"
                >
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">CY</label>
                <input type="number" value="${currentElement?.getAttribute('cy') || 0}"  class="mt-1 block
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" id="input-cy"
                oninput="updateCircleCy()" 
                >

            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Radius</label>
                <input type="number" value="${parseFloat(currentElement?.getAttribute('r')).toFixed(2) || 0}" class="mt-1 block
                w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" id="input-r"
                oninput="updateCircleRadius()"
                >
            </div>
        </div>
        `;  

    return tag
}



function styleProperties() {
    const currentElement = state.currentElement;

    // Update functions
    window.updateFillColor = () => {
        const value = document.getElementById("input-fill-color").value;
        if (!value) return;
        circlePropers.fill = value
        currentElement.setAttribute("fill", value);
    };

    window.updateStrokeColor = () => {
        const value = document.getElementById("input-stroke-color").value;
        if (!value) return;
        circlePropers.stroke = value
        currentElement.setAttribute("stroke", value);
    };

    window.updateStrokeWidth = () => {
        const value = document.getElementById("input-stroke-width").value;
        if (!value) return;
        circlePropers.strokeWidth = value
        currentElement.setAttribute("stroke-width", value);
    };

    window.updateOpacity = () => {
        const value = document.getElementById("input-opacity").value;
        if (!value) return;
        circlePropers.opacity = value
        currentElement.setAttribute("opacity", value / 100);
    };

    const tag = /*html*/ `
        <div class="space-y-3 style-properties">
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Fill Color</label>
                <div class="flex items-center space-x-2">
                    <input type="color" id="input-fill-color" class="property-input h-10 w-20 border border-gray-300 rounded-md cursor-pointer" value="${currentElement?.getAttribute("fill") || "#6366f1"}" 
                        oninput="updateFillColor()">
                    <input type="text" id="input-fill-color-text" class="property-input flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        value="${currentElement?.getAttribute("fill") || "#6366f1"}" oninput="updateFillColor()">
                </div>
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Stroke Color</label>
                <div class="flex items-center space-x-2">
                    <input type="color" id="input-stroke-color" class="property-input h-10 w-20 border border-gray-300 rounded-md cursor-pointer" value="${currentElement?.getAttribute("stroke") || "#000000"}"
                        oninput="updateStrokeColor()">
                    <input type="text" id="input-stroke-color-text" class="property-input flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value="${currentElement?.getAttribute("stroke") || "#000000"}" oninput="updateStrokeColor()">
                </div>
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Stroke Width</label>
                <input type="range" id="input-stroke-width" class="property-input w-full" min="0" max="10" value="${currentElement?.getAttribute("stroke-width") || 1}" 
                    oninput="updateStrokeWidth()">
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Opacity</label>
                <input type="range" id="input-opacity" class="property-input w-full" min="0" max="100" value="${(currentElement?.getAttribute("opacity") || 1) * 100}" 
                    oninput="updateOpacity()">
            </div>
        </div>
    `;

    return tag;
}


function transformProperties() {
    const currentElement = state.currentElement;

    // Helper to read current transform values
    const getTransformValues = () => {
        const transform = currentElement.getAttribute("transform") || "";
        const values = {
            rotate: 0,
            scaleX: 100,
            scaleY: 100,
            skewX: 0,
            skewY: 0
        };

        const rotateMatch = transform.match(/rotate\(([-\d.]+)\)/);
        if (rotateMatch) values.rotate = parseFloat(rotateMatch[1]);

        const scaleMatch = transform.match(/scale\(([-\d.]+),?\s*([-\d.]+)?\)/);
        if (scaleMatch) {
            values.scaleX = parseFloat(scaleMatch[1]) * 100;
            values.scaleY = scaleMatch[2] ? parseFloat(scaleMatch[2]) * 100 : values.scaleX;
        }

        const skewXMatch = transform.match(/skewX\(([-\d.]+)\)/);
        if (skewXMatch) values.skewX = parseFloat(skewXMatch[1]);

        const skewYMatch = transform.match(/skewY\(([-\d.]+)\)/);
        if (skewYMatch) values.skewY = parseFloat(skewYMatch[1]);

        return values;
    };

    const applyTransform = (values) => {
        const { rotate, scaleX, scaleY, skewX, skewY } = values;
        currentElement.setAttribute(
            "transform",
            `rotate(${rotate}) scale(${scaleX / 100},${scaleY / 100}) skewX(${skewX}) skewY(${skewY})`
        );
    };

    // Update functions
    window.updateRotate = () => {
        const values = getTransformValues();
        values.rotate = parseFloat(document.getElementById("input-rotate").value);
        applyTransform(values);
    };

    window.updateScaleX = () => {
        const values = getTransformValues();
        values.scaleX = parseFloat(document.getElementById("input-scale-x").value);
        applyTransform(values);
    };

    window.updateScaleY = () => {
        const values = getTransformValues();
        values.scaleY = parseFloat(document.getElementById("input-scale-y").value);
        applyTransform(values);
    };

    window.updateSkewX = () => {
        const values = getTransformValues();
        values.skewX = parseFloat(document.getElementById("input-skew-x").value);
        applyTransform(values);
    };

    window.updateSkewY = () => {
        const values = getTransformValues();
        values.skewY = parseFloat(document.getElementById("input-skew-y").value);
        applyTransform(values);
    };

    const values = getTransformValues();

    const tag = /*html*/ `
        <div class="space-y-3 transform-properties">
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Rotation</label>
                <input type="range" id="input-rotate" class="property-input w-full" min="0" max="360" value="${values.rotate}" 
                    oninput="updateRotate()">
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Scale X</label>
                <input type="range" id="input-scale-x" class="property-input w-full" min="0" max="200" value="${values.scaleX}" 
                    oninput="updateScaleX()">
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Scale Y</label>
                <input type="range" id="input-scale-y" class="property-input w-full" min="0" max="200" value="${values.scaleY}" 
                    oninput="updateScaleY()">
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Skew X</label>
                <input type="range" id="input-skew-x" class="property-input w-full" min="-45" max="45" value="${values.skewX}" 
                    oninput="updateSkewX()">
            </div>
            <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Skew Y</label>
                <input type="range" id="input-skew-y" class="property-input w-full" min="-45" max="45" value="${values.skewY}" 
                    oninput="updateSkewY()">
            </div>
        </div>
    `;

    return tag;
}






export { circleProperties , styleProperties , transformProperties };

