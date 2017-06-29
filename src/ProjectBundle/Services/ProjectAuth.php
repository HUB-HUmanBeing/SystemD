<?php
namespace ProjectBundle\Services;
use ProjectBundle\Entity\Project;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Class ProjectAuth
 * @package ProjectBundle\Services
 */
class ProjectAuth
{
    //utile pour faire l'injection de dépendence
    private $tokenStorage;

    //on ajoute au constructeur le tokenStorage qu'on a déclaré en argument du service
    public function __construct(TokenStorage $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return mixed
     */
    private function getUser()
    {
        return $this->tokenStorage->getToken()->getUser();
    }

    /**
     * renvoie true si l'utilisateur courant est membre ou admin du projet
     * @param Project $project
     * @return bool
     */
    public function isMemberAuth(Project $project)
    {
        if( $this->getUserRole($project) >= 0){
            return true;
        }else{
            $this->projectAuthError("Seuls Membres du projet ont accès à ces fonctionnalités");
            return false;
        }

    }

    /**
     * renvoie true si l'utilisateur courant est membre ou admin du projet
     * @param Project $project
     * @return bool
     */
    public function isAdminAuth(Project $project)
    {
        if( $this->getUserRole($project) === 0){
            return true;
        }else{
            $this->projectAuthError("Seuls les Administrateurs du projet ont accès à ces fonctionnalités");
            return false;
        }


    }

    /**
     * renvoie l'int correspondant au role de l'utilisateur, 0=>admin , 1 =>membre , -1 pour non authentifié
     * @param Project $project
     * @return int
     */
    public function getUserRole(Project $project){
        $userProjects = $project->getUserProjects();
        $userRole = -1;
        foreach ($userProjects as $userProject){
            if( $userProject->getUser() == $this->getUser() ){
                $userRole = $userProject->getRole();
            }
        }
        return $userRole;
    }

    /**
     * @param $message
     */
    private function projectAuthError($message)
    {
        throw new AccessDeniedException($message);
    }

}