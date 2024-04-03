//Manages the telegraph interactions
AFRAME.registerComponent('rotary-interaction', {
    schema: {
        offset:{type:'float', default:0.600},
        amgledif:{type:'float', default:25},
        startangle:{type:'float', default:45},
        scale:{type:'float', default:1},
    },
    init() {
        const CONTEXT_AF = this;

        CONTEXT_AF.playbackMessg = "";
        CONTEXT_AF.timeElapsed = 0;
        CONTEXT_AF.playAnim = false;

        //CONTEXT_AF.el.setAttribute('animation__rotateWheel', {'property': 'rotation', 'to': {x: 0, y: 0, z: 45}, 'dur':1000, 'startEvents': 'startWheelAnim'});
        //CONTEXT_AF.el.setAttribute('animation__returnWheel', {'property': 'rotation', 'to':{x:0,y:0,z:0}, 'dur':1000, 'startEvents': 'animationcomplete__rotateWheel', 'autoplay': false});
        //CONTEXT_AF.el.addEventListener('animationcomplete__returnWheel', function(){CONTEXT_AF.rotaryElements.setAttribute('circles-interactive-visible', 'true');});
        CONTEXT_AF.el.setAttribute('animation__rotateWheel', {'property': 'rotation','from':{x:0, y:0, z:0}, 'to': {x: 0, y: 0, z: -90}, 'dur':1000, 'startEvents': 'startWheelAnim', 'autoplay':false});
        CONTEXT_AF.el.setAttribute('animation__returnWheel', {'property': 'rotation', 'to':{x:0,y:0,z:0}, 'dur':1000, 'startEvents': 'animationcomplete__rotateWheel'});
        
        //Creates the rotary phone components

        //Container for the other elements that need to be toggle off
        console.log(CONTEXT_AF.data.scale);

        let rotaryElements = document.createElement('a-entity');
        rotaryElements.setAttribute('id', 'rotaryElements');
        rotaryElements.setAttribute('circles-interactive-visible', 'true');
        rotaryElements.setAttribute('rotation', {x:0,y:CONTEXT_AF.data.angle,z:0});
        rotaryElements.setAttribute('scale', {x:CONTEXT_AF.data.scale,y:CONTEXT_AF.data.scale,z:CONTEXT_AF.data.scale});
        
        CONTEXT_AF.rotaryElements = rotaryElements;

        //Rotary Display
        let rotaryDisplay = document.createElement('a-entity');
        rotaryDisplay.setAttribute('id','rotaryDisplay');
        rotaryDisplay.setAttribute('circles-label', {text:'', arrow_visible:false, offset:'0 1 0'});
        rotaryDisplay.setAttribute('circles-interactive-visible', 'false');
        
        rotaryElements.appendChild(rotaryDisplay);
        CONTEXT_AF.rotaryElements = rotaryElements;

        //Clear Button

        let comsBtnGrp = document.createElement('a-entity');
        comsBtnGrp.setAttribute('id', 'communicationButtonsGrp');
        comsBtnGrp.setAttribute('position', {x:0,y:0.6,z:0.4});
        comsBtnGrp.setAttribute('rotation', {x:0,y:0,z:0});

        let resetBtn = document.createElement('a-entity');
        resetBtn.setAttribute('id', 'resetBtn');
        resetBtn.setAttribute('geometry', {primitive:'plane', height:0.15, width:0.3});
        resetBtn.setAttribute('material', {color:'white'});
        resetBtn.setAttribute('position', {x:-0.4,y:0,z:0});
        resetBtn.setAttribute('text', {width:2,value:'Reset',align:'center',color:'black'});
        resetBtn.setAttribute('circles-interactive-object', {type:'scale', click_scale:0.95});
        resetBtn.setAttribute('animation__btnclick', {property:'scale',from:'0.95 0.95 0.95',to:'1.08 1.08 1.08',dur:200,startEvents:'click'});
        //resetBtn.addEventListener('click', ResetMessage);

        comsBtnGrp.appendChild(resetBtn);
        rotaryElements.appendChild(comsBtnGrp);

        //Input Buttons

        let inputBtnGrp = document.createElement('a-entity');
        inputBtnGrp.setAttribute('id', 'inputButtonsGrp');
        inputBtnGrp.setAttribute('position', {x:0,y:0,z:0});
        inputBtnGrp.setAttribute('rotation', {x:0,y:0,z:0});

        for (let i = 0; i < 10; i++) {
            let btnContainer = document.createElement('a-entity');
            btnContainer.setAttribute('rotation', {x:0,y:0,z:CONTEXT_AF.data.amgledif * i + CONTEXT_AF.data.startangle});

            let rotaryBtn = document.createElement('a-entity');
            rotaryBtn.setAttribute('id', 'rotaryBtn' + i);
            rotaryBtn.setAttribute('geometry', {primitive:'cylinder', height: 0.05, radius: 0.1});
            rotaryBtn.setAttribute('rotation', {x:90,y:0,z:0});
            rotaryBtn.setAttribute('position', {x:CONTEXT_AF.data.offset,y:0,z:0});
            rotaryBtn.setAttribute('scale', {x:CONTEXT_AF.data.scale, y:CONTEXT_AF.data.scale, z:CONTEXT_AF.data.scale});
            rotaryBtn.setAttribute('circles-interactive-object', {type:'highlight'});
            rotaryBtn.addEventListener('click', function(){CONTEXT_AF.InputRotary(i)});

            btnContainer.appendChild(rotaryBtn);
            inputBtnGrp.appendChild(btnContainer);

        }

        rotaryElements.appendChild(inputBtnGrp);

        CONTEXT_AF.el.appendChild(rotaryElements);

        CONTEXT_AF.InputRotary = function (val) {

            //CONTEXT_AF.el.removeAttribute("animation__rotateWheel");
            //CONTEXT_AF.el.removeAttribute("animation__returnWheel");

            console.log(CONTEXT_AF.rotaryElements);
            //CONTEXT_AF.rotaryElements.setAttribute('circles-interactive-visible', 'false');

            // CONTEXT_AF.el.setAttribute('animation__rotateWheel', {'property': 'rotation','from':{x:0, y:0, z:0}, 'to': {x: 0, y: 0, z: -(CONTEXT_AF.data.amgledif * (val + 1) + CONTEXT_AF.data.startangle)}, 'dur':1000 + (50 * val), 'startEvents': 'startWheelAnim', 'autoplay':false});
            // CONTEXT_AF.el.setAttribute('animation__returnWheel', {'property': 'rotation', 'to':{x:0,y:0,z:0}, 'dur':1000 + (50 * val), 'startEvents': 'animationcomplete__rotateWheel'});
            //CONTEXT_AF.el.setAttribute('animation__rotateWheel', {'property': 'rotation', 'from':{x:0,y:0,z:0}, 'to': {x: 0, y: 0, z: -(CONTEXT_AF.data.amgledif * (val + 1) + CONTEXT_AF.data.startangle)}, 'dur':1000 + (50 * val), 'startEvents': 'startWheelAnim'});
            //CONTEXT_AF.el.setAttribute('animation__returnWheel', {'dur':1000 + (50 * val)});

            CONTEXT_AF.el.emit('startWheelAnim');

            CONTEXT_AF.playAnim = true;
        }

        //connect to web sockets so we can sync the number lock between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.EventName = "rotary_event";

        CONTEXT_AF.World1Name = "TTime_MissionControl";
        CONTEXT_AF.World2Name = "TTime_Rotary";

        CONTEXT_AF.Group1Name = "missionControl";
        CONTEXT_AF.Group2Name = "timeTraveler";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //Add events listeners for the input type sending event ----------------------------------------------------------------
            // dotBtn.addEventListener('click', function(){SendMorse(MorseInput.dot)});
            // dashBtn.addEventListener('click', function(){SendMorse(MorseInput.dash)});
            // spaceBtn.addEventListener('click', function(){SendMorse(MorseInput.space)});

            //Inputs the morse symbol and emits an event to others in the room so they can see the new symbol added  --------------------------------------------------
            // function SendMorse(inputType) {
            //     inputMorse(inputType);
            //     CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseInput:inputType, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            // }

            //Add events listeners for the reset of the text field  --------------------------------------------------
            // sendBtn.addEventListener('click', SendReset);
            // resetBtn.addEventListener('click', SendReset);

            //Emits an event to others in the room so everyone has their text field reset   -------------------------------------------
            // function SendReset() {
            //     CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {resetRequest:true, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            // }

            //Add an event listeners to send the morse message   ------------------------------------------------------
            // sendBtn.addEventListener('click', SendMessage);

            //If the message is not null
            //Start playing the message
            //Sends the message to other users in the same world
            //Sends the message to other users in the specified other world
            // function SendMessage() {
            //     //If the text field is not null
            //     if (CONTEXT_AF.textField.getAttribute('circles-interactive-visible') == true) {
            //         //Reset text field
            //         CONTEXT_AF.textField.setAttribute('circles-interactive-visible', false);
    
            //         //Save the message in the text field
            //         let message = CONTEXT_AF.textField.getAttribute('circles-label').text;
            //         //console.log(message);
            //         //Emit the message to other users in the same world
            //         CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseMessage:message, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

            //         //Emit the message to users in the specified other world
            //         if (CIRCLES.getCirclesWorldName() === CONTEXT_AF.World1Name) {
            //             CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseMessage:message, room:CONTEXT_AF.Group2Name, world:CONTEXT_AF.World2Name});
            //         }
            //         else {
            //             CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseMessage:message, room:CONTEXT_AF.Group1Name, world:CONTEXT_AF.World1Name});
            //         }
    
            //         //Start playing the message
            //         CONTEXT_AF.StartMessagePlayback(message);
            //     }
            // }


            CONTEXT_AF.socket.on(CONTEXT_AF.EventName, function(data) {

            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    //CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {curMorseMessage:CONTEXT_AF.textField.getAttribute('circles-label').text, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                
            });
        };

        //check if circle networking is ready. If not, add an eent to listen for when it is ...
        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        }
        else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }
    },
    update() {},

    //Used to play the morse message
    tick: function (time, timeDelta) {
        const CONTEXT_AF = this;
    },
    
});