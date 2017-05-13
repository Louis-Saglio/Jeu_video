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
