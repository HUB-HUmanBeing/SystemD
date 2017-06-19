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
     * on crée une liste des noms d'utilisateur
     * @var array
     */
    private $userTable = [
        "Robin",
        "Audric",
        "Eude",
        "Giselle",
        "JeanLucDeLaCroix",
        "Marc",
        "Jérémy",
        "Lucien"
];
    //on commencera les fixtures avec celle la
    public function getOrder()
    {
        return 1; // number in which order to load fixtures
    }

    public function load(ObjectManager $manager)
    {
        //on boucle sur les noms d'utilisateurs
        foreach($this->userTable as $i => $username ) {
           // on instancie un User puis on l'hydrate de valeur de test
            $Userlist[$i] = new User();
            $Userlist[$i]->setUsername($username);
            $Userlist[$i]->setPassword('0');
            $Userlist[$i]->setSalt('');
            $Userlist[$i]->setRoles(['ROLE_USER']);
            $Userlist[$i]->setEncryptedPrivateAsymKey("");
            $Userlist[$i]->setPublicAsymKey("");
            $Userlist[$i]->setName($Userlist[$i]->getUsername());
            //on persite chaque utilisateur créé
            $manager->persist($Userlist[$i]);
        }
        //on lance la requete vers la bdd
        $manager->flush();
    }
}