<?php
// todo renommer en projectcontroller
namespace ProjectBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;



class ProjectController extends Controller
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
        return $this->render('@Project/Project/mainpage.html.twig',
            array(
                'project'=> $project
            )
        );
    }
    // renvoie la page des membres d'un projet  et le panneau d'envoi d'invitation d'un utilisateur
    public function membersAction($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $project = $em->getRepository('ProjectBundle:Project')->find($id);//récupération du projet
        $invitation = $project->getInvitations();//récupération des invitations liées
        $userProjects = $project->getUserProjects();//récupération de la table de jointure des utilisateurs liés
        return $this->render('@Project/Project/members.html.twig', array(
            "project"=> $project,
            "userProjects"=> $userProjects,
            "invitations"=> $invitation,
            "initialRequest" =>$request
        ));
    }
}
