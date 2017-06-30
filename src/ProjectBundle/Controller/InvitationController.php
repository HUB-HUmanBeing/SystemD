<?php
namespace ProjectBundle\Controller;

use ProjectBundle\Entity\Invitation;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use ProjectBundle\Form\InvitType;
use ProjectBundle\Entity\Project;


class InvitationController extends Controller
{

    //permet de gérer l'envoi et la reception du formulaire d'invitation
    //si post ca ajoute l'invit et ca renvoie vers la page membres
    //si get : ca renvoie juste le form
    public function addInvitationAction( Project $project, Request $request, $username = null){

        // sécurisation : que les admins peuvent le faire
        $this->get('project.ProjectAuth')->adminAuthCheck($project);
        $invitation =new Invitation();
        //on crée un drapeau pour savoir si on va devoir cacher ou non le champs d'ajout d'utilisateur dans le
        // formulaire suivant si on est dans la situation inviter depuis la page projet ou inviter depuis la page utilisateur
        $usernameFieldRequired = $username ? false : true;
        //on cre le formulaire
        $form = $this->get('form.factory')->create(InvitType::class, $invitation);

        //si on réceptionne la requete
        if ($request->isMethod('POST')) {
            //on remplit le form avec les variables du $_POST
            $form->handleRequest($request);
            //on définit le projet avec le projet passé en parametre
            $invitation->setProject($project);

            $invitation->setStatus(0);
            $userRepository = $this->getDoctrine()->getRepository('UserBundle:User');
            //on définit l'utilisateur à ajouter a partir de l'input du formulaire
            $user = $userRepository->findOneBy(array('username' => $request->get('username')));
            //todo arreter et renvoyer une erreur si l'utilisateur existe déja dans la table invitation
            $invitation->setUser($user);
            $em = $this->getDoctrine()->getManager();
            $em->persist($invitation);
            $em->flush();

            $request->getSession()->getFlashBag()->add('notice', 'l\'invitation a été envoyé!');
            //on renvoie l'utilisateur vers la page du projet
            return $this->redirectToRoute('project_members', array('id' => $project->getId()));
        }
        //si la requete est en get, en envoie le formulaire
        return $this->render('ProjectBundle:Invitation:addUser.html.twig', array(
            'form' => $form->createView(),//on crée la vue associée a notre formulaire
            'id' => $project->getId(),
            'username' => $username,
            'usernameFieldRequired' => $usernameFieldRequired
        ));
    }

    public function deleteInvitationAction( $invitation_id , Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        //on récupere l'invitation à partir de son id
        $invitation = $em->getRepository('ProjectBundle:Invitation')->find($invitation_id);
        // on récupere le projet
        $project = $invitation->getProject();
        //on peut alors vérifier que c'est bien un'admin du projet
        $this->get('project.ProjectAuth')->adminAuthCheck($project);
        //on crée un formulaire vide pour les crsf
        $form = $this->get('form.factory')->create();
        //si on recoit la requete de methode post et qu'elle est valide (crsf ok)
        if($request->isMethod('POST') && $form->handleRequest($request)->isValid()){
            //on la remove
            $em->remove($invitation);
            //puis on sauvegarde le tout
            $em->flush();
            //on revoie une confirmation
            $request->getSession()->getFlashBag()->add('notice', 'l\'invitation a été annulée');
            //on renvoie l'utilisateur vers la page du projet
            return $this->redirectToRoute('project_members', array('id' => $invitation->getProject()->getId()));
        }
        //si c'est en get on renvoie juste vers la vue affichant le formulaire de supression
        return $this->render('ProjectBundle:Invitation:delete_invitation.html.twig', array(
            'form' => $form->createView(),//on crée la vue associée a notre formulaire
            'invitation_id' => $invitation_id
        ));
    }

    public function acceptInvitationAction( $invitation_id , Request $request)
    {

        //on crée un formulaire vide pour les crsf
        $form = $this->get('form.factory')->create();
        //si on recoit la requete de methode post et qu'elle est valide (crsf ok)
        if($request->isMethod('POST') && $form->handleRequest($request)->isValid()){
            //on récupere l'invitation à partir de son id
            $em = $this->getDoctrine()->getManager();
            $invitation = $em->getRepository('ProjectBundle:Invitation')->find($invitation_id);
            //on chek que l'user courant est bien celui qui a recu l'invitation grace a notre service
            $this->get('user.userSecurity')->isThisUserCheck($invitation->getUser());
            //on chope le projet associé
            $project = $invitation->getProject();
            //on récupere la clef symetrique du projet chifrée avec la clef publique de l'utilisateur
            $encryptedSymKey = $invitation->getEncryptedSymKey();
            //on passe le statut de l'invitation à acceptée => 1
            $invitation->setStatus(1);
            //puis on sauvegarde le tout
            $em->persist($invitation);
            //on ajoute l'utilisateur au projet
            $project->addUser($invitation->getUser() , $encryptedSymKey);
            //puis on sauvegarde le tout
            $em->persist($project);
            $em->flush();
            //on revoie une confirmation
            $request->getSession()->getFlashBag()->add('notice', 'Vous faites désormais partie de l\'équipe  du projet "' . $project->getName() . '" !');
            //on renvoie l'utilisateur vers la page du projet
            return $this->redirectToRoute('project_members', array( 'id' => $invitation->getProject()->getId()));
        }

        //si on est en get on renvoie vers la vue du formulaire d'acceptation de l'invitation
        return $this->render('ProjectBundle:Invitation:accept_invitation.html.twig', array(
            'form' => $form->createView(),//on crée la vue associée a notre formulaire
            'invitation_id' => $invitation_id
        ));
    }

    public function declineInvitationAction($invitation_id, Request $request)
    {
        //on crée un formulaire vide pour les crsf
        $form = $this->get('form.factory')->create();
        //si on recoit la requete de methode post et qu'elle est valide (crsf ok)
        if($request->isMethod('POST') && $form->handleRequest($request)->isValid()){
            //on récupere l'invitation à partir de son id
            $em = $this->getDoctrine()->getManager();
            $invitation = $em->getRepository('ProjectBundle:Invitation')->find($invitation_id);
            //on chek que l'user courant est bien celui qui a recu l'invitation grace a notre service
            $this->get('user.userSecurity')->isThisUserCheck($invitation->getUser());
            //on passe son statut à 2 => déclinée
            $invitation->setStatus(2);
            //on met dans l'attribut reply la réponse passée par l'utilisateur au champ reply
            $invitation->setReply($request->get('reply'));
            //puis on sauvegarde le tout
            $em->persist($invitation);
            $em->flush();
            //on revoie une confirmation
            $request->getSession()->getFlashBag()->add('notice', 'l\'invitation a bien été déclinée');
            //on renvoie l'utilisateur vers la page du projet
            return $this->redirectToRoute('user_mainpage', array('id' => $this->getUser()->getId()));
        }
        return $this->render('ProjectBundle:Invitation:decline_invitation.html.twig', array(
            'form' => $form->createView(),//on crée la vue associée a notre formulaire
            'invitation_id' => $invitation_id
        ));
    }
}
