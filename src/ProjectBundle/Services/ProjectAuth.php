<?php
namespace ProjectBundle\Services;
use ProjectBundle\Entity\Project;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Created by PhpStorm.
 * User: banquo
 * Date: 29/06/17
 * Time: 15:23
 */
class ProjectAuth
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    private function getUser()
    {
        return $this->container->get('security.context')->getToken()->getUser();
    }

    public function isMemberAuth(Project $project)
    {
        if( $this->getUser()->getUserProjects()->contains($project)){
            return true;
        }else{
            return $this->projectAuthError();
        }

    }

    public function isAdminAuth(Project $project)
    {
        if( $this->userRole($project) == 0){
            return true;
        }else{
            return $this->projectAuthError();
        }


    }

    public function userRole(Project $project){
        $userProjects = $this->getUser()->getUserProjects();
        $userRole = null;
        foreach ($userProjects as $userProject){
            if( $userProject.getProject() == $project ){
                $userRole = $userProject->getRole();
            }
        }
        return $userRole;
    }
    private function projectAuthError()
    {

    }

}