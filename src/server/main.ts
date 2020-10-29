import express from 'express';
import Lobby from './lobby'
import path from "path";
const port = process.env.PORT || 3560;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mustache = require('mustache-express');
const morgan = require('morgan');

let lobbies: Lobby[] = [];

app.set('views', path.join(__dirname, '../client/pages'));
app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, '../client'), {redirect: false}));
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.get('/', (req, res) => {
    //res.send('Hello World!');
    //res.sendFile(__dirname + '/pages/lobby.mustache');
    let lobby = new Lobby(io);
    lobbies.push(lobby);
    res.redirect(307, '/lobby/' + lobby.id);
});

//Lobby is requested from invited player
app.get('/lobby/:lobbyId', (req, res) => {
    let lobbyId = req.params.lobbyId;
    let lobby = lobbies.filter(l => l.id === lobbyId)[0];
    if(lobby) {
        //res.render('lobby', {lobbyId, rules: lobby.getRules()});
        //res.send('Lobby found');
        console.log('[Express]: Lobby \'' + lobbyId + '\' requested. Found!');
        res.render('lobby');
    } else {
        //console.log('Lobby \'' + lobbyId + '\' not found');
        //res.status(404).render('lobbyNotFound', {lobbyId});
        //res.status(404).send('Lobby not found.<br><a href="/">Start a new one</a>');
        res.redirect(307, '/');
        console.log('[Express]: Lobby \'' + lobbyId + '\' requested. Not found!');
    }
});

app.get('/admin', (req, res) => {
    res.render('admin', {'lobbies': lobbies});
});

server.listen(port, () => {
    console.log(`Ploing! listening at http://localhost:${port}`)
});