<?php

namespace HUB\CryptoMessengerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('HUBCryptoMessengerBundle:Default:index.html.twig');
    }
}
