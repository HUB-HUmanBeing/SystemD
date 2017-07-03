<?php

namespace HUB\GeolocBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('HUBGeolocBundle:Default:index.html.twig');
    }
}
