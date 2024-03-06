const MorseInput = {
    dot: 0,
    dash: 1,
    space: 2
}

const MorseDelay = {
    dot: 0.3,
    dash: 0.5,
    space: 1
}

AFRAME.registerComponent('telegraph-interaction', {
    schema: {
    },
    init() {
        const CONTEXT_AF = this;

        CONTEXT_AF.playbackMessg = "";
        CONTEXT_AF.timeElapsed = 0;
        CONTEXT_AF.delay = 0;

        
        //Creates the telegraph components
        
        //Light element
        CONTEXT_AF.morseLight = document.createElement('a-entity');
        CONTEXT_AF.morseLight.setAttribute('id', 'morseLight');
        CONTEXT_AF.morseLight.setAttribute('position', {x:0,y:0.58,z:0});
        CONTEXT_AF.morseLight.setAttribute('geometry', {primitive:'cylinder', height:0.2, radius:0.1});
        CONTEXT_AF.morseLight.setAttribute('material', {color:'#316934', emissive:'#00ff00', emissiveIntensity:0});

        CONTEXT_AF.el.appendChild(CONTEXT_AF.morseLight);

        //Container for the other elements that need to be toggle off

        let telegraphElements = document.createElement('a-entity');
        telegraphElements.setAttribute('id', 'telegraphElements');
        telegraphElements.setAttribute('circles-interactive-visible', 'true');
        
        CONTEXT_AF.telegraphElements = telegraphElements;

        //Sound elements
        CONTEXT_AF.dot_sfx = document.createElement('a-entity');
        CONTEXT_AF.dot_sfx.setAttribute('sound', {src:'#dot_sfx'});
        CONTEXT_AF.dot_sfx.addEventListener('sound-ended', function() {CONTEXT_AF.ToggleLight(false)});

        CONTEXT_AF.dash_sfx = document.createElement('a-entity');
        CONTEXT_AF.dash_sfx.setAttribute('sound', {src:'#dash_sfx'});
        CONTEXT_AF.dash_sfx.addEventListener('sound-ended', function() {CONTEXT_AF.ToggleLight(false)});

        telegraphElements.appendChild(CONTEXT_AF.dot_sfx);
        telegraphElements.appendChild(CONTEXT_AF.dash_sfx);

        //Morse Display
        //Is there a way to change the size of the text?
        let morseDisplay = document.createElement('a-entity');
        morseDisplay.setAttribute('id','morseDisplay');
        morseDisplay.setAttribute('circles-label', {text:'', arrow_visible:false, offset:'0 1 0'});
        morseDisplay.setAttribute('circles-interactive-visible', 'false');
        
        telegraphElements.appendChild(morseDisplay);
        CONTEXT_AF.textField = morseDisplay;

        //Send/Clear Buttons

        let comsBtnGrp = document.createElement('a-entity');
        comsBtnGrp.setAttribute('id', 'communicationButtonsGrp');
        comsBtnGrp.setAttribute('position', {x:0,y:0.6,z:0.4});
        comsBtnGrp.setAttribute('rotation', {x:0,y:0,z:0});

        let sendBtn = document.createElement('a-entity');
        sendBtn.setAttribute('id', 'sendBtn');
        sendBtn.setAttribute('geometry', {primitive:'plane', height:0.15, width:0.3});
        sendBtn.setAttribute('material', {color:'white'});
        sendBtn.setAttribute('position', {x:0.4,y:0,z:0});
        sendBtn.setAttribute('text', {width:2,value:'Send',align:'center',color:'black'});
        sendBtn.setAttribute('circles-interactive-object', {type:'scale', click_scale:0.95});
        sendBtn.setAttribute('animation__btnclick', {property:'scale',from:'0.95 0.95 0.95',to:'1.08 1.08 1.08',dur:200,startEvents:'click'});

        let resetBtn = document.createElement('a-entity');
        resetBtn.setAttribute('id', 'resetBtn');
        resetBtn.setAttribute('geometry', {primitive:'plane', height:0.15, width:0.3});
        resetBtn.setAttribute('material', {color:'white'});
        resetBtn.setAttribute('position', {x:-0.4,y:0,z:0});
        resetBtn.setAttribute('text', {width:2,value:'Reset',align:'center',color:'black'});
        resetBtn.setAttribute('circles-interactive-object', {type:'scale', click_scale:0.95});
        resetBtn.setAttribute('animation__btnclick', {property:'scale',from:'0.95 0.95 0.95',to:'1.08 1.08 1.08',dur:200,startEvents:'click'});
        resetBtn.addEventListener('click', ResetMessage);

        comsBtnGrp.appendChild(sendBtn);
        comsBtnGrp.appendChild(resetBtn);
        telegraphElements.appendChild(comsBtnGrp);

        //Input Buttons

        let inputBtnGrp = document.createElement('a-entity');
        inputBtnGrp.setAttribute('id', 'inputButtonsGrp');
        inputBtnGrp.setAttribute('position', {x:0,y:0.3,z:0.6});
        inputBtnGrp.setAttribute('rotation', {x:-15,y:0,z:0});

        let dotBtn = document.createElement('a-entity');
        dotBtn.setAttribute('id', 'dotInputBtn');
        dotBtn.setAttribute('geometry', {primitive:'plane', height:0.2, width:0.2});
        dotBtn.setAttribute('material', {src:'#dotbtn_texture', transparent:true});
        dotBtn.setAttribute('position', {x:-0.3,y:0,z:0});
        dotBtn.setAttribute('circles-interactive-object', {type:'scale', click_scale:0.95, click_sound:'#dot_sfx'});
        dotBtn.setAttribute('animation__btnclick', {property:'scale',from:'0.95 0.95 0.95',to:'1.08 1.08 1.08',dur:200,startEvents:'click'});

        let dashBtn = document.createElement('a-entity');
        dashBtn.setAttribute('id', 'dashInputBtn');
        dashBtn.setAttribute('geometry', {primitive:'plane', height:0.2, width:0.2});
        dashBtn.setAttribute('material', {src:'#dashbtn_texture', transparent:true});
        dashBtn.setAttribute('circles-interactive-object', {type:'scale', click_scale:0.95, click_sound:'#dash_sfx'});
        dashBtn.setAttribute('animation__btnclick', {property:'scale',from:'0.95 0.95 0.95',to:'1.08 1.08 1.08',dur:200,startEvents:'click'});

        let spaceBtn = document.createElement('a-entity');
        spaceBtn.setAttribute('id', 'spaceInputBtn');
        spaceBtn.setAttribute('geometry', {primitive:'plane', height:0.2, width:0.2});
        spaceBtn.setAttribute('material', {src:'#spacebtn_texture', transparent:true});
        spaceBtn.setAttribute('position', {x:0.3,y:0,z:0});
        spaceBtn.setAttribute('circles-interactive-object', {type:'scale', click_scale:0.95});
        spaceBtn.setAttribute('animation__btnclick', {property:'scale',from:'0.95 0.95 0.95',to:'1.08 1.08 1.08',dur:200,startEvents:'click'});

        inputBtnGrp.appendChild(dotBtn);
        inputBtnGrp.appendChild(dashBtn);
        inputBtnGrp.appendChild(spaceBtn);
        telegraphElements.appendChild(inputBtnGrp);

        CONTEXT_AF.el.appendChild(telegraphElements);

        function inputMorse(inputType) {

            let textField = CONTEXT_AF.textField.getAttribute('circles-label').text;

            if (CONTEXT_AF.textField.getAttribute('circles-interactive-visible') == false) {
                CONTEXT_AF.textField.setAttribute('circles-interactive-visible', true);

                textField = '';
            }

            switch(inputType) {
                case MorseInput.dot:
                    textField += '.';
                    break;
                case MorseInput.dash:
                    textField += '-';
                    break;
                case MorseInput.space:
                    if (textField != '') {
                        textField += '/';
                    }
                    else {
                        CONTEXT_AF.textField.setAttribute('circles-interactive-visible', false);
                    }
                    break;
            }

            CONTEXT_AF.textField.setAttribute('circles-label', {text: textField});
        }

        function ResetMessage() {
            if (CONTEXT_AF.textField.getAttribute('circles-interactive-visible') == true) {
                CONTEXT_AF.textField.setAttribute('circles-interactive-visible', false);

                //console.log("MessageReset");
            }
        }

        //connect to web sockets so we can sync the number lock between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.EventName = "telegraph_event";

        CONTEXT_AF.World1Name = "DS3test";
        CONTEXT_AF.World2Name = "TelegraphTest";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            dotBtn.addEventListener('click', function(){SendMorse(MorseInput.dot)});
            dashBtn.addEventListener('click', function(){SendMorse(MorseInput.dash)});
            spaceBtn.addEventListener('click', function(){SendMorse(MorseInput.space)});

            function SendMorse(inputType) {
                inputMorse(inputType);
                CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseInput:inputType, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }

            sendBtn.addEventListener('click', SendReset);
            resetBtn.addEventListener('click', SendReset);

            function SendReset() {
                CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {resetRequest:true, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }

            sendBtn.addEventListener('click', SendMessage);

            function SendMessage() {
                if (CONTEXT_AF.textField.getAttribute('circles-interactive-visible') == true) {
                    CONTEXT_AF.textField.setAttribute('circles-interactive-visible', false);
    
                    let message = CONTEXT_AF.textField.getAttribute('circles-label').text;
                    //console.log(message);
                    CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseMessage:message, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

                    if (CIRCLES.getCirclesWorldName() === CONTEXT_AF.World1Name) {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseMessage:message, room:CIRCLES.getCirclesGroupName(), world:CONTEXT_AF.World2Name});
                    }
                    else {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {morseMessage:message, room:CIRCLES.getCirclesGroupName(), world:CONTEXT_AF.World1Name});
                    }
    
                    CONTEXT_AF.StartMessagePlayback(message);
                }
            }

            //listen for when others sends a morse message
            CONTEXT_AF.socket.on(CONTEXT_AF.EventName, function(data) {

                if (data.world === CIRCLES.getCirclesWorldName()) {

                    if (data.morseInput != null) {
    
                        inputMorse(data.morseInput);
        
                        switch(data.morseInput) {
                            case MorseInput.dot:
                                CONTEXT_AF.dot_sfx.components.sound.playSound();
                                break;
                            case MorseInput.dash:
                                CONTEXT_AF.dash_sfx.components.sound.playSound();
                                break;
                        }
                    }
    
                    if (data.resetRequest == true) {
                        ResetMessage();
                    }
    
                    if (data.morseMessage != null) {
                        CONTEXT_AF.StartMessagePlayback(data.morseMessage);
                    }
                }
            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {curMorseMessage:CONTEXT_AF.textField.getAttribute('circles-label').text, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName() && data.curMorseMessage != null) {
                    CONTEXT_AF.textField.setAttribute('circles-label', {text: data.curMorseMessage});
                    
                    if (data.curMorseMessage != "" && data.curMorseMessage != "label_text") {
                        CONTEXT_AF.textField.setAttribute('circles-interactive-visible', true);
                    } 
                }
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

    tick: function (time, timeDelta) {
        const CONTEXT_AF = this;

        if (CONTEXT_AF.playbackMessg != "") {
            CONTEXT_AF.timeElapsed += timeDelta / 1000;

            if (CONTEXT_AF.timeElapsed > CONTEXT_AF.delay) {
                CONTEXT_AF.timeElapsed = 0;

                switch(CONTEXT_AF.playbackMessg[0]) {
                    case '.':
                        CONTEXT_AF.dot_sfx.components.sound.playSound();
                        CONTEXT_AF.delay = MorseDelay.dot;
                        CONTEXT_AF.ToggleLight(true);
                        //console.log('dot');
                        break;
                    case '-':
                        CONTEXT_AF.dash_sfx.components.sound.playSound();
                        CONTEXT_AF.delay = MorseDelay.dash;
                        CONTEXT_AF.ToggleLight(true);
                        //console.log('dash');
                        break;
                    case '/':
                        CONTEXT_AF.delay = MorseDelay.space;
                        //console.log('space');
                        break;
                }

                CONTEXT_AF.playbackMessg = CONTEXT_AF.playbackMessg.slice(1);

                if (CONTEXT_AF.playbackMessg == "") {
                    CONTEXT_AF.telegraphElements.setAttribute('circles-interactive-visible', 'true');
                }
            }
        }
    },

    StartMessagePlayback: function(message) {
        const CONTEXT_AF = this;

        CONTEXT_AF.playbackMessg = message;

        switch(message[0]) {
            case '.':
                CONTEXT_AF.delay = MorseDelay.dot;
                //console.log('dot');
                break;
            case '-':
                CONTEXT_AF.delay = MorseDelay.dash;
                //console.log('dash');
                break;
        }

        CONTEXT_AF.telegraphElements.setAttribute('circles-interactive-visible', 'false');
    },

    ToggleLight: function(state) {
        const CONTEXT_AF = this;
        if (state == true) {
            CONTEXT_AF.morseLight.setAttribute('material', {emissiveIntensity:1});
        }
        else if (state == false) {
            CONTEXT_AF.morseLight.setAttribute('material', {emissiveIntensity:0});
        }
    },
    
});