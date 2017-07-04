<?php
namespace CoreBundle\Services;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
class Geoloc
{
    private $tokenStorage;

    //on ajoute au constructeur le tokenStorage qu'on a déclaré en argument du service
    public function __construct(TokenStorage $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    //renvoie la distance de l'utilisateur courant par rapport à un projet
    public function distanceFromCurrentUser($ProjectOrUser)
    {
        $User = $this->getUser();
        $distance_m = $this->get_distance_m($ProjectOrUser->getLat(),$ProjectOrUser->getLon(), $User->getLat() , $User->getLon());

        return round($distance_m/1000);
    }

    /**
     * @return mixed
     * renvoie l'utilisateur courant
     */
    private function getUser()
    {
        return $this->tokenStorage->getToken()->getUser();
    }

    // renvoi la distance en mètres entre deux points
    //http://www.phpsources.org/scripts459-PHP.htm
    private function get_distance_m($lat1, $lng1, $lat2, $lng2) {
        $earth_radius = 6378137;   // Terre = sphère de 6378km de rayon
        $rlo1 = deg2rad($lng1);
        $rla1 = deg2rad($lat1);
        $rlo2 = deg2rad($lng2);
        $rla2 = deg2rad($lat2);
        $dlo = ($rlo2 - $rlo1) / 2;
        $dla = ($rla2 - $rla1) / 2;
        $a = (sin($dla) * sin($dla)) + cos($rla1) * cos($rla2) * (sin($dlo) * sin($dlo
                ));
        $d = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return ($earth_radius * $d);
    }
}