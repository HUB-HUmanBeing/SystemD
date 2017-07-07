<?php
namespace ProjectBundle\Controller;


use ProjectBundle\Entity\Project;
use ProjectBundle\Form\ProjectType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;


/**
 * Class ProjectController
 * @package ProjectBundle\Controller
 */
class ProjectController extends Controller
{
    /*
     * action permetant de récuperer les infos nécessaires a l'affichage de la page "vitrine" de chaques
     */
    public function MainPageAction($id , Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $project = $em->getRepository('ProjectBundle:Project')->find($id);
        return $this->render('@Project/Project/mainpage.html.twig',
            array(
                'project'=> $project,
                "initialRequest" =>$request,
                'UserRoleInProject' => $this->get('project.ProjectAuth')->getUserRole($project)
            )
        );
    }
    // renvoie la page des membres d'un projet  et le panneau d'envoi d'invitation d'un utilisateur

    /**
     * @param $id
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
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

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function newProjectAction(Request $request){
        //on génere un nouveau projet
        $Project = new Project();
        //on va chercher le formulaire
        $form = $this->get('form.factory')->create(ProjectType::class, $Project);
        //si la requete est de type post et si le formulaire est valide (crsf etc)
        if ($request->isMethod('POST') && $form->handleRequest($request)->isValid()) {
            //on ajoute l'utilisateur venant de créer le projet comme admin (role => 0)
            // et on lui donne la clef symétrique du projet chifrée avec sa clef publique
            $Project->addUser( $this->getUser(), $request->get('encryptedSymKey'), 0);
            //on persiste le tout
            $em = $this->getDoctrine()->getManager();
            $em->persist($Project);
            $em->flush();
            //on renvoie une confirmation dans le flash-bag
            $request->getSession()->getFlashBag()->add('info', 'Votre Projet à bien été créé !');
            //quant c'est fait, on renvoie vers la page d'aceuil du projet
            return $this->redirectToRoute('project_mainpage' , array('id' => $Project->getId()));
        }
        //si on est en get on envoie juste le formulaire de nouveau projet
        return $this->render('ProjectBundle:Project:newProject.html.twig', array(
            'form' => $form->createView(),
            'path' => $this->generateUrl('new_project'),

        ));
    }

    /**
     * @param $project_id
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function editInfoAction($project_id , Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $Project = $em->getRepository('ProjectBundle:Project')->find($project_id);
        $formBuilder = $this->get('form.factory')->createBuilder(FormType::class, $Project);
        $formBuilder->add('description',   TextareaType::class)
                    ->add('save',  SubmitType::class);
        $form = $formBuilder->getForm();
        //si la requete est de type post et si le formulaire est valide (crsf etc)
        if ($request->isMethod('POST') && $form->handleRequest($request)->isValid()) {
            //on peut alors vérifie que c'est bien un'admin du projet
            $this->get('project.ProjectAuth')->adminAuthCheck($Project);
            //on persiste le tout
            $em->persist($Project);
            $em->flush();
            //on renvoie une confirmation dans le flash-bag
            $request->getSession()->getFlashBag()->add('info', 'Les informations du projet ont été mises à jour');
            //quant c'est fait, on renvoie vers la page d'aceuil du projet
            return $this->redirectToRoute('project_mainpage' , array('id' => $project_id));
        }
        return $this->render('ProjectBundle:Project:editInfo.html.twig', array(
            'form' => $form->createView(),
            'project_name' =>$Project->getName(),
            'path' => $this->generateUrl('edit_project_info', array('project_id' => $project_id)),
        ));
    }

    public function upgradeRoleAction($project_id, $userProject_id,  Request $request)
    {
        //on crée un formulaire vide pour les crsf
        $form = $this->get('form.factory')->create();
        //si on recoit la requete de methode post et qu'elle est valide (crsf ok)
        if($request->isMethod('POST') && $form->handleRequest($request)->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $Project = $em->getRepository('ProjectBundle:Project')->find($project_id);
            //on peut alors vérifie que c'est bien un'admin du projet
            $this->get('project.ProjectAuth')->adminAuthCheck($Project);
            $UserProject = $em->getRepository('ProjectBundle:UserProject')->find($userProject_id);
            $UserProject->setRole(0);
            $em->persist($UserProject);
            $em->flush();
            return $this->redirectToRoute('project_members', array(
                'id'=>$project_id
            ));
        }
            return $this->render('ProjectBundle:Project:upgrade_role.html.twig', array(
                'form' => $form->createView(),//on crée la vue associée a notre formulaire
                'project_id' => $project_id,
                'userProject_id' => $userProject_id
            ));
    }
}
