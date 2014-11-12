/** 
 * @fileoverview prioityQueue
 * @author 郁森<senyu@mail.dlut.edu.cn>
 * @description Javascript实现的 优先队列
 */
 ;(function (global) {
 	var prePrioityQueue = prioityQueue.prePrioityQueue = global.prioityQueue;
 	global.prioityQueue = prioityQueue;

    /**
     * @description 队列存储
     * @type {Array}
     */
 	var heap = [];
 	var op = {};
 	var length = 0;
 	/**
     * @description prioityQueue工厂函数
     * @arg {Function} cmp 排序比较函数
     * @arg {Array} arr 初始构造数据
     */
 	function prioityQueue(cmp, arr) {
 		op['arr'] = arr || [];1
 		op['cmp'] = cmp || function (a, b) { return a < b;};
 		length = op['arr'].length;
 		heap = [null].concat(op['arr']);
 		initQueue();
 		console.log('Heap Inited', heap);
 	}

 	function initQueue() {
 		var l = length;
 		for ( var i = parseInt(l/2); i>0; i-- ) {
 			queueAdjustTop(i, l);
 		}
 	}

 	function queueAdjustTop(l, r) {
 		var rc = heap[l];
 		for ( var i = 2*l; i<= r; i *= 2 ) {
 			if ( i<r && !op.cmp(heap[i], heap[i+1]) ) {
 				i++;
 			}
 			if ( op.cmp( rc, heap[i] ) ) break;
 			heap[l] = heap[i];
 			l = i;
 		}
 		heap[l] = rc;
 	}
 	//把最后一个元素往上冒
 	function queueAdjustBottom() {
 		var l = length,
 			p,
 			tSwap;
 		for ( var i = l; i>1; i = parseInt(i/2) ) {
 			p = parseInt(i/2);
 			if ( op.cmp( heap[i], heap[p] ) ) {
 				tSwap = heap[i];
 				heap[i] = heap[p];
 				heap[p] = tSwap;
 			}
 			else {
 				break;
 			}
 		}
 	}

 	function pushQueue(data) {
 		length++;
 		heap.push(data);
 		queueAdjustBottom();
 		//console.log('Heap Pushed', heap);
 	}

 	function popQueue() {
 		heap[1] = heap[length];
 		heap.pop();
 		length--;
 		queueAdjustTop(1, length);
 		if (length<=0) {
 			heap = [null];
 		}
 		if (length<0) {
 			length = 0;
 			console.warn('heap is empty!');
 		}
 	//	console.log('Heap Poped', heap);
 	}

 	function topQueue() {
 		if (length>0) return heap[1];
 		else {
 			console.warn('heap is empty!');
 			return null;
 		}
 	}

 	function getQueueLength() {
 		return length;
 	}

 	prioityQueue.prototype = {
 		push: pushQueue,
 		pop: popQueue,
 		top: topQueue,
 		length: getQueueLength,
 		empty: function () { return !getQueueLength(); },

 	}

 	return prioityQueue;

 })(global);


/** 
 * @fileoverview eightNums_AStar
 * @author 郁森<senyu@mail.dlut.edu.cn>
 * @description 八数码问题处理封装
 */
