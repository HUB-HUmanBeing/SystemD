HUmanBeing
==========
# Installation
## 1. Récupérer le code
Vous avez deux solutions pour le faire :

1. Via Git, en clonant ce dépôt ;
2. Via le téléchargement du code source en une archive ZIP, à cette adresse : https://github.com/winzou/mooc-symfony/archive/master.zip

*Attention, le code est divisé en plusieurs branches `iteration-XX`. Sur la branche `master` vous n'avez que le tout début du cours, n'hésitez pas à [changer de branche](https://github.com/winzou/mooc-symfony/branches) !*

## 2. Définir vos paramètres d'application
Pour ne pas qu'on se partage tous nos mots de passe, le fichier `app/config/parameters.yml` est ignoré dans ce dépôt. A la place, vous avez le fichier `parameters.yml.dist` que vous devez renommer (enlevez le `.dist`) et modifier.

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
le mieux pour tester est encore de se connecter avec le login "Giselle" et le mdp "0", mais sinon tout les utilisateurs fictifs ont le mdp "0" si vous souhaitez observer les changements d'etats et les interactions depuis d'autres point de vues
