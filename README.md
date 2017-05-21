# Cahier de création du jeu vidéo « Le jeu du chat noir »

## Présentation
Ce jeu vidéo a été développé dans le cadre de mes études à Ingésup Bordeaux en tant que projet final pour les cours de JavaScript de première année.
Le code a été entièrement écrit par moi-même (Louis Saglio) excepté la fonction shuffle qui a été copié-collé et légèrement remanié depuis ce site http://dev.petitchevalroux.net/javascript/fonction-shuffle-sur-tableau-javascript.349.html

## Choix du Framework
Le but du projet était d’affermir nos connaissances en JavaScript.
JavaScript est un langage avec une philosophie assez différente des autres langages que nous connaissons tels que Python ou Java, notamment à cause du fait que JavaScript soit fondamentalement asynchrone et soit orienté prototype et non pas objet.
Nous avons donc décidé de partir sur un développement from scratch afin de bien assimiler la philosophie et les mécanismes de base de JavaScript.

## Choix du gameplay
Sans Framework, il est beaucoup plus difficile de créer des effets graphiques. Un gameplay graphiquement simple c’est donc imposé. Pour contrebalancer cette faciliter et ajouter un peu de difficulté au développement, nous avons pensé qu’un jeu nécessitant une I.A. serait intéressant.
C’est alors présenté à notre esprit un jeu nommé « Le jeu du chat noir » où il s’agit de bloquer un chat se déplaçant sur des cases placées un quinconce. 

## Difficultés rencontrées
Le code du jeu peut être découpé en trois partie :
1.	Le moteur graphique
2.	L’intelligence artificielle
3.	Le gestionnaire de jeu
### Moteur graphique
Pour le moteur graphique, les principales difficultés ont été d’ordre algorithmique, notamment en ce qui concerne le fait que les cases soient placées en quinconce.
Vu cette complexité algorithmique il nous a été obligatoire d’implémenter une API totalement séparée des détails graphiques pour pouvoir l’utiliser dans l’I.A. du chat.
Le moteur graphique a connu quatre versions différentes avec une amélioration majeur des classes à la troisième version. Étonnamment cette version a été perturbée par un bug dût au cache du navigateur malgré sa désactivation dans les paramètres de développement.
### Intelligence artificielle
L’intelligence artificielle du chat fut la principale difficulté du développement du jeu. En effet, bien que fort basique (pas d’apprentissage artificiel) elle nous a pris au moins 75 % du temps homme disponible. Nous nous sommes rendu compte que plus nous l’améliorions plus elle nous semblait améliorable.
Nous l’avons redéveloppé en tout quatre fois, dont deux versions totalement différente.
La première version utilisait extensivement les arrays ce qui ne nous a finalement pas semblé une bonne idée en JavaScript, puisque nous devions souvent développer nous-mêmes des méthodes élémentaires d’array, avec tous les risques de bug que cela comporte.
La seconde version utilise plus-tôt les objets d’utilisation plus intuitive.
### Gestionnaire de jeux
Fort de l’expérience gagnée grâce aux deux parties précédentes, le gestionnaire de jeu c’est fait très rapidement sans difficulté.
## Bugs connus
Parfois en début de jeu l’image du chat ne se charge pas, cependant le chat est bien présent et le bug se corrige au deuxième tour.
Au moment de la victoire ou de la défaite, le chat ou une case peut apparaitre à travers l’image de victoire ou de défaite. Cela est dût à l’asynchronicité de Javascript. Pour corriger ce bug il faudrait développer une nouvelle version assez différente de l’actuelle. Nous n’en avons malheureusement pas le temps.

## Conclusion
Le but de ce projet n’était pas de créer un jeu commercial, addictif ou amusant à jouer mais bien d’approfondir et consolider nos compétences en JavaScript. Il a totalement rempli cet objectif car nous pensons que nos compétences en JavaScript ont doublé de niveau entre le début et la fin du projet.
