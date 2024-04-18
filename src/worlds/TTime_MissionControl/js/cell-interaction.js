const CellState = {
    subset: 0,
    character: 1
}

//Manages the Cell Phone interactions
AFRAME.registerComponent('cell-interaction', {
    schema: {
        angle:{type:'int', default:0},
        scale:{type:'float', default:1},
    },
    init() {
        const CONTEXT_AF = this;

        CONTEXT_AF.senderMsg = "";
        CONTEXT_AF.receiverMsg = "";
        CONTEXT_AF.lastInpt = -1;
        CONTEXT_AF.inptState = CellState.subset;
        CONTEXT_AF.cellPickedUp = false;

        CONTEXT_AF.charList = [[],['A', 'B', 'C'],['D','E','F'],['G','H','I'],['J','K','L'],['M','N','O'],['P','Q','R','S'],['T','U','V'],['W','X','Y','Z']];

        CONTEXT_AF.el.addEventListener('click',function() {
            //CONTEXT_AF.el.setAttribute('geometry', {depth:0.1, height:0.1});
        });

        CONTEXT_AF.el.addEventListener('animationcomplete__cpo_position', function() {
            CONTEXT_AF.cellPickedUp = !CONTEXT_AF.cellPickedUp;
            if (CONTEXT_AF.cellPickedUp) {
                CONTEXT_AF.el.setAttribute('geometry', {depth:0.1, height:0.1});
            }
            else if (!CONTEXT_AF.cellPickedUp) {
                CONTEXT_AF.el.setAttribute('geometry', {depth:1.450, height:1.880});
            }
        });

        //Creates the Cell Phone components

        //Container for the other elements

        let cellElements = document.createElement('a-entity');
        cellElements.setAttribute('id', 'cellElements');
        cellElements.setAttribute('rotation', {x:-90,y:CONTEXT_AF.data.angle,z:0});
        cellElements.setAttribute('scale', {x:CONTEXT_AF.data.scale,y:CONTEXT_AF.data.scale,z:CONTEXT_AF.data.scale});
        
        CONTEXT_AF.cellElements = cellElements;

        //Sound elements
        CONTEXT_AF.btnPress_sfx = document.createElement('a-entity');
        CONTEXT_AF.btnPress_sfx.setAttribute('sound', {src:'#btnPress_sfx'});

        CONTEXT_AF.textNotif_sfx = document.createElement('a-entity');
        CONTEXT_AF.textNotif_sfx.setAttribute('sound', {src:'#textNotif_sfx'});

        cellElements.appendChild(CONTEXT_AF.btnPress_sfx);
        cellElements.appendChild(CONTEXT_AF.textNotif_sfx);

        //Cell Display
        let celInptDisplay = document.createElement('a-entity');
        celInptDisplay.setAttribute('id','celInptDisplay');
        celInptDisplay.setAttribute('position', {x:0,y:-0.3,z:0});
        celInptDisplay.setAttribute('circles-label', {text:'', arrow_visible:false, offset:'0 1 0'});
        celInptDisplay.setAttribute('circles-interactive-visible', 'false');
        
        cellElements.appendChild(celInptDisplay);
        CONTEXT_AF.celInptDisplay = celInptDisplay;

        //Display for the Cell Phone Screen

        let cellDisplayScreen = document.createElement('a-entity');
        cellDisplayScreen.setAttribute('id', 'cellDisplayScreenCont');
        cellDisplayScreen.setAttribute('position', {x:0,y:-0.61,z:0.6});
        cellDisplayScreen.setAttribute('rotation', {x:90, y:0, z:0});

        let senderText = document.createElement('a-entity');
        senderText.setAttribute('position', {x:-0.391, y:-0.008, z:0.037});
        senderText.setAttribute('text', {align: 'right', value: '', color:'blue'});

        let receiverText = document.createElement('a-entity');
        receiverText.setAttribute('position', {x:0.391, y:-0.008, z:0.037});
        receiverText.setAttribute('text', {align: 'left', value: '', color:'green'});

        cellDisplayScreen.appendChild(senderText);
        cellDisplayScreen.appendChild(receiverText);



        let charSelectionDisplay = document.createElement('a-entity');
        charSelectionDisplay.setAttribute('id', 'charSelectionContainer');
        charSelectionDisplay.setAttribute('position', {x:0,y:-0.05,z:0.039});
        charSelectionDisplay.setAttribute('circles-interactive-visible', 'false');

        let charSelectionBG = document.createElement('a-entity');
        charSelectionBG.setAttribute('position', {x:0,y:0.01,z:0});
        charSelectionBG.setAttribute('geometry', {primitive:'plane', width:0.4, height: 0.08});
        charSelectionBG.setAttribute('material', {opacity:0.8, color:'black'});

        let charSelection = document.createElement('a-entity');
        charSelection.setAttribute('position', {x:0, y:0.01, z:0});
        charSelection.setAttribute('text', {align: 'center', value: '1-A | 2-B | 3-C | 4-D'});

        charSelectionDisplay.appendChild(charSelectionBG);
        charSelectionDisplay.appendChild(charSelection);
        cellDisplayScreen.appendChild(charSelectionDisplay);
        cellElements.appendChild(cellDisplayScreen);


        //Buttons
        
        let comsBtnGrp = document.createElement('a-entity');
        comsBtnGrp.setAttribute('id', 'communicationButtonsGrp');
        comsBtnGrp.setAttribute('position', {x:0,y:-0.6,z:0.4});
        comsBtnGrp.setAttribute('rotation', {x:0,y:0,z:0});

        for (let x = 0; x < 4; x++) {
            if (x == 3) {
                let numBtn = document.createElement('a-entity');
                numBtn.setAttribute('id', 'numBtn0');
                numBtn.setAttribute('gltf-model', '#cellBtn'+ 0 +'-gltf');
                numBtn.setAttribute('scale', {x:30, y:30, z:30});
                //numBtn.setAttribute('geometry', {primitive:'cylinder', radius:0.05, height:0.03});
                numBtn.setAttribute('position', {x:0,y:0,z:-0.05 * x});
                numBtn.setAttribute('rotation', {x:180,y:0,z:0});
                numBtn.setAttribute('circles-interactive-object', {type:'highlight', click_sound:'#btnPress_sfx'});
                numBtn.setAttribute('animation__btnclick', {property:'position',from:'0 0.01 ' + (-0.05 * x),to:'0 0 ' + (-0.05 * x),dur:200,startEvents:'click'});
                numBtn.addEventListener('click', function() {receiveInpt(0);});
                comsBtnGrp.appendChild(numBtn);
            }

            else {

                for (let y = 0; y < 3; y++) {
                    let numBtn = document.createElement('a-entity');
                    numBtn.setAttribute('id', 'numBtn' + ((x*3) + y + 1));
                    numBtn.setAttribute('gltf-model', '#cellBtn'+ ((x*3) + y + 1) +'-gltf');
                    numBtn.setAttribute('scale', {x:30, y:30, z:30});
                    //numBtn.setAttribute('geometry', {primitive:'cylinder', radius:0.05, height:0.03});
                    numBtn.setAttribute('position', {x:-0.088 + (0.088 * y),y:0,z:-0.05 * x});
                    numBtn.setAttribute('rotation', {x:180,y:0,z:0});
                    numBtn.setAttribute('circles-interactive-object', {type:'highlight', click_sound:'#btnPress_sfx'});
                    numBtn.setAttribute('animation__btnclick', {property:'position',from: (-0.088 + (0.088 * y)) + ' 0.01 ' + (-0.05 * x),to:(-0.088 + (0.088 * y)) + ' 0 ' + (-0.05 * x),dur:200,startEvents:'click'});
                    numBtn.addEventListener('click', function() {receiveInpt((x*3) + y + 1);});
    
                    comsBtnGrp.appendChild(numBtn);
                }
            }

        }

        let sendBtn = document.createElement('a-entity');
        sendBtn.setAttribute('id', 'sendBtn');
        sendBtn.setAttribute('gltf-model', '#cellBtnSND-gltf');
        sendBtn.setAttribute('scale', {x:30, y:30, z:30});
        //sendBtn.setAttribute('geometry', {primitive:'cylinder', radius:0.05, height:0.03});
        //sendBtn.setAttribute('material', {color:'red'});
        sendBtn.setAttribute('position', {x:0.089,y:0,z:-0.215});
        sendBtn.setAttribute('rotation', {x:180,y:0,z:0});
        sendBtn.setAttribute('circles-interactive-object', {type:'highlight', click_sound:'#btnPress_sfx'});
        sendBtn.setAttribute('animation__btnclick', {property:'position',from:'0.089 0.01 -0.215', to:'0.089 0 -0.215',dur:200,startEvents:'click'});

        let resetBtn = document.createElement('a-entity');
        resetBtn.setAttribute('id', 'resetBtn');
        resetBtn.setAttribute('gltf-model', '#cellBtnCLR-gltf');
        resetBtn.setAttribute('scale', {x:30, y:30, z:30});
        //resetBtn.setAttribute('geometry', {primitive:'cylinder', radius:0.05, height:0.03});
        //.setAttribute('material', {color:'white'});
        resetBtn.setAttribute('position', {x:0.035,y:0,z:-0.215});
        resetBtn.setAttribute('rotation', {x:180,y:0,z:0});
        resetBtn.setAttribute('circles-interactive-object', {type:'highlight', click_sound:'#btnPress_sfx'});
        resetBtn.setAttribute('animation__btnclick', {property:'position',from:'0.035 0.01 -0.215',to:'0.035 0 -0.215',dur:200,startEvents:'click'});

        comsBtnGrp.appendChild(sendBtn);
        comsBtnGrp.appendChild(resetBtn);
        cellElements.appendChild(comsBtnGrp);

        CONTEXT_AF.el.appendChild(cellElements);

        function receiveInpt(inputBtn) {
            inputCell(inputBtn);
            CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {cellInput:inputBtn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
        }

        function DisplayCharSelection(inputBtn) {
            charSelectionDisplay.setAttribute('circles-interactive-visible', 'true');

            let selectionString = "";
            let counter = 1;
            CONTEXT_AF.charList[inputBtn - 1].forEach(char => {
                if (counter != 1) {
                    selectionString += " | ";
                }

                selectionString += counter.toString() + "-" + char;
                counter++;
            });

            charSelection.setAttribute('text', {value: selectionString});
        }

        //Manage the received input
        function inputCell(inputBtn) {

            if (CONTEXT_AF.inptState == CellState.subset && inputBtn != 0 && inputBtn != 1) {
                CONTEXT_AF.lastInpt = inputBtn;

                DisplayCharSelection(inputBtn);

                CONTEXT_AF.inptState = CellState.character;
            }

            else if (CONTEXT_AF.inptState == CellState.character || (inputBtn == 0 && CONTEXT_AF.inptState == CellState.subset)) {

                //Current message string before adding anything
                let textField = CONTEXT_AF.celInptDisplay.getAttribute('circles-label').text;
    
                //If the text field is hidden then start the string over and make the field visible
                if (CONTEXT_AF.celInptDisplay.getAttribute('circles-interactive-visible') == false) {
                    textField = '';
                }
    
                if (inputBtn == 0) {
                    textField += " ";
                }
                else {
                    let inputChar = GetCharInpt(inputBtn);
                    if (inputChar == null) {
                        return;
                    }
                    textField += GetCharInpt(inputBtn);
                }
    
                charSelectionDisplay.setAttribute('circles-interactive-visible', 'false');
                CONTEXT_AF.celInptDisplay.setAttribute('circles-interactive-visible', true);
                //Set the text field with the message with the new character
                CONTEXT_AF.celInptDisplay.setAttribute('circles-label', {text: textField});

                CONTEXT_AF.inptState = CellState.subset;
            }

        }

        function GetCharInpt(inputBtn) {
            return CONTEXT_AF.charList[CONTEXT_AF.lastInpt - 1][inputBtn - 1];
        }

        //Hides the text field to reste the morse code
        //No need to actualy reset the string since it will be reset in the next inputMorse()
        function ResetMessage() {
            if (CONTEXT_AF.celInptDisplay.getAttribute('circles-interactive-visible') == true) {
                CONTEXT_AF.celInptDisplay.setAttribute('circles-interactive-visible', false);

                CONTEXT_AF.celInptDisplay.setAttribute('circles-label', {text: ""});
            }
        }

        function ReceiveMessage(role, msg) {
            CONTEXT_AF.textNotif_sfx.components.sound.playSound();

            if (role == "Sender") {
                CONTEXT_AF.senderMsg = msg;
                CONTEXT_AF.receiverMsg = "";
            }
            else if (role == "Receiver") {
                CONTEXT_AF.senderMsg = "";
                CONTEXT_AF.receiverMsg = msg;
            }

            senderText.setAttribute('text', {value: CONTEXT_AF.senderMsg});
            receiverText.setAttribute('text', {value: CONTEXT_AF.receiverMsg});
        }

        //connect to web sockets so we can sync the number lock between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.EventName = "cell_event";

        CONTEXT_AF.World1Name = "TTime_MissionControl";
        CONTEXT_AF.World2Name = "TTime_Cell";

        CONTEXT_AF.Group1Name = "missionControl";
        CONTEXT_AF.Group2Name = "timeTraveler";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //Add events listeners for the reset of the text field
            sendBtn.addEventListener('click', SendMessage);
            resetBtn.addEventListener('click', SendReset);

            //Emits an event to others in the room so everyone has their text field reset
            function SendReset() {
                CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {resetRequest:true, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                ResetMessage();
            }

            function SendMessage() {
                //If the text field is not null
                if (CONTEXT_AF.celInptDisplay.getAttribute('circles-interactive-visible') == true) {
    
                    //Save the message in the text field
                    let message = CONTEXT_AF.celInptDisplay.getAttribute('circles-label').text;
                    //console.log(message);
                    //Emit the message to other users in the same world
                    CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {cellMessage:message, role:'Sender', resetRequest:true, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

                    //Emit the message to users in the specified other world
                    if (CIRCLES.getCirclesWorldName() === CONTEXT_AF.World1Name) {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {cellMessage:message, role:'Receiver', room:CONTEXT_AF.Group2Name, world:CONTEXT_AF.World2Name});
                    }
                    else if (CIRCLES.getCirclesWorldName() === CONTEXT_AF.World2Name) {
                        CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {cellMessage:message, role:'Receiver', room:CONTEXT_AF.Group1Name, world:CONTEXT_AF.World1Name});
                    }

                    ReceiveMessage("Sender", message);
                }

                ResetMessage();
            }

            //listen for when others sends a morse message
            CONTEXT_AF.socket.on(CONTEXT_AF.EventName, function(data) {

                //If the event emited is meant for current world
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    if (data.cellInput != null) {
                        inputCell(data.cellInput);
                        CONTEXT_AF.btnPress_sfx.components.sound.playSound();
                    }
    
                    //If the data has the reset request
                    if (data.resetRequest == true) {
                        ResetMessage();
                    }
    
                    //If the data has the full message
                    if (data.cellMessage != null) {
                        ReceiveMessage(data.role, data.cellMessage);
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
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {curCellMessage:CONTEXT_AF.celInptDisplay.getAttribute('circles-label').text, senderMsg:CONTEXT_AF.senderMsg, receiverMsg:CONTEXT_AF.receiverMsg, lastInpt: CONTEXT_AF.lastInpt, curState: CONTEXT_AF.inptState, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    if (data.curCellMessage != null) {

                        CONTEXT_AF.celInptDisplay.setAttribute('circles-label', {text: data.curCellMessage});
                        
                        if (data.curCellMessage != "" && data.curCellMessage != "label_text") {
                            CONTEXT_AF.celInptDisplay.setAttribute('circles-interactive-visible', true);
                        } 
                    }

                    if (data.lastInpt != null) {
                        CONTEXT_AF.lastInpt = data.lastInpt;
                    }

                    if (data.curState != null) {
                        CONTEXT_AF.inptState = data.curState;

                        if (CONTEXT_AF.inptState == CellState.character) {
                            DisplayCharSelection(CONTEXT_AF.lastInpt);
                        }
                    }

                    if (data.senderMsg != "") {
                        ReceiveMessage("Sender", data.senderMsg);
                    }
                    if (data.receiverMsg != "") {
                        ReceiveMessage("Receiver", data.receiverMsg);
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
    
});