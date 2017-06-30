<?php
namespace ProjectBundle\Services;
use ProjectBundle\Entity\Project;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Class ProjectAuth
 * @package ProjectBundle\Services
 */
class ProjectAuth
{
    //utile pour faire l'injection de dépendence
    private $tokenStorage;

    //
    private $authorizationChecker;

    //on ajoute au constructeur le tokenStorage qu'on a déclaré en argument du service
    public function __construct(TokenStorage $tokenStorage, AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->tokenStorage = $tokenStorage;
        $this->authorizationChecker = $authorizationChecker;
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
    public function memberAuthCheck(Project $project)
    {
        //on check si l'user courant est membre ou admin (0 => admin, 1=>user)
        if( $this->getUserRole($project) >= 0){
            return true;
        }else{
            //sinon on renvoie une 403 forbidden avec ce message
            $this->projectAuthError('Seuls Membres du projet ont accès à ces fonctionnalités');
            return false;
        }
    }

    /**
     * renvoie true si l'utilisateur courant est membre ou admin du projet
     * @param Project $project
     * @return bool
     */
    public function adminAuthCheck(Project $project)
    {
        //on check si l'user courant est l'admin (0 => admin)
        if( $this->getUserRole($project) === 0){
            return true;
        }else{
            //sinon on renvoie une 403 forbidden avec ce message
            $this->projectAuthError('Seuls les Administrateurs du projet ont accès à ces fonctionnalités');
            return false;
        }
    }

    /**
     * renvoie l'int correspondant au role de l'utilisateur, 0=>admin , 1 =>membre , -1 pour non authentifié
     * @param Project $project
     * @return int
     */
    public function getUserRole(Project $project){
        //on commence par checker que l'utilisateur courant est bien authentifié
        if( ! $this->authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY')){
            $this->projectAuthError('Vous devez être authentifié pour pouvoir accéder à ces fonctionnalités');
        }
        $userProjects = $project->getUserProjects();
        //si le foreach qui suit ne trouve pas l'utilisateur dans ses membres,
        // alors on lui attribue le role -1 => non participant
        $userRole = -1;
        //on boucle pour trouver l'user dans les userprojects du projet
        foreach ($userProjects as $userProject){
            if( $userProject->getUser() == $this->getUser() ){
                $userRole = $userProject->getRole();
            }
        }
        return $userRole;
    }

    /**
     * renvoie le message d'exeption 403
     * @param $message
     */
    private function projectAuthError($message)
    {
        throw new AccessDeniedException($message);
    }
}