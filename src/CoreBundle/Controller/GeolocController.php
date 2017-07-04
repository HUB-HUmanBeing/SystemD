<?php

namespace CoreBundle\Controller;

use ProjectBundle\Entity\Project;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use UserBundle\Entity\User;

class GeolocController extends Controller
{

    /*
     * petit controlleur appelé pour
     */
    public function GeolocProjectAction(Project $Project)
    {
        $distanceFromCurrentUser = $this->get('core.geoloc')->distanceFromCurrentUser($Project);
        //puis on redirige vers l'acceuil
        return $this->render('CoreBundle:Geoloc:GeolocProject.html.twig', array(
            'distance' => $distanceFromCurrentUser,
            'project' => $Project
        ));

    }

    /*
     * petit controlleur appelé pour renvoyer la distance entre l'utilisateur courant et un autre utilisateur
     */
    public function GeolocUserAction(User $User)
    {
        $distanceFromCurrentUser = $this->get('core.geoloc')->distanceFromCurrentUser($User);
        //puis on renvoie juste la valeur en km vers la vue twig ou il à été appelé
        return new Response($distanceFromCurrentUser);

    }
}
