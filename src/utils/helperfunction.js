
import {state, Modes} from "../state.js";

function onShapeButtonClick() {
    state.mode = Modes.ADD;
    // Get the container once
    const container = document.querySelector(".shapes-container");

    // Use event delegation: listen on container, not each child
    container.addEventListener("click", (e) => {
        // Make sure we clicked on the span that contains the text, not the dot
        const targetSpan = e.target.closest("span.flex.items-center");
        if (!targetSpan) return;

        // The last child node is the text node (shape name)
        const shapeType = targetSpan.childNodes[targetSpan.childNodes.length - 1].textContent.trim();
        console.log("shapeType:", shapeType);
        state.shapeTypeSelected = shapeType;
    }); // optional: remove listener after first selection
}

export default function getMousePositionWithCTM(svg, evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const screenCTM = svg.getScreenCTM();
    if (screenCTM) {
        return pt.matrixTransform(screenCTM.inverse());
    }
    return {x: evt.offsetX, y: evt.offsetY};
}

/**
 * Generates points for a regular polygon centered at (cx, cy)
 * with radius r and n sides.
 * The points are ordered counter-clockwise and can be rotated
 * by the given rotation.
 * @param {number} cx - x-coordinate of the center of the polygon
 * @param {number} cy - y-coordinate of the center of the polygon
 * @param {number} r - radius of the polygon
 * @param {number} n - number of sides of the polygon
 * @param {number} rotation - rotation of the polygon in radians
 * @returns {string} - a string of points in the format "x1,y1 x2,y2 ..."
 */

function generatePolygonPoints(cx, cy, r, n, rotation = -Math.PI/2) {
    const points = [];
    

    for (let i = 0; i < n; i++) {
        const angle = (i * 2 * Math.PI / n) + rotation;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push([x.toFixed(3), y.toFixed(3)]);
    }

    return points.map(p => p.join(',')).join(' ');
}


function getTranslate(el) {
  const transform = el.getAttribute('transform') || '';
  const match = transform.match(/translate\(([^)]+)\)/);
  if (!match) return { x: 0, y: 0 };

  const [xStr, yStr] = match[1].trim().split(/[\s,]+/);
  return {
    x: parseFloat(xStr) || 0,
    y: parseFloat(yStr) || 0
  };
}

export { onShapeButtonClick, getMousePositionWithCTM , generatePolygonPoints , getTranslate };