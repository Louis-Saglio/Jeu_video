/**
 * Created by Louis Saglio on 10/04/2017.
 */

var Ia = {

    init : function () {

        this.direction = hasard_item("hbgd");
    },

    refresh : function (plateau) {
        this.super = plateau;
        this.plateau = plateau.plateau;
        this.chat = plateau.chat;
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
            var newChat = "h" + hasard_item("gd");
        }
        if (this.direction === "b") {
            var newChat = "b" + hasard_item("gd");
        }
        if (this.direction === "g") {
            var newChat = hasard_item("hb") + "g";
        }
        if (this.direction === "d") {
            var newChat = hasard_item("hb") + "d";
        }
        this.refresh();
        console.log("chat" ,newChat, "direction", this.direction);
        return newChat;
    }
};
var a = {

find_next_frized_case : function (pos) {
    var rep = {};
    var liste_dir = ["hg", "hd", "mg", "md", "bg", "bd"];
    for (var i=0; i<liste_dir.length; i++) {
        var mv_fact = this.find_move_factor(liste_dir[i]);
        if (this.plateau[pos.x + mv_fact.x][pos.y + mv_fact.y].apparence !== "images/plein.jpg") {
            rep[liste_dir[i]] = {"x": pos.x + mv_fact.x, "y": pos.y + mv_fact.y};
        }
    }
    return rep;
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
}
};