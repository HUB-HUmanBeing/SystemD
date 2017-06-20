<?php

namespace ProjectBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * action permetant de récuperer les infos nécessaires a l'affichage de la page "vitrine" de chaques
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function MainPageAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $project = $em->getRepository('ProjectBundle:Project')->find($id);
        return $this->render('@Project/Default/mainpage.html.twig',
            array(
                'project'=> $project
            )
        );
    }
    //TODO : écrire le controller
    // renvoie la page des membres d'un projet  et le panneau d'envoi d'invitation d'un utilisateur
    public function membersAction($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $project = $em->getRepository('ProjectBundle:Project')->find($id);
        return $this->render();
    }

    //permet de gérer l'envoi et la reception du formulaire d'invitation
    private function addinvitation(Request $request){

    }
}
