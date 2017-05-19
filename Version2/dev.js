 /**
 * Created by Louis Saglio on 03/05/2017.
 */

window.onload = function () {

    function shuffle(b)
    // mélange aléatoirement un objet
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

    function find_alter_dir(dir) {
        if (dir === "hg") return ["mg", "hd"];
        if (dir === "hd") return ["md", "hg"];
        if (dir === "bg") return ["mg", "bd"];
        if (dir === "bd") return ["bg", "md"];
        if (dir === "mg") return ["hg", "bg"];
        if (dir === "md") return ["hd", "bd"];
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
        }
        for (var key in obj){
            if (obj[key] > value) {
                value = obj[key];
                clef = key;
            }
        }
        return clef;
}

    function declare_victory (){
        alert("Victoire !");
    }

    function rand(fct) {
        return (Math.random() * (fct-1)) + 1;
    }

    function arrondir(nbr){
        return Math.round(nbr * 1000) / 1000;
    }

    function opposite_dir(dir) {
        if (dir === "hg") return "bd";
        if (dir === "hd") return "bg";
        if (dir === "bg") return "hd";
        if (dir === "bd") return "hg";
        if (dir === "mg") return "md";
        if (dir === "md") return "mg";
    }

    function random(min, max){
        return (max - min) * Math.random() + min
    }

    function count_items(liste, item){
        var nbr = 0;
        for (var element of liste){
            if (item === element){
                nbr += 1;
            }
        }
        return nbr;
    }

    class Case {

        constructor(x, y, id, pere, context) {
            this.context = pere.context;
            this.pere = pere;
            this.id = id;
            this.largeur = pere.largeur_case;
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

        get_border_distance(){
            var x0 = this.place.x;
            var x1 = this.pere.largeur_plateau - this.place.x - 1;
            var y0 = this.place.y;
            var y1 = this.pere.largeur_plateau - this.place.y - 1;
            return Math.min(x0, x1, y0, y1);
        }

        show() {
            var self = this;
            var image = new Image();
            image.src = this.get_image() + "?t=" + Math.random();
            var x = this.coord.x;
            var y = this.coord.y;
            image.onload = function () {
                self.context.drawImage(image, x, y);
            };
        }

        is_border (){
            return this.id % 11 === 0 || this.id % 11 === 10 || this.id < 11 || (this.id < 121 && this.id > 109);
        }

        find_case_by_dir (dir){
            var position_increments = numerise_dir(dir, this);
            return this.pere.plateau[position_increments.x + this.place.x][position_increments.y + this.place.y]
        }

        get_cliked_nbr (){
            var number = 0;
            for (var dir in this.pere.directions){
                try{
                    if (this.find_case_by_dir(dir).etat === "plein") { number += 1 }
                }
                catch (e){
                    // number += 0;
                }
            }
            return number;
        }

    }

    class Plateau {

        constructor(manager) {
            this.manager = manager;
            this.context = manager.context;
            this.nbr_coup = 0;
            this.largeur_case = 50;
            this.largeur_plateau = 11;
            this.plateau = [];
            this.directions = {"hg": 0, "bg": 0, "mg": 0, "hd": 0, "bd": 0, "md": 0};

            var id = 0;
            for (var ligne=0; ligne<this.largeur_plateau; ligne+=1){
                this.plateau.push([]);
                for (var colonne=0; colonne<this.largeur_plateau; colonne+=1){
                    var ma_case = new Case(ligne, colonne, id, this, this.context);
                    id += 1;
                    this.plateau[ligne].push(ma_case);
                }
            }
            this.chat = this.plateau[5][5];
            this.set_chat(this.chat);
        }

        set_chat (new_case) {
            new_case.date = this.nbr_coup;
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

        move_chat (dir){
            this.set_chat(this.chat.find_case_by_dir(dir));
        }
    }

    class IA {

        constructor (plateau){
            this.pere = plateau;
            this.plateau = plateau.plateau;
            this.directions = this.pere.directions;
            this.last_directions = [];
            this.set_dir(shuffle(this.directions)[0]);
        }

        set_dir (new_dir){
            this.last_directions.push(this.dir);
            this.dir = new_dir;
        }

        base (){
            for (var dir in this.directions){
                this.directions[dir] += random(1.1, 2);
            }
        }

        good_dir (){
            for (var dir in this.directions){
                if (dir === this.dir){
                    this.directions[dir] += random(8, 10);
                }
            }
        }

        near_good_direction(){
            this.directions[find_alter_dir(this.dir)[0]] += random(7, 9);
            this.directions[find_alter_dir(this.dir)[1]] += random(7, 9);
        }

        not_opposite_dir(){
            for (var dir in this.directions){
                if (this.pere.chat.find_case_by_dir(dir) !== opposite_dir(this.dir)){
                    this.directions[dir] += random(6, 8);
                }
            }
        }

        go_to_border (){
            for (var dir in this.directions){
                if (this.pere.chat.find_case_by_dir(dir).is_border()){
                    this.directions[dir] += 100;
                }
            }
        }

        continue_same_dir(){
            for (var dir in this.directions){
                if (dir === this.last_direction && dir !== this.dir){
                    this.directions[dir] += random(7, 9);
                }
            }
        }

        surrounded(){
            for (var dir in this.directions){
                this.directions[dir] /= (this.pere.chat.find_case_by_dir(dir).get_cliked_nbr() + 1);
            }
        }

        near_border(){
            for (var dir in this.directions){
                var ma_case = this.pere.chat.find_case_by_dir(dir);
                if (ma_case.get_border_distance() === 1 && ma_case.get_cliked_nbr() === 0){
                    this.directions[dir] += 50;
                }
            }
        }

        not_plein (){
            for (var dir in this.directions){
                if (this.pere.chat.find_case_by_dir(dir).etat === "plein") {
                    this.directions[dir] = 0;
                }
            }
        }

        nbr_passage(){
            for (var dir in this.directions){
                if (this.pere.nbr_coup - this.pere.chat.find_case_by_dir(dir).date > 4){
                    this.pere.chat.find_case_by_dir(dir).nbr_passage = 0;
                }
                if (this.pere.chat.find_case_by_dir(dir).nbr_passage > 0){
                    this.directions[dir] = random(0.5, 1);
                }
            }
        }

        manage_dir(){
            this.last_direction = this.dir_retenue;
        }

        check_victory_or_deafet(){
            if (this.directions[this.dir_retenue] === 0){
                this.pere.manager.victory();
            }
            if(this.pere.chat.find_case_by_dir(this.dir_retenue).is_border()){
                this.pere.manager.game_over();
            }
        }

        decide (){
            this.directions = {"hg": 0, "bg": 0, "mg": 0, "hd": 0, "bd": 0, "md": 0};
            this.base();
            this.good_dir();
            this.near_good_direction();
            this.not_opposite_dir();
            this.go_to_border();
            this.continue_same_dir();
            this.surrounded();
            this.near_border();
            this.nbr_passage();
            this.not_plein();
            this.dir_retenue = find_object_max_value(this.directions);
            this.manage_dir();
            this.check_victory_or_deafet();
            for (var dir in this.directions){
                console.log(dir, this.directions[dir]);
            }
            if (this.pere.manager.continue_game === true) {
                this.pere.move_chat(this.dir_retenue);
            }
        }
    }


    class Game_manager {

        constructor(){
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext("2d");
            this.new_game = document.getElementById("new_game");
            var self = this;
            this.new_game.onclick = function () { self.play() };
        }

        play(){
            var self = this;
            self.continue_game = true;
            self.plateau = new Plateau(this);
            self.ia = new IA(this.plateau);
            self.canvas.onclick = function (event) {
                var x = event.clientX;
                var y = event.clientY;
                var case_cliquee = self.plateau.onMouse_case(x, y);
                if (case_cliquee.etat === "libre" && self.continue_game === true){
                    case_cliquee.set_etat("plein");
                    self.ia.decide();
                    self.plateau.nbr_coup += 1;
                }
            }
        }

        game_over(){
            this.continue_game = false;
            var self = this;
            self.context.clearRect(0, 0, 600, 550);
            var image = new Image();
            image.src = "images/perdu.jpg?t=" + Math.random();
            image.onload = function () {
                self.context.drawImage(image, 0, 0);
            }
        }

        victory(){
            this.continue_game = false;
            var self = this;
            self.context.clearRect(0, 0, 600, 550);
            var image = new Image();
            image.src = "images/victoire.jpg?t=" + Math.random();
            image.onload = function () {
                self.context.drawImage(image, 0, 0);
            }
        }
    }


    var manager = new Game_manager();
    manager.play();
};
