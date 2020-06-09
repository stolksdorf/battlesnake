const utils = require('./utils.js');

const sample = (arr, count=1, r=new Set())=>{
	r.add(arr[Math.floor(arr.length*Math.random())]);
	return (r.size == count) ? Array.from(r) : sample(arr, count, r);
};

const MAX_HEALTH = 100;

const Engine = {
	create : (sneks, size=11, opts={health : MAX_HEALTH, length : 3})=>{
		const coords = utils.allCoords({width : size, height : size});
		const starting = sample(coords, sneks.length);
		return {
			game: {
				id: "game-00000000-0000-0000-0000",
				timeout: 500
			},
			turn: 0,
			board: {
				height: size,
				width: size,
				food: [],
				snakes: sneks.map((name, idx)=>{
					return {
						id: `snake-00000000-0000-0000-000${idx}`,
						name: name,
						health: opts.health,
						body: [starting[idx]],
						head: starting[idx],
						length: opts.length
					}
				})
			}
		}
	},

	next : (state, moves)=>{
		let nState = {
			...state,
			board : {
				...state.board,
				food : state.board.food,
				snakes : state.board.snakes
			}
		};
		nState.turn = nState.turn + 1;
		nState.board.snakes = state.board.snakes.map((_snek, idx)=>{
			let snek = {..._snek};
			snek.health -= 1;
			const newHead = utils.getMoves(snek.head)[moves[idx]];
			const location = utils.inspect(state, newHead);

			if(location == 'food'){
				nState.board.food = state.board.food.filter(({x,y})=>x!=newHead.x&&y!=newHead.y);
				snek.health = MAX_HEALTH;
				snek.length += 1;
			}
			if(location == 'wall') return false;
			if(snek.health <= 0) return false;

			snek.body = [newHead].concat(snek.body);
			snek.head = newHead;
			snek.body = snek.body.slice(0, snek.length);

			return snek;
		})
		.filter((snek)=>!!snek);

		//Collision Check
		nState.board.snakes = nState.board.snakes.filter((snek)=>{
			const {body,head} = utils.snakesAt(nState, snek.head, snek.id);

			if(body.length > 0) return false; //ran into another snake;
			if(head.length){
				return !!head.find((fightingSnek)=>fightingSnek.length >= snek.length)
			}
			return true;
		}, []);

		//Create Food
		if(Math.random() < 0.15){
			const empty = utils.allCoords(nState.board).filter((coord)=>utils.inspect(nState, coord) === 'empty');
			nState.board.food.push(sample(empty)[0]);
		}

		return nState;
	},

	//Provide key-value pair of snake name and functions
	play : async (snakes, initState, cb=()=>{})=>{
		let state = initState;
		let history = [];
		if(!state) state = Engine.create(Object.keys(snakes));

		Object.values(snakes).map(({start})=>start && start());
		history.push(state);
		cb(state);

		const recur = async ()=>{
			const prevState = state;
			const moves = await Promise.all(state.board.snakes.map((snek)=>{
				return snakes[snek.name].move({
					...state,
					you : snek
				});
			}));
			state = Engine.next(state, moves);

			//TODO: implement 'end'

			history.push(state);
			cb(state);

			return state.board.snakes.length > 1
				? await recur()
				: history
		};
		return recur();
	},
}
module.exports = Engine;