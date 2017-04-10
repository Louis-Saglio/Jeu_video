/**
 * Created by Louis Saglio on 06/04/2017.
 */

window.onload = function () {

    function hasard(min, max) {
        var a = Math.random() * (max - min);
        return Math.round(a + min);
    }

    function hasard_item(liste) {
        return liste[hasard(0, liste.length-1)];
    }

    function hasard_pol(val) {
        if (hasard(0, 1) === 0) {
            return val * -1;
        }
        else {
            return val;
        }
    }

    function random_sort(liste) {
        var rep = [];
        var a = liste.length;
        for (var i=0; i<a; i++){
            rep.push(liste.splice(hasard(0, liste.length-1), 1));
        }
        return rep;
    }

    function shuffle(a)
    {
        var j = 0;
        var valI = '';
        var valJ = valI;
        var l = a.length - 1;
        while(l > -1)
        {
            j = Math.floor(Math.random() * l);
            valI = a[l];
            valJ = a[j];
            a[l] = valJ;
            a[j] = valI;
            l = l - 1;
        }
        return a;
    }

    function remove(liste, item) {
        for (var i in liste){
            if (i === item){

            }
        }
    }

    function print(param) {
        console.log(param);
    }

    function append(liste, item) {
        liste.push(item);
        return liste.reverse();
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
            if (this.plateau[x][y].apparence !== "images/rond2.jpg") {
                this.plateau[this.chat.x][this.chat.y].set_apparence("rond.jpg");
                this.chat = {x: x, y: y};
                this.plateau[this.chat.x][this.chat.y].set_apparence("chat.png");
                this.dernier_mouvement_reussie = true;
            } else {
                print("cases verte");
                this.dernier_mouvement_reussie = false;
            }
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

        try_move : function (liste_dir) {
            for (var i=0; i<liste_dir.length; i++) {
                print(liste_dir[i]);
                var mv_fact = this.find_move_factor(liste_dir[i]);
                if (this.plateau[this.chat.x + mv_fact.x][this.chat.y + mv_fact.y].apparence !== "images/rond2.jpg") {
                    this.move_chat(liste_dir[i]);
                    break;
                }
            }
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
        },

        modify_direction : function (direction) {
            if (direction === "h") {
                var newChat = "h" + hasard_item("gd");
            }
            if (direction === "b") {
                var newChat = "b" + hasard_item("gd");
            }
            if (direction === "g") {
                var newChat = hasard_item("hb") + "g";
            }
            if (direction === "d") {
                var newChat = hasard_item("hb") + "d";
            }
            return newChat;
        },

        find_next_frized_case : function (pos) {
            var rep = {};
            var liste_dir = ["hg", "hd", "mg", "md", "bg", "bd"];
            for (var i=0; i<liste_dir.length; i++) {
                print(liste_dir[i]);
                var mv_fact = this.find_move_factor(liste_dir[i]);
                if (this.plateau[pos.x + mv_fact.x][pos.y + mv_fact.y].apparence !== "images/rond2.jpg") {
                    rep[liste_dir[i]] = {"x": pos.x + mv_fact.x, "y": pos.y + mv_fact.y};
                }
            }
            return rep;
        },

        recup_dir : function (dir) {
            if (dir === "h"){
                return shuffle(["hg", "hd"]);
            }
            if (dir === "b"){
                return shuffle(["bg", "bd"]);
            }
            if (dir === "g"){
                return shuffle(["bg", "hg"]);
            }
            if (dir === "d"){
                return shuffle(["bd", "hd"]);
            }
        },

        generate_dir_to_try : function () {
            var rep = [];
            for (var i of this.direction){
                rep = rep.concat(this.recup_dir(i));
            }
            return rep;
        },

        decide : function () {
            if (!("direction" in this)){
                this.direction = shuffle(["h", "g", "b", "d"]);
            }
            this.try_move(this.generate_dir_to_try());
        }

    };


    var a = Object.create(Plateau);
    a.init();
    a.refresh();

    canvas1.onclick = function () {
        var X = event.clientX;
        var Y = event.clientY;
        if (a.onMouse_case(X, Y).apparence === "images/rond.jpg") {
            a.onMouse_case(X, Y).set_apparence("rond2.jpg");
            a.decide();
            a.refresh();
        }
    }

};