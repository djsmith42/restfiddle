var express = require('express');
var app = express();
var uuid = require('node-uuid');

var LISTEN_PORT              = 3000;
var DEFAULT_ARRAY_LENGTH     = 10;
var MAX_ARRAY_LENGTH         = 10000;
var ASCII_ALPHABET           = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var UNICODE_ALPHABET         = "ȦƁƇḒḖƑƓĦĪĴĶĿḾȠǾƤɊŘŞŦŬṼẆẊẎẐȧƀƈḓḗƒɠħīĵķŀḿƞǿƥɋřşŧŭṽẇẋẏẑ";
var MAX_RANDOM_STRING_LENGTH = 500

app.disable('etag');
app.disable('x-powered-by');

var server = app.listen(LISTEN_PORT, function() {
    console.log('restfiddle listening on port %d', server.address().port);
});

app.get('/', function(req, res) {
    if (req.query.type == 'array') {
        var payload = [];
        var length = Math.min(req.query.length || DEFAULT_ARRAY_LENGTH, MAX_ARRAY_LENGTH);
        var template = req.query.template;
        for (var i=0; i<length; i++) {
            var renderedTemplate = template;
            renderedTemplate = replaceAll(renderedTemplate, '$firstName', randomFirstName);
            renderedTemplate = replaceAll(renderedTemplate, '$lastName',  randomLastName );
            renderedTemplate = replaceAll(renderedTemplate, '$uuid4',     uuid.v4        );
            renderedTemplate = populateIntegers(renderedTemplate);
            renderedTemplate = populateRandomStrings(renderedTemplate);
            try {
                var object = JSON.parse(renderedTemplate);
            } catch (err) {
                res.status(400);
                res.header('Content-Type', 'text/plain');
                res.send('Error: Your template contains invalid JSON: ' + err);
                return;
            }
            payload.push(object);
        }
    } else {
        res.status(400);
        res.header('Content-Type', 'text/plain');
        res.send('Error: Invalid or missing type');
        return;
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.json(payload);
});

function replaceBetween(string, start, length, what) {
    return string.substring(0, start) + what + string.substring(start+length);
};

function makeRandomString(len) {
    return randomStringHelper(len, ASCII_ALPHABET);
}

function makeRandomUnicodeString(len) {
    return randomStringHelper(len, UNICODE_ALPHABET);
}

function randomStringHelper(len, alphabet) {
    var ret = '';
    for (var i=0; i<len; i++) {
        ret += randomElement(alphabet);
    }
    return ret;
}

function populateRandomStrings(string) {
    var found;
    while ((found = /\$(string|unicode):(\d+)/g.exec(string))) {
        var stringOrUnicode = found[1];
        var len = Math.min(MAX_RANDOM_STRING_LENGTH, parseInt(found[2], 10));
        var fn = (stringOrUnicode == 'string' ? makeRandomString : makeRandomUnicodeString);
        string = replaceBetween(string, found.index, found[0].length, fn(len));
    }
    return string;
}

function populateIntegers(string) {
    var found;
    while ((found = /\$integer:(\d+):(\d+)/g.exec(string))) {
        var min = parseInt(found[1], 10);
        var max = parseInt(found[2], 10);
        // FIXME Validate that min < max
        var randomNumber = parseInt(Math.random() * (max - min) + min);
        string = replaceBetween(string, found.index, found[0].length, randomNumber+"");
    }
    return string;
}

function replaceAll(string, toReplace, fn) {
    while (string.indexOf(toReplace) > -1) {
        string = string.replace(toReplace, fn())
    }
    return string;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomFirstName() {
    return randomElement(FIRST_NAMES)
}

function randomLastName() {
    return randomElement(LAST_NAMES)
}

var FIRST_NAMES = [
    "Craig",
    "David",
    "Joyce",
    "Andrea",
    "Barbara",
    "Robert",
    "Gary",
    "Donald",
    "Bobby",
    "Joshua",
    "Wayne",
    "Keith",
    "Gerald",
    "Julie",
    "Brandon",
    "Phillip",
    "Larry",
    "Terry",
    "Judith",
    "Sara",
    "Irene",
    "Phyllis",
    "Amy",
    "Samuel",
    "Margaret",
    "Raymond",
    "Justin",
    "Christopher",
    "Jimmy",
    "Theresa",
    "Martin",
    "Adam",
    "Sandra",
    "Janice",
    "Ralph",
    "Martha",
    "Kenneth",
    "Mark",
    "Jesse",
    "Russell",
    "Brenda",
    "Dorothy",
    "Jacqueline",
    "Timothy",
    "Carol",
    "Kelly",
    "Debra",
    "Shirley",
    "Rebecca",
    "Jessica",
    "Christine",
    "Paul",
    "Diana",
    "Carl",
    "Todd",
    "Tina",
    "Willie",
    "Juan",
    "Julia",
    "Louise",
    "Henry",
    "Matthew",
    "Chris",
    "Elizabeth",
    "Tammy",
    "Evelyn",
    "Earl",
    "Joe",
    "Kimberly",
    "Heather",
    "Michelle",
    "Ryan",
    "Eric",
    "Sarah",
    "Richard",
    "Jack",
    "Helen",
    "Brian",
    "Bruce",
    "Jane",
    "Douglas",
    "Cheryl",
    "Howard",
    "Arthur",
    "Anthony",
    "Mildred",
    "Harry",
    "Cynthia",
    "Aaron",
    "Kathryn",
    "Rose",
    "Marie",
    "Roy",
    "Frank",
    "Ruth",
    "Laura",
    "Roger",
    "Walter",
    "Anne",
];

var LAST_NAMES = [
    "Kelly",
    "Taylor",
    "Gonzalez",
    "Griffin",
    "Brooks",
    "Clark",
    "Price",
    "Reed",
    "Johnson",
    "Murphy",
    "Ross",
    "Watson",
    "Gray",
    "Simmons",
    "Moore",
    "Rivera",
    "Lee",
    "Walker",
    "Gonzales",
    "Baker",
    "Lewis",
    "Campbell",
    "Hill",
    "Martinez",
    "Martin",
    "Scott",
    "Rodriguez",
    "Thompson",
    "Patterson",
    "Jenkins",
    "Wright",
    "Peterson",
    "Morgan",
    "Cook",
    "Ward",
    "Diaz",
    "Harris",
    "Thomas",
    "Hughes",
    "Alexander",
    "Long",
    "Robinson",
    "Bryant",
    "Howard",
    "Parker",
    "Hall",
    "Evans",
    "Torres",
    "Sanchez",
    "James",
    "Washington",
    "White",
    "Foster",
    "Nelson",
    "Collins",
    "Wilson",
    "Phillips",
    "Mitchell",
    "Wood",
    "Williams",
    "Allen",
    "Bell",
    "Garcia",
    "Russell",
    "Lopez",
    "Davis",
    "Henderson",
    "Carter",
    "Adams",
    "Anderson",
    "Cooper",
    "Bailey",
    "Green",
    "Rogers",
    "Jones",
    "Jackson",
    "Butler",
    "Young",
    "Brown",
    "Ramirez",
    "Morris",
    "Sanders",
    "Stewart",
    "Hernandez",
    "Coleman",
    "Powell",
    "Cox",
    "Turner",
    "Miller",
    "Flores",
    "Perez",
    "Roberts",
    "Perry",
    "Smith",
    "King",
    "Barnes",
    "Bennett",
    "Edwards",
    "Richardson",
];

