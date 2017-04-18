var beerTypes = [
    "ale",
    "saison",
    "IPA",
    "stout",
    "pale ale",
    "dark ale",
    "lager",
    "pilsner",
    "wheat beer",
    "porter",
    "tripel",
    "altbier",
    "american pale ale",
    "gose"
];

var adjectives = [
    "indigo",
    "majestic",
    "crimson",
    "purple",
    "lavendar",
    "green",
    "red",
    "rosy",
    "scarlet",
    "silver",

    "hoppy",
    "bitter",
    "sweet",
   
    "great",
    "strong",
    "light",
    "heavy",
    "hazy",
    "clear",
    "noisy",
    "faint",   
    
    "hipster",    
    "girly",
    "manly",    
    "old fashioned",
    "vegan",
    "futuristic",
    "modern",
    "regular",
    "eternal",
    "annual",
    "bewildered",
    "fierce",
    "glorious",
    "old",
    "swanky",
    "gleaming",
    "lovely",
    "murky",
    "colorful",
    "beautiful",
    "blonde"
];

var funnyWords = [
    "hipster approved",
    "hippity hoppity",
    "not sweet but sour",
    "grandma's favorite",
    "x-rated",
    "wholesale",
    "probably harmful",
    "mostly harmless",
    "basically pure alcohol",
    "minors favorite",
]

function beer(){
    var beerType = beerTypes[Math.floor(Math.random() * beerTypes.length)];
    var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    var adjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];

    if(adjective == adjective2){
        adjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];
    }

    var beerName = adjective + " " + beerType;

    var funnyWordN = Math.floor(Math.random() * 10) + 1;
    if(funnyWordN == 10){
        var funnyWord = funnyWords[Math.floor(Math.random() * funnyWords.length)];
        beerName = funnyWord + " " + beerName;
    }
    else{
        beerName = adjective2 + " " + beerName;
    }

    var div = document.getElementById("beer")
    div.innerHTML = beerName;
}

beer();
