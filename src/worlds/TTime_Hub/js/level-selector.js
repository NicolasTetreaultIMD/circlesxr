const Artefacts = {
    telegraph: 0,
    rotary: 1,
    cell: 2
}

let curArtefact = Artefacts.telegraph;

function UpdatePortals() {
    switch(curArtefact) {
        case Artefacts.telegraph:
            document.querySelector('#currentArtefactTxt').setAttribute('text', {value:'Currently Targeted Artefact:\n\n Telegraph'});

            document.querySelector('#TimeTraveler-Group').setAttribute('circles-portal', {link_url:"/w/TTime_Telegraph?group=timeTraveler&hub_state=" + hubStateStr});
            document.querySelector('#MissionControl-Group').setAttribute('circles-portal', {link_url:"/w/TTime_MissionControl?group=missionControl&artefact=telegraph&hub_state=" + hubStateStr});
            break;
        
        case Artefacts.rotary:
            document.querySelector('#currentArtefactTxt').setAttribute('text', {value:'Currently Targeted Artefact:\n\n Rotary Phone'});

            document.querySelector('#TimeTraveler-Group').setAttribute('circles-portal', {link_url:"/w/TTime_Rotary?group=timeTraveler&hub_state=" + hubStateStr});
            document.querySelector('#MissionControl-Group').setAttribute('circles-portal', {link_url:"/w/TTime_MissionControl?group=missionControl&artefact=rotary&hub_state=" + hubStateStr});
            break;
        
        case Artefacts.cell:
            document.querySelector('#currentArtefactTxt').setAttribute('text', {value:'Currently Targeted Artefact:\n\n Cell Phone'});

            document.querySelector('#TimeTraveler-Group').setAttribute('circles-portal', {link_url:"/w/TTime_Cell?group=timeTraveler&hub_state=" + hubStateStr});
            document.querySelector('#MissionControl-Group').setAttribute('circles-portal', {link_url:"/w/TTime_MissionControl?group=missionControl&artefact=cell&hub_state=" + hubStateStr});
            break;
    }
}

document.querySelector('#btnTelgraph').addEventListener('click', function() {
    curArtefact = Artefacts.telegraph;
    UpdatePortals();

    socket.emit(EventName, {curentArtefact:curArtefact, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
});

document.querySelector('#btnRotary').addEventListener('click', function() {
    curArtefact = Artefacts.rotary;
    UpdatePortals();

    socket.emit(EventName, {curentArtefact:curArtefact, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
});

document.querySelector('#btnCell').addEventListener('click', function() {
    curArtefact = Artefacts.cell;
    UpdatePortals();

    socket.emit(EventName, {curentArtefact:curArtefact, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
});

socket     = null;
connected  = false;
EventName = "hub_event";

function createNetworkingSystem () {
    socket = CIRCLES.getCirclesWebsocket();
    connected = true;
    console.warn("messaging system connected at socket: " + socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());
    
    socket.on(EventName, function(data) {
        if (data.curentArtefact != null) {
            curArtefact = data.curentArtefact;
            UpdatePortals();
        }
    });
    //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
    setTimeout(function() {
        socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }, THREE.MathUtils.randInt(0,1200));
    //if someone else requests our sync data, we send it.
    socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
        //if the same world as the one requesting
        if (data.world === CIRCLES.getCirclesWorldName()) {
            socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {curentArtefact: curArtefact, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
        }
    });
    //receiving sync data from others (assuming all others is the same for now)
    socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
        if (data.curentArtefact != null) {
            curArtefact = data.curentArtefact;
            UpdatePortals();
        }
    });
};
//check if circle networking is ready. If not, add an eent to listen for when it is ...
if (CIRCLES.isCirclesWebsocketReady()) {
    createNetworkingSystem();
}
else {
    const wsReadyFunc = function() {
        createNetworkingSystem();
        document.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    };
    document.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
}