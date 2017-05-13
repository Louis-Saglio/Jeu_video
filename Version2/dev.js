/**
 * Created by Louis Saglio on 03/05/2017.
 */

window.onload = function () {

    function shuffle(b)
    // mélange aléatoirement une liste
    {
        var a = [];
        for (var e in b){
            a.push(e);
        }
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

    function convert_quadra_dir_to_hexa_dir (dir) {
        if (dir === "h") return shuffle(["hg", "hd"]);
        if (dir === "b") return shuffle(["bg", "bd"]);
        if (dir === "g") return shuffle(["bg", "hg", "mg"]);
        if (dir === "d") return shuffle(["bd", "hd", "md"]);
    }

    function numerise_dir (dir, une_case){
        var y = 1;
        if (dir[0] === "h") y = -1;
        if (dir[1] === "g") {
            var x = -1;
            if (une_case.place.y % 2 === 0) x = 0;
        }
        if (dir[1] === "d") {
            var x = 0;
            if (une_case.place.y % 2 === 0) x = 1;
        }
        if (dir[0] === "m") {
            y = 0;
            if (dir[1] === "g") x = -1;
            if (dir[1] === "d") x = 1;
        }
        return {"x": x, "y": y};
    }

    function find_object_max_value (obj){
        for (var key in obj){
            var value = obj[key];
            var clef = key;
            break;
        };
        for (var key in obj){
            if (obj[key] > value) {
                value = obj[key];
                clef = key;
            }
        };
        return clef;
    }

    function declare_victory (){
        console.log("Victoire !");
    }

    function rand(fct) {
        return Math.round(Math.random() * fct) + 1;
    }

    var canvas1 = document.getElementById("canvas");
    var canvas = canvas1.getContext("2d");

    class Case {

        constructor(x, y, id, image, largeur) {
            this.id = id;
            this.largeur = largeur;
            this.set_place(x, y);
            this.set_etat("libre");
            this.nbr_passage = 0;
            this.move_factor = 0;
        }

        set_coord() {
            this.coord = {};
            this.coord.y = this.place.y * this.largeur;
            if (this.place.y % 2 === 0) {
                this.coord.x = this.place.x * this.largeur + this.largeur / 2;
            }
            else {
                this.coord.x = this.place.x * this.largeur;
            }
        }

        set_place(x, y) {
            this.place = {};
            this.place.x = x;
            this.place.y = y;
            this.set_coord();
        }

        set_etat(etat) {
            if (etat === "chat") this.nbr_passage += 1;
            this.etat = etat;
            this.image = "images/" + this.etat + ".jpg";
            this.show();
        }

        get_image(){
            if (this.etat === "chat"){
                return "images/chat.jpg";
            }
            return this.image;
        }

        show() {
            var self = this;
            var image = new Image();
            image.src = this.get_image() + "?t=" + Math.random();
            var x = this.coord.x;
            var y = this.coord.y;
            image.onload = function () {
                canvas.drawImage(image, x, y);
                // Outil de debug :
                // canvas.beginPath();
                // canvas.fillStyle = "#FF0000";
                // canvas.fillText(self.id,x + 25 ,y + 25);
                // canvas.closePath();

            };
        }

        is_border (){
            if (this.id % 11 === 0 || this.id % 11 === 10 || this.id < 11 || (this.id < 121 && this.id > 109)){
                return true;
            }
            else { return false };
        }

    }

    class Plateau {

        constructor() {
            this.largeur_case = 50;
            this.largeur_plateau = 11;
            this.plateau = [];

            var id = 0;
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1){
                this.plateau.push([]);
                for (var colonne=0; colonne<this.largeur_plateau; colonne+=1){
                    var ma_case = new Case(ligne, colonne, id, "rond", this.largeur_case);
                    id += 1;
                    this.plateau[ligne].push(ma_case);
                }
            }
            this.chat = this.plateau[5][5];
            this.set_chat(this.chat);
        }

        set_chat (new_case) {
            this.chat.set_etat("libre");
            this.chat.show();
            this.chat = this.plateau[new_case.place.x][new_case.place.y];
            this.chat.set_etat("chat");
            this.chat.show();
        }

        onMouse_case (x, y) {
            y = (y - (y % this.largeur_case)) / this.largeur_case;
            if (y % 2 === 0){
                x -= this.largeur_case / 2;
            }
            x = (x - (x % this.largeur_case)) / this.largeur_case;
            return this.plateau[x][y];
        }

        // Vérifier l'utilisation de cette fonction à la fin du developpement et éventuellement la supprimer
        show (){
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1){
                for (var colonne=0; colonne<this.largeur_plateau; colonne+=1)
                    this.plateau[ligne][colonne].show();
            }
        }

        find_case_by_dir (dir){
            var position_increments = numerise_dir(dir, this.chat);
            return this.plateau[position_increments.x + this.chat.place.x][position_increments.y + this.chat.place.y]
        }

        move_chat (dir){
            this.set_chat(this.find_case_by_dir(dir));
        }
    }

    class IA {

        constructor (plateau){
            this.pere = plateau;
            this.plateau = plateau.plateau;
            this.directions = {"hg": 0, "bg": 0, "mg": 0, "hd": 0, "bd": 0, "md": 0};
            this.dir = shuffle(this.directions)[0];
        }

        convert_negatives (){
            for (var dir in this.directions){
                if (this.directions[dir] < 0){
                    this.directions[dir] = 0.5;
                }
            };
        }

        random (){
            for (var dir in this.directions){
                this.directions[dir] += rand(9);
            };
        }

        good_dir (){
            for (var dir in this.directions){
                if (dir === this.dir){
                    this.directions[dir] += rand(9);
                }
            };
        }

        nbr_passage (){
            for (var dir in this.directions){
                this.directions[dir] -= rand(this.pere.find_case_by_dir(dir).nbr_passage * 2);
                this.convert_negatives();
            };
        }

        go_to_border (){
            for (var dir in this.directions){
                if (this.pere.find_case_by_dir(dir).is_border()){
                    this.directions[dir] += 100;
                }
            };
        }

        not_plein (){
            for (var dir in this.directions){
                if (this.pere.find_case_by_dir(dir).etat === "plein") {
                    this.directions[dir] = 0;
                };
            };
        }

        verifie_victory (){
            if (find_object_max_value(this.directions) === 0) {
                console.log("Victoire debug");
                declare_victory();
            }
        }

        decide (){
            this.directions = {"hg": 0, "bg": 0, "mg": 0, "hd": 0, "bd": 0, "md": 0};
            this.random();
            this.good_dir();
            this.nbr_passage();
            this.go_to_border();
            this.not_plein();
            this.verifie_victory();
            var dir_retenue = find_object_max_value(this.directions);
            this.debug();
            this.pere.move_chat(dir_retenue);
        }

        debug (){
            for (var dir in this.directions) {
                console.log(dir, this.directions[dir]);
            }
        }

    }

    var a = new Plateau();
    var ia = new IA(a);

    canvas1.onclick = function (event) {
        // récupération des coordonnées de la souris
        var X = event.clientX;
        var Y = event.clientY;
        var case_cliquee = a.onMouse_case(X, Y);
        if (case_cliquee.etat === "libre"){
            case_cliquee.set_etat("plein");
            ia.decide();
        }
    }
};
