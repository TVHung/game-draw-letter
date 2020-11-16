// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        currentTime: 0,
        timeRemaining: 0,
        timer: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    gameTimer(){
        var times = 0; 
        this.schedule(()=> {    
            if (!this.gameTimer) {
                this.gameTimer = cc.instantiate(this.node);
                this.node.addChild(this.gameTimer);j 
            }
            times++;
            console.log(times);
        }, 1, 10);  //1: mỗi giây 1 lần, 3 là repeat
    },

    timerGame(){
        this.callback = function () {
        if (this.currentTime <= 0) {
            this.unschedule(this.callback);
        }
            this.currentTime--;
                log(this.currentTime);
                this.Time.string = this.currentTime.toString();
            // this.Bar_Sprite.fillRange = this.currentTime/this.timeRemaining;
            }
        this.schedule(this.callback,1);
},
    
    update (dt) {
    },
});
