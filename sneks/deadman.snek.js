const { getLegalMoves } = require('../lib/utils.js');


const pluck = (arr)=>arr[Math.floor(Math.random()*arr.length)];

module.exports = {
	config : {
		head: "beluga",
		tail: "default"
	},

	move : (data)=>{
		return {move : 'left'};
	},
}