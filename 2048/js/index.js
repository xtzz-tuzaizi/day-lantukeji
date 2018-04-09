//单体单例模式   逻辑与操作分离，一个函数只做一件事
/*
	第一步：需要的函数：
		getWindowSize
		setItemSize
		initGUI
*/
var _2048 = (function(window , document){
	//获取窗口宽高
	function getWindowSize(){
		return {
			w : document.documentElement.clientWidth , 
			h : document.documentElement.clientHight
		}
	}
	//设置每一个LI的宽高
	function setItemSize(winW , size , item){
		var itemSize = 0;
		if( winW > 640 ){ return }//如果屏幕宽度大于640了则有固定宽高
		itemSize = (winW - 40 - size * 5) / size + 'px';
		item.style.width = itemSize;
		item.style.height = itemSize;
		item.style.lineHeight = itemSize;
	}
	//生成2048的初始界面
	function initGUI(matrix){
		var root = document.createElement('div'),
			ul = null,
			len = matrix.length,
			//最后生成的矩阵
			list = [],
			item = null,
			winW = getWindowSize().w;
		for (var i = 0; i < len; i++) {
			list[i] = [];
			ul = document.createElement('ul');
			for (var j = 0; j < len; j++) {
				item = document.createElement('li');
				item.appendChild(document.createElement('div'));
				setItemSize(winW , len , item);
				list[i][j] = item;
				ul.appendChild(item);
			}
			root.appendChild(ul);
		}
		root.style.position = 'relative';
		return {
			list : list ,
			root : root
		}
	}
	/*
		第二步：
			生成随机数，random2_4
			填充生成的随机数 fillNumbers
			找到所有可以填充数字的位置 findEmptyItemCoordnate
			找到数字后 添加对应的这个li的div里面 drawGUI
			生成颜色 通过每一个div 元素的innerHTML决定 createColorByNumber
	*/
	//生成随机数
	function random2_4(){
		return Math.random() > 0.5? 4 : 2;
	}
	//填充生成的随机数
	function fillNumbers(matrix,isInit){
		var list = [],
			x,
			y,
			item,
			len = matrix.length,
			times = isInit ? len - 2 : 1 ;
		for (var i = 0; i < times; i++) {
			item = findEmptyItemCoordnate(matrix);
			if( item && item.length == 2 ){
				x = item[0];
				y = item[1];
				matrix[x][y] = random2_4()
			}
		}
	}
	//找到所有可以填充数字的位置
	function findEmptyItemCoordnate(matrix){
		var emptyLen = 0,
			flag = 0,
			emptyArr = [],
			len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if (matrix[i][j] === 0 ) {
					emptyArr.push([i,j])
				} 
			}
		}
		emptyLen = emptyArr.length;
		if(emptyLen === 0){
			return []
		}
		flag = Math.floor(Math.random() * emptyLen)
		return emptyArr[flag]
	}
	//找到数字后 添加对应的这个li的div里面
	function drawGUI(matrix , list){
		var len = matrix.length,
			item = null,
			color;
		//console.log(len)
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				color = createColorByNumber(matrix[i][j]);
				//console.log(color)
				item =list[i][j].children[0];
				item.innerHTML = matrix[i][j]===0?'':matrix[i][j];
				item.style.background = color.bgColor;
				item.style.color = color.color;
			}
		}
	}
	// 生成颜色 通过每一个 div 元素的innerHTML决定
	function createColorByNumber(number){
		var flag = 0;
		var color = {	
			'0':  {bgColor: '#cbc2b2', color: '#333'},
            '1':  {bgColor: '#ebe4d9', color: '#333'},
            '2':  {bgColor: '#eedec7', color: '#333'},
            '3':  {bgColor: '#f39763', color: '#fff'},
            '4':  {bgColor: '#f29c5c', color: '#fff'},
            '5':  {bgColor: '#ef8161', color: '#fff'},
            '6':  {bgColor: '#f16432', color: '#fff'},
            '7':  {bgColor: '#eed170', color: '#fff'},
            '8':  {bgColor: '#edce5d', color: '#fff'},
            '9':  {bgColor: '#edc850', color: '#fff'},
            '10': {bgColor: '#edc53f', color: '#fff'},
            '11': {bgColor: '#edc22e', color: '#fff'},
            '12': {bgColor: '#b884ac', color: '#fff'},
            '13': {bgColor: '#b06ca9', color: '#fff'},
            '14': {bgColor: '#7f3d7a', color: '#fff'},
            '15': {bgColor: '#6158b1', color: '#fff'},
            '16': {bgColor: '#3a337b', color: '#fff'},
            '17': {bgColor: '#0f4965', color: '#fff'},
            '18': {bgColor: '#666', color: '#fff'},
            '19': {bgColor: '#333', color: '#fff'},
            '20': {bgColor: '#000', color: '#fff'}
		}
		if( number){
			flag = Math.log2(number )
		}
		return color[String(flag)]
	}
	/*
		第三步：
			添加事件 registerEvent
			判断是否可以移动
				eg: 移动方向的左侧区块的内容为0
					移动区域的两个相邻的元素的内容一样
				左移 canGoLeft
				右移 canGoRight
				上移 canGoUp
				下移 canGoDown
			编写移动函数 move
	*/
	function registerEvent(callback){
		function keyEventHadler(e){
			e = e || window.event;
			var code = e.keyCode;
			callback.call(this,code)
		}
		window.addEventListener('keydown' , keyEventHadler)
		return keyEventHadler;
	}
	//左移
	function canGoLeft(matrix){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if( matrix[i][j] === 0 && matrix[i][j+1] > 0){
					return true
				}
				if( matrix[i][j] > 0 && matrix[i][j] === matrix[i][j+1] ){
					return true
				}
			}
		}
		return false
	}
	//右移
	function canGoRight(matrix){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if( matrix[i][j+1] === 0 && matrix[i][j] > 0){
					return true
				}
				if( matrix[i][j+1] > 0 && matrix[i][j] === matrix[i][j+1] ){
					return true
				}
			}
		}
		return false
	}
	//上移
	function canGoUp(matrix){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if( matrix[j+1][i] === 0 && matrix[j][i] > 0){
					return true
				}
				if( matrix[j+1][i] > 0 && matrix[j][i] === matrix[j+1][i] ){
					return true
				}
			}
		}
		return false
	}
	// 下移
	function canGoDown( matrix ){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if ( matrix[j][i] > 0 && matrix[j + 1][i] === 0 ) {
					return true
				}
				if ( matrix[j][i] > 0 &&  matrix[j + 1][i] ===  matrix[j][i] ) {
					return true
				}
			}
		}
		return false
	}
	//取出非0的元素
	function getFilledItem(matrix){
		var len = matrix.length,
			filled = [];
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if( matrix[i][j] > 0 ){
					filled.push({
						flag : [i,j],
						value : matrix[i][j]
					})
				}
			}
		}
		return filled;
	}
	//移动函数
	function move(matrix , keyWord){
		var filled = getFilledItem(matrix);
		//console.log(filled)
		var len = matrix.length,
			line = [],
			lineLength = 0;
		switch (keyWord) {
			case 'left':
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[0] === i;
					})
					lineLength = line.length;
					for (var j = 0; j < lineLength; j++) {
						matrix[line[j].flag[0]][line[j].flag[1]] = 0;
						//matrix[line[j].flag[0]][line[j].flag[1]] = 0;
						matrix[i][j] = line[j].value;
					}
				}
				break;
			case 'right' : 
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[0] === i;
					})
					lineLength = line.length;
					for (var j = 0; j < lineLength; j++) {
						var lastLineItemIndex = lineLength -j -1;
						var lastItemIndex = len -j -1;
						matrix[line[lastLineItemIndex].flag[0]][line[lastLineItemIndex].flag[1]] = 0;
						matrix[i][lastItemIndex] = line[lastLineItemIndex].value;
					}
				}
			break;
			case 'up':
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[1] == i;
					})
					lineLength = line.length;
					for (var j = 0; j < lineLength; j++) {
						matrix[line[j].flag[0]][line[j].flag[1]] = 0;
						matrix[j][i] = line[j].value;
					}
				}
			break;
			case 'down' :
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[1] == i;
					})
					lineLength = line.length;
					for (var j = 0; j < lineLength; j++) {
						matrix[line[lineLength - j - 1].flag[0]][line[lineLength - j - 1].flag[1]] = 0;
						matrix[len - j -1][i] = line[lineLength - j - 1].value;
					}
				}
			break;
		}
	}
	/*
		第四步：
			合并
			设置分数
	*/
	//合并函数
	function merge(matrix,keyWord,callback){
		var len = matrix.length,
			singleStepScore = 0;
		switch (keyWord) {
			case 'left':
				for (var i = 0; i < len; i++) {
					for(var j = 0; j < len-1; j++){
						if( matrix[i][j] > 0 && matrix[i][j] === matrix[i][j+1 ]){
							matrix[i][j] *= 2;
							singleStepScore = matrix[i][j];
							matrix[i][j+1] = 0;
						}
					}
				}
				break;
			case 'right':
				for (var i = 0; i < len; i++) {
					for(var j = 0; j < len-1; j++){
						if( matrix[i][j + 1] > 0 && matrix[i][j] === matrix[i][j+1 ]){
							matrix[i][j + 1] *= 2;
							singleStepScore = matrix[i][j + 1];
							matrix[i][j] = 0;
						}
					}
				}
				break;
			case 'up':
				for (var i = 0; i < len; i++) {
					for(var j = 0; j < len-1; j++){
						if( matrix[j][i] > 0 && matrix[j][i] === matrix[j+1][i]){
							matrix[j][i] *= 2;
							singleStepScore = matrix[j][i];
							matrix[j+1][i] = 0;
						}
					}
				}
				break;
			case 'down':
				for (var i = 0; i < len; i++) {
					for(var j = 0; j < len-1; j++){
						if( matrix[j + 1][i] > 0 && matrix[j][i] === matrix[j+1][i]){
							matrix[j+1][i] *= 2;
							singleStepScore = matrix[j+1][i];
							matrix[j][i] = 0;
						}
					}
				}
				break;	
		}
		callback && callback.call(this , singleStepScore ) 
	}
	//本地保存分数
	function saveMaxScore(size , score , bestScore){
		if(score > bestScore){
			window.localStorage.setItem('bestScore--'+ size , score)
		}
	}
	//获取本地分数
	function getMaxScoreFromLocalStorage(size){
		return window.localStorage.getItem('bestScore--' + size)
	}
	//显示最高分
	function showMaxScore(ele , score , bestScore){
		return ele.innerHTML = score > bestScore ? score:bestScore;
	}
	/*
		第五步：游戏结束和胜利
	*/
	function gameOver(rootEle , scoreEl , callback){
		var wrapper = document.createElement('div'),
			h3 = document.createElement('h3'),
			restarBtn = document.createElement('button');
			wrapper.className = 'gr-wrapper';
			h3.className = 'gr-title';
			restarBtn.className = 'gr-btn';
			h3.innerHTML = '游戏结束';
			restarBtn.innerHTML = '重新开始';
			wrapper.appendChild(h3);
			wrapper.appendChild(restarBtn);
			rootEle.appendChild(wrapper);
			restarBtn.addEventListener('click', function(){
				scoreEl.innerHTML = 0;
				callback && callback.call(this,wrapper)
			})
	}
	function gameWin (rootEle , scoreEl,restarCallback, continueCallback){
		var wrapper = document.createElement('div'),
			h3 = document.createElement('h3'),
			restarBtn = document.createElement('button');
			continueBtn = document.createElement("button");
			wrapper.className = 'gw-wrapper';
			h3.className = 'gw-title';
			restarBtn.className = 'gw-btn';
			continueBtn.className = "gw-btn";
			h3.innerHTML = '游戏胜利';
			restarBtn.innerHTML = '重新开始';
			continueBtn.innerHTML = "继续游戏";
			wrapper.appendChild(h3);
			wrapper.appendChild(restarBtn);
			wrapper.appendChild(continueBtn)
			rootEle.appendChild(wrapper);
			restarBtn.addEventListener('click', function(){
				scoreEl.innerHTML = 0;
				restarCallback && restarCallback.call(this,wrapper)
			})
			continueBtn.addEventListener('click' , function(){
				rootEle.removeChild(wrapper);
				continueCallback && continueCallback.call(this)
			})
	}
	var Game = {
		//常量 通常大写字母
		ARROW_LEFT : 37,	//左键
		ARROW_TOP : 38 ,	//上键
		ARROW_RIGHT : 39 ,  //右键
		ARROW_DOWN : 40 ,	//下键
		score : 0 ,         //初始分数
		size : 4 ,			// 初始的盒子大小（尺寸）
		data : [] ,			// 矩阵数据
		bestScore : 0 ,		//最高分
		isInit : true,      //是否是初始化
		//初始化游戏的函数，config 是在使用这个 _2048 的时候需要的一些配置信息
		init : function(config){
			var gui = {} ;  //存放布局信息
			// 保存这个配置信息
			this.config = config,
			// 2048 游戏总容器
			this.wrap = config.wrap;
			//游戏内容容器
			this.content = config.parent;
			//游戏得分容器
			this.scoreEl = config.score;
			//游戏得分容器
			this.bestScoreEl = config.bestScore;
			//游戏盒子大小，有默认值，默认是 4 表示 4 * 4 的结构
			this.size = config.size || this.size;
			//生成默认的矩阵
			for (var i = 0; i < this.size; i++) {
				this.data[i] = [];
				for (var j = 0; j < this.size; j++) {
					this.data[i][j] = 0
				}
			}
			gui = initGUI(this.data);
			this.root = gui.root;
			this.element = gui.list;
			//初始化的时候获取最高分
			this.bestScore = getMaxScoreFromLocalStorage(this.size);
			try {
				if(getWindowSize().w > 640){
					this.wrap.style.width = 40 + this.size * 5 + 60 * this.size + 'px';
				}
				this.bestScoreEl.innerHTML = this.bestScore;
				this.scoreEl.innerHTML = this.score;
				this.content.appendChild(this.root)
				return this
			} catch(e) {
				throw new Error(e)
			}

		},
		//游戏开始
		start : function(){
			var self = this;
			fillNumbers(this.data , this.isInit)
			this.isInit = false;
			drawGUI(this.data , this.element)
			//第三步
			handler = registerEvent(function(code){
				if(self.isGameOver()){
					window.removeEventListener('keydown', handler);
					gameOver(self.content, self.scoreEl,function(ele){
						self.root.parentNode.removeChild(self.root);
						ele.parentNode.removeChild(ele);
						self.init(self.config).start();
						self.isInit = true;
					})
				}
				switch (code){
					case self.ARROW_LEFT:
						console.log('ARROW_LEFT')
						self.go('left');
						break;
					case self.ARROW_TOP:
						console.log('ARROW_TOP')
						self.go('up');
						break
					case self.ARROW_RIGHT:
						console.log("ARROW_RIGHT")
						self.go("right");
						break;
					case self.ARROW_DOWN:
						console.log("ARROW_DOWN")
						self.go("down");
						break;
				}
				drawGUI(self.data , self.element)  //当时写错了this.element
				//设置分数
				self.scoreEl.innerHTML = self.score;
				//保存最高分
				saveMaxScore(self.size,self.score,self.bestScore);
				showMaxScore(self.bestScoreEl,self.score,self.bestScore);
				if(self.isWin()){
					gameWin(self.content,self.scoreEl,function(ele){
						self.root.parentNode.removeChild(self.root)
						ele.parentNode.removeChild(ele)
						self.init(self.config).start()
						self.isInit = true;
					},function(){

					})
				}
			})
		},
		//移动
		go : function(keyWord){
			var matrix = this.data,
				self = this;
			if(keyWord){
				if( this.canGo(keyWord)){
					move(matrix , keyWord)
					merge(matrix , keyWord , function(singleStepScore){
						self.score +=singleStepScore
					})
				}
				fillNumbers(matrix , self.isInit)
			}
		}, 
		canGo : function(keyWord){
			var matrix = this.data;
			switch (keyWord) {
				case 'left':
					return canGoLeft(matrix)
					break;
				case "up":
					return canGoUp(matrix)
					break;
				case "right":
					return canGoRight(matrix)
					break;
				case "down":
					return canGoDown(matrix)
					break;
			}
		},
		//游戏结束
		isGameOver : function(){
			return !(this.canGo("left") || this.canGo("right") || this.canGo("up") || this.canGo("down"))
		},
		//获取每一个元素的内容
		getMax : function(){
			var max = 0;
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					if ( max < this.data[i][j] ) {
						max = this.data[i][j]
					}
				}
			}
			return max;
		},
		//游戏胜利 有一个元素的内容达到2048
		isWin : function(){
			return this.getMax() === 2048;
		}
	}
	return{
		Game : Game
	}
})(window , document)
