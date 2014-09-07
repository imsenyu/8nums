var eightNumsApp = angular.module('8nums', []);

eightNumsApp.filter('getWidth', function() {
    return function (data) {
        return data%3;
    };
}).filter('getHeight', function() {
    return function (data) {
        return parseInt(data/3);
    };
});

eightNumsApp.controller('mainPanel', function($scope, $timeout) {

    var func = eightNums();
    $scope.count = 0;
    $scope.result = func.getPath();
    if ( $scope.result.solve )
        $scope.position = func.remap( $scope.result.path[0] );
    $scope.event = {
        random: function () {
            console.log(func.setRandom());
            $scope.result = func.getPath();
            if ( $scope.result.solve )
                $scope.position = func.remap( $scope.result.path[0] );
            $scope.count = 0;
        },
        next: function () {
            $scope.count ++;
            if ( $scope.result.solve && $scope.count < $scope.result.path.length) {
                $scope.position = func.remap( $scope.result.path[$scope.count] );

            }
            else if ( confirm("done?") ) {
                $scope.position = func.remap( $scope.result.path[0] );
                $scope.count = 0;
            }
            else {
                return false;
            }
            return true;
        },
        reset: function () {
            if ( $scope.result.solve )
                $scope.position = func.remap( $scope.result.path[0] );
             $scope.count = 0;
        },
        auto: function () {
            goNext();
            function goNext() {
                if ($scope.event.next())
                    $timeout( function () {
                        goNext();
                    }, 150 );
            }
        }
    };
});


function eightNums() {

    var MAXN = 388211;
    var d = [[0,4,0,2],[0,5,1,3],[0,6,2,0],[1,7,0,5],[2,8,4,6],[3,9,5,0],[4,0,0,8],[5,0,7,9],[6,0,8,0]];
    var st = [];
    var target = {sta:0,pos:0,step:0,visit:0};
    var source = {sta:0,pos:0,step:0,visit:0};
    var beginT, endT;
    var defaultSource = [2,1,7,6,3,4,5,8,0];
    var defaultTarget = [1,2,3,4,5,6,7,8,0];

    return {
        setRandom: randomSource,
        getPath: produce,
        remap: remap
    };

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

    function produce(sou, tar) {
        init();
        var i = 0;
        var q = [];
        var index;
        var count = 0;
        var steps = -1;
        var isSolve = false;
        var sourceDest ;
        var targetDest ;
        var paths = [];

        tar = tar || defaultTarget;
        sou = sou || defaultSource;

        convert(tar, target);
        convert(sou, source);

        beginT = (new Date()).getTime();

        i = search(source);
        q.push(i);

        i = search(target);
        q.push(i);

        st[i] = st[i] || {sta:0,pos:0,step:0,visit:0};
        st[i].visit = 1;
        st[i].step  = 1;

        if (sigma(sou)%2 !== sigma(tar)%2) {
            return {solve: false};
        }


        if(!(source.sta^target.sta)&&!(source.pos^target.pos)) {
            while(q.length)q.pop();
            return {changePath: [tar], stepNum: 0, solve: true};
        }

        while ( q.length && ! isSolve ) {
            count ++;
            index = q[0];
            for ( var j = 0; j < 4; j++ ) {
                if( d[st[index].pos][j] ) {
                    var flag = search(exchange(st[index],d[st[index].pos][j]));
                    if ( !st[flag].step ) {
                        st[flag].step = st[index].step + 1;
                        st[flag].visit = st[index].visit;
                        q.push(flag);
                        paths[flag] = index;
                    }
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

            q.shift();
        }
        while(q.length)q.pop();
        endT = (new Date()).getTime();

        if(!isSolve) return {solve: false, time: endT-beginT, stateNum: count};

        var changePath = [];
        stepTraverse(sourceDest, paths, changePath, true);
        stepTraverse(targetDest, paths, changePath, false);
        var tempState = {};
        convert(changePath[0], tempState);

        if(tempState.sta === target.sta) changePath = changePath.reverse();

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