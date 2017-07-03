<?php

namespace UserBundle\Form;

use Doctrine\DBAL\Types\FloatType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    /**
     * {@inheritdoc}
     * construction du formulaire d' inscription
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class)
            ->add('password', RepeatedType::class, array(
                'type' => PasswordType::class,
                'invalid_message' => 'les passwords ne sont pas identiques',
                'options' => array('attr' => array('class' => 'password-field')),
                'required' => true,
                'first_options'  => array('label' => 'Password'),
                'second_options' => array('label' => 'répétez le Password'),
            ))
            ->add('description' , TextareaType::class)
            ->add('encryptedPrivateAsymKey',TextType::class)
            ->add('publicAsymKey', TextType::class)
            ->add('lat', TextType::class, array('required' => false, 'attr' =>['id' =>'lat']))
            ->add('lon', TextType::class, array('required' => false, 'attr' =>['id' =>'lon']))
            ->add('city', TextType::class, array('required' => false, 'attr' =>['id' =>'city']))
            ->add('country', TextType::class, array('required' => false, 'attr' =>['id' =>'country']))
            ->add('save', SubmitType::class)
        ;
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'UserBundle\Entity\User'
        ));
    }
}
