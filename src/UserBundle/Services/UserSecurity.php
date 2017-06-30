<?php
namespace UserBundle\Services;
use ProjectBundle\Entity\Project;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use UserBundle\Entity\User;

/**
 * Class ProjectAuth
 * @package ProjectBundle\Services
 */
class UserSecurity
{
    //
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
        //on commence par
        if( ! $this->authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY')){
            $this->userAuthError('Vous devez être authentifié pour pouvoir accéder à ces fonctionnalités');
        }
        return $this->tokenStorage->getToken()->getUser();
    }

    /**
     * renvoie true si l'utilisateur courant est celui passé en argument, renvoie une 403 sinon
     * @param user $user
     * @return bool
     */
    public function isThisUserCheck(User $user)
    {
        //on check si l'user courant est membre ou admin (0 => admin, 1=>user)
        if( $this->getUser() === $user){
            return true;
        }else{
            //sinon on renvoie une 403 forbidden avec ce message
            $this->userAuthError('Vous n\'avez pas accès  à cette fonctionalité');
            return false;
        }
    }



    /**
     * renvoie le message d'exeption 403
     * @param $message
     */
    private function userAuthError($message)
    {
        throw new AccessDeniedException($message);
    }
}