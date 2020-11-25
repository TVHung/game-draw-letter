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

        paint: cc.Node,

        mask: cc.Mask,

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

        arrCollider: {
            default: [],
            type: cc.PolygonCollider
        },

        tutorialScript: {
            default: null,
            type: cc.Label
        },

        gameScore: {
            default: null,
            type: cc.Label
        },

        scoretable:{
            default: null,
            type: cc.Label
        },

        countDown: {
            default: null,
            type: cc.Prefab
        },

        timeRollerBar: {            //thanh hiển thị thời gian
            default: null,
            type: cc.Sprite
        },

        timeRollerStep: {           //bước nhảy của time
            default: 0,
            range: [0, 2, 0.1],
            slide: true
        },
    
        icon: {                     //icon 
            default: null,
            type: cc.SpriteAtlas
        },

        tableLetter: {
            default: null,
            type: cc.Node
        },

        tableLetterAtlas: {              
            default: null,
            type: cc.SpriteAtlas
        },

        letterAtlas: {              //list chu
            default: null,
            type: cc.SpriteAtlas
        },

        _isGameOver: false,
        _win: false,
        nextStep: 0,
        sceneNext: 1,
        sizeCollider: 20,
        letter: "A",                //chu se duoc ve
        strockCount: 0,
        strockCount1: 0,
        strockCount2: 0, 
        strockCount3: 0, 
        letterIndex: 0,
        netthu: 1,
        sizeFillDraw: 130,
        score: 0,
        scoreTable: 0,
        allowDraw: false,


        //phần này xử lý lấy tọa độ ko liên quan
        arrPosition: "",
        posXcurrent: 0,
        posYcurrent: 0,
        posXpre: 0,
        posYpre: 0,
        count: 0,
        countChoice: 1,
    },

    start(){   
        this.node.getComponent("SoundManager").playBackGroundSound();
        
    },

    onLoad () {                         //chay tat ca game    
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.debug.setDisplayStats(false);

        this.initEventListener();
        //mang kiem tra so net ve
        arr = new Array();
        arr[0] = new Array("a", "b", "e", "d");                 //loai chu
        arr[1] = new Array( 2 , 1 , 1, 2);                      //so net ve chu thuong
        arr[2] = new Array( 3 , 2 , 1, 2);                      //so net ve chu hoa
        arr[3] = new Array( 3 , 3 , 4, 2);                      //so net ve in hoa
        arr[4] = new Array("9 19", "0", "0", "6");                 //diem leo tai cuoi net chu thuong
        arr[5] = new Array("10 18 21", "7", "0", "7");              //diem leo tai cuoi net chu hoa   
        arr[6] = new Array("8 16 19", "7 13", "7 11 15", "7");     //diem leo tai cuoi net chu hoa   

        arr_c = new Array();
        // this.arr_c = [{'x':-19, 'y':-1}, {'x':-48, 'y':-2}, {'x':-72, 'y':-17}, {'x':-91, 'y':-39}, {'x':-101, 'y':-66}, {'x':-100, 'y':-95}, {'x':-90, 'y':-122}, {'x':-71, 'y':-144}, {'x':-46, 'y':-158}, {'x':-18, 'y':-156}, {'x':28, 'y':-2}, {'x':28, 'y':-31}, {'x':28, 'y':-61}, {'x':28, 'y':-90}, {'x':29, 'y':-118}, {'x':31, 'y':-146}, {'x':54, 'y':-162}, {'x':79, 'y':-149}, {'x':98, 'y':-127}, {'x':111, 'y':-102}, {'x':79, 'y':-149}, {'x':98, 'y':-127}, {'x':111, 'y':-102}];
        // this.spawnNewApple(this.arr_c, 0.8);

        this.gameScore.string += this.score;
        this.getPropertyLetter(arr);
        this.startTimeRoller();
        // this.tutorial.getComponent(cc.Animation).play('net6_' + this.letter);
        // setTimeout(()=>{
        //     this.tutorial.getComponent(cc.Animation).play('net7_' + this.letter);
        // },3000);
        // setTimeout(()=>{
        //     this.tutorial.getComponent(cc.Animation).play('net8_' + this.letter);
        // },6000);
        // console.log(cc.director.getScene().name);
        // console.log(this.mask.spriteFrame.name);
    },

    resetGameData(){
        this._win = false;
        this.nextStep = 1;
        this.tutorial.opacity = 0;
        this.timeRollerBar.fillStart = 0;

        //phần lấy tọa độ
        this.arrPosition = "";
        this.countChoice = 1;
        this.count = 0;
    },
    //bắt đầu con lăn thời gian
    //ham nay se chay dau tien cho man
    startTimeRoller () {
        cc.director.getCollisionManager().enabled = false;
        this.getSceneCurrent();
        this.LetterCurrentMap();
        this.resetGameData();

        var times = 3; 
        this.schedule(()=> {    
            if (times !== 0) {
                this.allowDraw = false;
                if (!this.countDownNode) {
                    this.countDownNode = cc.instantiate(this.countDown);
                    this.node.addChild(this.countDownNode);
                }
                this.countDownNode.getChildByName("Sp Num").opacity = 255;
                this.countDownNode.getChildByName("Nodes start").opacity = 0;
                let spriteFrameName = "num_" + times;
                this.countDownNode.getChildByName("Sp Num").getComponent(cc.Sprite).spriteFrame = this.icon.getSpriteFrame(spriteFrameName);
                this.node.getComponent("SoundManager").playEffectSound("second", false);
            }   
            else {
                cc.director.getCollisionManager().enabled = true;
                this.allowDraw = true;
                this.countDownNode.getChildByName("Sp Num").opacity = 0;
                this.countDownNode.getChildByName("Nodes start").opacity = 255;
                this.schedule(this.countDownScheduleCallBack, this.timeRollerStep);
                this.startGame();
            }
            times--;
        }, 0.1, 3);  //1: mỗi giây 1 lần, 3 là repeat
    },

    //get man choi
    getSceneCurrent(){
        console.log("scene: " + this.sceneNext);
        if(this.sceneNext > 1){
            var i = 0;
            var j = this.apples.length;
            while(i < j + 1){
                this.apple.active = true;
                this.apple.getComponent("Apple")._isLive = true;
                console.log(this.apples);
                console.log(typeof(this.apples[i]));
                // this.apples[i].isDestroy();
                i++;
            }
        }
        console.log(this.apples);
        if(this.sceneNext === 1){
            this.netthu = 1;                                //xac dinh duoc net tutorial
            this.strockCount = this.strockCount1;
            var letter = this.letter + "1";
            this.mask.getComponent(cc.Mask).spriteFrame = this.letterAtlas.getSpriteFrame(letter);
            this.arr_c = [{'x':-19, 'y':-1}, {'x':-48, 'y':-2}, {'x':-72, 'y':-17}, {'x':-91, 'y':-39}, {'x':-101, 'y':-66}, {'x':-100, 'y':-95}, {'x':-90, 'y':-122}, {'x':-71, 'y':-144}, {'x':-46, 'y':-158}, {'x':-18, 'y':-156}, {'x':28, 'y':-2}, {'x':28, 'y':-31}, {'x':28, 'y':-61}, {'x':28, 'y':-90}, {'x':29, 'y':-118}, {'x':31, 'y':-146}, {'x':54, 'y':-162}, {'x':79, 'y':-149}, {'x':98, 'y':-127}, {'x':111, 'y':-102}];
            this.sizeFillDraw = 60;
            this.spawnNewApple(this.arr_c, 0.8);
        }
        if(this.sceneNext === 2){
            this.netthu = arr[1][this.letterIndex] + 1;                                //xac dinh duoc net tutorial
            this.strockCount = this.strockCount2;
            var letter = this.letter + "2";
            this.mask.getComponent(cc.Mask).spriteFrame = this.letterAtlas.getSpriteFrame(letter);
            this.arr_c =    [{'x':93, 'y':173}, {'x':39, 'y':130}, {'x':17, 'y':75}, {'x':4, 'y':17}, {'x':-7, 'y':-38}, {'x':-26, 'y':-92}, {'x':-60, 'y':-138}, {'x':-114, 'y':-160}, {'x':-166, 'y':-136}, {'x':-174, 'y':-77}, {'x': -130, 'y': -30}, 
                            {'x':90, 'y':111}, {'x':91, 'y':54}, {'x':91, 'y':-4}, {'x':92, 'y':-61}, {'x':92, 'y':-118}, {'x':128, 'y':-161}, {'x':179, 'y':-137}, {'x':195, 'y':-100}, 
                            {'x':-35, 'y':-3}, {'x':50, 'y':13}, {'x':131, 'y':10}];
            this.sizeFillDraw = 50;
            this.spawnNewApple(this.arr_c, 0.8);
        }
        if(this.sceneNext === 3){
            this.netthu = arr[1][this.letterIndex] + arr[2][this.letterIndex] + 1;
            this.strockCount = this.strockCount3;
            var letter = this.letter + "3";
            this.mask.getComponent(cc.Mask).spriteFrame = this.letterAtlas.getSpriteFrame(letter);
            this.arr_c = [{'x':0, 'y':170}, {'x':-16, 'y':140}, {'x':-30, 'y':108}, {'x':-46, 'y':65}, {'x':-63, 'y':21}, {'x':-80, 'y':-22}, {'x':-96, 'y':-66}, {'x':-113, 'y':-109}, {'x':-130, 'y':-153}, 
                                            {'x':16, 'y':140}, {'x':30, 'y':108}, {'x':46, 'y':65}, {'x':63, 'y':21}, {'x':80, 'y':-22}, {'x':96, 'y':-66}, {'x':113, 'y':-109}, {'x':130, 'y':-153}, 
                                            {'x':-49, 'y':-65}, {'x':-3, 'y':-65}, {'x':43, 'y':-65}];
            this.sizeFillDraw = 90;
            this.spawnNewApple(this.arr_c, 1.5);
        }
        if(this.sceneNext > 3){
            this.onCLickExit();
        }
    },

    startGame(){
        setTimeout(()=>{
            this.countDownNode.getChildByName("Nodes start").opacity = 0;
            this.tutorial.opacity = 255;
            this.tutorial.getComponent(cc.Animation).play('net'+ (this.netthu) + '_' + this.letter);
            this.netthu++;
            this.tutorialScript.string = 'Hãy vẽ theo hướng mũi tên, chú ý không vẽ ra ngoài nhé!';
        }, 500);
    },

    LetterCurrentMap(){
        for(var i = 1; i <= 3; i++){
            var letterCurrent = "Letter" + i;   
            if(i < this.sceneNext){
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawed").active = true;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawing").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDraw").active = false;
            }else if(i == this.sceneNext){
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawed").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawing").active = true;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDraw").active = false;
            }else{
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawed").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDrawing").active = false;
                cc.find("Canvas/Main game/Bg A/TableMap/" + letterCurrent + "/LetterDraw").active = true;
            }
        }
    },

    getPropertyLetter(arr){
        var i = 0;
        while(arr[0][i] != this.letter){
            i++;
        }
        this.strockCount1 = arr[1][i];
        this.strockCount2 = arr[2][i];
        this.strockCount3 = arr[3][i];
        this.letterIndex = i;
        console.log(this.letterIndex);

    },

    initEventListener () {    
        this.node.on(cc.Node.EventType.MOUSE_MOVE, (event)=>{     
            this.onBeCreateNodeCheckEvent(event.getLocation());      
        },this);  

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            var pos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.brush.getComponent('Brush').setBrushPos(pos.x, pos.y); 
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{  
            this.brush.getComponent('Brush').setBrushLineWidth(20);
            this.onCheckClick(); 
            var pos = this.node.convertToNodeSpaceAR(event.getLocation());
            if(this.allowDraw === true){
                this.brush.getComponent('Brush').drawTo(pos.x, pos.y);
            }
            this.onBeCreateNodeCheckEvent(event.getLocation()); 
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{  
            this.brush.getComponent('Brush').close();
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

    spawnNewApple(arr_c, scale) {
        var i = 0;
        while(arr_c[i] != null){
            this.apples[i] = cc.instantiate(this.apple);
            this.apples[i].setPosition(arr_c[i].x, arr_c[i].y);
            this.apples[i].getComponent('Apple').game = this;
            this.node.addChild(this.apples[i]);
            this.apples[i].scale = scale;
            this.apples[i]._components[3].radius = this.sizeCollider;           //set size collider cho cac man khac nhau
            // console.log(this.apples[i]._components[3].radius);  //lấy ra độ lớn collider
            i++;
        }
    },

    setPositionApple(arr_c, scale){
        var i = 0;
        while(arr_c[i] != null){
            this.apples[i].setPosition(arr_c[i].x, arr_c[i].y);
            this.apples[i].active = true;
            this.apples[i].scale = scale;
            this.apples[i].opacity = 255;
            i++;
        }
    },

    destroyAllNode(){
        var i = 0;
            var j = this.apples.length;
            while(i < j){
                this.apples[i].isDestroy();
                i++;
            }
    },

    onCheckClick(){
        if(this.apple.getComponent("ColliderManager")._isCollider === true){
            this.apple.active = false;
            this.apple.getComponent("Apple")._isLive = false;
            this.apple.getComponent("Apple").isDestroy();
        }
    },

    onFinishGameEvent(){ 
        // this.destroyAllNode();
        cc.director.getCollisionManager().enabled = false;
        this.brush.getComponent('Brush').nonDraw();
        this.unschedule(this.countDownScheduleCallBack);
        
        this.nextStep++;
        if(this._win === true){
            this.sceneNext++;
            this.score += 100 - Math.ceil(this.timeRollerBar.fillStart * 100);
            this.scoretable.string = 100 - Math.ceil(this.timeRollerBar.fillStart * 100);
            this.gameScore.string = this.score;

            setTimeout(()=>{
                if(this.sceneNext <= 4){
                    this.onClickNext();
                }
            }, 1000);
        }else{
            setTimeout(()=>{
                if(this.sceneNext < 4){
                    this.onClickReplay();
                }
            }, 1000);
        } 
        
    },

    onClickNext(){
        // cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();
        this.brush.getComponent('Brush').clear();
        if(this._win === false){
            this.sceneNext++;
        }
        this.startTimeRoller();
    },

    onClickPre(){
        // cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();
        this.brush.getComponent('Brush').clear();
        // this.sceneNext--;
        this.startTimeRoller();
    },

    onClickReplay(){
        // cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();   
        this.brush.getComponent('Brush').clear();
        this.startTimeRoller();
    },

    onCheckTouchBorder(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (touch, event) {
            var touchLoc = touch.getLocation();
            var i = 0;
            // if (cc.Intersection.pointInPolygon(touchLoc, this.arrCollider[0].world.points) || cc.Intersection.pointInPolygon(touchLoc, this.arrCollider[1].world.points)) {
            //     this.touchBorder = true;
            //     this.tutorialScript.string = 'Bạn vẽ ra ngoài mất rồi vẽ lại đi nhé!';
            //     console.log("hit");
            //     checkNext = false;
            //     this._win = false;
            //     this.onFinishGameEvent();
            // }
        }, this);
    },

    countDownScheduleCallBack () {
        this.timeRollerBar.fillStart += 1/200;
        if (this.timeRollerBar.fillStart === this.timeRollerBar.fillRange) {
            this.unschedule(this.countDownScheduleCallBack);
            if(this._win === true){
                // hoan thanh
            }else{
                // chua hoan thanh
            }
            // Thực thi chức năng hoàn thành trò chơi
            this.onFinishGameEvent();
        }
    },
    
    onCLickExit(){
        cc.director.loadScene("MainGame");
    },

    onClickBack(){
        cc.director.loadScene("MainGame");
    },

    //Lấy theo kiểu vị trí chia hết cho 8
    getPositionLetter(){
        var pos = this.tutorial.getPosition();
        pos.x = Math.ceil(pos.x);
        pos.y = Math.ceil(pos.y);
        this.count++;
        if((pos.x != this.posXcurrent || pos.y != this.posYcurrent) && this.count %8 === 0){
            this.posXcurrent = pos.x;
            this.posYcurrent = pos.y;
            this.countChoice ++;
            this.arrPosition += "{'x':" + pos.x + ", 'y':" + pos.y + "}, ";
            console.log(this.arrPosition);
            console.log(this.countChoice);
        }
    },
    //lay vi tri dua vao khoang cach
    getPositionUseDistance(){
        var pos = this.tutorial.getPosition();
        pos.x = Math.ceil(pos.x);
        pos.y = Math.ceil(pos.y);
        if(this.count === 0){
            this.posXpre = pos.x;
            this.posYpre = pos.y;
            this.arrPosition += "{'x':" + this.posXpre + ", 'y':" + this.posYpre + "}, ";
        }
        var MIN_POINT_DISTANCE = 45;

        this.posXcurrent = pos.x;
        this.posYcurrent = pos.y;
        
        var distance = this.distanceTwoVecto(this.posXpre, this.posYpre, this.posXcurrent, this.posYcurrent);
        distance = Math.ceil(distance);
        this.count++;
        if(distance > MIN_POINT_DISTANCE){
            this.posXpre = this.posXcurrent;
            this.posYpre = this.posYcurrent;

            this.countChoice ++;
            this.arrPosition += "{'x':" + this.posXpre + ", 'y':" + this.posYpre + "}, ";
            console.log(this.arrPosition);
            console.log(this.countChoice);
        }
    },
    
    distanceTwoVecto(x1, y1, x2, y2){
        var distance = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
        return distance;
    },

    PaintFill(arrPaint, a, b, size){          //xac dinh diem dau va diem cuoi duoc ve
        if(this.sceneNext <= 4){
            this.paint.getComponent('Brush').setBrushPos(arrPaint[a].x, arrPaint[a].y);
            this.paint.getComponent('Brush').setBrushLineWidth(size);
            for(var i = a; i <= b; i++){
                this.paint.getComponent('Brush').drawTo(arrPaint[i].x, arrPaint[i].y);
            }
            this.paint.getComponent('Brush').close();
        }
    },
    
    update(dt){
        // this.getPositionLetter();
        // this.getPositionUseDistance();
        //kiểm tra xem người chơi có vẽ ngược hay không
        var checkNext = true;
        if(this._isGameOver === false){
            for(let i = 1; i <= this.apples.length - 1; i++){
                if(this.apples[i].active === false){
                    if(this.apples[i-1].active === true){
                        checkNext = false;
                        this._isGameOver = true;
                        this._win = false;
                        this.tutorialScript.string = 'Ôi bạn vẽ sai mất rồi vẽ lại đi nhé!';

                        this.onFinishGameEvent();
                    } 
                    
                }
            }
        }
        //hiển thị hướng dẫn các nét
        //check net thu nhat
        if(this.nextStep <= this.strockCount - 1 && this.sceneNext < 4){
            if(this.sceneNext === 1){
                var mangsonet = new Number(arr[4][this.letterIndex].split(" ")[this.nextStep - 1]);
                if(this.nextStep > 1){
                    var mangsonet1 = new Number(arr[4][this.letterIndex].split(" ")[this.nextStep - 2]);
                }
            }else if(this.sceneNext === 2){
                var mangsonet = new Number(arr[5][this.letterIndex].split(" ")[this.nextStep - 1]);
                if(this.nextStep > 1){
                    var mangsonet1 = new Number(arr[5][this.letterIndex].split(" ")[this.nextStep - 2]);
                }
            }else{
                var mangsonet = new Number(arr[6][this.letterIndex].split(" ")[this.nextStep - 1]);
                if(this.nextStep > 1){
                    var mangsonet1 = new Number(arr[6][this.letterIndex].split(" ")[this.nextStep - 2]);
                }
            }
            if(this.apples[mangsonet].active === false && checkNext === true && this._isGameOver === false){
                setTimeout(()=>{
                    if(this.sceneNext < 4){
                        this.brush.getComponent('Brush').clear();
                        this.tutorialScript.string = "Bạn vẽ đúng rồi vẽ nét thứ " + (this.nextStep) + " nhé!";
                        this.node.getComponent("SoundManager").playEffectSound("exactly", false);
                    }
                    if(this.nextStep === 2){
                        this.PaintFill(this.arr_c, 0, mangsonet, this.sizeFillDraw);
                    }else{
                        this.PaintFill(this.arr_c, mangsonet1 + 1, mangsonet, this.sizeFillDraw);
                    }
                    console.log("Step: " + this.nextStep);
                }, 500);
                setTimeout(()=>{
                    if(this.sceneNext < 4){
                        console.log("net: " + this.netthu);
                        this.tutorial.getComponent(cc.Animation).play('net'+ (this.netthu) + '_' + this.letter);
                        this.netthu++;
                    }
                }, 1500);
                this.nextStep = this.nextStep + 1;
            }

        }

        //check net cuoi
        if(this.apples[new Number(arr[this.sceneNext + 3][this.letterIndex].split(" ")[arr[1][this.letterIndex] - 1])].active === false && this.nextStep == this.strockCount && checkNext === true && this._isGameOver === false && this.sceneNext < 4){
            setTimeout(()=>{
                this.brush.getComponent('Brush').clear();
                var n = this.sceneNext - 1;
                if(n === 1){
                    var a = new Number(arr[4][this.letterIndex].split(" ")[arr[1][this.letterIndex] - 2]);
                    var b = new Number(arr[4][this.letterIndex].split(" ")[arr[1][this.letterIndex] - 1]);
                } 
                if(n === 2){
                    var a = new Number(arr[5][this.letterIndex].split(" ")[arr[2][this.letterIndex] - 2]);
                    var b = new Number(arr[5][this.letterIndex].split(" ")[arr[2][this.letterIndex] - 1]);
                }
                if(n === 3){
                    var a = new Number(arr[6][this.letterIndex].split(" ")[arr[3][this.letterIndex] - 2]);
                    var b = new Number(arr[6][this.letterIndex].split(" ")[arr[3][this.letterIndex] - 1]);
                }
                console.log(a + ", " + b);
                this.PaintFill(this.arr_c, a+1, b, this.sizeFillDraw);
                this.node.getComponent("SoundManager").playEffectSound("exactly", false);
            }, 500);
            setTimeout(()=>{
                this.tutorialScript.string = 'Bạn đã hoàn thành, chúc mừng!';
            }, 1000);
            this.nextStep = this.nextStep + 1;
        }
        if(this.nextStep === this.strockCount + 1){
            this._win = true;
            //doan nay chay animation chuc mung
            this.onFinishGameEvent();
        }
    },
});
