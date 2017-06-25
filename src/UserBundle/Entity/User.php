<?php

namespace UserBundle\Entity;


use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use HUB\CryptoMessengerBundle\Entity\CommunicatingEntity;
use ProjectBundle\Entity\Invitation;
use ProjectBundle\Entity\UserProject;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * User
 *
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="UserBundle\Repository\UserRepository")
 */
class User extends CommunicatingEntity implements UserInterface
{
    //pas d'id, il en hérite de communicating-entity

    /**
     * c'est le nom unique par lequel on authentifie un utilisateur
     * @var string
     *
     * @ORM\Column(name="username", type="string", length=70, unique=true)
     */
    private $username;
    /**
     * c'est le nom unique par lequel on authentifie un utilisateur
     * @var string
     *
     * @ORM\Column(name="hashed_email", type="string", length=255, unique=false, nullable=true)
     */
    private $hashedEmail;

    /**
     * @var string
     *
     * @ORM\Column(name="password", type="string", length=255)
     */
    private $password;

    /**
     * @var string
     *
     * @ORM\Column(name="salt", type="string", length=255)
     */
    private $salt = "";
//TODO : gerer le salt
    /**
     * @var array
     *
     * @ORM\Column(name="roles", type="array")
     */
    private $roles = array( "ROLE_USER");

    /**
     * @ORM\OneToMany(targetEntity="ProjectBundle\Entity\Invitation", mappedBy="user")
     * @ORM\JoinColumn(nullable=true)
     */
    private $invitations;

    /**
     * @ORM\OneToMany(targetEntity="ProjectBundle\Entity\UserProject", mappedBy="user")
     * @ORM\JoinColumn(nullable=true)
     */
    private $userProjects;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->userProjects = new ArrayCollection();
        $this->invitations = new ArrayCollection();
    }

    /**
     *
     */
    public function eraseCredentials()
    {
    }

    /**
     * Get id
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set username
     * @param string $username
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }


    /**
     * Get username
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set password
     * @param string $password
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set salt
     * @param string $salt
     * @return User
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;

        return $this;
    }

    /**
     * Get salt
     * @return string
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * Set roles
     * @param array $roles
     * @return User
     */
    public function setRoles($roles)
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Get roles
     * @return array
     */
    public function getRoles()
    {
        return $this->roles;
    }

    /**
     * @param UserProject $userProject
     */
    public function addUserProject(UserProject $userProject)
    {
        $this->userProjects[] = $userProject;

    }

    /**
     * @param UserProject $userProject
     */
    public function removeUserProject(UserProject $userProject)
    {
        $this->userProjects->removeElement($userProject);
    }
    

    /**
     * @return mixed
     */
    public function getUserProjects()
    {
        return $this->userProjects;
    }

    /**
     * @return string
     */
    public function getHashedEmail()
    {
        return $this->hashedEmail;
    }

    /**
     * @param string $hashedEmail
     */
    public function setHashedEmail($hashedEmail)
    {
        $this->hashedEmail = $hashedEmail;
    }

    /**
     * @return mixed
     */
    public function getInvitations()
    {
        return $this->invitations;
    }

    /**
     * @param Invitation $invitation
     * @param $is_accepted
     * @param $reply
     */
    public function replyInvitation(Invitation $invitation, $is_accepted, $reply)
    {
        $invitation->setReply($reply);
        if($is_accepted){
           $invitation->setStatus(1);
           $project=$invitation->getProject()->addUser($this, $invitation->getEncryptedSymKey() );
        }

    }
    /**
     * @param mixed $invitations
     */
    public function setInvitations($invitations)
    {
        $this->invitations = $invitations;
    }

}

