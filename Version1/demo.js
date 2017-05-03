/**
 * Created by Louis Saglio on 03/04/2017.
 */

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


    // Chargement du plateau de jeu
    for (var ligne=0; ligne<largeur*11; ligne+=largeur){
        for (var colonne=0; colonne<largeur*11; colonne+=largeur){
                charger_image('libre.jpg', ligne, colonne);
        }
    }

    // Chargement du chat sur sa position initiale
    var chat_x = 250;
    var chat_y = 250;
    charger_image("chat.png", chat_x, chat_y);


    var cases_vertes = [];


    canvas1.onclick = function (event) {
        var X = event.clientX - event.clientX % largeur;
        var Y = event.clientY - event.clientY % largeur;

        if ((X !== chat_x || Y !== chat_y) && (contains(cases_vertes, [X, Y]) === false)) {

            charger_image('plein.jpg', X, Y);
            cases_vertes.push([X, Y]);

            var chat_new_x = chat_x;
            var chat_new_y = chat_y;

            if (X > chat_x){
                chat_new_x -= largeur;
            }
            else if (X < chat_x){
                chat_new_x += largeur;
            }

            if (Y > chat_y){
                chat_new_y -= largeur;
            }
            else if (Y < chat_y){
                chat_new_y += largeur;
            }

            // si la cases où le chat veut aller n'est pas vertes
            if (contains(cases_vertes, [chat_new_x, chat_new_y]) === false){
                charger_image('libre.jpg', chat_x, chat_y);
                charger_image('chat.png', chat_new_x, chat_new_y);
                chat_x = chat_new_x;
                chat_y = chat_new_y;
            }
            // si cette case est verte
            else {
                var cases_possibles = [];
                var cases_dispo = [[chat_x+largeur, chat_y+largeur], [chat_x+largeur, chat_y-largeur], [chat_x-largeur, chat_y+largeur], [chat_x-largeur, chat_y-largeur],  [chat_x, chat_y-largeur], [chat_x, chat_y+largeur], [chat_x+largeur, chat_y], [chat_x-largeur, chat_y]];
                for (var i=0; i<cases_dispo.length; i++) {
                    if (contains(cases_vertes, cases_dispo[i]) === false) {
                        cases_possibles.push([cases_dispo[i][0], cases_dispo[i][1]]);
                    }
                }
                if (0 in cases_possibles){
                    var coords = getRandomItem(cases_possibles);
                    chat_new_x = coords[0];
                    chat_new_y = coords[1];
                    charger_image('libre.jpg', chat_x, chat_y);
                    charger_image('chat.png', chat_new_x, chat_new_y);
                    chat_x = chat_new_x;
                    chat_y = chat_new_y;
                }
                else {
                    console.log("Gagné !");
                }

            }

        }
    };
};