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
     *  il précise le nom  d'un projet.
     * @var string
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * lien vers l'entité/table reliant les utilisateurs au projet
     * si un projet est suprimé la relation avec ses utilisateurs aussi donc persistance en cascade de ce coté
     * @ORM\OneToMany(targetEntity="ProjectBundle\Entity\UserProject", mappedBy="project", cascade={"persist"})
     * @ORM\JoinColumn(nullable=true)
     */
    private $userProjects;

    /**
     * lien vers l'entité/table des invitations a rejoindre un projet
     * @ORM\OneToMany(targetEntity="ProjectBundle\Entity\Invitation", mappedBy="project", cascade={"persist"})
     * @ORM\JoinColumn(nullable=true)
     */
    private $invitations;


    /**
     * Project constructor.
     */
    public function __construct()
    {
        $this->userProjects = new ArrayCollection();
        $this->invitations = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @return string
     */
    public function getEncryptedPrivateAsymKey()
    {
        return $this->encryptedPrivateAsymKey;
    }

    /**
     * @return string
     */
    public function getPublicAsymKey()
    {
        return $this->publicAsymKey;
    }

    /**
     * cette fonction est en private car on va demander plutot d'ajouter un utilisateur
     * @param UserProject $userProject
     */
    private function addUserProject(UserProject $userProject)
    {
        $this->userProjects[] = $userProject;
        $userProject->setProject($this);
    }

    /**
     * permet de suprimer une relation et donc de sortir un utilisateur du projet
     * @param UserProject $userProject
     */
    public function removeUserProject(UserProject $userProject)
    {
        $this->userProjects->removeElement($userProject);
    }

    /**
     * ajouter un utilisateur a un projet
     * @param User $user
     * @param $encryptedSymKey
     * @param integer $role
     * 0 =>admin
     * 1=>membre
     */
    public function addUser(User $user, $encryptedSymKey ,$role = 1)
    {
        //on hydrate la table de jointure avec toutes les infos nécessaires
        $userProject= new UserProject($user , $this , $encryptedSymKey , $role);
        //puis on ajoute la réference a la table de jointure dans notre arraycollection
        $this->addUserProject($userProject);
    }

    /**
     * @return ArrayCollection
     */
    public function getUserProjects()
    {
        return $this->userProjects;
    }


    /**
     * cette fonction est en private car on va demander plutot d'ajouter un utilisateur
     * @param Invitation $invitation
     */
    private function addInvitation(Invitation $invitation)
    {
        $this->invitations[] = $invitation;
    }

    /**
     * permet de suprimer une relation de type invitation
     * @param Invitation $invitation
     */
    public function removeInvitation(Invitation $invitation)
    {
        $this->userProjects->removeElement($invitation);
    }

    /**
     * créer une invitation
     * @param User $user
     * @param string $content
     * @param string $encryptedSymKey
     */
    public function buildInvitation(User $user, $content, $encryptedSymKey )
    {
        //on hydrate la table de jointure avec toutes les infos nécessaires
        $invitation= new Invitation();
        $invitation->setUser($user );
        $invitation->setProject($this);
        $invitation->setContent($content);
        $invitation->setStatus(0);
        $invitation->setEncryptedSymKey($encryptedSymKey);
        //puis on ajoute la réference a la table de jointure dans notre arraycollection
        $this->addInvitation($invitation);
    }

    /**
     * @return ArrayCollection
     */
    public function getInvitations()
    {
        return $this->invitations;
    }



}

