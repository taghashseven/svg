export default function toImage(){
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = svg.clientWidth;
        canvas.height = svg.clientHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngData;
        link.download = 'svg_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    img.src = url;
}

document.addEventListener("paste", async (e) => {
    const svg = document.querySelector("svg");
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            const url = URL.createObjectURL(file);

            // Create SVG image element
            const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
            img.setAttribute("href", url);
            img.setAttribute("x", 0);
            img.setAttribute("y", 0);
            img.setAttribute("width", 200); // default size
            img.setAttribute("height", 200);
            img.style.cursor = "move";

            svg.appendChild(img);

            // Optional: make it draggable
            makeSVGDraggable(img);
        }
    }
});

function makeSVGDraggable(el, ) {
    const svg = document.querySelector("svg");
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener("mousedown", e => {
        dragging = true;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        offsetX = parseFloat(el.getAttribute("x")) - svgP.x;
        offsetY = parseFloat(el.getAttribute("y")) - svgP.y;
        e.stopPropagation();
    });

    svg.addEventListener("mousemove", e => {
        if (!dragging) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        el.setAttribute("x", svgP.x + offsetX);
        el.setAttribute("y", svgP.y + offsetY);
    });

    svg.addEventListener("mouseup", () => dragging = false);
}


