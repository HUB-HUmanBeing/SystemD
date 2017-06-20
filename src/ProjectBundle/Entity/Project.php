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


    public function __construct()
    {
        $this->userProjects = new ArrayCollection();
        $this->invitations = new ArrayCollection();
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
     * @param array $roles
     */
    public function addUser(User $user, $encryptedSymKey ,$roles = ["member"])
    {
        //on hydrate la table de jointure avec toutes les infos nécessaires
        $userProject= new UserProject($user , $this , $encryptedSymKey , $roles);
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
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * cette fonction est en private car on va demander plutot d'ajouter un utilisateur
     * @param Invitation $invitation
     */
    private function addInvitation(Invitation $invitation)
    {
        $this->userProjects[] = $invitation;
        $invitation->setProject($this);
    }

    /**
     * permet de suprimer une relation et donc de sortir un utilisateur du projet
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
     */
    public function buildInvitation(User $user, $content )
    {
        //on hydrate la table de jointure avec toutes les infos nécessaires
        $invitation= new Invitation($user , $this , $content);
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

