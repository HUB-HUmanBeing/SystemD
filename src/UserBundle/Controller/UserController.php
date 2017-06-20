<?php

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\User;
use UserBundle\Form\UserType;

class UserController extends Controller
{
    //permet d'envoyer le formulaire de création ou de créer un nouvel  utilisateur si la methode est de type post
    public function addAction(Request $request)
    {
        $user =new User();
        $form = $this->get('form.factory')->create(UserType::class, $user);

        if ($request->isMethod('POST') && $form->handleRequest($request)->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            $request->getSession()->getFlashBag()->add('notice', 'Bienvenue parmi les utilisateurs d\'HUmanBeing');

            return $this->redirectToRoute('homepage');//quant c'est fait, on renvoie vers
        }

        return $this->render('UserBundle:Default:signIn.html.twig', array(
            'form' => $form->createView(),
            'path' => $this->generateUrl('sign_in'),
        ));

    }

    //renvoie vers la page principale d'un projet en fonction de son id
    public function mainpageAction($id , Request $request)
    {
        $em = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $em->find($id);
        return $this->render('UserBundle:Default:userMainpage.html.twig', array(
            'user' => $user
        ));
    }

    //renvoie vers la page permettant de visualiser les membres d'un projet et
    public function invitationsProjectsAction(Request $request)
    {
        $currentUser = $this->getUser() ;
        //on récupere les projets de
        $userProjects = $currentUser->getUserProjects();
        $invitations = $currentUser->getInvitations();//todo : c'est pas tres propre car je vais choper toutes les invitations alors que ya besoin de récuperer seulement celles avec le status à 0
        return $this->render('@User/Default/invitationProject.html.twig', array(
            'userProjects' => $userProjects,
            'invitations' => $invitations,
        ));
    }
}