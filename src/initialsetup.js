
import { state, stateProxy } from "./state.js";

function initialSetup() {

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // stops the menu from appearing
    });


    // delete element with delete key
    document.addEventListener("keydown", (e) => {
        if(e.key === "Delete" ) {
            if(state.currentElement) {
                state.currentElement.remove();
                state.currentElement = null;
                stateProxy.shapes = stateProxy.shapes.filter(shape => shape !== state.currentElement);
            }
        }
    });


}


initialSetup();