/**
 * Created by Louis Saglio on 06/04/2017.
 */

window.onload = function () {

    function hasard(min, max) {
        var a = Math.random() * (max - min);
        return Math.round(a + min);
    }

    function hasard_item(liste) {
        return liste[hasard(0, liste.length)];
    }

    function hasard_pol(val) {
        if (hasard(0, 1) === 0) {
            return val * -1;
        }
        else {
            return val;
        }
    }

    function print(param) {
        console.log(param);
    }

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
        chat : {x: 7, y: 3},

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


        find_move_factor : function (dir) {
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
            return {"x": x, "y": y};
        },


        move_chat : function (dir) {
            var mv = this.find_move_factor(dir);
            this.set_chat(this.chat.x + mv.x, this.chat.y + mv.y);
        },

        refresh : function () {
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1) {
                for (var colonne = 0; colonne < this.largeur_plateau; colonne += 1) {
                    this.plateau[ligne][colonne].show();
                }
            }
            this.set_chat(this.chat.x, this.chat.y);
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


    var Ia = {

        refresh : function (plateau) {
            this.plateau = plateau.plateau;
            this.chat = plateau.chat;
            this.direction = hasard_item("hbgd");
        },

        find_move_case : function (dir, chat) {
            var y = 1;
            if (dir[0] === "h") {
                y = -1;
            }
            if (dir[1] === "g") {
                var x = -1;
                if (chat.y % 2 === 0) {
                    x = 0;
                }
            }
            if (dir[1] === "d") {
                var x = 0;
                if (chat.y % 2 === 0) {
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
            return {"x": chat.x + x, "y": chat.y + y};
        },

        find_relative_case : function (dir, num, chat) {
            for (var i=0; i<num; i++) {
                chat = this.find_move_case(dir, chat);
            }
            return chat;
        },

        find_one_axe : function (dir, chat) {
            var axe = [];
            for (var i=0; i<11; i++){
                axe.push(this.find_relative_case(dir, i, chat));
            }
            return axe;
        },

        find_axes : function (chat) {
            var axes = {"hg": [], "hd": [], "bg": [], "bd": [], "mg": [], "md": []};
            for (var dir in axes) {
                axes[dir] = this.find_one_axe(dir, chat);
            }
            return axes;
        },
        
        decide : function () {
            if (this.direction === "h") {
                var newChat = this.find_move_case("h" + hasard_item("gd"), this.chat);
            }
            if (this.direction === "b") {
                var newChat = this.find_move_case("b" + hasard_item("gd"), this.chat);
            }
            if (this.direction === "g") {
                var newChat = this.find_move_case(hasard_item("hb" + "g"), this.chat);
            }
            if (this.direction === "d") {
                var newChat = this.find_move_case(hasard_item("hb") + "d", this.chat);
            }

        }
    };


    var a = Object.create(Plateau);
    a.init();
    var b = Object.create(Ia);
    a.refresh();
    b.refresh(a);

    canvas1.onclick = function () {
        var X = event.clientX;
        var Y = event.clientY;
        a.onMouse_case(X, Y).set_apparence("rond2.jpg");
        //print(b.find_axes(b.chat));
        b.decide();
        a.refresh();
        b.refresh(a);

    }

};