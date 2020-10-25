// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        brush: cc.Node,

        check: {
            default: null,
            type: cc.Prefab         
        },

        apple: {
            default: null,
            type: cc.Prefab         
        },

        arrApple: [cc.Node],
        
        arrow: {
            default: null,
            type: cc.Node         
        },

        tutorial: {
            default: null,
            type: cc.Node
        },

        net1: {
            default: null,
            type: cc.Node
        },

        net2: {
            default: null,
            type: cc.Node
        },

        net3: {
            default: null,
            type: cc.Node
        },

        net4: {
            default: null,
            type: cc.Node
        },


        _appleNode: null,
        _bg_a: null,
        _isGameOver: false,
        nextTutorial: 1,
        nextStep: 1,
    },

    start(){
        this.initEventListener();
        console.log(this.node.children[6]);
        
        // this.node.getComponent("SoundManager").playBackGroundSound();   //play âm thanh
    },

    onLoad () {
        // không hiện fps
        cc.debug.setDisplayStats(false);
        this.arr_tutorial = [{"x":0,"y":140}, {"x":30,"y":100}, {"x":-30,"y":-60}];
        this.arr_c = [{"x":0,"y":140}, {"x":-30,"y":100}, {"x":-50,"y":50}, {"x":-70,"y":0}, {"x":-90,"y":-60}, {"x":-110,"y":-120}, {"x":30,"y":100}, {"x":50,"y":50}, {"x":70,"y":0}, {"x":90,"y":-60}, {"x":110,"y":-120}, {"x":-30,"y":-60}, {"x":30,"y":-60}];
        this.arr_strock = [0, 6, 11];
        // this.checkStrokeOrder(1);
        this.spawnNewApple(this.arr_c);
        this.tutorial.getComponent(cc.Animation).play('net1_A');
    },

    initEventListener () {    
        this.node.on(cc.Node.EventType.MOUSE_MOVE, (event)=>{     
            this.onBeCreateNodeCheckEvent(event.getLocation());      
        },this);  

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{   
            this.onCheckClick(); 
            this.onCheckClickBorder();
            let pos = this.node.convertToNodeSpaceAR(event.getLocation());  //convertToNodeSpaceAR: chuyển tọa độ vào nút
            this.brush.getComponent('Brush').drawTo(pos.x, pos.y);
            this.onBeCreateNodeCheckEvent(pos); 
        },this);

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{     
            this.brush.getComponent('Brush').clear();
        },this);
        
        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{   
            // this.brush.getComponent('Brush').clear();
        },this);
    
    },

    onBeCreateNodeCheckEvent (position) {
        if (!cc.isValid(this.checkNode)) {                                          //cc.isValid: xác định xem giá trị đã chỉ định của đối tượng có hợp lệ hay không
            this.checkNode = cc.instantiate(this.check);                            //khởi tạo
            this.checkNode.zIndex = cc.macro.MAX_ZINDEX;
            this.checkNode.getComponent("ColliderManager")._isCollider = false;     //tạo khả năng va chạm
            this.node.addChild(this.checkNode);                                     //thêm node 
        }
        this.checkNode.opacity = 0;
        this.checkNode.position = this.node.convertToNodeSpaceAR(position);       
    },

    spawnNewApple(arr_c) {
        var i = 0;
        while(arr_c[i] != null){
            newApple = cc.instantiate(this.apple);
            newApple.setPosition(arr_c[i].x, arr_c[i].y);
            newApple.getComponent('Apple').game = this;
            newApple.opacity = 0;
            this.node.addChild(newApple);
            i++;
        }
    },

    onClickButtonGreen(){
        this.color = cc.Color.GREEN;
        this.brush.getComponent('Brush').setBrushColor(this.color);
        this.brush.getComponent('Brush').setBrushLineWidth(50);
    },

    onCheckClick(){
        //this.checkNode.angle = this.checkNode.angle === 0 ? 30 : 0; 
        if(this._appleNode.getComponent("ColliderManager")._isCollider == true){
            this._appleNode.opacity = 0;
            this._appleNode.active = false;
            this._appleNode.getComponent("Apple")._isLive = false;
            // console.log(this._appleNode);
        }
    },

    onCheckClickBorder(){
    //    if(this._bg_a.getComponent("ColliderManager")._isCollider == true){
    //        console.log("Da cham");
    //    }
    },

    onFinishGameEvent(){
        setTimeout(()=>{
            cc.director.loadScene("Test");
        }, 500);
    },

    onClickReload(){
        cc.director.loadScene("Test");
    },

    onClickStop(){

    },
    update(dt){
        //kiểm tra xem người chơi có vẽ ngược hay không
        var checkNext = true;
        if(this._isGameOver === false){
            for(let i = 22; i > 10; i--){
                if(this.node.children[i].active === false){
                    for(let j = 10; j < i; j++){
                        if(this.node.children[j].active === true){
                            checkNext = false;
                            this._isGameOver = true;
                            this.onFinishGameEvent();
                            setTimeout(()=>{
                            }, 1000);
                        }
                    }
                }
            }
        }

        //hiển thị hướng dẫn các nét
        if(this.node.children[15].active === false && this.nextStep === 1 && checkNext === true){
            setTimeout(()=>{
                this.net1.getComponent(cc.Animation).play();
            }, 500);
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                this.tutorial.getComponent(cc.Animation).play('net2_A');
            }, 2000);
            this.nextStep = this.nextStep + 1;
        }
        if(this.node.children[20].active === false && this.nextStep === 2 && checkNext === true){
            setTimeout(()=>{
                this.net2.getComponent(cc.Animation).play();
            }, 500);
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                this.tutorial.getComponent(cc.Animation).play('net3_A');
            }, 2000);
            this.nextStep = this.nextStep + 1;
        }
        //check hoan thanh
        if(this.node.children[22].active === false && this.nextStep == 3){
            setTimeout(()=>{
                this.net3.getComponent(cc.Animation).play();
            }, 500);
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
            }, 1000);
            console.log("game over");
            this.nextStep = this.nextStep + 1;
            setTimeout(()=>{
                cc.director.loadScene("Test");
            }, 2000);
        }
    },
});