function eightNums_AStar() {

    /**
     * @description 最大状态数
     */
    var MAXN = 388211;
    /**
     * @description [i][j]，在i位置的元素值与上下左右进行交换后的位置，打表
     */
    var d = [[0,4,0,2],[0,5,1,3],[0,6,2,0],[1,7,0,5],[2,8,4,6],[3,9,5,0],[4,0,0,8],[5,0,7,9],[6,0,8,0]];
    /**
     * @description 状态map
     */
    var st = [];
    /**
     * @description 目标，源状态最初对象
     */
    var target = {sta:0,pos:0,step:0,visit:0,astar:0};
    var source = {sta:0,pos:0,step:0,visit:0,astar:0};
    /**
     * @description 计时
     */
    var beginT, endT;
    /**
     * @description 默认随机状态
     */
    var defaultSource = [8,6,7,2,5,4,3,1,0];//[2,1,7,6,3,4,5,8,0];
    var defaultTarget = [1,2,3,4,5,6,7,8,0];

    /**
     * @description 对外暴露方法
     * @method 设置随机源状态
     * @method 计算！取得路径
     * @method 数值列表与位置列表的转换
     * @method 判定是否有解
     * @method 取得源、目标状态数值数组
     */
    return {
        setRandom: randomSource,
        getPath: produce,
        remap: remap,
        hasSolution: hasSolution,
        getSourceArr: getArr('s'),
        getTargetArr: getArr('t'),
    };

    /**
     * @description 获取状态值
     */
    function getArr(type) {
        return function () {
            switch (type) {
                case 's': return defaultSource;
                case 't': return defaultTarget;
                default: return [1,2,3,4,5,6,7,8,0];
            }
        };
    }

    /**
     * @description 判定是否有解
     */
    function hasSolution(arS, arT) {
        arS = arS || defaultSource;
        arT = arT || defaultTarget;
        return sigma(arS)%2 === sigma(arT)%2;
    }

    function remap(arr) {
        var ret = [];
        for( var i=0;i<9;i++ ) {
            ret[arr[i]] = i;
        }
        return ret;
    }

    function init() {
        st = [];
        target = {sta:0,pos:0,step:0,visit:0,astar:0};
        source = {sta:0,pos:0,step:0,visit:0,astar:0};
    }

    function randomSource() {
        var init = defaultSource;
        for( var i=0;i<8;i++ ) {
            var rnd = random(i,9);
            var temp = init[rnd];
            init[rnd] = init[i];
            init[i] = temp;
        }

        return init;
    }

    function random(m, n) {
        return parseInt(Math.random()*(n-m)+m);
    }
    function sigma(arr) {
        var ret = 0;
        for ( var i=1;i<=8;i++ )
            ret += p(arr, i);
        return ret;

        function p(arr, x) {
            var ret = 0;
            for ( var i=0;i<9;i++ ) {
                if ( arr[i] && arr[i] < x )
                    ret ++;
                else if ( arr[i] === x )
                    break;
            }
            return ret;
        }
    }
    function convert(arr, state) {
        //state 引用传值
        state.sta = 0;
        for ( var i = 0; i < 9; i ++ ) {
            if ( arr[i] !== 0 ) {
                state.sta |= ((arr[i]-1)<<(24-i*3));
            }
            else {
                state.pos = i;
                state.sta |= (arr[i]<<(24-i*3));
            }
        }

        return 1;
    }

    function reconvert(state, arr) {
        for (var i = 0; i< 9; i++) {
            if (state.pos != i) {
                arr[i] = (state.sta>>(24-i*3) ) & 7;
                arr[i] ++;
            }
            else {
                arr[i]=0;
            }
        }
    }

    function exchange(state, pos) {
        //state 复制传值
        var temp = 7<<((9-pos)*3);
        var s = {sta:0,pos:0,step:0,visit:0};
        s.sta = state.sta;
        temp = temp & state.sta;
        temp = ((temp>>((9-pos)*3))<<((9-state.pos-1)*3));
        s.sta |= temp;
        s.sta &= ~(7<<((9-pos)*3));
        s.pos = pos-1;
        return s;
    }

    function search(state) {
        var index = state.sta % MAXN;
        var flag = true;
        while ( flag ) {
            if ( ! st[index] ) {
                st[index] = st[index] || {sta:0,pos:0,step:0,visit:0,astar:0};
                st[index].sta = state.sta;
                st[index].pos = state.pos;
                flag = false;
            }
            else if (!(st[index].sta^state.sta)&&!(st[index].pos^state.pos)) {
                flag = false;
            }
            else {
                index = (index+1) % MAXN;
            }
        }
        return index;
    }

    /**
     * @description 八数码问题主要处理函数
     */
    function produce(sou, tar) {
        init();
        var i = 0;
        /**
         * @description q 为优先队列对象
         */
        var q = new prioityQueue(cmp);
        var index;
        var count = 0;
        var steps = -1;
        var isSolve = false;
        var sourceDest ;
        var targetDest ;
        /**
         * @description 路径记录
         */
        var paths = [];

        var manhattan = //第i个数及其所处不同位置的Manhattan路径长度  
        [  
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  
        [-1, 0, 1, 2, 1, 2, 3, 2, 3, 4],  
        [-1, 1, 0, 1, 2, 1, 2, 3, 2, 3],  
        [-1, 2, 1, 0, 3, 2, 1, 4, 3, 2],  
        [-1, 1, 2, 3, 0, 1, 2, 1, 2, 3],  
        [-1, 2, 1, 2, 1, 0, 1, 2, 1, 2],  
        [-1, 3, 2, 1, 2, 1, 0, 3, 2, 1],  
        [-1, 2, 3, 4, 1, 2, 3, 0, 1, 2],  
        [-1, 3, 2, 3, 2, 1, 2, 1, 0, 1],  
        [-1, 4, 3, 2, 3, 2, 1, 2, 1, 0]  
          
        ];

        /**
         * @description 优先队列大小比较函数
         */
        function cmp(a, b) {
            var A=AStar(a), B=AStar(b);
            return A==B?(st[a].step<st[b].step):A<B;
        }

        /**
         * @description 计算AStar曼哈顿路径 H函数
         */
        function AStar(s) {
            //console.log('state', state, map[state])
            var state = st[s];
            var ret = 0;
            if(state.astar)return state.astar+ state.step;
            for (var i = 0; i< 9; i++) {
                if (state.pos !== i) {
                    ret += manhattan[((state.sta>>(24-i*3) ) & 7 )+1][i+1];
                   // console.log("lll", ((state.state>>(24-i*3) ) & 7 ), i)
                }
            }
            state.astar = ret ;
            return state.astar+ state.step;
        }
        
        /**
         * @description 初始化源状态，目标状态
         */
        tar = tar || defaultTarget;
        sou = sou || defaultSource;
        defaultTarget = tar;
        defaultSource = sou;

        /**
         * @description 由数组数值转换成 二进制数字存储状态
         */
        convert(tar, target);
        convert(sou, source);

        beginT = (new Date()).getTime();

        /**
         * @description 查找source的哈希映射
         */
        i = search(source);

        /**
         * @description 把待搜索原状态压入优先队列
         */
        q.push(i);
        /**
         * @description 初始化哈希映射i的数据（即初始状态的数据）
         */
        AStar(i);
        /**
         * @description 建立目标状态哈希数据
         */
        search(target);

        st[i].step  = 1;
        /**
         * @description 判定是否可解
         */
        if (sigma(sou)%2 !== sigma(tar)%2) {
            return {solve: false};
        }

        /**
         * @description 若待搜索原状态==目标状态，跳出
         */
        if(!(source.sta^target.sta)&&!(source.pos^target.pos)) {
            while(q.length())q.pop();
            return {changePath: [tar], stepNum: 0, solve: true};
        }

        /**
         * @description 开始队列循环搜索
         */
        while ( q.length() && ! isSolve ) {
            count ++;
            index = q.top();

            /**
             * @description 上下左右四个方向
             */
            for ( var j = 0; j < 4; j++ ) {
                /**
                 * @description 若方向可走，则搜索交换数字之后的哈希状态
                 */
                if( d[st[index].pos][j] ) {
                    var flag = search(exchange(st[index],d[st[index].pos][j]));
                    /**
                     * @description 若该哈希状态未搜索过，则压入优先队列
                     */
                    if ( !st[flag].step ) {
                        st[flag].step = st[index].step + 1;
                        q.push(flag);
                        paths[flag] = index;
                    }
                    
                    /**
                     * @description 若交换后的状态和原状态一样，则找到
                     */
                    if(st[flag].sta == target.sta)
                    {
                        sourceDest = flag;
                        paths[flag] = index;
                        isSolve = true;
                        steps = (st[index].step );
                    }
                    
                }
            }
            /**
             * @description 查找完状态，出队列
             */
            q.pop();
        }
        
        endT = (new Date()).getTime();
        console.log("done");
        /**
         * @description 优先队列clear
         */
        q = new prioityQueue(cmp);

        /**
         * @description 没找到，一般不可能，因为之前已经判定过了
         */
        if(!isSolve) {
            st = [];
            return {solve: false, time: endT-beginT, stateNum: count};
        }
        var changePath = [];
        
        /**
         * @description 由path记录的路径还原最终路径结果
         */
        stepTraverse(sourceDest, paths, changePath, true);
        st = [];

        return {time: endT-beginT, stateNum: count, stepNum: steps, solve: true, path: changePath};

        function stepTraverse(s, p, c, b) {
            var t = s;
            var flag = false;
            var cnt=40;
            while(cnt--) {
                var arr = [];
                reconvert(st[t], arr);
                b ? c.unshift(arr) : c.push(arr);
                t = p[t];
                if(!t || flag)break;
                flag = source.sta === st[t].sta;
            }
        }

    }



}

var func = eightNums_AStar();

do {
	func.setRandom();
}
while ( !func.hasSolution() );
console.log( "八数码问题-A*启发式搜索" );
console.log( "原状态 ", func.getSourceArr() );
console.log( "目标状态 ", func.getTargetArr() );

var result = func.getPath();
console.log( result );