<?php

namespace ProjectBundle\Form;

use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProjectType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {

        $builder
            ->add('name')
            ->add('description')
            ->add('encryptedPrivateAsymKey')
            ->add('publicAsymKey')
            ->add('lat', TextType::class, array('required' => false, 'attr' =>['id' =>'lat']))
            ->add('lon', TextType::class, array('required' => false, 'attr' =>['id' =>'lon']))
            ->add('city', TextType::class, array('required' => false, 'attr' =>['id' =>'city']))
            ->add('country', TextType::class, array('required' => false, 'attr' =>['id' =>'country']))
            ->add('save', SubmitType::class);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'ProjectBundle\Entity\Project'
        ));
    }



}
