/**
 * Created by Louis Saglio on 31/03/2017.
 */

window.onload = function () {

    var canvas1 = document.getElementById("canvas");
    var canvas = canvas1.getContext("2d");

    var largeur = 50;

    function charger_image(name, x, y) {
        var image = new Image();
        image.src = 'images/' + name;
        image.onload = function() {
            canvas.drawImage(this,x,y);
        };
    }

    function afficher_liste(liste) {
        for (var i=0; i<liste.length; i++){
            console.log(liste[i]);
        }
    }

    function contains(liste, item) {
        for (var i=0; i<liste.length; i++){
            if (liste[i][0] === item[0] && liste[i][1] === item[1]){
                return true;
            }
        }
        return false;
    }

    function getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    function getRandomItem(list) {
        return list[getRandom(0, list.length-1)]
    }


    function getCase(x, y, taille) {
        y = (y - (y % largeur)) / largeur;
        if (y % 2 === 0){
            x -= largeur / 2;
        }
        x = (x - (x % largeur)) / largeur;
        return [x, y];
    }

    function getCoord(x, y, taille) {
        var posy = y * taille;
        if (y % 2 === 0) {
            var posx = x * taille + taille / 2;
        }
        else{
            var posx = x * taille;
        }
        return [posx, posy];
    }


    function autre() {
        var X = event.clientX - 10;
        var Y = event.clientY - 10;
        var a = getCase(X, Y, largeur);
        var b = getCoord(a[0], a[1], largeur);
        return [b[0], b[1], a[0], a[1]];
    }


    function move_chat(old_x, old_y, new_x, new_y) {
        charger_image("rond.jpg", old_x, old_y);
        charger_image("chat.png", new_x, new_y);
    }


    // Chargement du plateau de jeu
    for (var ligne=0; ligne<largeur*11; ligne+=largeur){
        for (var colonne=0; colonne<largeur*11; colonne+=largeur){
            if (((colonne / largeur) % 2) === 0){
                charger_image('rond.jpg', ligne + largeur / 2, colonne);
            }
            else{
                charger_image('rond.jpg', ligne, colonne);
            }
        }
    }

    // Chargement du chat sur sa position initiale
    var chat_x = 250;
    var chat_y = 250;
    charger_image("chat.png", chat_x, chat_y);

    var cases_vertes = [];

    canvas1.onclick = function (event) {
        var a = autre();
        var X = a[0];
        var Y = a[1];

        var d = getCase(chat_x, chat_y, largeur);
        var c = getCoord(d[0] - 1, d[1] - 1, largeur);
        move_chat(chat_x, chat_y, c[0], c[1]);
        chat_x = c[0];
        chat_y = c[1];

        charger_image("rond2.jpg", X, Y);
    }
};