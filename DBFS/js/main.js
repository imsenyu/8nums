var eightNumsApp = angular.module('eightNumsApp', []);

eightNumsApp.filter('getWidth', function() {
    return function (data) {
        return data%3;
    };
}).filter('getHeight', function() {
    return function (data) {
        return parseInt(data/3);
    };
});

eightNumsApp.controller('mainPanel', ['$scope', '$timeout', function($scope, $timeout) {

    $scope.filter = {
        getWidth: function (data) {
            return data%3;
        },
        getHeight: function (data) {
            return parseInt(data/3);
        }
    };
    $scope.event = {
        random: function () {
            $scope.event.reset();

            var rnd = func.setRandom();
            console.log("source", rnd);
            $scope.sourcePosition = func.remap( rnd );
            $scope.showPosition = func.remap( rnd );
            $scope.targetPosition = func.remap( func.getTargetArr() );

            $scope.hasSolution = func.hasSolution();
            $scope.event.solve();
        },
        solve: function () {
            $scope.result = func.getPath();
            if ( $scope.result && $scope.result.solve )
                $scope.showPosition = func.remap( $scope.result.path[0] );
            $scope.sourceIndex = 0;
        },
        next: function () {
            $scope.sourceIndex ++;
            if ( $scope.result && $scope.result.solve && $scope.sourceIndex < $scope.result.path.length) {
                $scope.showPosition = func.remap( $scope.result.path[$scope.sourceIndex] );

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
        reset: function () {
            $scope.animateMessage = false;
            $timeout(function(){$scope.showMessage = false;}, 400);

            if ( $scope.result && $scope.result.solve )
                $scope.showPosition = func.remap( $scope.result.path[0] );
             $scope.sourceIndex = 0;
        },
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
        pathView: function (event, index) {
            //console.log(event,index);
            $scope.holdMouseHover = true;
            $scope.tempIndex = index;
            $scope.showPosition = func.remap( $scope.result.path[ $scope.tempIndex ] );
        },
        pathResume: function () {
            $scope.holdMouseHover = false;
            $timeout(function(){
                if ($scope.holdMouseHover) return;
                $scope.showPosition = func.remap( $scope.result.path[ $scope.sourceIndex ] );
            },500);
        },
        pathSelect: function (event, index) {
            $scope.sourceIndex = index;
            $scope.showPosition = func.remap( $scope.result.path[ $scope.sourceIndex ] );
            try{$scope.$digest();}catch(e){}
        },
        keyControl: function (e) {
            if( e.which===38 ) {
                if ( $scope.sourceIndex > 0 )
                    $scope.event.pathSelect( null, $scope.sourceIndex-1 );
                e.preventDefault();
            }
            else if ( e.which===40 ) {
                if ( $scope.result && $scope.result.path && $scope.sourceIndex+1 < $scope.result.path.length)
                    $scope.event.pathSelect( null, $scope.sourceIndex+1 );
                e.preventDefault();
            }
        },
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
        }
    };

    var func = eightNums();
    $scope.event.random();
    $scope.event.solve();

    angular.element(document).on('keydown',$scope.event.keyControl);

}]);


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
        remap: remap,
        hasSolution: hasSolution,
        getSourceArr: getArr('s'),
        getTargetArr: getArr('t'),
    };

    function getArr(type) {
        return function () {
            switch (type) {
                case 's': return defaultSource;
                case 't': return defaultTarget;
                default: return [1,2,3,4,5,6,7,8,0];
            }
        };
    }

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
        defaultTarget = tar;
        defaultSource = sou;

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