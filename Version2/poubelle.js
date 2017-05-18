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

    get_border_distance(){
        var distances = {};
        distances.x0 = this.place.x;
        distances.x1 = this.pere.largeur_plateau - this.place.x;
        distances.y0 = this.place.y;
        distances.y1 = this.pere.largeur_plateau - this.place.y;
        //return distances[find_object_max_value(distances)];
        //return this.pere.largeur_plateau - this.place.x - 1;
        return find_object_max_value(distances);
    }
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
    for (var key in obj){
        var liste_max_val = [];
        if (obj[key] === value){
            liste_max_val.push(key);
        }
    }
    if (liste_max_val[0] !== undefined){
        return shuffle(a)[0];
    }
    return clef;
}

convert_negatives (){
    for (var dir in this.directions){
        if (this.directions[dir] < 0){
            this.directions[dir] = 0.5//random(0.1, 0.7);
        }
    };
}

random (){
    for (var dir in this.directions){
        this.directions[dir] += 1//random(0, 4);
    };
}

good_dir (){
    for (var dir in this.directions){
        if (dir === this.dir){
            this.directions[dir] += 20//random(3, 9);
        }
    };
}

nbr_passage (){
    for (var dir in this.directions){
        var main_case = this.pere.chat.find_case_by_dir(dir);
        var second_case_0 = this.pere.chat.find_case_by_dir(find_alter_dir(dir)[0]);
        var second_case_1 = this.pere.chat.find_case_by_dir(find_alter_dir(dir)[1]);
        this.directions[dir] -= (random(3, 5) ** this.pere.chat.find_case_by_dir(dir).nbr_passage) - 1;
        if (dir === this.dir && main_case.nbr_passage > 1){
            this.directions[dir] /= 2.5//random(2, 3);
        };
        if (dir === find_alter_dir(dir)[0] && second_case_0.nbr_passage > 1){
            this.directions[dir] /= 2.5//random(2, 3);
        };
        if (dir === find_alter_dir(dir)[1] && second_case_1.nbr_passage > 1){
            this.directions[dir] /= 2.5//random(2, 3);
        };
    };
}

surrounded_by_three(){
    for (var dir in this.directions){
        if (this.pere.chat.find_case_by_dir(dir).get_surrounding_cliked_case_number() > 2){
            this.directions[dir] -= 15//random(7, 9);
        }
    }
}

near_good_direction(){
    this.directions[find_alter_dir(this.dir)[0]] += 7//random(3, 7);
    this.directions[find_alter_dir(this.dir)[1]] += 7//random(3, 7);
}

near_border(){
    for (var dir in this.directions){
        for (var dir2 in this.directions){
            if (this.pere.chat.find_case_by_dir(dir) === false){
                if (this.pere.chat.find_case_by_dir(dir).find_case_by_dir(dir2).is_border()){
                    this.directions[dir] += 10//random(4, 7);
                }
            }
        }
    }
}

distance_to_border(){
    for (var dir in this.directions){
        this.directions[dir] -= this.pere.chat.find_case_by_dir(dir).get_border_distance();
    }
}

change_main_dir (){
    for (var dir in this.directions){
        if (this.pere.chat.find_case_by_dir(dir).nbr_passage > 1){
            var index = Math.round(random(0, 1))
            this.dir = find_alter_dir(opposite_dir(this.dir))[index];
            return;
        }
    }
}

go_to_border (){
    for (var dir in this.directions){
        if (this.pere.chat.find_case_by_dir(dir).is_border()){
            this.directions[dir] += 100;
        }
    };
}

not_plein (){
    for (var dir in this.directions){
        if (this.pere.chat.find_case_by_dir(dir).etat === "plein") {
            this.directions[dir] = 0;
        };
    };
}

verifie_victory (){
    if (find_object_max_value(this.directions) === 0) {
        declare_victory();
    }
}

console.log(find_object_max_value({"hg": 0, "bg": 0, "mg": 0, "hd": 0, "bd": 1, "md": 0}));
