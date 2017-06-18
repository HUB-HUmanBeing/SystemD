<?php

namespace ProjectBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use HUB\CryptoMessengerBundle\Entity\CommunicatingEntity;
use UserBundle\Entity\User;

/**
 * Project
 *
 * @ORM\Table(name="project")
 * @ORM\Entity(repositoryClass="ProjectBundle\Repository\ProjectRepository")
 */
class Project extends CommunicatingEntity
{


    /**
     * @var string
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @ORM\OneToMany(targetEntity="ProjectBundle\Entity\UserProject", mappedBy="project", cascade={"persist"})
     * @ORM\JoinColumn(nullable=true)
     */
    private $userProjects;


    public function __construct()
    {
        $this->userProjects = new ArrayCollection();
    }

    public function addUserProject(UserProject $userProject)
    {
        $this->userProjects[] = $userProject;
        $userProject->setProject($this);
    }

    public function removeUserProject(UserProject $userProject)
    {
        $this->userProjects->removeElement($userProject);
    }

    public function addUser(User $user, $encryptedSymKey ,$roles = ["member"])
    {
        $userProject= new UserProject($user , $this , $encryptedSymKey , $roles);
        $this->addUserProject($userProject);
    }
    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }
}

