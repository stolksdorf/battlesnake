const state = require('./lib/sample.state.json');

const engine = require('./lib/snek.engine.js');

const utils = require('./lib/utils.js');


// console.log(utils.print(state));


// //console.log(utils.getLegalMoves(state, "snake-508e96ac-94ad-11ea-bb37"));
// console.log(utils.getLegalMoves(state, {"x": 5, "y": 4}));
// console.log(utils.getLegalMoves(state, {"x": 0, "y": 0}));

// const nState = engine.next(state, [
// 	'left', //"My Snake"
// 	'up', //"Another Snake"
// ]);

// console.log(utils.print(nState));
// console.dir(nState, {depth : 8})


const snakes = {
	foo : {
		start : ()=>{
			console.log('LETS START')
		},
		move : (state)=>{
			return 'up'
		},
		end : ()=>{
			console.log('I am ded');
		}
	},
	bar : {
		move : (state)=>{
			return 'left'
		}
	},
	gru : {
		move : (state)=>{
			return 'down'
		}
	}
};


engine.play(snakes, null, (state)=>console.log(utils.print(state) + '\n'))
	.then((states)=>{
		console.log(states)
	})
	.catch((err)=>{
		console.log(err)
	});