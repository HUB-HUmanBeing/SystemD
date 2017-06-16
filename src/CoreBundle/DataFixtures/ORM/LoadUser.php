<?php
// src/AppBundle/DataFixtures/LoadUserData.php

namespace BlogBundle\DataFixtures\ORM;

use BlogBundle\Entity\Image;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use UserBundle\Entity\User;
use BlogBundle\Entity\Category;

class LoadUser extends AbstractFixture implements OrderedFixtureInterface
{
    private $UserTable = [
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
        for ($i = 0; $i < 5; $i++) {
            //$image = new Image();
            //$image->setUrl('http://www.tattoo-tatouages.com/wp-content/uploads/2010/02/britney-spears40.jpg');

            $User = new User();
            $User->setUsername($this->UserTable[$i]);
            $User->setPassword('0');
            //$post->setImage($image);
            $User->setSalt('');
            $User->setRoles(['ROLE_USER']);
            $manager->persist($User);
        }
        $manager->flush();
    }
}