<?php

namespace HUB\CryptoMessengerBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="communicating_entity")
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({"user" = "UserBundle\Entity\User", "project" = "ProjectBundle\Entity\Project"})
 */
abstract class CommunicatingEntity
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    protected $name;

    /**
     * @var string
     * the private_asym_key is necessary for decrypt the symmetrical key used for Encryption/decryption of a shared content
     * @ORM\Column(name="encrypted_private_asym_key", type="string", length=255)
     */
    protected $encryptedPrivateAsymKey;

    /**
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

