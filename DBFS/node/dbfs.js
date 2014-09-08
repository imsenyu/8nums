var maxStates = 388211;
// 9! 所有状态数
var direction = [[0,4,0,2],[0,5,1,3],[0,6,2,0],[1,7,0,5],[2,8,4,6],[3,9,5,0],[4,0,0,8],[5,0,7,9],[6,0,8,0]];
var states = [];
var defaultState = {state:0, pos:0, step:0, visit:0};
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
        var ret = {state:0, pos:0, step:0, visit:0};//utils.deepCopy(defaultState);
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
        var ret = {state:0, pos:0, step:0, visit:0};//utils.deepCopy(defaultState);
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
                states[index] = {state:0, pos:0, step:0, visit:0};//utils.deepCopy(defaultState);
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
    var sourceArr = [8,6,7,2,5,4,3,1,0];

    var queue = [];

    var target = utils.arr2state( targetArr );
    var source = utils.arr2state( sourceArr );
    console.log("target", targetArr, target);
    console.log("source", sourceArr, source);

    beginT = utils.clock();

    var sourceIndex = utils.search(source);
    var targetIndex = utils.search(target);
    queue.push( sourceIndex );
    queue.push( targetIndex );

    console.log("queue.int", queue);

/*    states[targetIndex] = utils.deepCopy(defaultState);
    states[targetIndex].visit = 1;
    states[targetIndex].step  = 1;*/

    if ( utils.canSolve(targetArr)%2 !== utils.canSolve(sourceArr)%2 ) {
        console.log("can't solve\n");
        return;
    }

    if(!(source.state^target.state)&&!(source.pos^target.pos)) {
        console.log("0\n");
        while(queue.length)queue.pop();
        return;
    }

    var isSolve = false;
    var dest1, dest2;
    var paths = [];
    while ( queue.length && ! isSolve ) {
        var topState = queue[0];
       //console.log("queue.length", queue.length);
        for ( var i=0;i<4;i++ ) {
            //从 topState 的 0 移动4个方向 的 具体位置
            if ( direction[states[topState].pos][i] ) {
                var newState = utils.search( utils.stateExchange( states[topState], direction[states[topState].pos][i] ) );
               // console.log("newState", newState);
                if ( !states[newState].step ) {
                    states[newState].step = states[topState].step + 1;
                    states[newState].visit = states[topState].visit;
                    queue.push( newState );
                }
                else if ( states[newState].visit^states[topState].visit ) {
                    isSolve = true;
                    console.log("done,", states[topState].step + states[newState].step);
                    dest1 = topState;
                    dest2 = newState;
                }
            }
        }
        queue.shift();
    }

    endT = utils.clock();
    console.log("Times:", endT - beginT);
}

main();