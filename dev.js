/**
 * Created by Louis Saglio on 06/04/2017.
 */

window.onload = function () {

    var canvas1 = document.getElementById("canvas");
    var canvas = canvas1.getContext("2d");


    var Case = {

        largeur : 50,

        set_place : function (x, y) {
            this.place_x = x;
            this.place_y = y;
            this.set_pos();
        },

        set_pos : function () {
            this.coord_y = this.place_y * this.largeur;
            if (this.place_y % 2 === 0) {
                this.coord_x = this.place_x * this.largeur + this.largeur / 2;
            }
            else{
                this.coord_x = this.place_x * this.largeur;
            }
        },

        set_apparence : function (app) {
            this.apparence = "images/" + app;
        },

        show : function () {
            var image = new Image();
            image.src = this.apparence;
            var x = this.coord_x;
            var y = this.coord_y;
            image.onload = function() {
                canvas.drawImage(image, x, y);
            };
        },

        init : function (x, y) {
            this.apparence = "images/rond.jpg";
            this.set_place(x, y);
        }

    };


    var Plateau = {

        largeur_case : 50,
        largeur_plateau : 11,
        plateau : [],
        chat : {x: 5, y: 5},

        init : function () {
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1){
                this.plateau.push([]);
                for (var colonne=0; colonne<this.largeur_plateau; colonne+=1){
                    var a = Object.create(Case);
                    a.init(ligne, colonne);
                    this.plateau[ligne].push(a);
                }
            }
            this.set_chat(this.chat.x, this.chat.y);
        },

        set_chat : function (x, y) {
            this.plateau[this.chat.x][this.chat.y].set_apparence("rond.jpg");
            this.chat = {x: x, y: y};
            this.plateau[this.chat.x][this.chat.y].set_apparence("chat.png");
        },


        move_chat : function (dir) {
            var y = 1;
            if (dir[0] === "h") {
                y = -1;
            }
            if (dir[1] === "g") {
                var x = -1;
                if (this.chat.y % 2 === 0) {
                    x = 0;
                }
            }
            if (dir[1] === "d") {
                var x = 0;
                if (this.chat.y % 2 === 0) {
                    x = 1;
                }
            }
            if (dir[0] === "m") {
                y = 0;
                if (dir[1] === "g") {
                    x = -1;
                }
                if (dir[1] === "d") {
                    x = 1;
                }
            }
            this.set_chat(this.chat.x + x, this.chat.y + y);
        },

        refresh : function () {
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1) {
                for (var colonne = 0; colonne < this.largeur_plateau; colonne += 1) {
                    this.plateau[ligne][colonne].show();
                }
            }
        },

        onMouse_case : function (x, y) {
            y = (y - (y % this.largeur_case)) / this.largeur_case;
            if (y % 2 === 0){
                x -= this.largeur_case / 2;
            }
            x = (x - (x % this.largeur_case)) / this.largeur_case;
            return this.plateau[x][y];
        }

    };

    var a = Object.create(Plateau);
    a.init();
    a.refresh();

    canvas1.onclick = function () {
        var X = event.clientX;
        var Y = event.clientY;
        a.onMouse_case(X, Y).set_apparence("rond2.jpg");
        a.move_chat("mg");
        a.refresh();
    }

};