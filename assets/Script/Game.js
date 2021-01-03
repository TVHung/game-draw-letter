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
            type: cc.Node
        },

        tutorial: {
            default: null,
            type: cc.Node
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

        character: {
            default: null,
            type: cc.Node
        },

        _isGameOver: false,
        _win: false,
        nextStep: 0,
        sceneNext: 1,
        sizeCollider: 20,
        letter: "a",                //chu se duoc ve
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
        setTimeout(()=>{
            this.node.getComponent("SoundManager").playBackGroundSound();
        }, 2500);
    },

    onLoad () {        
        // var letter = this.letter + "1";
        // var self = this;
        // cc.loader.loadRes("letter/" + letter, cc.SpriteFrame, function (err, spriteFrame) {
        //     self.mask.getComponent(cc.Mask).spriteFrame = spriteFrame;
        // });            
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.debug.setDisplayStats(false);
        //mang kiem tra so net ve
        arr = new Array();
        arr[0] = new Array("a", "b", "e", "d", "k");                                //loai chu
        arr[1] = new Array( 2 , 1 , 1, 2, 2);                                       //so net ve chu thuong
        arr[2] = new Array( 3 , 2 , 1, 2, 2);                                       //so net ve chu hoa
        arr[3] = new Array( 3 , 3 , 4, 2, 3);                                       //so net ve in hoa
        arr[4] = new Array("11 20", "19", "15", "7 19", "9 19");                     //diem leo tai cuoi net chu thuong
        arr[5] = new Array("15 28 33", "9 21", "38", "9 21", "9 21");               //diem leo tai cuoi net chu hoa   
        arr[6] = new Array("9 19 24", "7 12 17", "8 15 21 28", "7 17", "9 13 17");  //diem leo tai cuoi net chu hoa   

        this.letter = cc.sys.localStorage.getItem('letter');        //lấy chữ cần đọc

        arr_letter = new Array();
        arr_letter1 = new Array();
        arr_letter2 = new Array();
        arr_letter3 = new Array();
        cc.loader.loadRes('allLetterArr.json', function (err, object) {             //get data from json file
            if (err) {
                console.log(err);
                return;
            }
            this.arr_letter1 = object.json.letter[this.letter].arr1;
            this.arr_letter2 = object.json.letter[this.letter].arr2;
            this.arr_letter3 = object.json.letter[this.letter].arr3;
        }.bind(this));

        var letter = this.letter + "1"; 
        cc.loader.loadRes("letter/" + letter, cc.SpriteFrame, function (err, spriteFrame) {
            cc.find("Canvas/Main game/Bg A/TableMap/Letter1/letter").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        var letter = this.letter + "2"; 
        cc.loader.loadRes("letter/" + letter, cc.SpriteFrame, function (err, spriteFrame) {
            cc.find("Canvas/Main game/Bg A/TableMap/Letter2/letter").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        var letter = this.letter + "3"; 
        cc.loader.loadRes("letter/" + letter, cc.SpriteFrame, function (err, spriteFrame) {
            cc.find("Canvas/Main game/Bg A/TableMap/Letter3/letter").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        this.gameScore.string += this.score;
        this.getPropertyLetter(arr);
        //chạy aniamtion nhan vat dong hanh
        this.character.getComponent(cc.Animation).play('monsterIn');
        cc.find("Canvas/Character/mess").getComponent(cc.Label).string = 'Con hãy vẽ theo \nhướng mũi tên và\ncác chấm đỏ nhé!';
        this.node.getComponent("SoundManager").playEffectSound("batdau", false);   
        setTimeout(() => {
            this.character.getComponent(cc.Animation).play('monsterOut');
            this.startTimeRoller();
        }, 2500);
        this.apple = this.apple.data;

        // setTimeout(()=>{
        //     this.tutorial.getComponent(cc.Animation).play('net6_' + this.letter);
        // },4000);
        // setTimeout(()=>{
        //     this.tutorial.getComponent(cc.Animation).play('net7_' + this.letter);
        // },6000);
        // setTimeout(()=>{
        //     this.tutorial.getComponent(cc.Animation).play('net8_' + this.letter);
        // },8000);
        // setTimeout(()=>{
        //     this.tutorial.getComponent(cc.Animation).play('net6_' + this.letter);
        // },8000);
        // console.log(cc.director.getScene().name);
        // console.log(this.mask.spriteFrame.name);
    },

    resetGameData(){
        this._win = false;
        this.nextStep = 1;
        this.tutorial.opacity = 0;
        this.timeRollerBar.fillStart = 0;
        this._isGameOver = false;
        
        //phần lấy tọa độ
        this.arrPosition = "";
        this.countChoice = 1;
        this.count = 0;
    },
    //bắt đầu con lăn thời gian
    //ham nay se chay dau tien cho man
    startTimeRoller () {
        this.resetGameData();
        if(this.sceneNext <= 3){
            var letter = this.letter + this.sceneNext;                                                  //load hinh anh tiep theo
            var self = this;
            cc.loader.loadRes("letter/" + letter, cc.SpriteFrame, function (err, spriteFrame) {
                self.mask.getComponent(cc.Mask).spriteFrame = spriteFrame;
            });

        }else{
            this.onCLickExit();
        }
        this.LetterCurrentMap();
        cc.director.getCollisionManager().enabled = false;
        
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
                // this.countDownNode.getChildByName("Nodes start").opacity = 255;
                this.node.getComponent("SoundManager").playEffectSound("begin", false);
                this.schedule(this.countDownScheduleCallBack, this.timeRollerStep);
                this.startGame();
                this.getSceneCurrent();
            }
            times--;
        }, 0.1, 3);  //1: mỗi giây 1 lần, 3 là repeat
    },

    //get man choi
    getSceneCurrent(){
        console.log("scene: " + this.sceneNext);
        cc.director.getCollisionManager().enabled = false;
        if(this.sceneNext === 1){
            this.netthu = 1;                                //xac dinh duoc net tutorial
            this.strockCount = this.strockCount1;
            this.arr_letter = this.arr_letter1;
            this.sizeFillDraw = 30;
            this.spawnNewApple(this.arr_letter, 0.8);
        }
        if(this.sceneNext === 2){
            this.netthu = arr[1][this.letterIndex] + 1;                                //xac dinh duoc net tutorial
            this.strockCount = this.strockCount2;
            this.arr_letter = this.arr_letter2;
            this.sizeFillDraw = 30;
            this.spawnNewApple(this.arr_letter, 0.8);
        }
        if(this.sceneNext === 3){
            this.netthu = arr[1][this.letterIndex] + arr[2][this.letterIndex] + 1;
            this.strockCount = this.strockCount3;
            this.arr_letter = this.arr_letter3;
            this.sizeFillDraw = 70;
            this.spawnNewApple(this.arr_letter, 1.5);
        }
        this.initEventListener();
    },

    startGame(){
        setTimeout(()=>{
            this.countDownNode.getChildByName("Nodes start").opacity = 0;
            this.tutorial.opacity = 255;
            this.tutorial.getComponent(cc.Animation).play('net'+ (this.netthu) + '_' + this.letter);
            this.netthu++;
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

    },

    initEventListener () {  
        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{  
            this.onBeCreateNodeCheckEvent(event.getLocation()); 
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event)=>{  
            this.onCheckClick(); 
            this.onBeCreateNodeCheckEvent(event.getLocation()); 
        },this);
    },

    onBeCreateNodeCheckEvent (position) {
        if (!cc.isValid(this.checkNode)) {                                          //cc.isValid: xác định xem giá trị đã chỉ định của đối tượng có hợp lệ hay không
            this.checkNode = cc.instantiate(this.check);                            
            this.checkNode.zIndex = cc.macro.MAX_ZINDEX;
            // this.checkNode.getComponent("ColliderManager")._isCollider = false;     
            this.node.addChild(this.checkNode);                                     //thêm node 
        }
        this.checkNode.opacity = 0;
        this.checkNode.position = this.node.convertToNodeSpaceAR(position);       
    },

    spawnNewApple(arr_letter, scale) {
        this.destroyAllNode();  
        var i = 0;
        while(arr_letter[i] != null){
            this.apples[i] = cc.instantiate(this.apple);
            // this.apples[i].setPosition(arr_letter[i].x, arr_letter[i].y);
            this.apples[i].setPosition(3000, 3000);
            // this.apples[i].getComponent('Apple').game = this;
            this.node.addChild(this.apples[i]);
            this.apples[i].scale = scale;
            this.apples[i]._components[3].radius = this.sizeCollider;           //set size collider cho cac man khac nhau
            i++;
        }
    },
    setPositionNode(arr_letter, a, b){
        if(arr_letter != null && this.apples.length != 0){
            for(var i = a; i <= b; i++){
                this.apples[i].setPosition(arr_letter[i].x, arr_letter[i].y);
            }
        }
    },

    destroyAllNode(){
        var i = 0;
            var j = this.apples.length;
            while(i < j){
                this.apples[i].removeFromParent();
                i++;
            }
        this.apples.length = 0;
    },

    onCheckClick(){
        if(this.apple.getComponent("ColliderManager")._isCollider && this.apple){
            this.apple.active = false;
            this.node.getComponent("SoundManager").playEffectSound("drawing", false);
        }
    },

    onFinishGameEvent(){ 
        cc.director.getCollisionManager().enabled = false;
        this.apple.active = true;               //component để các prefab xuất hiện
        this.destroyAllNode();
        this.brush.getComponent('Brush').nonDraw();
        this.unschedule(this.countDownScheduleCallBack);
        
        this.nextStep++;
        if(this._win === true){
            this.sceneNext++;
            this.score += 100 - Math.ceil(this.timeRollerBar.fillStart * 100);
            this.scoretable.string = 100 - Math.ceil(this.timeRollerBar.fillStart * 100);
            this.gameScore.string = this.score;
            //co vu
            this.character.getComponent(cc.Animation).play('monsterIn');
            if(this.sceneNext < 4){
                cc.find("Canvas/Character/mess").getComponent(cc.Label).string = 'Con làm tốt lắm!\nHãy viết chữ tiếp theo';
                this.node.getComponent("SoundManager").playEffectSound("chutieptheo", false);
            }else{
                cc.find("Canvas/Character/mess").getComponent(cc.Label).string = 'Chúc mừng con đã\nhoàn thành xuất sắc!';
                this.node.getComponent("SoundManager").playEffectSound("hoanthanh", false);
            }
            setTimeout(() => {
                this.character.getComponent(cc.Animation).play('monsterOut');
            }, 2500);
            
            setTimeout(()=>{
                if(this.sceneNext <= 4){
                    this.onClickNext();
                }
            }, 3000);
        }else{
            this.character.getComponent(cc.Animation).play('monsterIn');
            cc.find("Canvas/Character/mess").getComponent(cc.Label).string = 'Con vẽ sai mất rồi\n Hãy thử lại đi nhé!'
            this.node.getComponent("SoundManager").playEffectSound("vesai", false);
            setTimeout(() => {
                this.character.getComponent(cc.Animation).play('monsterOut');
            }, 2500);
            setTimeout(()=>{
                if(this.sceneNext < 4){
                    this.onClickReplay();
                }
            }, 3000);
        } 
        
    },

    onClickNext(){
        // cc.find("Canvas/Game over").active = false;    
        this.paint.getComponent('Brush').clear();
        this.brush.getComponent('Brush').clear();
        if(this._win === false){
            if(this.sceneNext <= 3){
                this.sceneNext++;
            }
        }
        this.startTimeRoller();
    },

    onClickPre(){
        this.paint.getComponent('Brush').clear();
        this.brush.getComponent('Brush').clear();
        this.startTimeRoller();
    },

    onClickReplay(){
        this.destroyAllNode(); 
        this.paint.getComponent('Brush').clear();   
        this.brush.getComponent('Brush').clear();
        this.startTimeRoller();
    },

    countDownScheduleCallBack () {
        this.timeRollerBar.fillStart += 1/200;
        if (this.timeRollerBar.fillStart === this.timeRollerBar.fillRange) {
            this.unschedule(this.countDownScheduleCallBack);
            this.onFinishGameEvent();
        }
    },
    
    onCLickExit(){
        this.node.getComponent("SoundManager").stopAll();   //thì tắt hết âm thanh
        this.character.getComponent(cc.Animation).stop();
        cc.director.loadScene("MainGame");
    },

    onClickBack(){
        this.node.getComponent("SoundManager").stopAll();   //thì tắt hết âm thanh
        this.character.getComponent(cc.Animation).stop();
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
            this.arrPosition += "{\"x\":" + this.posXpre + ", \"y\":" + this.posYpre + "}, ";
        }
        var MIN_POINT_DISTANCE = 40;

        this.posXcurrent = pos.x;
        this.posYcurrent = pos.y;
        
        var distance = this.distanceTwoVecto(this.posXpre, this.posYpre, this.posXcurrent, this.posYcurrent);
        distance = Math.ceil(distance);
        this.count++;
        if(distance > MIN_POINT_DISTANCE){
            this.posXpre = this.posXcurrent;
            this.posYpre = this.posYcurrent;

            this.countChoice ++;
            this.arrPosition += "{\"x\":" + this.posXpre + ", \"y\":" + this.posYpre + "}, ";
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
            this.paint.getComponent('Brush').setBrushPos(arrPaint[a].x, arrPaint[a].y-75);
            this.paint.getComponent('Brush').setBrushLineWidth(size);
            for(var i = a; i <= b; i++){
                this.paint.getComponent('Brush').drawTo(arrPaint[i].x, arrPaint[i].y-75);
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
            var maxIndexIsActive = 0;
            for(let i = 1; i <= this.apples.length - 1; i++){
                if(this.apples[i].active === false){
                    if(i > maxIndexIsActive){
                        maxIndexIsActive = i;
                    }
                }
            }
            if(maxIndexIsActive > 0){
                if(this.apples[maxIndexIsActive-1].active === true){
                    checkNext = false;
                    this._isGameOver = true;
                    this._win = false;
                    this.onFinishGameEvent();
                }else{
                    if(arr[this.sceneNext][this.letterIndex] === 1){
                        this.PaintFill(this.arr_letter, maxIndexIsActive-1, maxIndexIsActive, this.sizeFillDraw);
                    }else{
                        var checkSetPos = true;
                        for(var j = 0; j < arr[this.sceneNext][this.letterIndex] - 1; j++){
                            var n = new Number(arr[this.sceneNext + 3][this.letterIndex].split(" ")[j]);
                            if(maxIndexIsActive === n+1){
                                checkSetPos = false;
                            }
                        }  
                        if(checkSetPos === true){
                            this.PaintFill(this.arr_letter, maxIndexIsActive-1, maxIndexIsActive, this.sizeFillDraw);
                        }
                    }
                    
                }  
            }
        }

        // hien thi cac node truoc khi ve
        if(this.apples.length != 0){
            if(this.nextStep <= this.strockCount){
                if(this.sceneNext === 1){
                    var sonet = arr[1][this.letterIndex];
                    var cuoinet = new Number(arr[4][this.letterIndex].split(" ")[this.nextStep - 1]);
                    if(this.nextStep > 1){
                        var daunet = new Number(arr[4][this.letterIndex].split(" ")[this.nextStep - 2]);
                    }
                }else if(this.sceneNext === 2){
                    var sonet = arr[2][this.letterIndex];
                    var cuoinet = new Number(arr[5][this.letterIndex].split(" ")[this.nextStep - 1]);
                    if(this.nextStep > 1){
                        var daunet = new Number(arr[5][this.letterIndex].split(" ")[this.nextStep - 2]);
                    }
                }else{
                    var sonet = arr[3][this.letterIndex];
                    var cuoinet = new Number(arr[6][this.letterIndex].split(" ")[this.nextStep - 1]);
                    if(this.nextStep > 1){
                        var daunet = new Number(arr[6][this.letterIndex].split(" ")[this.nextStep - 2]);
                    }
                }
                if(sonet === 1){
                    this.setPositionNode(this.arr_letter, 0, this.apples.length - 1);
                }else{
                        if(this.nextStep === 1){
                            this.setPositionNode(this.arr_letter, 0, cuoinet);
                        }else{
                            setTimeout(() => {
                                this.setPositionNode(this.arr_letter, daunet + 1, cuoinet);
                            }, 1000);
                        }
                }
            }
        }

        //hiển thị hướng dẫn các nét
        //check net thu nhat
        if(this.nextStep <= this.strockCount - 1 && this.sceneNext < 4 && checkNext === true && this._isGameOver === false && this.apples.length !== 0){
            if(this.sceneNext === 1){
                var cuoinet = new Number(arr[4][this.letterIndex].split(" ")[this.nextStep - 1]);
            }else if(this.sceneNext === 2){
                var cuoinet = new Number(arr[5][this.letterIndex].split(" ")[this.nextStep - 1]);
            }else{
                var cuoinet = new Number(arr[6][this.letterIndex].split(" ")[this.nextStep - 1]);
            }
            if(this.apples[cuoinet].active === false){
                setTimeout(()=>{
                    if(this.sceneNext < 4){
                        this.brush.getComponent('Brush').clear();
                        setTimeout(() => {
                            this.node.getComponent("SoundManager").playEffectSound("exactly", false);
                        }, 300);
                    }
                    console.log("Step: " + this.nextStep);
                }, 100);
                setTimeout(()=>{
                    if(this.sceneNext < 4){
                        this.tutorial.getComponent(cc.Animation).play('net'+ (this.netthu) + '_' + this.letter);
                        this.netthu++;
                    }
                }, 500);
                this.nextStep = this.nextStep + 1;
            }

        }

        //check net cuoi
        // console.log("A" + new Number(arr[this.sceneNext+4][this.letterIndex].split(" ")[arr[this.sceneNext+1][this.letterIndex] - 1]));
        if(this.apples.length != 0){
            if(this.apples[this.apples.length - 1].active === false && this.nextStep == this.strockCount && checkNext === true && this._isGameOver === false && this.sceneNext < 4){
                this.brush.getComponent('Brush').clear();
                setTimeout(() => {
                    this.node.getComponent("SoundManager").playEffectSound("exactly", false);
                }, 300);
                this.nextStep = this.nextStep + 1;
            }
            if(this.nextStep === this.strockCount + 1){
                this._win = true;
                //doan nay chay animation chuc mung
                this.onFinishGameEvent();
            }
        }
        
    },
});
