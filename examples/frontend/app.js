var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var data = {
    access_token:  '1234567890',
    refresh_token: '0987654321'
};
var dataIncorrect = {
    access_token:  '3213213123',
    refresh_token: '0987654321'
};
var privateData = {
    data: 'This is a private data for demo'
};
var publicData = {
    data: 'This is public data for demo'
};

var user = {
    username: 'username',
    password: 'password'
};
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/login', function(req, res) {
    console.log(req.body);
    if (req.body.username == user.username &&
        req.body.password == user.password) {
        res.send(data);
    }
    else {
        res.status(401).send({error: 'Incorrect/Missing Username or Password'});
    }
});

app.post('/logout', function(req, res) {
    res.send({logout: 'success'});
});

app.get('/privateData', function(req, res) {
    if (req.headers.Authorization != undefined) {
        if (req.headers.Authorization == data.access_token) {
            res.send(privateData);
        }
        res.status(403).send({error: 'Access Token is Invalid!'});
    }
    res.status(401).send({error: 'Access Token is Missing!'});
});

app.get('/publicData', function(req, res) {
    res.send(publicData);
});

app.post('/auth/facebook', function(req, res) {
    if (req.body.code != undefined) {
        res.send(data);
    }
    else {
        res.status(401).send({error: 'Code Invalid/Missing!'});
    }
});

app.post('/auth/google', function(req, res) {
    if (req.body.code != undefined) {
        res.send(data);
    }
    else {
        res.status(401).send({error: 'Code Invalid/Missing!'});
    }
});

app.use(express.static('public'));
app.use(express.static('bower_components'));
// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
