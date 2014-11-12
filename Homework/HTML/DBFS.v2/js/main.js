/** 
 * @fileoverview angular-controller
 * @author 郁森<senyu@mail.dlut.edu.cn>
 * @description 基于Angular框架的控制器，控制页面元素，资源
 */
var eightNums_DBFSApp = angular.module('eightNums_DBFSApp', []);
var eightNums_DBFSApp = angular.module('eightNums_DBFSApp', []);

/**
 * @description Angular.Filter过滤器
 */
eightNums_DBFSApp.filter('getWidth', function() {
    return function (data) {
        return data%3;
    };
}).filter('getHeight', function() {
    return function (data) {
        return parseInt(data/3);
    };
});

eightNums_DBFSApp.controller('mainPanel', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.fValue = 0;
    $scope.filter = {
        getWidth: function (data) {
            return data%3;
        },
        getHeight: function (data) {
            return parseInt(data/3);
        }
    };
    $scope.event = {
        /**
         * @description UI set按钮，根据文本框设置原始状态
         */
         set: function () {
            var splt = $scope.inputSourceArr.toString().split(',');
            var arr = [];
            for(var i = 0;i<splt.length;i++) {
                arr.push( parseInt(splt[i],10) );
            }
            $scope.inputSourceArr = arr.toString();
            if ( func.setSource(arr) ) {
                var res = func.getSourceArr();
                console.log( "更新原始状态",func.getSourceArr() )
                $scope.sourcePosition = func.remap( res );
                $scope.showPosition = func.remap( res );
                $scope.targetPosition = func.remap( func.getTargetArr() );

                $scope.hasSolution = func.hasSolution();
                $scope.event.solve();
            }
            else {
                alert("输入状态错误，请检查" );
                console.log( "输入状态错误",$scope.inputSourceArr );
            }
         },
        /**
         * @description UIrandom按钮，随机阵列并计算结果返回显示
         */
        random: function () {
            $scope.event.reset();

            var rnd = func.setRandom();
            $scope.inputSourceArr = rnd.toString();
            console.log("source", rnd);
            $scope.sourcePosition = func.remap( rnd );
            $scope.showPosition = func.remap( rnd );
            $scope.targetPosition = func.remap( func.getTargetArr() );

            $scope.hasSolution = func.hasSolution();
            $scope.event.solve();
        },
        /**
         * @description 对当前结果进行显示
         */
        solve: function () {
            $scope.result = func.getPath();
            if ( $scope.result && $scope.result.solve )
                $scope.showPosition = func.remap( $scope.result.path[0] );
            $scope.sourceIndex = 0;
        },
        /**
         * @description 步入下一个状态
         */
        next: function () {
            $scope.sourceIndex ++;
            if ( $scope.result && $scope.result.solve && $scope.sourceIndex < $scope.result.path.length) {
                $scope.showPosition = func.remap( $scope.result.path[$scope.sourceIndex] );
                $scope.fValue = $scope.event.getFValue();
            }
            else {
                $scope.sourceIndex --;
                $scope.showMessage = true;
                $timeout(function(){$scope.animateMessage = true;}, 50);
                $timeout(function(){$scope.animateMessage = false;},2000);
                $timeout(function(){$scope.showMessage = false;},2400);
                return false;
            }
            return true;
        },
        /**
         * @description 重置运行状态为0
         */
        reset: function () {
            $scope.animateMessage = false;
            $timeout(function(){$scope.showMessage = false;}, 400);

            if ( $scope.result && $scope.result.solve )
                $scope.showPosition = func.remap( $scope.result.path[0] );
             $scope.sourceIndex = 0;
        },
        /**
         * @description 自动调用next方法
         */
        auto: function () {
            if ( $scope.async ) return;
            $scope.async = true;
            goNext();
            function goNext() {
                if ($scope.event.next())
                    $timeout( function () {
                        goNext();
                    }, 150 );
                else {
                    $scope.async = false;
                }
            }
        },
        /**
         * @description 鼠标移动到路径上时 临时显示
         */
        pathView: function (event, index) {
            //console.log(event,index);
            $scope.holdMouseHover = true;
            $scope.tempIndex = index;
            $scope.showPosition = func.remap( $scope.result.path[ $scope.tempIndex ] );
        	$scope.fValue = $scope.event.getFValue();
        },
        /**
         * @description 鼠标移出时恢复状态显示
         */
        pathResume: function () {
            $scope.holdMouseHover = false;
            $timeout(function(){
                if ($scope.holdMouseHover) return;
                $scope.showPosition = func.remap( $scope.result.path[ $scope.sourceIndex ] );
            	$scope.fValue = $scope.event.getFValue();
            },500);
        },
        /**
         * @description 鼠标点选时状态切换
         */
        pathSelect: function (event, index) {
            $scope.sourceIndex = index;
            $scope.showPosition = func.remap( $scope.result.path[ $scope.sourceIndex ] );
            $scope.fValue = $scope.event.getFValue();
            try{$scope.$digest();}catch(e){}
        },
        /**
         * @description 监听键盘动作
         */
        keyControl: function (e) {
            var arr = func.getSourceArr();
            var ret = func.findZero(arr);
            var find = (ret[0]-1)*3+ret[1]-1;
            
            if ( e.which >= 37 && e.which <= 40 ) {
                console.log(find,ret);
                $scope.result = {};
                var flag = false;
                if( e.which===40 ) {
                    console.log("上");
                    if ( ret[0] != 1 ) {
                        arr[find]=arr[find-3];
                        arr[find-3]=0;
                        flag = true;
                    }
                }
                else if ( e.which===38 ) {
                    console.log("下");
                    if ( ret[0] != 3 ) {
                        arr[find]=arr[find+3];
                        arr[find+3]=0; 
                        flag = true;
                    }
                }
                else if ( e.which===37 ) {
                    console.log("右");
                    if ( ret[1] != 3 ) {
                        arr[find]=arr[find+1];
                        arr[find+1]=0;
                        flag = true;
                    }
                }
                else if ( e.which===39 ) {
                    console.log("左");
                    if ( ret[1] != 1 ) {
                        arr[find]=arr[find-1];
                        arr[find-1]=0;
                        flag = true;
                    }                    
                }
                if ( flag ) {
                    console.log(func.setSource(arr), arr)
                    //$scope.event.reset();
                    console.log( func.getSourceArr() );
                    $scope.sourcePosition = func.remap( arr );
                    $scope.showPosition = func.remap( arr );
                    $scope.targetPosition = func.remap( func.getTargetArr() );

                    //$scope.hasSolution = func.hasSolution();
                    $scope.event.solve();
                    $scope.$apply();
                }
                e.preventDefault();
            }
        },
        /**
         * @description 给路径显示时加入运行方向显示
         */
        calcDir: function (arr, index) {
            var a = index, b = index + 1;
            if ( arr.length <= b ) return '=';
            var Da = findBlank(arr[a]);
            var Db = findBlank(arr[b]);
            if ( Da<Db ) {
                if ( Db-Da === 1 )
                    return '←';
                else
                    return '↑';
            }
            else {
                if ( Da-Db === 1)
                    return '→';
                else
                    return '↓';
            }
            function findBlank(arr) {
                for( var i=0;i<9;i++ ) {
                    if ( arr[i] === 0 ) return i;
                }
                return -1;
            }
        },
        /**
         * @description 计算不在位数值（待修改）
         */
        getFValue: function () {
        	var ret = 0;
        	console.log('remap',$scope.showPosition);
        	for (var i=0;i<9;i++) {
        		if (i==0)
        			ret += 0;//(8 != $scope.showPosition[0]);
        		else 
        			ret += (i-1 != $scope.showPosition[i]);
        	}
        	return ret;
        }
    };

    var func = eightNums_DBFS();
    $scope.event.random();
    $scope.inputSourceArr = func.getSourceArr().toString();
    //$scope.event.solve();

    angular.element(document).on('keydown',$scope.event.keyControl);

}]);

