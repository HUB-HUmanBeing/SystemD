<?php

namespace ProjectBundle\Repository;

/**
 * InvitationRepository
 */
class InvitationRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * renvoie un ensemble d'objet de type invitations en fonction de
     * l'id de l'appelant, de leurs status, et de la nature de l'apellant
     * @param $id
     * id de l'élement sur lequel on se réfere
     * @param $status
     * status de l'invitation : sans réponse => 0 , acceptée => 1 , refusée => 2
     * @param $is_demanded_by_project
     * true => il faut renvoyer les invit ayant pour projet projet.id
     * false => il faut renvoyer les invit ayant pour user user.id
     * @return array
     */
    public function invitationsByStatus($id, $status, $is_demanded_by_project)
    {
        $qb = $this->createQueryBuilder('a');
        if($is_demanded_by_project) {//si l'appelant est un projet
            $qb->where('a.project = :project')
                ->setParameter('project', $id)//on prends celle avec le project à $id
                ->andWhere('a.status = :status')
                ->setParameter('status', $status)//et celles ou le status est celui demandé
                ->orderBy('a.id', 'DESC')
            ;
        }else{ //sinon..
            $qb->where('a.user = :user')
                ->setParameter('user', $id)
                ->andWhere('a.status = :status')
                ->setParameter('status', $status)
                ->orderBy('a.id', 'DESC')
            ;
        }
        return $qb->getQuery()->getResult();//et on renvoie tout le bazar
    }
}
