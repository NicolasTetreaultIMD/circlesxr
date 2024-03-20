AFRAME.registerComponent('end-level', {
    schema: {
    },
    init() {
        const CONTEXT_AF = this;

        //connect to web sockets so we can sync the number lock between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.EventName = "endRoom_event";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            let btn = document.querySelector('#btn');
            if (btn != null) {
                document.querySelector('#btn').addEventListener('click', emitEndLevel);
            }

            function enablePortal() {
                document.querySelector('#Hub-clear').setAttribute('position', {x:-2.729, y:1, z:-1.752});
            }

            function emitEndLevel() {
                console.log("END");
                enablePortal();
                CONTEXT_AF.socket.emit(CONTEXT_AF.EventName, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }

            //listen for when others makes changes to the numberlock
            CONTEXT_AF.socket.on(CONTEXT_AF.EventName, function(data) {
                enablePortal();
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