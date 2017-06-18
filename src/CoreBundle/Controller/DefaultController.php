<?php

namespace CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('CoreBundle:Default:index.html.twig');
    }
    public function workInProgressAction(Request $request)
    {
        $request->getSession()->getFlashBag()->add('warning', 'Cette fonctionnalité n\'est pas encore accessible');
        return $this->redirectToRoute("homepage");

    }
}