/** 
 * @fileoverview eightNums_DBFS
 * @author 郁森<senyu@mail.dlut.edu.cn>
 * @description 八数码问题处理封装
 */
function eightNums_DBFS() {

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
    var target = {sta:0,pos:0,step:0,visit:0};
    var source = {sta:0,pos:0,step:0,visit:0};
    /**
     * @description 计时
     */
    var beginT, endT;
    /**
     * @description 默认随机状态
     */
    var defaultSource = [2,1,7,6,3,4,5,8,0];
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
        setSource:setSource,
        findZero: function (arr) {
            var ret = [-1,-1];
            for(var i=0;i<arr.length;i++) {
                if (arr[i]===0) {
                    ret[0] = parseInt(i/3, 0)+1;
                    ret[1] = i-(ret[0]-1)*3+1;
                    break;
                }
            }
            return ret;
        }
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
        target = {sta:0,pos:0,step:0,visit:0};
        source = {sta:0,pos:0,step:0,visit:0};
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

    function setSource(arr) {
        var ret = true;
        var map = {};
        try {
            for(var i=0;i<9;i++) {
                map[ arr[i] ] = true;
            }
            for(var i=0;i<9;i++) {
                ret = ret && map[i];
            }
        }
        catch (e){
            return false;
        }
        if ( ret ) {
            var init = defaultSource;
            for(var i=0;i<9;i++) {
                init[i]=arr[i];
            }
        }
        return ret;
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
                st[index] = st[index] || {sta:0,pos:0,step:0,visit:0};
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
         * @description q 为普通队列，实现宽搜
         */
        var q = [];
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
         * @description 查找source，target的哈希映射，并加入队列中
         */
        i = search(source);
        q.push(i);

        i = search(target);
        q.push(i);

        st[i] = st[i] || {sta:0,pos:0,step:0,visit:0};
        st[i].visit = 1;
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
            while(q.length)q.pop();
            return {path: [tar], stepNum: 0, solve: true};
        }

        /**
         * @description 开始队列双向搜索，已经加入 source，target状态
         */
        while ( q.length && ! isSolve ) {
            count ++;
            index = q[0];
            /**
             * @description 上下左右四个方向
             */
            for ( var j = 0; j < 4; j++ ) {
                if( d[st[index].pos][j] ) {
                    var flag = search(exchange(st[index],d[st[index].pos][j]));
                    /**
                     * @description 若该哈希状态未搜索过，则压入队列
                     */
                    if ( !st[flag].step ) {
                        st[flag].step = st[index].step + 1;
                        st[flag].visit = st[index].visit;
                        q.push(flag);
                        paths[flag] = index;
                    }
                    /**
                     * @description 搜索过的话，判断一下visit值，找到了
                     */
                    else {
                        if(st[flag].visit !== st[index].visit)
                        {
                            sourceDest = flag;
                            targetDest = index;

                            isSolve = true;
                            steps = (st[index].step + st[flag].step);
                        }
                    }
                }
            }
            /**
             * @description 查找完状态，出队列，shift是 js的Array弹队首的方法，pop是给栈用的
             */
            q.shift();
        }
        /**
         * @description 队列清除
         */
        while(q.length)q.pop();
        endT = (new Date()).getTime();

        if(!isSolve) return {solve: false, time: endT-beginT, stateNum: count};

        /**
         * @description 由path记录的路径还原最终路径结果，从source来的，从target来的 都要，还原两次
         */
        var changePath = [];
        stepTraverse(sourceDest, paths, changePath, true);
        stepTraverse(targetDest, paths, changePath, false);
        var tempState = {};
        convert(changePath[0], tempState);

        if(tempState.sta === target.sta) changePath = changePath.reverse();

        var changeFlag = true;
        for(var i=0;i<9;i++) {
            if ( defaultSource[i] !== changePath[0][i] )  {
                changeFlag = false;
                break;
            }
        }
        if ( !changeFlag ) {
            changePath.unshift( defaultSource );
        }
        return {time: endT-beginT, stateNum: count, stepNum: steps, solve: true, path: changePath};

        function stepTraverse(s, p, c, b) {
            var t = s;
            var flag = false;
            while(1) {
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