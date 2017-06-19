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

    /**
     * petit controlleur appelé lorsqu'une fonctionnalité n'est pas encore disponible
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function workInProgressAction(Request $request)
    {
        //on rempli le flashbag
        $request->getSession()->getFlashBag()->add('warning', 'Cette fonctionnalité n\'est pas encore accessible');
        //puis on redirige vers l'acceuil
        return $this->redirectToRoute("homepage");

    }
}
