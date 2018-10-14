const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// configure express to use handelbars (hbs) as view engine (templates)
app.set('view engine', 'hbs');
// configuration partials (to inject footer in hbs templates)
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// passer une variable pour toutes les templates
hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();
})

app.use((req, res, next)=>{
    const now = new Date();
    const log = `${now} : ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err)=>{
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// maintenance du site : rediriger toutes les requêtes vers la page de maintenance.
// app.use((req, res, next)=>{
//     res.render('maintenance.hbs');
// });


// configure express to serve a static directory:
const _staticDirToServe = path.join(__dirname,'public');
app.use(express.static(_staticDirToServe));

// use process's port if exists, else use 3000 (locally)
const PORT = process.env.PORT || 3000;

const templateHome = {
    title : 'Home',
    texte: 'Bienvenu dans mon Site Web'
};

app.get('/', (res, rep)=>{
    rep.render('home.hbs', templateHome);
});

const templateProjects = {
    title : 'Projets',
    texte: 'Page dédiée pour les projets'
};

app.get('/projects', (res, rep)=>{
    rep.render('projects.hbs', templateProjects);
});

app.get('/test', (res, rep)=>{
    rep.send({
        info : 'page root',
        by : 'mboudhina'
    });
});

const templateAbout = {
    title : 'A propos :'
};

app.get('/about', (res, rep)=>{
    rep.render('about.hbs', templateAbout);
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});


