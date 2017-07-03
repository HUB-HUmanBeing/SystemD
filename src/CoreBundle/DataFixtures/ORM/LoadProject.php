<?php
// src/AppBundle/DataFixtures/LoadUserData.php

namespace BlogBundle\DataFixtures\ORM;


use BlogBundle\DataFixtures\ORM\LoadUser;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use ProjectBundle\Entity\Project;

class LoadProject extends AbstractFixture implements OrderedFixtureInterface
{
    private $geoloc;

    //on vient hydrater géoloc avec le tableau qu'on a définit dans load user
    public function __construct()
    {
        $this->geoloc = LoadUser::getGeoloc();
    }

    /*
     * attribut pour créer des nouveaux projets
     */
    private $projectTable = [
        ['name' => 'Potager Collectif'],
        ['name' => 'piece de theatre'],
        ['name' => 'rammassage des déchets de la riviere'],
        ['name' => 'organisation d\'une soirée concert'],
        ['name' => 'cantine solidaire'],
        ['name' => 'HUmanBeing']
    ];
    private $description = 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatumDebitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum';
    //message d'invitation a envoyer
    private $invitMessage ="onsectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptat";
    /*
     * on crée les projets après avoir fait les utilisateurs pour pouvoir leurs associer des utilisateurs existants
     */
    public function getOrder()
    {
        return 2; // number in which order to load fixtures
    }

    public function load(ObjectManager $manager)
    {
        //on récupere les utilisateurs
        $usersRepository= $manager->getRepository('UserBundle:User');
        $users = $usersRepository->findAll();
        //on boucle sur le tableau des données du projet définit en attribut de classe plus haut
        foreach($this->projectTable as $projectData ) {
            //on crée un nouveau projet et on le remplit avec des données
            $Project = new Project();
            $Project->setEncryptedPrivateAsymKey('');
            $Project->setPublicAsymKey('');
            $Project->setName($projectData['name']);
            $Project->setDescription($this->description);
            //on localise nos projets
            shuffle($this->geoloc);
            $Project->setLat($this->geoloc[0]['lat']);
            $Project->setLon($this->geoloc[0]['lon']);
            $Project->setCity($this->geoloc[0]['city']);
            $Project->setCountry($this->geoloc[0]['country']);
            //on mélange les utilisateurs puis on les ajoute au projet, en mettant le premier comme administrateur
            shuffle($users);
            $Project->addUser($users[0], "",  0);
            for ($i=1; $i<4; $i++){
                $Project->addUser($users[$i],"");
            }
            for($i=4;$i<8;$i++){
                $Project->buildInvitation($users[$i], $this->invitMessage, "0");
        }
        foreach($Project->getInvitations() as $i => $invitation){
                if($i%2 == 0){
                    $invitation->setStatus(2);
                    $invitation->setReply('non merci, ca ne m\'interesse pas trop');
                }
        }
            //on persiste chaque projet crées
            $manager->persist($Project);
        }

        //on flush le tout
        $manager->flush();
    }
}