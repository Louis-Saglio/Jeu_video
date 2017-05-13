/**
 * Created by Louis Saglio on 10/04/2017.
 */

function remove1(liste, item) {

    for (var i=0; i<liste.length; i++){
        console.log(i);
        console.log(liste[i]);
        console.log(item);
        if (liste[i] === item){
            liste.slice(i, i+1);
            console.log(liste);
        }
    }
    return liste;
}

function remove(liste, item, num) {
    var rep = [];
    var  compt = 0;
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

var a = [8,9,true,2,5,"5",7,"t"];
console.log(a);
a=move_item(a, true, 0);
console.log(a);