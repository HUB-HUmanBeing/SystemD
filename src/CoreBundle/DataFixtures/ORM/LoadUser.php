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

        ['name' => 'Robin'],
        ['name' => "Audric"],
        ['name' => "Eude"],
        ['name' => "Giselle"],
        [ 'name' => "JeanLucDeLaCroix"],
        ['name' =>  "Marc"],
        ['name' =>   "Jérémy"],
        ['name' => "Lucien"],
        ['name' => "Emilie"],
        ['name' => "Patrick"],
        ['name' => "Yves"]
    ];
    private $description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A animi architecto assumenda aut dignissimos, dolor ducimus eum ipsam laudantium minima optio possimus provident quas similique soluta, sunt vel voluptas voluptatem!";

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
            $user = new User();
            $user->setUsername($userTable['name']);
            $user->setDescription($this->description);

            $user->setSalt('');
            $user->setPassword('0');
            $user->setRoles(['ROLE_USER']);
            $user->setEncryptedPrivateAsymKey("");
            $user->setPublicAsymKey("");
            $user->setName($user->getUsername());
            //on persite chaque utilisateur créé
            $manager->persist($user);
        }
        //on lance la requete vers la bdd
        $manager->flush();
    }
}