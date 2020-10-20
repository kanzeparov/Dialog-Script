const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const Iconv = require('iconv').Iconv;
const port = 3000
var lunr = require("lunr")
const { base64encode, base64decode } = require('nodejs-base64');
require("lunr-languages/lunr.stemmer.support")(lunr)
require("lunr-languages/lunr.ru")(lunr)


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
        var result = "";
        var badwords = ["Приемлемый","адекватный","выполнимо","Между","Зависит","Эффективный","Быстрый","моментальный","Гибкий","Улучшенный","минимизируйте","Необязательно","Несколько","Реальный","Достаточный","позволяет"]
        conv = Iconv('windows-1251', 'utf8');
        let decodedString = conv.convert(buf).toString();
        decodedString = deleteAllSymbols(strip_html_tags(decodedString.toLowerCase()));
        var wordsBef = decodedString.split(' ');
        var words = wordsBef.filter(function (el) {
            return el != "";
        });
        console.log(words)

        var index = lunr(function () {
            this.use(lunr.ru)
            this.ref('id')
            this.field('text')

            for(var i = 0; i < words.length; i++) {
                this.add({
                    'id': i,
                    'text': words[i]
                })
            }
        });

        // for(var i = 0; i < badwords.length; i++) {
        //     console.log(index.search(badwords[i].toLowerCase));
        // }


        for(var i = 0; i < words.length; i++) {
            for(var j = 0; j < badwords.length; j++) {
                if (words[i].startsWith(badwords[j].toLowerCase())) {
                    result += badwords[j] + "; ";
                }
            }
        }



        //console.log(buf);
        console.log("ok");
        console.log(base64decode(result+"dwdwqdqw"));
    } catch (e) {
        console.log(e);
    }

    res.send("ok" + base64decode(result.toString()));
})



function strip_html_tags(str)
{
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, ' ');
}

function deleteAllSymbols(str)
{
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString().toLowerCase();
    return str.replace(/[^а-я]/g, ' ');
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
