/*
        * 分析：
        *   1.页面样式初始化，需要创建游戏初始界面的样式
        *   2.开始游戏
        *   3.创建敌军==>以及敌军下落的运动（要去边界值的函数）
        *   4.创建我军==>我军的飞机，以及移动范围==>生成子弹，以及子弹的运动
        *   5.检测碰撞==>分析子弹与敌军，敌军与我军
        *   6.爆炸特效
        *   7.分数
        *   8结束页面
        * */
(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {return setTimeout(fn, 1000/60)};
    window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
    //定义全局变量
    var oBox = document.getElementById('box'),
        time1;
    //初始化界面
    init();
    function  init() {
        //生成h1标题
        var h1 = document.createElement('h1');
        h1.innerHTML = '飞机大战1.0';
        oBox.appendChild(h1);
        //生成关卡难度信息
        var arrdiff = ['简单模式' , '一般模式' , '困难模式' , '兔子模式'];
        for(var i = 0;i < arrdiff.length ; i++){
            var p = document.createElement('p');
            p.innerHTML = arrdiff[i];
            p.className = i === (arrdiff.length-1) ? 'diff':'difficult';
            p.i = i;
            p.onclick = function (e) {
                startGame(this.i ,e);
            }
            oBox.appendChild(p);
        }
    };
    //开始游戏
    function startGame(index,e) {
        oBox.innerHTML = '';
        score();
        var plane = myPlane(index,e);
        enemy(index ,plane);
    }
    //生成敌军
    function enemy(index , plane) {
        //定义一个数组来确定敌军生成速度
        var arrEn = [160 , 120 , 80 , 40];
        time1 = setInterval(function () {
            //生成敌军图片
            var enImg = new Image();
            enImg.src = 'images/enemy.png';
            enImg.width = 23;
            enImg.height = 30;
            enImg.style.top = 0;
            enImg.style.left = Math.random()*oBox.clientWidth - enImg.width/2 + 'px';
            oBox.appendChild(enImg);
            //设置下落速度
            var speed = Math.random()*3 + 2;
            !function enemySpeed() {
                enImg.style.top = enImg.offsetTop + speed + 'px';
                if( enImg.offsetTop >= oBox.clientHeight - enImg.height){
                    oBox.removeChild(enImg);
                }else {
                    //敌军和子弹接触
                    var biu = document.getElementsByClassName('biu');
                    for(var i=0 ; i < biu.length ; i++){
                        if( isCollision(biu[i],enImg)){
                            cancelAnimationFrame( biu[i].timer2);
                            oBox.removeChild(biu[i]);
                            boom(enImg ,'')
                            oBox.removeChild(enImg);
                            document.getElementsByClassName('score')[0].innerHTML = oBox.score += 10;
                            return false;
                        }
                    }
                    //敌军和我军接触
                    if( plane.parentNode && isCollision(plane,enImg)){
                        document.onmousemove = null;
                        clearInterval(plane.timer);
                        clearInterval(time1);
                        boom(plane , 2);
                        boom(enImg , '');
                        oBox.removeChild(plane);
                        oBox.removeChild(enImg);
                        return false;
                    }
                    plane.parentNode && requestAnimationFrame(enemySpeed);
                }
            }()
        },arrEn[index])
    }
    //生成我军
    function myPlane(index,e) {
        e = e || window.event;
        var mpImg = new Image();
        mpImg.className = 'mplane';
        mpImg.src = 'images/plane.png';
        mpImg.width = 60;
        mpImg.height = 36;
        mpImg.style.top = e.pageY - getOffset(oBox).top - mpImg.height/2 +'px';
        mpImg.style.left = e.pageX - getOffset(oBox).left - mpImg.width/2 +'px';
        oBox.appendChild(mpImg);
        //我军运动 1.设置边界值，2运动
        var leftMax = oBox.clientWidth - mpImg.width/2;
            leftMin = -mpImg.width/2;
            topMax = oBox.clientHeight - mpImg.height;
        document.onmousemove = function (e) {
            e = e || window.event;
            var top = e.pageY - getOffset(oBox).top - mpImg.height/2,
                left = e.pageX - getOffset(oBox).left - mpImg.width/2;
            top = Math.max(0,top);
            top = Math.min(topMax , top);
            left = Math.min(leftMax , left);
            left = Math.max(leftMin , left);
            mpImg.style.top = top +'px';
            mpImg.style.left = left + 'px';
        }
        //生成子弹
        var arrMbiu = [100 ,80 ,50 ,20];
        mpImg.timer = setInterval(function () {
            var biu = new Image();
            biu.className = 'biu';
            biu.src = 'images/bullet.png';
            biu.width = 6;
            biu.height = 22;
            biu.style.top = mpImg.offsetTop - biu.height + 'px';
            biu.style.left = mpImg.offsetLeft + mpImg.width/2 - biu.width/2 + 'px';
            oBox.appendChild(biu);
            //运动
            var biuSpeed = 8;
            !function biuMove() {
                biu.style.top = biu.offsetTop - biuSpeed + 'px';
                if(biu.offsetTop <=0){
                    cancelAnimationFrame(biu.timer2);
                    oBox.removeChild(biu);
                }else {
                    mpImg.parentNode && (biu.timer2 = requestAnimationFrame(biuMove));
                }
            }();
          //console.log(arrMbiu[index])
        },arrMbiu[index])
        return mpImg;
    };
    //爆炸特效
    function boom(obj,num) {
        var boomImg = new Image();
        boomImg.src = 'images/boom'+num+'.png';
        boomImg.width = obj.width;
        boomImg.height = obj.height;
        boomImg.style.top = obj.offsetTop + 'px';
        boomImg.style.left = obj.offsetLeft + 'px';
        oBox.appendChild(boomImg);
        setTimeout(function () {
            boomImg.parentNode && oBox.removeChild(boomImg);
            num &&  gameOver();
            },num?1000:200)
    }
    //分数
    function score() {
        oBox.score = 0;
        var span = document.createElement('span');
        span.className = 'score';
        span.innerHTML = oBox.score;
        //console.log(span.innerHTML)
        oBox.appendChild(span);
    }
    //结束页面
    function gameOver() {
        oBox.innerHTML = '';
        var div1 = document.createElement('div'),
            div2 = document.createElement('div');
        div1.className = 'game-over';
        div2.innerHTML = '<h2>Game Over</h2>\n' +
            '<p>分数 <span>'+oBox.score+'</span></p>\n' +
            ' <p class = "res">重新开始</p>';
        div2.onclick=function () {
            oBox.innerHTML = "";
            init();
        }
        div1.appendChild(div2);
        oBox.appendChild(div1);
    }
    //检测碰撞
    function isCollision(biu , enemy) {
        //获取的biu的
        var top1 = biu.offsetTop,
            bottom1 = biu.offsetTop + biu.height,
            left1 = biu.offsetLeft,
            right1 = biu.offsetLeft + biu.width;
        //获取的敌军的
        var top2 = enemy.offsetTop,
            bottom2 = enemy.offsetTop + enemy.height,
            left2 = enemy.offsetLeft,
            right2 = enemy.offsetLeft + enemy.width;
        return !(top1 > bottom2 || left1 > right2 || bottom1 < top2 || right1 < left2);
    }
    //获取对象到body的距离
    function getOffset(obj) {
        var json = {
            top : 0,
            left: 0
        }
        while(obj !== document.body){
            json.left += obj.offsetLeft;
            json.top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return json;
    }
})()