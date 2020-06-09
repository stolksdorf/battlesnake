const { getLegalMoves } = require('../lib/utils.js');
const pluck = (arr)=>arr[Math.floor(Math.random()*arr.length)];

module.exports = {
	config : {},

	move : (data, cb)=>{

		cb({move : 'left'});
	},
}