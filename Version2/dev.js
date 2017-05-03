/**
 * Created by Louis Saglio on 03/05/2017.
 */

window.onload = function () {

    var canvas1 = document.getElementById("canvas");
    var canvas = canvas1.getContext("2d");

    class Case {

        constructor(x, y, id, image, largeur) {
            this.id = id;
            this.largeur = largeur;
            this.set_place(x, y);
            this.set_etat("libre");
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
            this.etat = etat;
            this.image = "images/" + this.etat + ".jpg";
        }

        get_image(){
            if (this.etat === "chat"){
                return "images/chat.jpg"
            }
            return this.image;
        }

        show() {
            var image = new Image();
            image.src = this.get_image();
            var x = this.coord.x;
            var y = this.coord.y;
            image.onload = function () {
                canvas.drawImage(image, x, y);
            };
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
            this.chat.x = new_case.place.x; this.chat.y = new_case.place.y;
            this.plateau[this.chat.x][this.chat.y].set_etat("chat");
        }

        onMouse_case (x, y) {
            y = (y - (y % this.largeur_case)) / this.largeur_case;
            if (y % 2 === 0){
                x -= this.largeur_case / 2;
            }
            x = (x - (x % this.largeur_case)) / this.largeur_case;
            return this.plateau[x][y];
        }

        show (){
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1){
                for (var colonne=0; colonne<this.largeur_plateau; colonne+=1)
                    this.plateau[ligne][colonne].show();
            }
            this.plateau[this.chat.x][this.chat.y].show();
            this.set_chat(this.plateau[this.chat.x][this.chat.y]);
        }

        find_case_by_dir (dir){
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
            return this.plateau[x + this.chat.x][y + this.chat.y]
        }

        move_chat (dir){
            this.set_chat(this.find_case_by_dir(dir));
        }
    }

    a = new Plateau();
    a.show();
    a.move_chat("hg");
    a.show();
    canvas.clearRect(0, 0, canvas.width, canvas.height);
};
