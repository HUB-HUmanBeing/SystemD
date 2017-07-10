<?php

namespace CoreBundle\Controller;

use ProjectBundle\Entity\Project;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use UserBundle\Entity\User;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class GeolocController extends Controller
{

    /*
     * petit controlleur appelé pour
     */
    public function GeolocProjectAction(Project $Project)
    {
        $distanceFromCurrentUser = $this->get('core.geoloc')->distanceFromCurrentUser($Project);
        //puis on redirige vers l'acceuil
        return $this->render('CoreBundle:Geoloc:GeolocProject.html.twig', array(
            'distance' => $distanceFromCurrentUser,
            'project' => $Project
        ));

    }

    /*
     * petit controlleur appelé pour renvoyer la distance entre l'utilisateur courant et un autre utilisateur
     */
    public function GeolocUserAction(User $User)
    {
        $distanceFromCurrentUser = $this->get('core.geoloc')->distanceFromCurrentUser($User);
        //puis on renvoie juste la valeur en km vers la vue twig ou il à été appelé
        return new Response($distanceFromCurrentUser);

    }

    /**
     * action de controlleur pour éditer la position géographique d'un projet ou d'un user
     * @param $project_id
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function editGeolocProjectAction($project_id , Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $Project = $em->getRepository('ProjectBundle:Project')->find($project_id);
        $formBuilder = $this->get('form.factory')->createBuilder(FormType::class, $Project);
        $formBuilder->add('lon',   TextType::class)
            ->add('lat',   TextType::class)
            ->add('city',   TextType::class)
            ->add('country',   TextType::class)
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
            $request->getSession()->getFlashBag()->add('info', 'La localisation du projet à été mise à jour');
            //quant c'est fait, on renvoie vers la page d'aceuil du projet
            return $this->redirectToRoute('project_mainpage' , array('id' => $project_id));
        }
        //si on est juste en get on renvoie simplement le formulaire d'edition
        return $this->render('CoreBundle:Geoloc:edit_geoloc.html.twig', array(
            'form' => $form->createView(),
            'path' => $this->generateUrl('edit_geoloc_project', array('project_id' => $project_id)),
        ));
    }
}
