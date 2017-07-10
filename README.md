HUmanBeing
==========

## Plate forme web de projets collaboratifs non marchands et de partage à modération horizontale

Jusqu'ici, les projets collaboratifs ainsi que les pratiques de partages et de gratuité ont été limités par l'étroitesse de nos réseaux relationnels. Cette plate-forme web met en lien une communauté mondiale d'utilisateurs sur la base de leurs compétences et de leurs envies à travers la possibilité de collaborer à des projets proposés par chacun d'eux. Elle offre aussi un support organisationnel et un système permettant le partage des ressources de chacun, ainsi que le partage de celles produites par les projets, le tout modéré horizontalement par la communauté d'utilisateurs.

# Installation
## 1. Récupérer le code
Vous avez deux solutions pour le faire :

1. Via Git, en clonant ce dépôt ;
2. Via le téléchargement du code source en une archive ZIP.


## 2. Définir vos paramètres d'application
Pour ne pas qu'on se partage tous nos mots de passe, le fichier `app/config/parameters.yml` est ignoré dans ce dépôt. A la place, vous avez le fichier `parameters.yml.dist` que vous devez copier puis renommer (enlevez le `.dist`) et modifier.(il faut garder malgré tout le `parameters.yml.dist` initial dans le dossier)

## 3. Télécharger les vendors
Avec Composer bien évidemment :

    php composer.phar install

## 4. Créez la base de données
Si la base de données que vous avez renseignée dans l'étape 2 n'existe pas déjà, créez-la :

    php bin/console doctrine:database:create

Puis créez les tables correspondantes au schéma Doctrine :

    php bin/console doctrine:schema:update --force

Enfin, éventuellement, ajoutez les fixtures :

    php bin/console doctrine:fixtures:load


## c'est pret !
Le plus simple pour pouvoir aller voir le site est encore de le lancer avec la commande : 

    php bin/console server:start
    
le mieux pour tester est de se connecter avec le login "Giselle" et le mdp "0", mais sinon tout les utilisateurs fictifs ont le mdp "0" si vous souhaitez observer les changements d'etats et les interactions depuis d'autres point de vues
