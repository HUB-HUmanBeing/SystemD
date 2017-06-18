<?php
// src/AppBundle/DataFixtures/LoadUserData.php

namespace BlogBundle\DataFixtures\ORM;


use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use ProjectBundle\Entity\Project;
use UserBundle\Entity\User;

class LoadProject extends AbstractFixture implements OrderedFixtureInterface
{
    private $projectTable = [
        [
            'name' => 'Potager Collectif',
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => 'piece de theatre',
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => 'rammassage des déchets de la riviere',
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => 'organisation d\'une soirée concert',
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ],
        [
            'name' => 'cantine solidaire',
            'description' => 'lLorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus error minus unde vitae. Debitis dolore eligendi ipsa quam sit tempora ullam. Ea molestias nobis officiis sit sunt veritatis voluptatum?'
        ]
    ];

    public function getOrder()
    {
        return 2; // number in which order to load fixtures
    }

    public function load(ObjectManager $manager)
    {
        $usersRepository= $manager->getRepository('UserBundle:User');
        $users = $usersRepository->findAll();
        foreach($this->projectTable as $projectData ) {
            $ProjectList = new Project();
            $ProjectList->setEncryptedPrivateAsymKey('');
            $ProjectList->setPublicAsymKey('');
            $ProjectList->setName($projectData['name']);
            $ProjectList->setDescription($projectData['description']);
            shuffle($users);
            $ProjectList->addUser($users[0], "",  ["admin"]);
            for ($i=1; $i<4; $i++){
                $ProjectList->addUser($users[$i],"");
            }

            $manager->persist($ProjectList);
        }
        $manager->flush();
    }
}