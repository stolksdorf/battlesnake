const SnekServer = require('./lib/snek.server.js');

const Sneks = require('./sneks');

SnekServer.defaultConfig = {
	apiversion : '1',
	author     : 'stolksdorf',
	color      : '#29434E',
	head       : 'default',
	tail       : 'default'
};

Object.entries(Sneks).map(([name, actions])=>SnekServer.add(name, actions));

const PORT = 8000;

SnekServer.start(PORT).then(()=>{
	console.log('_____________________________');
	console.log(`🐍🐍🐍 battlesnek server running on port: ${PORT} 🐍🐍🐍`);
})
.catch((err)=>console.log(err))