<?php

namespace CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class MenuController extends Controller
{
    /**
     * ce controlleur génere un tableau  avec l'ensemble des infos nécessaires a la réalisation du menu latéral
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function generalMenuAction()
    {
        //on récupere l'utilisateur courant
        $currentUser=$this->getUser();
        //on crée un petit sous menu générique pour les onglets qui sont pas encore remplis
        $basicSubMenu = array(
            ['path'=>'work_in_progress','title'=>'lien vers telle fonctionnalité'],
            ['path'=>'work_in_progress','title'=>'lien vers telle fonctionnalité'],
            ['path'=>'work_in_progress','title'=>'lien vers telle fonctionnalité']
        );
        //pour le menu utilisateur on ajoute la déconnexion
        $userSubMenu = array(
            ['path'=>'user_mainpage', 'id'=> $this->getUser()->getId(), 'title'=>'Mon Profil'],
            ['path'=>'logout','title'=>'déconnexion']
            )
        ;
        $messageSubMenu = $basicSubMenu;
        //sous menu des projet
        $projectSubmenu = array('path'=>'user_projects','title'=>'Mes projets et invitations');
        //on boucle sur les projets utilisateurs
        foreach ($currentUser->getUserProjects() as $userProjects){
            $project = $userProjects->getProject();
            $projectSubmenu[] = [
                'path'=>'project_mainpage',
                'id'=>$project->getId(),
                'title'=>$project->getName()
            ];
        }
        //on construit le menu général avec toutes ces infos
        $generalMenu = array(
            'agenda' => array(
                'title'=> 'Agenda',
                'iconUrl'=> 'img/icon/agenda_icon.png',
                'subMenu' => $basicSubMenu
            ),
            'user' => array(
                'title'=> $currentUser->getUsername(),
                'iconUrl'=> 'img/icon/user_icon.png',
                'subMenu' => $userSubMenu
            ),
            'messenger' => array(
                'title'=> 'messagerie',
                'iconUrl'=> 'img/icon/message_icon.png',
                'subMenu' => $messageSubMenu
            ),
            'project' => array(
                'title'=> 'Mes Projets',
                'iconUrl'=> 'img/icon/project_icon.png',
                'subMenu' => $projectSubmenu
            ),
            'sharing' => array(
                'title'=> 'Partage',
                'iconUrl'=> 'img/icon/sharing_icon.png',
                'subMenu' => $basicSubMenu
            ),
            'moderation' => array(
                'title'=> 'Modération',
                'iconUrl'=> 'img/icon/moderation_icon.png',
                'subMenu' => $basicSubMenu
            )
        );
        //on renvoie vers la vue général-menu
        return $this->render('CoreBundle:Menu:generalMenu.html.twig', array(
            'generalMenu' => $generalMenu
        ));
    }
    //gere la petite fenetre de connexion et ses erreurs
    public function connexionPannelAction()
    {
        $authenticationUtils = $this->get('security.authentication_utils');
        return $this->render('CoreBundle:Menu:connexionPannel.html.twig', array(
            'last_username' => $authenticationUtils->getLastUsername(),
            'error'         => $authenticationUtils->getLastAuthenticationError()
        ));
    }
}
