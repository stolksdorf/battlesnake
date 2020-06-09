//legalMoves

//deadManSwitch

//killShot

const utils = {

	// getLegalMoves : (state)=>{

	// }

	allCoords : ({width, height})=>{
		return Array.from({length: width*height}, (v,i)=>{
			return {x:i%width, y:Math.floor(i/height)}
		});
	},
	getLegalMoves : (state, {x,y})=>{
		let moves = utils.getMoves({x,y});
		return Object.keys(moves).reduce((acc, move)=>{
			if(utils.isLegal(state, moves[move])) acc[move] = moves[move];
			return acc;
		}, {});
	},

	getMoves : ({x,y})=>{
		return {
			right : {x:x+1,y},
			left  : {x:x-1,y},
			down  : {x,y:y-1},
			up    : {x,y:y+1},
		}
	},
	isLegal : (state, {x,y})=>{
		const space = utils.inspect(state, {x,y});
		return space == 'empty' || space == 'food';
	},

	inspect : (state, {x,y})=>{
		let board = state.board;
		if(x < 0 || x > board.width) return 'wall';
		if(y < 0 || y > board.height) return 'wall';
		if(board.food.find((f)=>f.x==x&&f.y==y)) return 'food';
		const snek = board.snakes.find((snek)=>{
			return snek.body.find((f)=>f.x==x&&f.y==y)
		});
		if(snek) return snek.id;
		return 'empty';
	},

	snakesAt : (state, {x,y}, skipId=false)=>{
		return state.board.snakes.reduce((acc, snek)=>{
			if(snek.id == skipId) return acc;
			if(snek.head.x==x&&snek.head.y==y){
				acc.head.push(snek);
			}else if(snek.body.find((p)=>p.x==x&&p.y==y)){
				acc.body.push(snek);
			}
			return acc;
		}, {body:[], head:[]});
	},



	print : (state)=>{
		const color = [
			(txt)=>`\x1b[36m${txt}\x1b[0m`,
			(txt)=>`\x1b[35m${txt}\x1b[0m`,
			(txt)=>`\x1b[32m${txt}\x1b[0m`,
			(txt)=>`\x1b[33m${txt}\x1b[0m`,
			(txt)=>`\x1b[31m${txt}\x1b[0m`,
			(txt)=>`\x1b[90m${txt}\x1b[0m`,
		];

		let board = Array.from({length: state.board.height+1}, (v, x) =>{
			return Array.from({length: state.board.width+1}, (v, y) =>{
				return '.';
			});
		});

		const update = (x,y,txt)=>board[state.board.height-y][x] = txt

		//add food
		state.board.food.map(({x,y})=>update(x,y,'F'));

		//add sneks
		state.board.snakes.map((snek, i)=>{
			snek.body.map(({x,y})=>update(x,y,color[i]('B')))
			update(snek.head.x, snek.head.y, color[i]('H'));
		});

		const lines = board.map(line=>line.join(' '));
		lines[0] += `   Turn ${state.turn}`
		state.board.snakes.map((snek, i)=>{
			lines[i+1] += `   ${color[i](snek.name)} (${snek.health}) [${snek.length}]`;
		})
		return lines.join('\n');
	},







};



module.exports = utils;