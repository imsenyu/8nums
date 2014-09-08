var MAXN = 388211;
var d = [[0,4,0,2],[0,5,1,3],[0,6,2,0],[1,7,0,5],[2,8,4,6],[3,9,5,0],[4,0,0,8],[5,0,7,9],[6,0,8,0]];
var st = [];
var target = {sta:0,pos:0,step:0,visit:0};
var source = {sta:0,pos:0,step:0,visit:0};
var beginT, endT;

function sigma(arr) {
	var result = 0;
	for (var i=1; i<9; i++) {
		for ( var j=0;j<i;j++) {
			if ( arr[j] < arr[i] )
				result ++;
		}
	}
	return result;
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

var main = function () {

	var sour = [8,7,2,6,5,4,3,1,0];
	var targ = [1,2,3,4,5,6,7,8,0];

	var result = produce(sour, targ);

	console.log("result", result);

	function produce(sou, tar) {
		var i = 0;
		var q = [];
		var index;
		var count = 0;
		var steps = -1;
		var isSolve = false;
		var sourceDest ;
		var targetDest ;
		var paths = [];


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

		var changePath = [];
		stepTraverse(sourceDest, paths, changePath, true);
		stepTraverse(targetDest, paths, changePath, false);

		return {path: changePath, time: endT-beginT, stateNum: count, stepNum: steps, solve: true };

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
		//console.log("memory", memory[search(source)]);
	}
};


main();