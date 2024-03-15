AFRAME.registerComponent('number-lock-ws', {
    schema: {
        nums: {type:'int', default:4},
        code: {type:'int', default:1234},
    },
    init() {
        const CONTEXT_AF = this;
        CONTEXT_AF.onUnlock = null;
        
        CONTEXT_AF.numSlots = [];
        CONTEXT_AF.combination = "";

        CONTEXT_AF.objScale = CONTEXT_AF.el.getAttribute('geometry');
        CONTEXT_AF.objWidth = CONTEXT_AF.objScale.split(';')[1].split(':')[1];
        CONTEXT_AF.objHeight = CONTEXT_AF.objScale.split(';')[2].split(':')[1];
        CONTEXT_AF.objDepth = CONTEXT_AF.objScale.split(';')[2].split(':')[1];
        CONTEXT_AF.slotWidth = CONTEXT_AF.objWidth / CONTEXT_AF.data.nums;

        for (let i = 0; i < CONTEXT_AF.data.nums; i++) {
            let numSlot = document.createElement('a-entity');

            let slotID = CONTEXT_AF.el.getAttribute('id')+'-'+i;
            numSlot.setAttribute('id', slotID);

            numSlot.setAttribute('circles-interactive-object', {type:'highlight'});
            numSlot.setAttribute('class', 'interactive');
            numSlot.setAttribute('position',{x:(CONTEXT_AF.slotWidth * i) + (CONTEXT_AF.slotWidth/2) - (CONTEXT_AF.objWidth/2),y:0,z:CONTEXT_AF.objDepth / 2});
            numSlot.setAttribute('geometry', {primitive:'box', width:CONTEXT_AF.slotWidth * (4/5), height:CONTEXT_AF.objHeight * (4/5), depth:CONTEXT_AF.objHeight * (4/5)});
            numSlot.setAttribute('animation__lock', {property:'rotation', to:(360/10) +' 0 0', dur:500, startEvents:'rotate-slot'});

            numSlot.addEventListener('animationcomplete__lock', UpdateNumSlot);
            CONTEXT_AF.numSlots.push(numSlot);

            numSlot.addEventListener('click', function () {
                numSlot.emit('rotate-slot');
            });


            CONTEXT_AF.el.appendChild(numSlot);

            CONTEXT_AF.combination = CONTEXT_AF.combination + "0";
        }

        function UpdateNumSlot() {
            let toRot = this.getAttribute('rotation').x + (360/10);
            this.setAttribute('animation__lock', {to: toRot + ' 0 0'});

            let newCode = "";

            for (let i = 0; i < CONTEXT_AF.data.nums; i++) {
                if (this == CONTEXT_AF.numSlots[i]) {
                    newCode = newCode + (parseInt(CONTEXT_AF.combination[i]) + 1)%10;
                }
                else {
                    newCode = newCode + parseInt(CONTEXT_AF.combination[i]);
                }
            }
            CONTEXT_AF.combination = newCode;
            //console.log(newCode);

            CONTEXT_AF.CheckCode();
        }

        //connect to web sockets so we can sync the number lock between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.EventName = "numberLock_event";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            CONTEXT_AF.numSlots.forEach(numSlot => {
                numSlot.addEventListener('click', emitSlotChange);
            });

            function emitSlotChange() {
                CONTEXT_AF.turnNumSlot(this.getAttribute('id'));
                CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {rotatedSlot:this.getAttribute('id'), room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }

            //listen for when others makes changes to the numberlock
            CONTEXT_AF.socket.on(CONTEXT_AF.EventName, function(data) {
                CONTEXT_AF.turnNumSlot(data.rotatedSlot);
            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {numberSlotState:CONTEXT_AF.combination, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.setNumSlot(data.numberSlotState );
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
    turnNumSlot : function (numSlotID) {
        const CONTEXT_AF = this;

        if (CONTEXT_AF.el.getAttribute('id') == numSlotID.split('-')[0]) {
            let numSlot = document.querySelector('#' + numSlotID);
            if (numSlot != null) {
                numSlot.emit('rotate-slot');
            }
        }
    },
    setNumSlot : function (state) {
        const CONTEXT_AF = this;
        CONTEXT_AF.combination = state;

        for (let i = 0; i < CONTEXT_AF.data.nums; i++) {
            CONTEXT_AF.numSlots[i].setAttribute('rotation', {x: (360/10) * (parseInt(state[i])), y:0, z:0});
            CONTEXT_AF.numSlots[i].setAttribute('animation__lock', {to: (360/10) * (parseInt(state[i]) + 1) + ' 0 0'});
            CONTEXT_AF.CheckCode();
        }
    },
    CheckCode : function () {
        const CONTEXT_AF = this;
        if (parseInt(CONTEXT_AF.combination) === CONTEXT_AF.data.code) {
            console.log("Unlocked");
            CONTEXT_AF.numSlots.forEach(numSlot => {
                numSlot.setAttribute('circles-interactive-object', {enabled: false});
            });
        }
    }
});