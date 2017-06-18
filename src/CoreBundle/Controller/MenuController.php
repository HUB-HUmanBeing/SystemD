<?php

namespace CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MenuController extends Controller
{
    public function generalMenu()
    {
        $currentUser=$this->getUser();
        $basicSubMenu = array(
            ['href'=>'#','title'=>'lien vers telle fonctionnalité'],
            ['href'=>'#','title'=>'lien vers telle fonctionnalité'],
            ['href'=>'#','title'=>'lien vers telle fonctionnalité']
        );
        $projectSubmenu = array();
        foreach ($currentUser->getUserProjects() as $userProjects){
            $project =$userProjects->getProject();
            $projectSubmenu[] = [
                'href'=>'project_mainpage',
                'id'=>$project->getId(),
                'title'=>$project->getName()
            ];
        }
        $generalMenu = array(
            'user' => array(
                'title'=> $currentUser->getUsername(),
                'iconUrl'=> 'img/icon/user_icon.png',
                'subMenu' => $basicSubMenu
            ),
            'messenger' => array(
                'title'=> 'messagerie',
                'iconUrl'=> 'img/icon/message_icon.png',
                'subMenu' => $basicSubMenu
            ),
            'project' => array(
                'title'=> 'Mes projets',
                'iconUrl'=> 'img/icon/project_icon.png',
                'subMenu' => $projectSubmenu
            ),
            'sharing' => array(
                'title'=> 'messagerie',
                'iconUrl'=> 'img/icon/message_icon.png',
                'subMenu' => $basicSubMenu
            ),
            'moderation' => array(
                'title'=> 'messagerie',
                'iconUrl'=> 'img/icon/message_icon.png',
                'subMenu' => $basicSubMenu
            )
        );
        return $this->render(':template:general_menu.html.twig', array(
            'generalMenu' => $generalMenu
        ));
    }
}
