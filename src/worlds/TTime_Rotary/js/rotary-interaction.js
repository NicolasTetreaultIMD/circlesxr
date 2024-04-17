//Manages the telegraph interactions
AFRAME.registerComponent('rotary-interaction', {
    schema: {
        offset:{type:'float', default:0.600},
        amgledif:{type:'float', default:25},
        startangle:{type:'float', default:45},
        scale:{type:'float', default:1},
        code:{type:'string', default:12345},
        enabled:{type:'boolean', default:true},
    },
    init() {
        const CONTEXT_AF = this;

        CONTEXT_AF.rotaryWheel = document.querySelector('#rotary-wheel');
        CONTEXT_AF.playbackMessg = "";
        CONTEXT_AF.timeElapsed = 0;
        CONTEXT_AF.codeInputed = false;

        CONTEXT_AF.rotaryWheel.addEventListener('animationcomplete__returnWheel', function(){ if (!CONTEXT_AF.codeInputed) CONTEXT_AF.inputBtnGrp.setAttribute('circles-interactive-visible', 'true');});

        //animations for rotary
        for (let i = 0; i < 10; i++) {
            CONTEXT_AF.rotaryWheel.setAttribute('animation__rotateWheel' + i, {'property': 'rotation','from':{x:0, y:0, z:0}, 'to': {x: 0, y: 0, z: -(CONTEXT_AF.data.amgledif * (i + 1) + CONTEXT_AF.data.startangle)}, 'dur':1000, 'startEvents': 'startWheelAnim' + i, 'autoplay':false});
        }

        CONTEXT_AF.rotaryWheel.setAttribute('animation__returnWheel', {'property': 'rotation', 'to':{x:0,y:0,z:0}, 'dur':1000, 'startEvents': 'animationcomplete__rotateWheel0,animationcomplete__rotateWheel1,animationcomplete__rotateWheel2,animationcomplete__rotateWheel3,animationcomplete__rotateWheel4,animationcomplete__rotateWheel5,animationcomplete__rotateWheel6,animationcomplete__rotateWheel7,animationcomplete__rotateWheel8,animationcomplete__rotateWheel9'});
        
        //Creates the rotary phone components

        //Rotary Display
        let rotaryDisplay = document.createElement('a-entity');
        rotaryDisplay.setAttribute('id','rotaryDisplay');
        rotaryDisplay.setAttribute('circles-label', {text:'', arrow_visible:false, offset:'0 1 0'});
        rotaryDisplay.setAttribute('circles-interactive-visible', 'false');
        
        CONTEXT_AF.el.appendChild(rotaryDisplay);
        CONTEXT_AF.textField = rotaryDisplay;

        //Container for the other elements that need to be toggle off
        console.log(CONTEXT_AF.data.scale);

        let rotaryElements = document.createElement('a-entity');
        rotaryElements.setAttribute('id', 'rotaryElements');
        rotaryElements.setAttribute('circles-interactive-visible', CONTEXT_AF.data.enabled);
        rotaryElements.setAttribute('rotation', {x:0,y:CONTEXT_AF.data.angle,z:0});
        rotaryElements.setAttribute('scale', {x:CONTEXT_AF.data.scale,y:CONTEXT_AF.data.scale,z:CONTEXT_AF.data.scale});
        
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
        resetBtn.addEventListener('click', function() {CONTEXT_AF.ResetText()});

        comsBtnGrp.appendChild(resetBtn);
        rotaryElements.appendChild(comsBtnGrp);

        //Input Buttons

        let inputBtnGrp = document.createElement('a-entity');
        inputBtnGrp.setAttribute('id', 'inputButtonsGrp');
        inputBtnGrp.setAttribute('circles-interactive-visible', CONTEXT_AF.data.enabled);
        inputBtnGrp.setAttribute('position', {x:0,y:0,z:0});
        inputBtnGrp.setAttribute('rotation', {x:0,y:0,z:0});

        CONTEXT_AF.rotaryBtns = [];

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
            rotaryBtn.addEventListener('click', function(){CONTEXT_AF.ReceiveInput(i)});

            CONTEXT_AF.rotaryBtns.push(rotaryBtn);

            btnContainer.appendChild(rotaryBtn);
            inputBtnGrp.appendChild(btnContainer);

        }

        CONTEXT_AF.inputBtnGrp = inputBtnGrp;
        CONTEXT_AF.rotaryWheel.appendChild(inputBtnGrp);

        CONTEXT_AF.el.appendChild(rotaryElements);

        CONTEXT_AF.ReceiveInput = function(val) {
            CONTEXT_AF.InputRotary(val);
            CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {rotaryInput:val, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
        }

        CONTEXT_AF.InputRotary = function (val) {

            CONTEXT_AF.inputBtnGrp.setAttribute('circles-interactive-visible', 'false');

            CONTEXT_AF.rotaryWheel.setAttribute('animation__rotateWheel' + val, {'property': 'rotation','from':{x:0, y:0, z:0}, 'to': {x: 0, y: 0, z: -(CONTEXT_AF.data.amgledif * (val + 1) + CONTEXT_AF.data.startangle)}, 'dur':1000, 'startEvents': 'startWheelAnim' + val, 'autoplay':false});
            CONTEXT_AF.rotaryWheel.setAttribute('animation__returnWheel', {'property': 'rotation', 'to':{x:0,y:0,z:0}, 'dur':1000, 'startEvents': 'animationcomplete__rotateWheel0,animationcomplete__rotateWheel1,animationcomplete__rotateWheel2,animationcomplete__rotateWheel3,animationcomplete__rotateWheel4,animationcomplete__rotateWheel5,animationcomplete__rotateWheel6,animationcomplete__rotateWheel7,animationcomplete__rotateWheel8,animationcomplete__rotateWheel9'});

            CONTEXT_AF.rotaryWheel.emit('startWheelAnim' + val);

            //Current message string before adding anything
            let textField = CONTEXT_AF.textField.getAttribute('circles-label').text;

            //If the text field is hidden then start the string over and make the field visible
            if (CONTEXT_AF.textField.getAttribute('circles-interactive-visible') == false) {
                CONTEXT_AF.textField.setAttribute('circles-interactive-visible', true);

                textField = '';
            }

            textField += val;

            //Set the text field with the message with the new number
            CONTEXT_AF.textField.setAttribute('circles-label', {text: textField});

            CONTEXT_AF.VerifyCode();
        }

        CONTEXT_AF.VerifyCode = function() {
            let textField = CONTEXT_AF.textField.getAttribute('circles-label').text;

            if (textField.length == CONTEXT_AF.data.code.toString().length) {
                if (textField == CONTEXT_AF.data.code.toString()) {
                    console.log("CORRECT!");
                    CONTEXT_AF.CreateConnection();

                    if (CIRCLES.getCirclesWorldName() === CONTEXT_AF.World1Name) {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {createConnection:true, room:CONTEXT_AF.Group2Name, world:CONTEXT_AF.World2Name});
                    }
                    else {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {createConnection:true, room:CONTEXT_AF.Group1Name, world:CONTEXT_AF.World1Name});
                    }
                }
                else {
                    console.log("INCORRECT!");
                    CONTEXT_AF.ResetText();
                }
            }
        }

        CONTEXT_AF.CreateConnection = function() {
            CONTEXT_AF.codeInputed = true;
            CONTEXT_AF.rotaryElements.setAttribute('circles-interactive-visible', false);
            CONTEXT_AF.textField.setAttribute('circles-label', {text: "You are now allowed to talk with the other team"});
        }

        CONTEXT_AF.ResetText = function() {
            CONTEXT_AF.textField.setAttribute('circles-label', {text: ''});
            CONTEXT_AF.textField.setAttribute('circles-interactive-visible', false);
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

            //Add events listeners for the reset of the text field
            resetBtn.addEventListener('click', SendReset);

            //Emits an event to others in the room so everyone has their text field reset 
            function SendReset() {
                CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {resetRequest:true, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }

            CONTEXT_AF.socket.on(CONTEXT_AF.EventName, function(data) {
                //If the event emited is meant for current world
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    //If the data has the morse input
                    if (data.rotaryInput != null) {
                        CONTEXT_AF.InputRotary(data.rotaryInput);
                    }
    
                    //If the data has the reset request
                    if (data.resetRequest == true) {
                        CONTEXT_AF.ResetText();
                    }
    
                    //If the data has the full message
                    if (data.createConnection == true) {
                        CONTEXT_AF.CreateConnection();
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
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {curRotaryCode:CONTEXT_AF.textField.getAttribute('circles-label').text, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName() && data.curRotaryCode != null) {
                    if (data.curRotaryCode != "" && data.curRotaryCode != "label_text") {
                        CONTEXT_AF.textField.setAttribute('circles-label', {text: data.curRotaryCode});
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

    //Used to play the morse message
    tick: function (time, timeDelta) {
        const CONTEXT_AF = this;
    },
    
});