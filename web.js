var express = require("express");
var cheerio = require('cheerio');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());

app.post('/work', function (req, res) {
  if (req.body.hasOwnProperty('map')) {
    var map = req.body.map;
  }else{
    var map = '';
  }

  $ = cheerio.load(map, {xmlMode:true});

  var output = [];
  $('checkpoint').each(function (i, elem) {

    var cp = [$(elem).attr('posX'), $(elem).attr('posY'), $(elem).attr('posZ'),
        $(elem).attr('size')];

    // update every int to float (like 5 to 5.0)
    // because @PAWNO 5 is wrong where float is expected
    cp.forEach(function (elem, i) {
      if (elem % 1 == 0) {
        cp[i] = parseInt(elem).toFixed(1);
      }
    });

    // let's conver comments too .-.
    var com =  $(elem).attr('id');

    output.push('{2, 0, 0, ' + cp.join(', ') + ', 0, 0, 0, 0, false} //' + com);
  });

  res.send(output.join('\n'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});