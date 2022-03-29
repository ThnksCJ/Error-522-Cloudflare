const ejs = require('ejs');
const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const port = 8008;

app.use(cors());

dAtE = new Date();

var hh = dAtE.getHours();
var mm = dAtE.getMinutes();
var ss = dAtE.getSeconds();


function randomString(len, charSet) {
    charSet = charSet || 'abcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

function isValidUrl(url) {
  return url.includes('.');
}

app.get('/', (req, res) => {
    res.redirect('/cloudflare');
});

app.get('/cloudflare', (req, res) => {
    if(req.query.url == null){
        res.json({ Error: 'Invalid URL', Usage: '?url='})
    }else if(isValidUrl(req.query.url)){
        let today = dAtE.toISOString().slice(0, 10)
        let currenttime = hh + ":" + mm + ":" + ss;
        var zone = dAtE.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]
        var cloudflareid = Math.random().toString().slice(2,10) + randomString(3) + Math.random().toString().slice(2,7);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        res.render('Error-522.ejs', {
            domain: req.query.url,
            rayid: cloudflareid,
            date: today,
            time: currenttime,
            ip: ip,
            timezone: zone
        })
    }else{
        res.json({ Error: 'Invalid URL', Usage: '?url='})
    }
});

app.listen(port, () => {
    console.log(`Webserver listening on ::${port}`)
});
