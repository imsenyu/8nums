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
    //  console.log('Heap Poped', heap);
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

var maxStates = 388211;
// 9! 所有状态数
var direction = [[0,4,0,2],[0,5,1,3],[0,6,2,0],[1,7,0,5],[2,8,4,6],[3,9,5,0],[4,0,0,8],[5,0,7,9],[6,0,8,0]];
var states = [];
var defaultState = {state:0, pos:0, step:0, visit:0, astar:0};
var beginT, endT;

function isType(type) {
    return function (item) {
        return ({}).toString.call( item ) === '[object '+type+']';
    };
}

var utils = {
    isArray: isType('Array'),
    isString: isType('String'),
    isObject: isType('Object'),
    isUndefined: isType('Undefined'),
    clock: function () {
        return (new Date()).getTime();
    },
    deepCopy: function (s) {
        var ret = {};
        for ( var k in s )
            if ( s.hasOwnProperty( k ) )
                ret[k] = s[k];
        return ret;
    },
    canSolve: function (arr) {
        var ret = 0;
        for ( var i=1;i<=8;i++ )
            ret += p(arr, i);
        return ret;

        function p(arr, x) {
            var ret = 0;
            for ( var i=0;i<9;i++ ) {
                if ( arr[i] < x )
                    ret ++;
                else if ( arr[i] === x )
                    break;
            }
            return ret;
        }
    },
    arr2state: function (arr) {
        var ret = {state:0, pos:0, step:0, visit:0, astar:0};//utils.deepCopy(defaultState);
        for (var i=0;i<9;i++ ) {
            if ( arr[i] !== 0 ) {
                ret.state |= ((arr[i]-1)<<(24-i*3));
            }
            else {
                ret.state |= (arr[i]<<(24-i*3));
                ret.pos = i;
            }
        }
        return ret;
    },
    state2arr: function (state) {
        var ret = [];
        for (var i = 0; i< 9; i++) {
            if (state.pos !== i) {
                ret[i] = (state.state>>(24-i*3) ) & 7;
                ret[i] ++;
            }
            else {
                ret[i]=0;
            }
        }
        return ret;
    },
    stateExchange: function (state, newPos) {
        var ret = {state:0, pos:0, step:0, visit:0, astar:0};//utils.deepCopy(defaultState);
        var mask = 7<<((9-newPos)*3);
        //制作新位置蒙版
        ret.state = state.state;
        mask = mask & state.state;
        //取state在新位置的数值
        mask = (mask>>((9-newPos)*3))<<((9-state.pos-1)*3);
        //移动到空格位置
        ret.state |= mask;
        //设置空格位置的新值
        ret.state &= ~(7<<((9-newPos)*3));
        //把新的空格位置 置为 000
        ret.pos = newPos - 1;

        return ret;
    },
    search: function (state) {
        var index = state.state % maxStates;
        var flag = true;

        while ( flag ) {
            if ( ! states[index] ) {
                states[index] = {state:0, pos:0, step:0, visit:0, astar:0};//utils.deepCopy(defaultState);
                states[index].state = state.state;
                states[index].pos = state.pos;
                flag = false;
            }
            else if ( !(states[index].state^state.state)&&!(states[index].pos^state.pos) ) {
                flag = false;
            }
            else {
                index = (index+1) % maxStates;
            }
        }
        return index;
    }
};

function main() {
    var targetArr = [1,2,3,4,5,6,7,8,0];
    var sourceArr = [8,6,7,2,5,4,3,1,0];//[8,6,7,2,5,4,3,1,0];
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
    function cmp(a, b) {
        var A=AStar(a), B=AStar(b);
        return A==B?(states[a].step<states[b].step):A<B;
    }

    function AStar(s) {
        //console.log('state', state, map[state])
        var state = states[s];
        var ret = 0;
        if(state.astar)return state.astar + state.step;
        for (var i = 0; i< 9; i++) {
            if (state.pos !== i) {
                ret += manhattan[((state.state>>(24-i*3) ) & 7 )+1][i+1];
               // console.log("lll", ((state.state>>(24-i*3) ) & 7 ), i)
            }
        }
        state.astar = ret;
        return state.astar + state.step;
    }

    var queue = new prioityQueue(cmp);;

    var target = utils.arr2state( targetArr );
    var source = utils.arr2state( sourceArr );
    console.log("target", targetArr, target);
    console.log("source", sourceArr, source);

    beginT = utils.clock();

    var sourceIndex = utils.search(source);
    var targetIndex = utils.search(target);
    queue.push( sourceIndex );
    AStar(sourceIndex);
    console.log("queue.int", queue);


        if ( utils.canSolve(targetArr)%2 !== utils.canSolve(sourceArr)%2 ) {
            console.log("can't solve\n");
            return;
        }

        if(!(source.state^target.state)&&!(source.pos^target.pos)) {
            console.log("0\n");
            while(queue.length())queue.pop();
            return;
        }

    var isSolve = false;
    var cntt=0;
    while ( queue.length() && ! isSolve ) {
        var topState = queue.top();
        cntt++;
     if(cntt<10)   console.log("now", topState,utils.state2arr(states[topState]),states[topState]);
        for ( var i=0;i<4;i++ ) {
            if ( direction[states[topState].pos][i] && !(states[topState].visit & (1<<i)) ) {
                states[topState].visit |= (1<<i);
                var newState = utils.search( utils.stateExchange( states[topState], direction[states[topState].pos][i] ) );
                if (states[newState].state == states[targetIndex].state && states[newState].pos == states[targetIndex].pos) {
                    console.log("LLLLLLLLLLLL");
                    isSolve = true;
                }
                else if ( !states[newState].step ) {
                     states[newState].step = states[topState].step + 1;
                     queue.push( newState );
                }

            }
        }
        queue.pop();

    }


    endT = utils.clock();
    console.log("Times:", endT - beginT, isSolve, states.length,cntt);
}

main();