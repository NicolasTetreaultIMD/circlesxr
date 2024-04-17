function loadTelegraphPuzzle() {
    console.log("Telegraph Puzzle Loaded");

    document.querySelector('#passwordLock').setAttribute('number-lock', {slotPos:0, mode:'char', code:2734, stringCode:"DAHS", eventName:'openLid-emit'});
    document.querySelector('#RoomQuestion').setAttribute('text', {value:'What are long presses called \n in morse code?'});

    document.querySelector('#btn').setAttribute('end-level', {curRoom:0});

    document.querySelector('#telegraph-container').setAttribute('circles-interactive-visible', true);
}

function loadRotaryPuzzle() {
    console.log("Rotary Puzzle Loaded");

    document.querySelector('#passwordLock').setAttribute('number-lock', {slotPos:0, mode:'char', code:51756, stringCode:"PULSE", nums:5, eventName:'openLid-emit'});
    document.querySelector('#RoomQuestion').setAttribute('text', {value:'An electrical _____ is sent\n to the phone switching office.'});

    document.querySelector('#btn').setAttribute('end-level', {curRoom:1});

    document.querySelector('#rotary-container').setAttribute('circles-interactive-visible', true);
}

function loadCellPuzzle() {
    console.log("Cell Puzzle Loaded");

    document.querySelector('#passwordLock').setAttribute('number-lock', {slotPos:0, mode:'char', code:28905, stringCode:"HELLO", nums:5, eventName:'openLid-emit'});
    document.querySelector('#RoomQuestion').setAttribute('text', {value:'What did the inventor\n of the cellphone say?'});

    document.querySelector('#btn').setAttribute('end-level', {curRoom:2});

    document.querySelector('#cell-container').setAttribute('circles-interactive-visible', true);
}