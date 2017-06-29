<?php

namespace ProjectBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use UserBundle\Entity\User;

/**
 * UserProject
 * entité de liaison entre les entités user et les projets
 *
 * @ORM\Table(name="user_project")
 * @ORM\Entity(repositoryClass="ProjectBundle\Repository\UserProjectRepository")
 */
class UserProject
{
    /**
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;


    /**
     * id de l'utilisateur
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", inversedBy="userProjects")
     */
    private $user;

    /**
     * id du projet
     * @ORM\ManyToOne(targetEntity="ProjectBundle\Entity\Project", inversedBy="userProjects", cascade={"persist"})
     */
    private $project;

    /**
     * contient la clef symétrique unique du projet chifrée avec la clef publique de l'utilisateur
     * ainsi l'utilisateur pourra déchiffrer avec sa clef publique
     * @var string
     *
     * @ORM\Column(name="encrypted_sym_key", type="string", length=255)
     */
    private $encryptedSymKey;

    /**
     * un petit drapeau qui permet d'anoncer si il y a eu du contenu ajouté depuis la dernière visite de l'utilisateur
     * @var bool
     *
     * @ORM\Column(name="is_content_unread", type="boolean")
     */
    private $isContentUnread = false;

    /**
     * permet d'affecter un role aux differents utilisateurs,
     * 0 => administrateur
     * 1 => member
     *
     * par défault, le role de base est "member" donc $roles = 1
     * @var int
     *
     * @ORM\Column(name="role", type="integer")
     */
    private $role;

    /**
     * UserProject constructor.
     * @param User $user
     * @param Project $project
     * @param $encryptedSymKey
     * @param int $roles
     */
    public function __construct(User $user, Project $project, $encryptedSymKey, $roles)
    {
        $this->setUser($user);
        $this->setProject($project);
        $this->setEncryptedSymKey($encryptedSymKey);
        $this->setRoles($roles);
    }

    /**
     * Set encryptedSymKey
     * @param string $encryptedSymKey
     * @return UserProject
     */
    public function setEncryptedSymKey($encryptedSymKey)
    {
        $this->encryptedSymKey = $encryptedSymKey;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Get encryptedSymKey
     * @return string
     */
    public function getEncryptedSymKey()
    {
        return $this->encryptedSymKey;
    }

    /**
     * Set isContentUnread
     * @param boolean $isContentUnread
     * @return UserProject
     */
    public function setIsContentUnread($isContentUnread)
    {
        $this->isContentUnread = $isContentUnread;

        return $this;
    }

    /**
     * Get isContentUnread
     * @return bool
     */
    public function getIsContentUnread()
    {
        return $this->isContentUnread;
    }


    /**
     * @param int $role
     * @return $this
     */
    public function setRole($role)
    {
        $this->role = $role;

        return $this;
    }

    /**
     * Get roles
     * @return int
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }
    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $project
     */
    public function setProject(Project $project)
    {
        $this->project = $project;
    }

    /**
     * @return mixed
     */
    public function getProject()
    {
        return $this->project;
    }
}

