<?php

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use UserBundle\Entity\User;
use UserBundle\Form\UserType;

class UserController extends Controller
{
    public function addAction(Request $request)
    {
        $user =new User();
        $form = $this->get('form.factory')->create(UserType::class, $user);

        if ($request->isMethod('POST') && $form->handleRequest($request)->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            $request->getSession()->getFlashBag()->add('notice', 'Bienvenu parmis les utilisateurs d\'HUmanBeing');

            return $this->redirectToRoute('homepage');
        }

        return $this->render('UserBundle:Default:signIn.html.twig', array(
            'form' => $form->createView(),
            'path' => $this->generateUrl('sign_in'),
        ));

    }
    public function mainpageAction($id , Request $request)
    {
        $em = $this->getDoctrine()->getRepository('UserBundle:User');
        $user = $em->find($id);
        return $this->render('UserBundle:Default:userMainpage.html.twig', array(
            'user' => $user
        ));
    }
}