<?php
// src/AppBundle/DataFixtures/LoadUserData.php

namespace BlogBundle\DataFixtures\ORM;


use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use UserBundle\Entity\User;

class LoadUser extends AbstractFixture implements OrderedFixtureInterface
{
    private $userTable = [
        "Robin",
        "Audric",
        "Eude",
        "Giselle",
        "JeanLucDeLaCroix"
];

    public function getOrder()
    {
        return 1; // number in which order to load fixtures
    }

    public function load(ObjectManager $manager)
    {
        foreach($this->userTable as $i => $username ) {
            //$image = new Image();
            //$image->setUrl('http://www.tattoo-tatouages.com/wp-content/uploads/2010/02/britney-spears40.jpg');

            $Userlist[$i] = new User();
            $Userlist[$i]->setUsername($username);
            $Userlist[$i]->setPassword('0');
            //$post->setImage($image);
            $Userlist[$i]->setSalt('');
            $Userlist[$i]->setRoles(['ROLE_USER']);
            $Userlist[$i]->setEncryptedPrivateAsymKey("");
            $Userlist[$i]->setPublicAsymKey("");
            $Userlist[$i]->setName($Userlist[$i]->getUsername());
            $manager->persist($Userlist[$i]);
        }
        $manager->flush();
    }
}