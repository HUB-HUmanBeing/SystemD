<?php

namespace ProjectBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class InvitationController extends Controller
{
    /**
     * renvoie vers la liste des invitations recues par l' utilisateur courant
     * @return array
     */
    public function listForUser()
    {
        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('ProjectBundle:Invitation');
        $userId = $this->getUser()->getID();
        $newInvitations =$repository->invitationsByStatus($userId, 0, false) ;
        $acceptedInvitations = $repository->invitationsByStatus($userId, 1, false) ;
        $declinedInvitations= $repository->invitationsByStatus($userId, 2, false) ;

        $invitations = array(
                'newInvitations' => $newInvitations ,
            'acceptedInvitations' => $acceptedInvitations,
            'declinedInvitations' => $declinedInvitations
        );
    return $invitations;
    }

    /**
     * renvoie vers la liste des invitations envoyées
     * a des utilisateurs par un projet de l'id indiqué
     * @param $id
     * id du projet
     * @return array
     */
    public function listForProject($id)
    {
        $repository = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('ProjectBundle:Invitation');

        $newInvitations =$repository->invitationsByStatus($id, 0, false) ;
        $acceptedInvitations = $repository->invitationsByStatus($id, 1, false) ;
        $declinedInvitations= $repository->invitationsByStatus($id, 2, false) ;

            $invitations = array(
                'newInvitations' => $newInvitations ,
                'acceptedInvitations' => $acceptedInvitations,
                'declinedInvitations' => $declinedInvitations
            );
        return $invitations;
    }
}