

Element.prototype.on = function(event, handler) {
  this.addEventListener(event, handler);
  return this; // enable chaining
};

NodeList.prototype.on = function(event, handler) {
  this.forEach(el => el.addEventListener(event, handler));
  return this;
};


// events -----------------------------------------
function addMethods(proto) {
    proto.onMouseLeftButtonDown = function(handler) {
        this.on('mousedown', function(e) {
            if (e.button === 0) { // left button
                handler.call(this, e);
            }
        });
        return this;
    }

    proto.onMouseLeftButtonUp = function(handler) {
        this.on('mouseup', function(e) {
            if (e.button === 0) { // left button
                handler.call(this, e);
            }
        });
        return this;
    }

    proto.onMouseRightButtonDown = function(handler) {
        this.on('mousedown', function(e) {
            if (e.button === 2) { // right button
                handler.call(this, e);
                e.stopPropagation(); // prevent context menu
                e.preventDefault();
            }
        });
        return this;
    }

    proto.onMouseRightButtonUp = function(handler) {
        this.on('mouseup', function(e) {
            if (e.button === 2) { // right button
                handler.call(this, e);
            }
            e.stopPropagation(); // prevent context menu
            e.preventDefault();
        });
        return this;
    }

    proto.onMouseMiddleButtonDown = function(handler) {
        this.on('mousedown', function(e) {
            if (e.button === 1) { // middle button
                handler.call(this, e);
            }
        });
        return this;
    }

    proto.onMouseMove = function(handler) {
        this.on('mousemove', handler);
        return this;
    }

    proto.onMouseRightButtonClick = function(handle) {
        this.on("contextmenu", function(e) {
        e.preventDefault(); // optional – prevents the default right-click menu
        handle.call(this, e);
    });
    }

    
}

addMethods(Element.prototype);
addMethods(NodeList.prototype);



