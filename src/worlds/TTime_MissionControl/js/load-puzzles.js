function loadTelegraphPuzzle() {
    console.log("Telegraph Puzzle Loaded");

    document.querySelector('#passwordLock').setAttribute('number-lock', {slotPos:0, mode:'char', code:2734, stringCode:"DAHS", eventName:'openLid-emit'});
    document.querySelector('#RoomQuestion').setAttribute('text', {value:'What are long presses called \n in morse code?'});

    document.querySelector('#btn').setAttribute('end-level', {curRoom:0});

    let telegraph = document.createElement('a-entity');
    telegraph.setAttribute('id', 'telegraph');
    telegraph.setAttribute('telegraph-interaction', {angle:180, scale:0.3});
    telegraph.setAttribute('gltf-model', "#telegraph-gltf");
    telegraph.setAttribute('position', {x:0.904, y:0.582, z:3.390});
    telegraph.setAttribute('scale', {x:2.719, y:2.719, z:2.719});
    
    document.querySelector('#room').appendChild(telegraph);

    let morseCodePoster = document.createElement('a-entity');
    morseCodePoster.setAttribute('id', 'morseCodePoster');
    morseCodePoster.setAttribute('position', {x:-3.8, y:1.732, z:1.644});
    morseCodePoster.setAttribute('shadow', {receive:'false', cast:'false'});
    morseCodePoster.setAttribute('circles-sphere-env-map', 'src:/global/assets/textures/equirectangular/WhiteBlue.jpg');
    morseCodePoster.setAttribute('circles-artefact', {inspectScale:"0.85 0.85 0.85", inspectRotation: "0 -90 0", inspectPosition: "0 0.2 0",
                                                    origScale: "1 1 1", origRotation: "0 0 0", label_offset: "0 2.2 0", arrow_position: 'down',
                                                    title: '', description: 'Samuel Morse, along with associate, Alfred Vail create new invention that will change the world!',
                                                    description_on:'false', label_text: 'The Future of Communication', label_on:'false'});
    morseCodePoster.setAttribute('geometry', {primitive:'box', width:0.01, height:1.5, depth:2.25});
    morseCodePoster.setAttribute('material', {src:'#morseCode', side:'double'});

    // let newEntity = document.createElement('a-entity');
    // newEntity.setAttribute('geometry', {primitive:'box', rotation:'90 90 0', scale:'2.35 0.001 1.6'});
    // newEntity.setAttribute('material', {color:'#454545'});

    // morseCodePoster.appendChild(newEntity);
    document.querySelector('#room').appendChild(morseCodePoster);
}

function loadRotaryPuzzle() {
    console.log("Rotary Puzzle Loaded");
}

function loadCellPuzzle() {
    console.log("Cell Puzzle Loaded");
}