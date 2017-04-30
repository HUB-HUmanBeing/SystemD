<?php

/* TestBundle:Default:coucou.html.twig */
class __TwigTemplate_da897e0976ede860226973851986c2d84d2dd243af79bc3a33fe14262c23a654 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_75d755190d2810242316081a144df33fdd7e22d4f277c5bedcb62f396ff0cb24 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_75d755190d2810242316081a144df33fdd7e22d4f277c5bedcb62f396ff0cb24->enter($__internal_75d755190d2810242316081a144df33fdd7e22d4f277c5bedcb62f396ff0cb24_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "TestBundle:Default:coucou.html.twig"));

        $__internal_a02f7d79937514d7bb15758581a428e11a7af153c63558d13ef904f18db54eed = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_a02f7d79937514d7bb15758581a428e11a7af153c63558d13ef904f18db54eed->enter($__internal_a02f7d79937514d7bb15758581a428e11a7af153c63558d13ef904f18db54eed_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "TestBundle:Default:coucou.html.twig"));

        // line 1
        echo "<t1> bonjour ";
        echo twig_escape_filter($this->env, ($context["name"] ?? $this->getContext($context, "name")), "html", null, true);
        echo "</T1>
";
        
        $__internal_75d755190d2810242316081a144df33fdd7e22d4f277c5bedcb62f396ff0cb24->leave($__internal_75d755190d2810242316081a144df33fdd7e22d4f277c5bedcb62f396ff0cb24_prof);

        
        $__internal_a02f7d79937514d7bb15758581a428e11a7af153c63558d13ef904f18db54eed->leave($__internal_a02f7d79937514d7bb15758581a428e11a7af153c63558d13ef904f18db54eed_prof);

    }

    public function getTemplateName()
    {
        return "TestBundle:Default:coucou.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  25 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("<t1> bonjour {{ name }}</T1>
", "TestBundle:Default:coucou.html.twig", "/var/www/html/HUmanBeing/src/TestBundle/Resources/views/Default/coucou.html.twig");
    }
}
