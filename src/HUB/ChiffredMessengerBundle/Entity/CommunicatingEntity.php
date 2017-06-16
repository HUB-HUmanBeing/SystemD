<?php

namespace HUB\ChiffredMessengerBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CommunicatingEntity
 *
 **@MappedSuperclass
 */
abstract class CommunicatingEntity
{
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    protected $name;

    /**
     * @var string
     *
     * @ORM\Column(name="chiffred_private_asym_key", type="string", length=255)
     */
    protected $chiffredPrivateAsymKey;

    /**
     * @var string
     *
     * @ORM\Column(name="public_asym_key", type="string", length=255)
     */
    protected $publicAsymKey;


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
     * Set chiffredPrivateAsymKey
     *
     * @param string $chiffredPrivateAsymKey
     *
     * @return CommunicatingEntity
     */
    public function setChiffredPrivateAsymKey($chiffredPrivateAsymKey)
    {
        $this->chiffredPrivateAsymKey = $chiffredPrivateAsymKey;

        return $this;
    }

    /**
     * Get chiffredPrivateAsymKey
     *
     * @return string
     */
    public function getChiffredPrivateAsymKey()
    {
        return $this->chiffredPrivateAsymKey;
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

