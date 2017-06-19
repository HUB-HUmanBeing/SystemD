<?php

namespace HUB\CryptoMessengerBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * cette entité est le parent a partir duquel héritent les enfants projets et utilisateurs
 * @ORM\Entity
 * @ORM\Table(name="communicating_entity")
 * la stratégie pour representer cela en base de donnée est de type joined ce qui entraine Trois tables distinctes
 * @ORM\InheritanceType("JOINED")
 * on pourra déterminer si la communicating entity est un user ou un projet a partir de la collone type dans la bdd
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({"user" = "UserBundle\Entity\User", "project" = "ProjectBundle\Entity\Project"})
 */
abstract class CommunicatingEntity
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    
    /**
     * le name est un attribut commun aux users et au projets, il précise le nom d'usage d'un utilisateur ou le nom courant d'un projet.
     * il est modifiable
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    protected $name;

    /**
     * cette clef est générée puis chiffrée coté client avec le mot de passe utilisateur
     * elle permet de déchiffrer les clef symétriques des contenus partagés
     * @var string
     * the private_asym_key is necessary for decrypt the symmetrical key used for Encryption/decryption of a shared content
     * @ORM\Column(name="encrypted_private_asym_key", type="string", length=255)
     */
    protected $encryptedPrivateAsymKey;

    /**
     * cette clef est générée coté client en meme temps que la clef privée qui lui correspond
     * elle permet a un autre utilisateur de transmettre la clef symétrique d'un contenu qu'il souhaite partager avec notre entité
     * @var string
     *the private_asym_key is necessary for Encrypt the symmetrical key used for Encryption/decryption of a shared content
     * @ORM\Column(name="public_asym_key", type="string", length=255)
     */
    protected $publicAsymKey;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return CommunicatingEntity
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set encryptedPrivateAsymKey
     *
     * @param string $encryptedPrivateAsymKey
     *
     * @return CommunicatingEntity
     */
    public function setEncryptedPrivateAsymKey($encryptedPrivateAsymKey)
    {
        $this->encryptedPrivateAsymKey = $encryptedPrivateAsymKey;

        return $this;
    }

    /**
     * Get encryptedPrivateAsymKey
     *
     * @return string
     */
    public function getencryptedPrivateAsymKey()
    {
        return $this->encryptedPrivateAsymKey;
    }

    /**
     * Set publicAsymKey
     *
     * @param string $publicAsymKey
     *
     * @return CommunicatingEntity
     */
    public function setPublicAsymKey($publicAsymKey)
    {
        $this->publicAsymKey = $publicAsymKey;

        return $this;
    }

    /**
     * Get publicAsymKey
     *
     * @return string
     */
    public function getPublicAsymKey()
    {
        return $this->publicAsymKey;
    }
}

