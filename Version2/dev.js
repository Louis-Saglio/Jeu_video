/**
 * Created by Louis Saglio on 03/05/2017.
 */

window.onload = function () {

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

    function convert_quadra_dir_to_hexa_dir (dir) {
        if (dir === "h") return shuffle(["hg", "hd"]);
        if (dir === "b") return shuffle(["bg", "bd"]);
        if (dir === "g") return shuffle(["bg", "hg", "mg"]);
        if (dir === "d") return shuffle(["bd", "hd", "md"]);
    }

    function numerise_dir (dir){
        var y = 1;
        if (dir[0] === "h") y = -1;
        if (dir[1] === "g") {
            var x = -1;
            if (this.chat.y % 2 === 0) x = 0;
        }
        if (dir[1] === "d") {
            var x = 0;
            if (this.chat.y % 2 === 0) x = 1;
        }
        if (dir[0] === "m") {
            y = 0;
            if (dir[1] === "g") x = -1;
            if (dir[1] === "d") x = 1;
        }
        return {"x": x, "y": y};
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
                // canvas.fillText(self.etat,x + 25 ,y + 25);
                // canvas.closePath();

            };
        }

        get_coord_cases_environnantes () {
            var cases_environnantes = {};
            var dirs = ["hg", "bg", "mg", "hd", "bd", "md"];
            for (var direction of dirs){
                var position_increments = numerise_dir(direction);
                cases_environnantes[direction] = {
                    "x": position_increments.x + this.place.x,
                    "y": position_increments.y + this.place.y
                };
            }
        }

    }

    class Plateau {

        constructor() {
            this.largeur_case = 50;
            this.largeur_plateau = 11;
            this.chat = {x: 5, y: 6};
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
            this.set_chat(this.plateau[this.chat.x][this.chat.y]);
        }

        set_chat (new_case) {
            this.plateau[this.chat.x][this.chat.y].set_etat("libre");
            this.plateau[this.chat.x][this.chat.y].show();
            this.chat.x = new_case.place.x;
            this.chat.y = new_case.place.y;
            this.plateau[this.chat.x][this.chat.y].set_etat("chat");
            this.plateau[this.chat.x][this.chat.y].show();
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
            var position_increments = numerise_dir(dir);
            return this.plateau[position_increments.x + this.chat.x][position_increments.y + this.chat.y]
        }

        move_chat (dir){
            this.set_chat(this.find_case_by_dir(dir));
        }
    }

    class IA {

        constructor (plateau) {
            this.plateau = plateau.plateau;
            this.chat = plateau[plateau.chat.x][plateau.chat.y];
            this.directions = [
                convert_quadra_dir_to_hexa_dir('h'),
                convert_quadra_dir_to_hexa_dir('b'),
                convert_quadra_dir_to_hexa_dir('d'),
                convert_quadra_dir_to_hexa_dir('g')
            ];
            this.directions = shuffle(this.directions);
            this.cases_environnant_chat = this.get_cases_environnant_chat();
        }

        get_cases_environnant_chat () {
            var cases_environnantes = {};
            var coords = this.chat.get_coord_cases_environnantes();
            for (var dir in coords){
                cases_environnantes[dir] = this.plateau[coords[dir].x][coords[dir].y];
            }
            return cases_environnantes;
        }
    }

    var a = new Plateau();
    console.log(a.plateau);
    console.log(a.chat.x, a.chat.y);
    var ia = new IA(a);

    canvas1.onclick = function (event) {
        // récupération des coordonnées de la souris
        var X = event.clientX;
        var Y = event.clientY;
        var case_cliquee = a.onMouse_case(X, Y);
        if (case_cliquee.etat === "libre"){
            a.move_chat("hg");
            case_cliquee.set_etat("plein");
        }
    }
};
