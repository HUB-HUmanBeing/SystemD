<?php
namespace ProjectBundle\Controller;


use ProjectBundle\Entity\Project;
use ProjectBundle\Form\ProjectType;
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
                'project'=> $project,
                'UserRoleInProject' => $this->get('project.ProjectAuth')->getUserRole($project)
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
            "initialRequest" =>$request,
            'UserRoleInProject' => $this->get('project.ProjectAuth')->getUserRole($project)
        ));
    }
    public function newProjectAction(Request $request){

        $Project = new Project();
        $form = $this->get('form.factory')->create(ProjectType::class, $Project);
        if ($request->isMethod('POST') && $form->handleRequest($request)->isValid()) {
            $Project->addUser( $this->getUser(), $request->get('encryptedSymKey'), 0);
            $em = $this->getDoctrine()->getManager();
            $em->persist($Project);
            $em->flush();

            $request->getSession()->getFlashBag()->add('info', 'Votre Projet à bien été créé !');

            return $this->redirectToRoute('project_mainpage' , array('id' => $Project->getId()));//quant c'est fait, on renvoie vers
        }

        return $this->render('ProjectBundle:Project:newProject.html.twig', array(
            'form' => $form->createView(),
            'path' => $this->generateUrl('new_project'),
        ));
    }
}
