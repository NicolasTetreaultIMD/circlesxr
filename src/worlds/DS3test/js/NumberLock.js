//'use strict'
AFRAME.registerComponent('number-lock', {
    schema: {
        nums: {type:'int', default:4},
        code: {type:'int', default:1234},
    },
    multiple:false,
    init: function() {      

        const CONTEXT_AF = this;
        CONTEXT_AF.onUnlock = null;

        CONTEXT_AF.numSlots = [];
        CONTEXT_AF.combination = ""

        console.log(CONTEXT_AF.el.getAttribute('geometry'));
        let objScale = CONTEXT_AF.el.getAttribute('geometry');
        let objWidth = objScale.split(';')[1].split(':')[1];
        let objHeight = objScale.split(';')[2].split(':')[1];
        let objDepth = objScale.split(';')[2].split(':')[1];
        let slotWidth = objWidth / CONTEXT_AF.data.nums;

        for (let i = 0; i < CONTEXT_AF.data.nums; i++) {
            let numSlot = document.createElement('a-entity');
            numSlot.setAttribute('circles-interactive-object', {type:'highlight', click_sound:'#note_c'});
            numSlot.setAttribute('position',{x:(slotWidth * i) + (slotWidth/2) - (objWidth/2),y:0,z:objDepth / 2});
            numSlot.setAttribute('geometry', {primitive:'box', width:slotWidth * (4/5), height:objHeight * (4/5), depth:objHeight * (4/5)});
            numSlot.setAttribute('animation__lock', {property:'rotation', to:(360/9) +' 0 0', dur:500, startEvents:'click'});

            numSlot.addEventListener('animationcomplete__lock', CheckCode);

            CONTEXT_AF.numSlots.push(numSlot);

            CONTEXT_AF.el.appendChild(numSlot);

            CONTEXT_AF.combination = CONTEXT_AF.combination + "1";
        }

        function CheckCode() {
            let toRot = this.getAttribute('rotation').x + (360/9);
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

            if (parseInt(CONTEXT_AF.combination) === CONTEXT_AF.data.code) {
                console.log("Unlocked");
                CONTEXT_AF.numSlots.forEach(numSlot => {
                    numSlot.setAttribute('circles-interactive-object', {enabled: false});
                });
            }
        }
    },

});