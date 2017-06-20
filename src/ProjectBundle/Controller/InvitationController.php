<?php

namespace ProjectBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class InvitationController extends Controller
{
    /**
     * renvoie vers la liste des invitations recues par l' utilisateur courant
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listForUserAction(Request $request)
    {
        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('ProjectBundle:Invitation');
        $userId = $this->getUser()->getID();
        $newInvitations =$repository->invitationsByStatus($userId, 0, false) ;
        $acceptedInvitations = $repository->invitationsByStatus($userId, 1, false) ;
        $declinedInvitations= $repository->invitationsByStatus($userId, 2, false) ;

        return $this->render('UserBundle:Invitation:list.html.twig', array(
                'newInvitations' => $newInvitations , 'acceptedInvitations' => $acceptedInvitations, 'declinedInvitations' => $declinedInvitations
        ));

    }

    /**
     * renvoie vers la liste des invitations envoyées
     * a des utilisateurs par un projet de l'id indiqué
     * @param $id
     * id du projet
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listForProjectAction($id, Request $request)
    {
        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('ProjectBundle:Invitation');

        $newInvitations =$repository->invitationsByStatus($id, 0, false) ;
        $accepted_invitations = $repository->invitationsByStatus($id, 1, false) ;
        $declined_invitations= $repository->invitationsByStatus($id, 2, false) ;
        return $this->render('UserBundle:Invitation:list.html.twig', array(
            'invitations' => [
                'newInvitations' => $newInvitations , 'accepted_invitations' => $accepted_invitations, 'declined_invitations' => $declined_invitations]
        ));
    }
}