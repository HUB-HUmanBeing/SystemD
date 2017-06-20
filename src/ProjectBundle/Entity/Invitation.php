<?php

namespace ProjectBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Invitation
 *
 * @ORM\Table(name="invitation")
 * @ORM\Entity(repositoryClass="ProjectBundle\Repository\InvitationRepository")
 */
class Invitation
{

    /**
     * id de l'utilisateur
     * @ORM\ID
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", inversedBy="invitations")
     */
    private $user;

    /**
     * id du projet
     * @ORM\ID
     * @ORM\ManyToOne(targetEntity="ProjectBundle\Entity\Project", inversedBy="invitations")
     */
    private $project;

    /**
     * clef symétrique du projet chifrée avec la clef publique de l'utilisateur coté navigateur
     * @ORM\Column(name="EncryptedSymKey", type="string", length=255)
     */
    private $EncryptedSymKey;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;

    /**
     * status de l'invitation : sans réponse => 0 , acceptée => 1 , refusée => 2
     * @var int
     *
     * @ORM\Column(name="status", type="integer")
     */
    private $status = 0;

    /**
     * @var string
     *
     * @ORM\Column(name="reply", type="text", nullable=true)
     */
    private $reply;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="send_at", type="datetime")
     */
    private $sendAt;



public function __construct($user , $project, $content)
{
    $this->setUser($user);
    $this->setUser($project);
    $this->setUser($content);
    $this->sendAt = new DateTime();
}

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Invitation
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set status
     *
     * @param string $status
     *
     * @return Invitation
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set reply
     *
     * @param string $reply
     *
     * @return Invitation
     */
    public function setReply($reply)
    {
        $this->reply = $reply;

        return $this;
    }

    /**
     * Get reply
     *
     * @return string
     */
    public function getReply()
    {
        return $this->reply;
    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
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
    public function getProject()
    {
        return $this->project;
    }

    /**
     * @param mixed $project
     */
    public function setProject($project)
    {
        $this->project = $project;
    }

    /**
     * @return mixed
     */
    public function getEncryptedSymKey()
    {
        return $this->EncryptedSymKey;
    }

    /**
     * @param mixed $EncryptedSymKey
     */
    public function setEncryptedSymKey($EncryptedSymKey)
    {
        $this->EncryptedSymKey = $EncryptedSymKey;
    }

    /**
     * @return DateTime
     */
    public function getSendAt()
    {
        return $this->sendAt;
    }
}

