<?php

namespace ProjectBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use UserBundle\Entity\User;

/**
 * UserProject
 *
 * @ORM\Table(name="user_project")
 * @ORM\Entity(repositoryClass="ProjectBundle\Repository\UserProjectRepository")
 */
class UserProject
{
    /**
     * @ORM\ID
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", inversedBy="user_projects")
     */
    private $user;
    /**
     * @ORM\ID
     * @ORM\ManyToOne(targetEntity="ProjectBundle\Entity\Project", inversedBy="user_projects", cascade={"persist"})
     */
    private $project;

    /**
     * @var string
     *
     * @ORM\Column(name="encrypted_sym_key", type="string", length=255)
     */
    private $encryptedSymKey;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_content_unread", type="boolean")
     */
    private $isContentUnread = false;

    /**
     * @var string
     *
     * @ORM\Column(name="roles", type="array")
     */
    private $roles;

    public function __construct(User $user, Project $project, $encryptedSymKey, array $roles )
    {
        $this->setUser($user);
        $this->setProject($project);
        $this->setEncryptedSymKey($encryptedSymKey);
        $this->setRoles($roles);
    }

    /**
     * Set encryptedSymKey
     *
     * @param string $encryptedSymKey
     *
     * @return UserProject
     */
    public function setEncryptedSymKey($encryptedSymKey)
    {
        $this->encryptedSymKey = $encryptedSymKey;

        return $this;
    }

    /**
     * Get encryptedSymKey
     *
     * @return string
     */
    public function getEncryptedSymKey()
    {
        return $this->encryptedSymKey;
    }

    /**
     * Set isContentUnread
     *
     * @param boolean $isContentUnread
     *
     * @return UserProject
     */
    public function setIsContentUnread($isContentUnread)
    {
        $this->isContentUnread = $isContentUnread;

        return $this;
    }

    /**
     * Get isContentUnread
     *
     * @return bool
     */
    public function getIsContentUnread()
    {
        return $this->isContentUnread;
    }

    /**
     * Set roles
     *
     * @param string $roles
     *
     * @return UserProject
     */
    public function setRoles($roles)
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Get roles
     *
     * @return string
     */
    public function getRoles()
    {
        return $this->roles;
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

