// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // brush: cc.Node,
        draw: cc.Node,

        check: {
            default: null,
            type: cc.Prefab         
        },

        apple: {
            default: null,
            type: cc.Prefab         
        },

        apples: {
            default: [],
            type: cc.Prefab
        },

        tutorial: {
            default: null,
            type: cc.Node
        },

        colliderBorderOut: {
            default: null,
            type: cc.PolygonCollider
        },
        colliderBorderIn: {
            default: null,
            type: cc.PolygonCollider
        },

        tutorialScript: {
            default: null,
            type: cc.Label
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
        _isGameOver: false,
        nextTutorial: 1,
        nextStep: 1,
        touchBorder: false,
    },

    start(){
        this.initEventListener();        
        // this.node.getComponent("SoundManager").playBackGroundSound();   //play âm thanh
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        cc.debug.setDisplayStats(false);
        this.arr_c = [{'x': -14, 'y': 126}, {'x': -20, 'y': 109}, {'x': -26, 'y': 92}, {'x': -32, 'y': 75}, {'x': -38, 'y': 58}, {'x': -45, 'y': 41}, {'x': -51, 'y': 24}, {'x': -57, 'y': 8}, {'x': -63, 'y': -9}, {'x': -69, 'y': -26}, {'x': -75, 'y': -43}, {'x': -82, 'y': -60}, {'x': -89, 'y': -81}, {'x': -96, 'y': -98}, {'x': -102, 'y': -115}, {'x': -108, 'y': -131}, {'x': -111, 'y': -139}, {'x': 20, 'y': 124}, {'x': 26, 'y': 108}, {'x': 31, 'y': 92}, {'x': 37, 'y': 76}, {'x': 43, 'y': 60}, {'x': 49, 'y': 44}, {'x': 54, 'y': 28}, {'x': 60, 'y': 11}, {'x': 66, 'y': -5}, {'x': 72, 'y': -21}, {'x': 77, 'y': -37}, {'x': 83, 'y': -53}, {'x': 89, 'y': -69}, {'x': 95, 'y': -85}, {'x': 100, 'y': -102}, {'x': 106, 'y': -118}, {'x': 111, 'y': -133}, {'x': -30, 'y': -68}, {'x': -20, 'y': -68}, {'x': -10, 'y': -68}, {'x': 0, 'y': -68}, {'x': 10, 'y': -68}, {'x': 20, 'y': -68}, {'x': 30, 'y': -68}];
        this.spawnNewApple(this.arr_c);
        this.tutorial.getComponent(cc.Animation).play('net1_A');
        this.tutorialScript.string = 'Hãy vẽ theo hướng mũi tên, chú ý không vẽ ra ngoài nhé!';
        this.onCheckTouchBorder();

    },

    initEventListener () {    
        this.node.on(cc.Node.EventType.MOUSE_MOVE, (event)=>{     
            this.onBeCreateNodeCheckEvent(event.getLocation());      
        },this);  

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{     
            //this.brush.getComponent('Brush').clear();
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{   
            this.onCheckClick(); 
            // var pos = this.node.convertToNodeSpaceAR(event.getLocation());  //convertToNodeSpaceAR: chuyển tọa độ vào nút
            //this.brush.getComponent('Brush').drawTo(pos.x, pos.y);
            this.onBeCreateNodeCheckEvent(event.getLocation()); 
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{  

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
            this.apples[i] = newApple;                  //them vo mang
            // this.apples[i].opacity = 0; 
            this.node.addChild(newApple);
            i++;
        }
    },

    onCheckClick(){
        if(this._appleNode.getComponent("ColliderManager")._isCollider == true){
            this._appleNode.opacity = 0;
            this._appleNode.active = false;
            this._appleNode.getComponent("Apple")._isLive = false;
            // console.log(this._appleNode);
        }
    },

    onFinishGameEvent(){ 
        setTimeout(()=>{
            cc.find("Canvas/Main game").active = false;
            cc.find("Canvas/Game over").active = true; 
        }, 2000);   
    },

    onClickReplay(){
        cc.find("Canvas/Main game").active = true;
        cc.find("Canvas/Game over").active = false;    
        cc.director.loadScene("DrawLetter");
    },

    onCheckTouchBorder(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (touch, event) {
            var touchLoc = touch.getLocation();
            if (cc.Intersection.pointInPolygon(touchLoc, this.colliderBorderOut.world.points) || cc.Intersection.pointInPolygon(touchLoc, this.colliderBorderIn.world.points)) {
                this.touchBorder = true;
                this.tutorialScript.string = 'Ôi không bạn đã vẽ ra ngoài, hãy vẽ lại nhé!';
                console.log("hit");
                checkNext = false;
                this.onFinishGameEvent();
            }
        }, this);
    },
    
    onCLickExit(){

    },

    onClickStop(){

    },
    
    update(dt){
        //kiểm tra xem người chơi có vẽ ngược hay không
        var checkNext = true;
        if(this._isGameOver === false){
            for(let i = 40; i >= 0; i--){
                if(this.apples[i].active === false){
                    for(let j = 0; j < i; j++){
                        if(this.apples[j].active === true){
                            checkNext = false;
                            this._isGameOver = true;
                            this.tutorialScript.string = 'Bạn vẽ sai mất rồi vẽ lại đi nhé!';
                            this.onFinishGameEvent();
                        }
                    }
                }
            }
        }
        //hiển thị hướng dẫn các nét
        if(this.apples[16].active === false && this.nextStep === 1 && checkNext === true){
            setTimeout(()=>{
                // this.brush.getComponent('Brush').clear();
                this.net1.getComponent(cc.Animation).play();
                this.tutorialScript.string = 'Bạn vẽ đúng rồi vẽ nét thứ 2 nhé!';
            }, 500);
            setTimeout(()=>{
                this.tutorial.getComponent(cc.Animation).play('net2_A');
            }, 1500);
            this.nextStep = this.nextStep + 1;
        }
        if(this.apples[33].active === false && this.nextStep === 2 && checkNext === true){
            setTimeout(()=>{
                // this.brush.getComponent('Brush').clear();
                this.net2.getComponent(cc.Animation).play();
                this.tutorialScript.string = 'Bạn vẽ đúng rồi vẽ nét cuối cùng nhé!';
            }, 500);
            setTimeout(()=>{
                this.tutorial.getComponent(cc.Animation).play('net3_A');
            }, 1500);
            this.nextStep = this.nextStep + 1;
        }
        //check hoan thanh
        if(this.apples[40].active === false && this.nextStep == 3 && checkNext === true){
            setTimeout(()=>{
                // this.brush.getComponent('Brush').clear();
                this.net3.getComponent(cc.Animation).play();
            }, 500);
            setTimeout(()=>{
                this.tutorialScript.string = 'Bạn đã hoàn thành, chúc mừng!';
            }, 1000);
            console.log("game over");
            this.nextStep = this.nextStep + 1;
            this.onFinishGameEvent();
        }
    },
});
