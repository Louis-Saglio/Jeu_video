/**
 * Created by Louis Saglio on 06/04/2017.
 */

window.onload = function () {

    function hasard(min, max) {
        // Retourne un nombre aléatoire entre min et max
        var a = Math.random() * (max - min);
        return Math.round(a + min);
    }

    function hasard_item(liste) {
        //retourne un élément au hasard d'une liste
        return liste[hasard(0, liste.length-1)];
    }

    function shuffle(a)
    // mélange aléatoirement une liste
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
        // supprime tous les élément item de la liste liste
        var rep = [];
        for (var i=0; i<liste.length; i++) {
            if (liste[i] === item) {
                delete liste[i];
            }
        }
        for (var i=0; i<liste.length; i++) {
            if (liste[i] !== (undefined)){
                rep.push(liste[i]);
            }
        }
        return rep;
    }

    function contains(liste, item) {
        for (var i=0; i<liste.length; i++){
            if ((liste[i].x === item.x) && (liste[i].y === item.y)){
                return true;
            }
        }
        return false;
    }

    function move_item(liste, item, place) {
        remove(liste, item);
        var a = [];
        var c = [];
        for (var i=0; i<place; i++) {
            a.push(liste[i]);

        }
        for (var i=place; i<liste.length; i++) {
            c.push(liste[i]);
        }
        var b = [item];
        return remove((a.concat(b)).concat(c), undefined);
    }

    // On instancie nos objet de canvas
    var canvas1 = document.getElementById("canvas");
    var canvas = canvas1.getContext("2d");

    // Création de la classe Case modélisant les cases du plateau de jeu

    class TOTO {
        constructor (a, b){
            this.a = a;
            this.b = b;
        }

        test (){
            return 10;
        }
    }
    var Case = {

        // largeur en pixel des images des cases (doit correspondre à la largeur des images du dossier images
        largeur : 50,

        id : null,

        // setteur permettant de coordonner les modification des coordonnées théoriques (this.place.x et .y) avec les coordonnées réelles dans le canvas this.coord_x et _y
        set_place : function (x, y) {
            this.place_x = x;
            this.place_y = y;
            this.set_pos();
        },

        // setteur mettant à jour les coordonnées réelles en fonction des coordonnées théoriques
        set_pos : function () {
            this.coord_y = this.place_y * this.largeur;
            if (this.place_y % 2 === 0) {
                this.coord_x = this.place_x * this.largeur + this.largeur / 2;
            }
            else{
                this.coord_x = this.place_x * this.largeur;
            }
        },

        // setteur permettant de facilement modifier l'attribut this.apparence (qui indique le path de l'image de la case)
        set_apparence : function (app) {
            this.apparence = "images/" + app;
        },

        // affiche l'image de this aux bonnes coordonnées dans le canvas
        show : function () {
            var image = new Image();
            image.src = this.apparence;
            var x = this.coord_x;
            var y = this.coord_y;
            image.onload = function() {
                canvas.drawImage(image, x, y);
            };
        },

        // constructeur artificiel en attendant mieux
        init : function (x, y, i) {
            this.id = i;
            this.apparence = "images/libre.jpg";
            this.set_place(x, y);
        }

    };


    var Plateau = {

        largeur_case : 50,
        largeur_plateau : 11,
        plateau : [],
        chat : {x: 5, y: 6},
        historique_chat : [],

        // constructeur créant un tableau à deux dimensions rempli de Case et plaçant le chat sur la position par défaut
        init : function () {
            var id = 0;
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1){
                this.plateau.push([]);
                for (var colonne=0; colonne<this.largeur_plateau; colonne+=1){
                    var a = Object.create(Case);
                    a.init(ligne, colonne, id);
                    id += 1;
                    this.plateau[ligne].push(a);
                }
            }
            this.set_chat(this.chat.x, this.chat.y);
        },

        // gère complètement le déplacement du chat
        set_chat : function (x, y) {
            if (this.plateau[x][y].apparence !== "images/plein.jpg") {
                // On déplace le chat
                this.plateau[this.chat.x][this.chat.y].set_apparence("libre.jpg");
                this.chat = {x: x, y: y};
                this.plateau[this.chat.x][this.chat.y].set_apparence("chat.png");
            }
        },

        // trouve comment modifier les coordonnées théoriques d'un point en fonction d'une d'rection données (hg, bg, mg, hd, bd, md)
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

        // déplace le chat d'une case dans la direction données
        move_chat : function (dir) {
            var mv = this.find_move_factor(dir);
            this.set_chat(this.chat.x + mv.x, this.chat.y + mv.y);
            this.historique_chat.push(this.plateau[this.chat.x][this.chat.y].id);
        },

        // essaye de déplacer le chat dans la direction données par le premier élément liste_dir, si c'est une case verte, essaye avec le second élément etc.
        try_move : function (liste_dir) {
            for (var i=0; i<liste_dir.length; i++) {
                var mv_fact = this.find_move_factor(liste_dir[i]);
                if (this.plateau[this.chat.x + mv_fact.x][this.chat.y + mv_fact.y].apparence !== "images/plein.jpg") {
                    this.move_chat(liste_dir[i]);
                    break;
                }
            }
        },

        // met à jour l'affichage des cases du plateau
        refresh : function () {
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1) {
                for (var colonne = 0; colonne < this.largeur_plateau; colonne += 1) {
                    this.plateau[ligne][colonne].show();
                }
            }
        },

        // renvoie la case où se trouvent les coordonnées réelles x et y
        onMouse_case : function (x, y) {
            y = (y - (y % this.largeur_case)) / this.largeur_case;
            if (y % 2 === 0){
                x -= this.largeur_case / 2;
            }
            x = (x - (x % this.largeur_case)) / this.largeur_case;
            return this.plateau[x][y];
        },
        
        is_border : function (x, y) {
            return x === 0 || x === this.largeur_plateau || y === 0 || y === this.largeur_plateau;
        },

        // renvoie les deux directions les plus proches de dir (dont dir) dans un ordre aléatoire
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

        // renvoie une liste de directions où tenter de déplacer le chat
        generate_dir_to_try : function () {
            if (!("direction" in this)){
                this.direction = shuffle(["h", "g", "b", "d"]);
            }
            var rep = [];

            /*
            rep.map(function(el){


            });

            rep = [1,2,3,3,4];
            var somme = rep.reduce(function(prev, curr, index){
                return prev+curr;
            }, rep[0]);

            rep = [ { id : 10, somme : 20 },{ id : 13, somme : 20 },{ id : 15, somme : 20 },{ id : 11, somme : 20 },{ id : 20, somme : 20 } ];
            var instance = rep.find(function(el){

                return el.id === 11 ;
            });

            rep.includes(2)
             */





            for (var i of this.direction){
                rep = rep.concat(this.recup_dir(i));
            }
            rep = remove(rep, undefined);
            // hist = 3 dèrnières cases du chat
            var hist = this.historique_chat.slice(this.historique_chat.length-3, this.historique_chat.length);
            // copy = liste_des_directions_à_essayer
            var copie = rep;
            // for une_direction in copy:
            for (var direction of copie) {
                if (this.plateau[5]){

                }
            }
            return rep;
        },

        // lance l'ia du chat
        decide : function () {
            this.try_move(this.generate_dir_to_try());
        }

    };

    // création du plateau de jeu
    var a = Object.create(Plateau);
    a.init();
    a.refresh();

    canvas1.onclick = function (event) {
        // récupération des coordonnées de la souris
        var X = event.clientX;
        var Y = event.clientY;
        console.log('toto');
        if (a.onMouse_case(X, Y).apparence === "images/libre.jpg") {
            // si on a clické sur un une case clickable, la case cliqué est grisée
            a.onMouse_case(X, Y).set_apparence("plein.jpg");
            // le chat se déplace
            a.decide();
            // on met à jour l'affichage
            a.refresh();
        }
    }

};