import * as express from 'express';
import * as cors from 'cors';
import controllers from './controllers';
const app = express();

const env = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(controllers);

if (env === 'production') {
    const frontendFolder = __dirname + '/../frontend';
    // serve contents of backend/dist/frontend when built
    app.use(express.static(frontendFolder));
    app.all('/*', function (req, res, next) {
        // Just send the index.html for other files
        res.sendFile('index.html', { root: frontendFolder });
    });
} else {
    app.get('/', function (req, res) {
        res.send('This is where the server will serve the frontend app on production!');
    });
}

const port = process.env.PORT || '3000'
app.listen(port, function () {
    console.log('Backend listening on port ' + port + '!');
});

process.on('SIGINT', function () {
    //Graceful Shutdown
    process.exit();
});