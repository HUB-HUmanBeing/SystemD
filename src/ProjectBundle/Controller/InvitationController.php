<?php
// todo renommer en projectcontroller
namespace ProjectBundle\Controller;

use ProjectBundle\Entity\Invitation;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use ProjectBundle\Form\InvitType;
use ProjectBundle\Entity\Project;


class InvitationController extends Controller
{

    //permet de gérer l'envoi et la reception du formulaire d'invitation
    public function addInvitationAction( Project $project, Request $request, $username = null){
        //si post ca ajoute l'invit et ca renvoie vers la page membres
        //si get : ca renvoie juste le form
        //todo rajouter la sécurisation : que les admins peuvent le faire
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

    public function deleteInvitationAction($project_id, $user_id, Request $request)
    {
        $form = $this->get('form.factory')->create();
        if($request->isMethod('POST')){
            $em = $this->getDoctrine()->getManager();
            $project = $em->getRepository('ProjectBundle:Project')->find($project_id);
            $user = $em->getRepository('UserBundle:User')->find($user_id);
            foreach ($project->getInvitations() as $invitation){
                if($invitation->getUser() == $user){
                    $em->remove($invitation);
                    $em->flush();
                }
            }
            $request->getSession()->getFlashBag()->add('notice', 'l\'invitation a été annulée');
            //on renvoie l'utilisateur vers la page du projet
            return $this->redirectToRoute('project_members', array('id' => $project->getId()));


        }
        return $this->render('ProjectBundle:Invitation:delete_invitation.html.twig', array(
            'form' => $form->createView(),//on crée la vue associée a notre formulaire
            'project_id' => $project_id,
            'user_id' => $user_id
        ));
    }
}
