const express = require('express')
const app = express()
const port = 3000

//Gpio du raspberry
const Gpio = require('onoff').Gpio;
// Gpio du capteur
var sensor = new Gpio(17, 'in', 'both');

//Création et configuration d'un server dse websockets
const websocket = require('ws');
const wss = new websocket.Server({ port: 3030 });
var clients = [];
wss.on('connection', function connection(ws) {
	clients.push(ws);
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
});

//Fonction pour quitter le script
function exit() {
	sensor.unexport();
	process.exit();

// Détection de mouvements
sensor.watch(function (err, value) {
		if(err) exit();
	//Si le capteur détecte du mouvement 
	//On affiche 'Mouvement détecté'
		if(value == 1) {
			function sendText(text) {
        			for(index in clients) {
       					 clients[index].send(text);
        }}};

//fonction pour envoyer du texte à tous les clients
//function sendText(text) {
//	for(index in clients) {
//		clients[index].send(text);
//	}
//};


//OS est un utilitaire node qui va nous servir à afficher le nom de notre raspberry
const os = require("os");
//MustacheExpress est notre moteur de template
const mustacheExpress = require('mustache-express');

//Configuration du moteur de template
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

//Ici on dit au serveur de servir les fichiers statiques depuis le dossier /public
app.use(express.static('public'))

//On retrouve le même comportement que notre serveur précédent
app.get('/', (request, response) => {
	//Ici on indique que nous voulons transformer notre fichier index.mustache en HTML
	response.render('index');
});

app.listen(port, (err) => {
	if (err) {
		return console.log('Erreur du serveur : ', err)
  	}
	//On utilise l'utilitaire OS pour récupérer le nom de notre raspberry.
	console.log('Le serveur écoute sur le port '+port+'\nRendez vous sur http://'+os.hostname()+'.local:'+port);
	console.log('Tappez votre texte ici, il sera envoyé sur votre page web instantanément.');
});
