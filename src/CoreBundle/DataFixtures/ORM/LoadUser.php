<?php
// src/AppBundle/DataFixtures/LoadUserData.php

namespace BlogBundle\DataFixtures\ORM;


use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use UserBundle\Entity\User;

class LoadUser extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * on crée une liste des noms d'utilisateur (12)
     * @var array
     */
    private $usersTable = [
        [
            'name' => 'Robin',
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Audric",
        'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Eude",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Giselle",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "JeanLucDeLaCroix",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' =>  "Marc",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' =>   "Jérémy",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Lucien",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Emilie",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Patrick",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => "Yves",
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
        'name' => "Camille",
        'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
         ],
    ];
    //on commencera les fixtures avec celle la
    public function getOrder()
    {
        return 1; // number in which order to load fixtures
    }

    public function load(ObjectManager $manager)
    {
        //on boucle sur les noms d'utilisateurs
        foreach($this->usersTable as $userTable ) {
           // on instancie un User puis on l'hydrate de valeur de test
            $Userlist = new User();
            $Userlist->setUsername($userTable['name']);
            $Userlist->setDescription($userTable['description']);
            $Userlist->setPassword('0');
            $Userlist->setSalt('');
            $Userlist->setRoles(['ROLE_USER']);
            $Userlist->setEncryptedPrivateAsymKey("");
            $Userlist->setPublicAsymKey("");
            $Userlist->setName($Userlist->getUsername());
            //on persite chaque utilisateur créé
            $manager->persist($Userlist);
        }
        //on lance la requete vers la bdd
        $manager->flush();
    }
}