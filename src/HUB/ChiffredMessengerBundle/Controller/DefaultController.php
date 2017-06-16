<?php

namespace HUB\ChiffredMessengerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('HUBChiffredMessengerBundle:Default:index.html.twig');
    }
}
