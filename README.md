
![enter image description here](https://i.imgur.com/D8qWGid.png)
#  www.system-d.org


## Plate forme web chiffrée de projets collaboratifs non marchands

#### Crééz des projets, invitez vos amis, et profitez ensemble des outils gratuits et sécurisés pour organiser ensemble votre association ou collectif

### Notre Objectif : 

> Favoriser le non-marchand et le collaboratif afin qu'ils puissent se
> dévelloper grace aux outils du numériques en réseau.
> 
> Créer un outil qui accompagne la transition d'une société de l'argent
> en faillite à un mode de production basé sur la collaboration et le
> partage.

### Un projet en trois phases :


#### Créer un outil de gestion de projet ouvert à tous 

> Un outil qui permettra aux différents collectifs et association de
> s'organiser efficacement. Un outil chiffré, gratuit, open-source
> visant à favoriser l'horizontalité dans la gestion de projet.

#### Faire de SystemD le réseau social du projet non-marchand

> Création des interfaces faisant de la plateforme un espace de
> rencontre et de circulation des utilisateurs sur différents projets :
> Recherche géolocalisée par compétences-centres d’intérêts, messagerie
> chiffrée, blogs partagés, etc.

#### Dévelloper un réseau de gratuité et de partage

> Permettre à chaque utilisateur et chaque projets de mettre en partage
> les ressources qu'ils produisent afin de pouvoir réaliser une
> circulation non-marchande de grande ampleur



## Roadmap

### Première phase :

 - [X] Interface de création de comptes utilisateurs et connexion à la plate-forme 
 - [ ]  Interface de modification du profil utilisateur 
 - [ ]  Interface de création de projet 
 - [ ]  Invitation à des projets et gestion des membres 
 - [ ]  Création d'un forum de discussion par projet 
 - [ ]  Agenda participatif pour chacun des projets 
 - [ ]  Liste des taches ergonomique pour chaque projet 
 - [ ]  Interface pour soutenir ou participer à SystemD

### Deuxième phase :

 - [ ]  Interface pour que chaque utilisateur puisse renseigner ses
   compétences
 - [ ]  Interface pour que chaque utilisateur puisse renseigner ses centres
   d’intérêts 
 - [ ]  Prise en compte de la localisation géographique
 - [ ]  Outils de recherches avancées pour rechercher des collaborateurs
   potentiels / des projets intéressants
 - [ ]  Messagerie inter-utilisateurs et inter-projets
 - [ ]  Blog personnel et blog de projets
 - [ ]  Module de carte interactives pour les projets

### Troisième phase :

 - [ ]  Prise en compte des retours utilisateurs de la seconde phase et
   amélioration des fonctionnalités
 - [ ]  Interface permettant de lister les ressources matérielles qu'un
   projet ou utilisateur souhaite mettre en partages
 - [ ]  Interface de recherche de ressources
 - [ ]  Possibilité de laisser des annonces concernant les besoins personnels
   et ceux des projets
 - [ ]  Applications IOS, ANDROID et DESKTOP
 - [ ]  Module de planning Scrum


### Installation en local
#### 1. Récupérer le code
Vous avez deux solutions pour le faire :

1. Via Git, en clonant ce dépôt ;
2. Via le téléchargement du code source en une archive ZIP.

#### 2. Installation de MeteorJS et de node js (Ubuntu)
node :  

    $ sudo apt-get install nodejs

meteor : 

    $ curl https://install.meteor.com/ | sh
 
#### 3. Lancer le serveur interne de Meteor (Ubuntu)
pour uploader les paquets et lancer le serveur, utiliser la commande
   
    $ meteor npm install

#### 4. Pour lancer le serveur d'assets :
#####a- lancer un serveur d'assets avec docker
dans un autre terminal lancez minio avec la commande suivante :
    $ docker run -p 9000:9000 --name system-d -e "MINIO_ACCESS_KEY=CeQueTuVeux"  -e "MINIO_SECRET_KEY=TonJoliMotDePasse" -v /mnt/data:/data  -v /mnt/config:/root/.minio minio/minio server /data

#####b- copier puis renomez le fichier 'settings.template.json' à la racine en 'settings.json' et remplacer les "???" avec vos parametres
     "minio": {
        "endPoint": "172.17.0.2",
        "port": 9000,
        "MINIO_ACCESS_KEY":"CeQueTuVeux" ,
        "MINIO_SECRET_KEY":"TonJoliMotDePasse"
      }

    
#### 4. C'est prêt !
enfin, lancez le serveur de dev avec :
   
    $  meteor --settings settings.json
Vous pouvez ensuite visionner l'avancement du travail en vous rendant à l'adresse suivante :
        
 http://localhost:3000/
   
    
