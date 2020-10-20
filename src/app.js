const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const Iconv = require('iconv').Iconv;

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.text({type: "text/html"}))

app.post('/', function (req, res) {
    console.log(`Example app listening at http://localhost:${port}`)
    try {
        var b64string = req.body.toString();
        var buf = (new Buffer.from(b64string, 'base64'));
        //conv = Iconv('windows-1251', 'utf8');
        //let decodedString = conv.convert(buf).toString();
        console.log(buf);
        console.log("ok");
    } catch (e) {
        console.log(e);
    }

    res.send(b64string);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
