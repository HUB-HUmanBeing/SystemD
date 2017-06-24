<?php
// todo renommer en projectcontroller
namespace ProjectBundle\Controller;

use ProjectBundle\Entity\Invitation;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use ProjectBundle\Form\InvitType;
use ProjectBundle\Entity\Project;
use UserBundle\Entity\User;

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

    //permet de gérer l'envoi et la reception du formulaire d'invitation
    public function addInvitationAction( Project $project, Request $request, $username = null){
        //si post ca ajoute l'invit et ca renvoie vers la page membres
        //si get : ca renvoie juste le form
        dump($username);
        //todo rajouter la sécurisation : que les admins peuvent le faire
        $invitation =new Invitation();
        //on crée un drapeau pour savoir si on va devoir créer un champ nom
        // dans le formulaire d'invitation ou si l'utilisateur a ajouter est déja défini contextualement
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
            //si ya pas d'utilisateur définit en attribut, on le crée a en recherchant a partir de l'input 'username'
            $user = $userRepository->findOneBy(array('username' => $request->get('username')));
            //todo arreter et renvoyer une erreur si l'utilisateur existe déja dans la table invitation
            $invitation->setUser($user);
            $em = $this->getDoctrine()->getManager();
            $em->persist($invitation);
            $em->flush();

            $request->getSession()->getFlashBag()->add('notice', 'l\'invitation a été envoyé!');

            return $this->redirectToRoute('project_members', array('id' => $project->getId()));//quant c'est fait, on renvoie vers
        }

        return $this->render('ProjectBundle:Invitation:addUser.html.twig', array(
            'form' => $form->createView(),//on crée la vue associée a notre formulaire
            'id' => $project->getId(),
            'username' => $username,
            'usernameFieldRequired' => $usernameFieldRequired
        ));
    }
}
