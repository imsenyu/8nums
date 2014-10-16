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
	1. 显示双向宽度优先搜索
	2. 显示AStar 优先队列搜索

	设计一个统一的 康拓展开存储状态

	1. source，target状态
	2. 转换成number康拓展开
	3. 用 一个队列记录path
		用hashmap存储每个状态数的 next指向 

	4. 双向宽搜
		开一个队列，push， unshift
		第一次push source 第二次push target
		然后开始 while

	5. AStar
		开一个优先队列，存储的是康拓状态，同时用hash存储每个状态的nexts
		第一次push source，
		每次取 top 状态，pop，更新hash[top]计算next，查看hash是否存在，不存在的全都扔进去queue，如果有 target就停止

	6. 
 */


var defaultSource = [8,6,7,2,5,4,3,0];
var defaultTarget = [1,2,3,4,5,6,7,8,0];
var direction = [[0,4,0,2],[0,5,1,3],[0,6,2,0],[1,7,0,5],[2,8,4,6],[3,9,5,0],[4,0,0,8],[5,0,7,9],[6,0,8,0]];
var cantorFactor = [1,1,2,6,24,120,720,5040,40320,362880,3628800];

function cantor(arr, len) {
	var temp = [];
	var i, j;
	var ret = 0, mul=0;
	len = len || arr.length;
	for ( i=0; i<len; i++ )
		temp[i] = arr[i]+1;
	for ( i=0; i<len; i++ ) {
		mul = 0;
		for ( j=i+1; j< len; j++ ) {
			mul += temp[i] > temp[j] ? 1:0;
		}
		ret += mul * cantorFactor[ len-i-1 ];
	}
	return ret;
}

function reCantor(num, len) {
	len = len || 9;
	
	var i, j;
	var quo, rem;
	var ret = [];
	var ind;
	for ( i = len-1; i>=0; i--) {

		quo = parseInt( num / cantorFactor[ i ] );
		rem = num - quo * cantorFactor[ i ];
		quo += 1;
		
		ind = [].concat(ret).sort();
		for ( j = 0; j<len; j++ ) {
			if ( ind[j] <= quo ) {
				quo++;
			}
		}
		ret.push(quo);
		num = rem;
	}
	for ( i=0; i<ret.length; i++ ) 
		ret[i] -=1;
	return ret;
}

var path = []; //成功路径
var traverse = []; //遍历路径
var map = {}; //状态记录
var queue = new prioityQueue(cmp); //选择最优状态集

function cmp(a, b) {
	var A=AStar2(a), B=AStar2(b);
	//return map[a].step < map[b].step;
	return A==B? map[a].step>map[b].step: A<B;
}

function AStar(state ) {
	//console.log('state', state, map[state])
	var arr = map[state].arr;
	var ret=0;
	for(var i =0;i<arr.length;i++) 
		ret += arr[i] == defaultTarget[i] ? 0:1;
	return  map[state].step + ret;
}

var manhd = [    
[ 0, 1, 2, 1, 2, 3, 2, 3, 4],  
[ 1, 0, 1, 2, 1, 2, 3, 2, 3],  
[ 2, 1, 0, 3, 2, 1, 4, 3, 2],  
[ 1, 2, 3, 0, 1, 2, 1, 2, 3],  
[ 2, 1, 2, 1, 0, 1, 2, 1, 2],  
[ 3, 2, 1, 2, 1, 0, 3, 2, 1],  
[ 2, 3, 4, 1, 2, 3, 0, 1, 2],  
[ 3, 2, 3, 2, 1, 2, 1, 0, 1],  
[ 4, 3, 2, 3, 2, 1, 2, 1, 0]  
  
]; 

function AStar2(state) {
	var arr = map[state].arr;
	var ret=0;
	for(var i=1;i<=arr.length;i++) {
		var x=arr[i-1]
		var y=i%arr.length
		ret += manhd[x][y];
	}
	return  map[state].step + ret;
}

function getZero(arr) {
	for(var i=0;i<arr.length;i++) {
		if (arr[i] == 0) return i;
	}
}

function exchangeState(top, j) {
	var state = top.state;
	var arr = top.arr;
	var ret = [].concat(arr);
	var pos = getZero(arr);
	var dir = direction[pos][j];
	if (!dir) return 0;
	ret[pos] = ret[dir-1];
	ret[dir-1] = 0;
	return ret;
}

var bT,eT;

bT=(new Date()).getTime();

var source = cantor(defaultSource);
var target = cantor(defaultTarget);



map[source] = {
	state: source,
	step: 0,
	arr: reCantor(source)
};

queue.push(source);
var flag = false;
while ( !queue.empty() ) {
	var top = queue.top();
	queue.pop();
	var ele = map[top];
//	console.log(ele, AStar(ele.state))
	//path.push(top);
	traverse.push(top);

	//上下左右
	for(var j = 0;j<4;j++) {
		var stArr;
		if ( stArr = exchangeState(ele, j) ) {
				
			var stState = cantor(stArr);
			if (  map[stState] ) continue;
			map[stState] = {
				state:stState,
				step: ele.step+1,
				arr: stArr
			};

			if ( target == stState ) {
				console.log('found'); 
				flag = true;
				break;

			}

			queue.push(stState);
		}

	}
	if ( flag ) break;
	
}
console.log(traverse.length);
eT=(new Date()).getTime();
console.log('Time', eT-bT);