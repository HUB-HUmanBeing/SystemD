<?php

namespace CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GeolocalizedEntity
 *
 * @ORM\Table
 * @ORM\Entity(repositoryClass="CoreBundle\Repository\GeolocalizedEntityRepository")
* la stratégie pour representer cela en base de donnée est de type joined ce qui entraine Trois tables distinctes
* @ORM\InheritanceType("JOINED")
* on pourra déterminer si la communicating entity est un user ou un projet a partir de la collone type dans la bdd
* @ORM\DiscriminatorColumn(name="type", type="string")
* @ORM\DiscriminatorMap({"communicating" = "CoreBundle\Entity\CommunicatingEntity"})
 */
abstract class GeolocalizedEntity
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var float
     *
     * @ORM\Column(name="lon", type="float", nullable=true)
     */
    private $lon;

    /**
     * @var float
     *
     * @ORM\Column(name="lat", type="float", nullable=true)
     */
    private $lat;

    /**
     * @var int
     * @ORM\Column(name="city", type="string", nullable=true)
     */
    private $city;


    /**
     * @var int
     * @ORM\Column(name="country", type="string", nullable=true)
     */
    private $country;
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
     * Set lon
     *
     * @param float $lon
     *
     * @return GeolocalizedEntity
     */
    public function setLon($lon)
    {
        $this->lon = $lon;

        return $this;
    }

    /**
     * Get lon
     *
     * @return float
     */
    public function getLon()
    {
        return $this->lon;
    }

    /**
     * Set lat
     *
     * @param float $lat
     *
     * @return GeolocalizedEntity
     */
    public function setLat($lat)
    {
        $this->lat = $lat;

        return $this;
    }

    /**
     * Get lat
     *
     * @return float
     */
    public function getLat()
    {
        return $this->lat;
    }
    /**
     * @return int
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * @param int $city
     */
    public function setCity($city)
    {
        $this->city = $city;
    }

    /**
     * @return int
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * @param int $country
     */
    public function setCountry($country)
    {
        $this->country = $country;
    }



}

