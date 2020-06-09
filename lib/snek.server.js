const http = require('http');

const getJson = async (req)=>{
	return new Promise((rslv,rej)=>{
		let body = '';
		req.on('data', (chunk)=>body += chunk);
		req.on('end', ()=>{
			try{ rslv(JSON.parse(body)) }catch(err){ rslv({}) }
		});
	})
};
let Sneks = {};
const Server = {
	defaultConfig : {
		apiversion : '1',
		author     : 'you',
		color      : '#FFF',
		head       : 'default',
		tail       : 'default'
	},
	add : (name, actions)=>{
		Sneks[name] = actions;
	},
	start : async (PORT=8000)=>{
		return new Promise((resolve, reject)=>{
			const server = http.createServer(async (req, res)=>{
				try{
					const [_, snekName, action='config'] = req.url.split('/');
					if(!Sneks[snekName]){
						res.writeHead(404, {'Content-Type': 'text/html'});
						return res.end('Battlesnake not found');
					}
					res.writeHead(200, { 'Content-Type': 'text/json' });
					if(action == 'config'){
						res.end(JSON.stringify({...Server.defaultConfig, ...Sneks[snekName].config}));
					}else if(!Sneks[snekName][action]){
						res.end('ok');
					}else{
						const json = await getJson(req);
						const result = await Sneks[snekName][action](json);
						res.end(JSON.stringify(result));
					}
				}catch(err){
					console.log(err);
				}
			});

			server.listen(PORT, resolve);
		})
	}
};

module.exports = Server;
