<?php
// src/AppBundle/DataFixtures/LoadUserData.php

namespace BlogBundle\DataFixtures\ORM;


use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

use UserBundle\Entity\User;


class LoadUser extends AbstractFixture implements OrderedFixtureInterface
{

    //tableau des lieux on le déclare en statique pour pouvoir le réutiliser dans les fixtures des projets
    private static $geoloc = array(
        ['lat' => 44.1251672,
        'lon' => 4.0554226,
        'city' => 'Alès',
        'country' => 'France'],
        ['lat' => 44.0541049,
            'lon' => 3.9414446,
            'city' => 'Anduze',
            'country' => 'France'],
        ['lat' => 44.1610863,
            'lon' => 4.5717224,
            'city' => 'Bagnols sur cèze',
            'country' => 'France'],
        ['lat' => null,
            'lon' => null,
            'city' => null,
            'country' => null],
    );

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
            //on géolocalise nos utilisateurs
            shuffle(self::$geoloc);
            $user->setLat(self::$geoloc[0]['lat']);
            $user->setLon(self::$geoloc[0]['lon']);
            $user->setCity(self::$geoloc[0]['city']);
            $user->setCountry(self::$geoloc[0]['country']);
            //on persite chaque utilisateur créé
            $manager->persist($user);
        }
        //on lance la requete vers la bdd
        $manager->flush();
    }

    //on fait un getteur statique du tableau de géoloc pour pouvaoir l'appeler dans les projet
    static public function getGeoloc(){
        return self::$geoloc;
    }
}