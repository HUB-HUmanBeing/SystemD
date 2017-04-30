<?php

/* base.html.twig */
class __TwigTemplate_ecb3622156435dcef755b54ddd8e4732d0aa1bb06c91b31273e3d3ad684eea6d extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
            'title' => array($this, 'block_title'),
            'stylesheets' => array($this, 'block_stylesheets'),
            'body' => array($this, 'block_body'),
            'javascripts' => array($this, 'block_javascripts'),
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_4a01e3b63b91231148c7cd10db272d2ade73b87a2197029cdb8f5e90f39fca56 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_4a01e3b63b91231148c7cd10db272d2ade73b87a2197029cdb8f5e90f39fca56->enter($__internal_4a01e3b63b91231148c7cd10db272d2ade73b87a2197029cdb8f5e90f39fca56_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "base.html.twig"));

        $__internal_6b113bc193e1e2b6a448c3a58be0f0e4df20717d0e113b98020225aed820b175 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_6b113bc193e1e2b6a448c3a58be0f0e4df20717d0e113b98020225aed820b175->enter($__internal_6b113bc193e1e2b6a448c3a58be0f0e4df20717d0e113b98020225aed820b175_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "base.html.twig"));

        // line 1
        echo "<!DOCTYPE html>
<html>
    <head>
        <meta charset=\"UTF-8\" />
        <title>";
        // line 5
        $this->displayBlock('title', $context, $blocks);
        echo "</title>
        ";
        // line 6
        $this->displayBlock('stylesheets', $context, $blocks);
        // line 7
        echo "        <link rel=\"icon\" type=\"image/x-icon\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\AssetExtension')->getAssetUrl("favicon.ico"), "html", null, true);
        echo "\" />
    </head>
    <body>
        ";
        // line 10
        $this->displayBlock('body', $context, $blocks);
        // line 11
        echo "        ";
        $this->displayBlock('javascripts', $context, $blocks);
        // line 12
        echo "    </body>
</html>
";
        
        $__internal_4a01e3b63b91231148c7cd10db272d2ade73b87a2197029cdb8f5e90f39fca56->leave($__internal_4a01e3b63b91231148c7cd10db272d2ade73b87a2197029cdb8f5e90f39fca56_prof);

        
        $__internal_6b113bc193e1e2b6a448c3a58be0f0e4df20717d0e113b98020225aed820b175->leave($__internal_6b113bc193e1e2b6a448c3a58be0f0e4df20717d0e113b98020225aed820b175_prof);

    }

    // line 5
    public function block_title($context, array $blocks = array())
    {
        $__internal_20d0181955d811c08c011363ea65b3511ca0d97f163e07828ab5a242c9fb0b4a = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_20d0181955d811c08c011363ea65b3511ca0d97f163e07828ab5a242c9fb0b4a->enter($__internal_20d0181955d811c08c011363ea65b3511ca0d97f163e07828ab5a242c9fb0b4a_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        $__internal_9f9a91ab63ae99d44af0e00998f873bdf9a17cbe2791f3c8d043ff94cf9d6a3e = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_9f9a91ab63ae99d44af0e00998f873bdf9a17cbe2791f3c8d043ff94cf9d6a3e->enter($__internal_9f9a91ab63ae99d44af0e00998f873bdf9a17cbe2791f3c8d043ff94cf9d6a3e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        echo "Welcome!";
        
        $__internal_9f9a91ab63ae99d44af0e00998f873bdf9a17cbe2791f3c8d043ff94cf9d6a3e->leave($__internal_9f9a91ab63ae99d44af0e00998f873bdf9a17cbe2791f3c8d043ff94cf9d6a3e_prof);

        
        $__internal_20d0181955d811c08c011363ea65b3511ca0d97f163e07828ab5a242c9fb0b4a->leave($__internal_20d0181955d811c08c011363ea65b3511ca0d97f163e07828ab5a242c9fb0b4a_prof);

    }

    // line 6
    public function block_stylesheets($context, array $blocks = array())
    {
        $__internal_6f8abd30d30f7b413c25521b67fb471d9e3a74040a56de06cdbb6f92d8636c06 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_6f8abd30d30f7b413c25521b67fb471d9e3a74040a56de06cdbb6f92d8636c06->enter($__internal_6f8abd30d30f7b413c25521b67fb471d9e3a74040a56de06cdbb6f92d8636c06_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "stylesheets"));

        $__internal_7c331d78a4549e391686313170ac9cdea5132858e2485bd66e044053d28ded11 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_7c331d78a4549e391686313170ac9cdea5132858e2485bd66e044053d28ded11->enter($__internal_7c331d78a4549e391686313170ac9cdea5132858e2485bd66e044053d28ded11_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "stylesheets"));

        
        $__internal_7c331d78a4549e391686313170ac9cdea5132858e2485bd66e044053d28ded11->leave($__internal_7c331d78a4549e391686313170ac9cdea5132858e2485bd66e044053d28ded11_prof);

        
        $__internal_6f8abd30d30f7b413c25521b67fb471d9e3a74040a56de06cdbb6f92d8636c06->leave($__internal_6f8abd30d30f7b413c25521b67fb471d9e3a74040a56de06cdbb6f92d8636c06_prof);

    }

    // line 10
    public function block_body($context, array $blocks = array())
    {
        $__internal_22456d50823f98c29965094fe3fd5223a9c244403ba81f9ce7a67fc6820494ac = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_22456d50823f98c29965094fe3fd5223a9c244403ba81f9ce7a67fc6820494ac->enter($__internal_22456d50823f98c29965094fe3fd5223a9c244403ba81f9ce7a67fc6820494ac_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        $__internal_6a2cf9d6f234f4a937a5ceede382ee7b766b9fe27e2c2ef8700b7b7e9f540d16 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_6a2cf9d6f234f4a937a5ceede382ee7b766b9fe27e2c2ef8700b7b7e9f540d16->enter($__internal_6a2cf9d6f234f4a937a5ceede382ee7b766b9fe27e2c2ef8700b7b7e9f540d16_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        
        $__internal_6a2cf9d6f234f4a937a5ceede382ee7b766b9fe27e2c2ef8700b7b7e9f540d16->leave($__internal_6a2cf9d6f234f4a937a5ceede382ee7b766b9fe27e2c2ef8700b7b7e9f540d16_prof);

        
        $__internal_22456d50823f98c29965094fe3fd5223a9c244403ba81f9ce7a67fc6820494ac->leave($__internal_22456d50823f98c29965094fe3fd5223a9c244403ba81f9ce7a67fc6820494ac_prof);

    }

    // line 11
    public function block_javascripts($context, array $blocks = array())
    {
        $__internal_595aead8ae47e20fe5a438b88dba30305f540776f83e473c9ab481752750f054 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_595aead8ae47e20fe5a438b88dba30305f540776f83e473c9ab481752750f054->enter($__internal_595aead8ae47e20fe5a438b88dba30305f540776f83e473c9ab481752750f054_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "javascripts"));

        $__internal_b9d8adc7912968b7fef8ce975e532a803dd9912b7f3371b14c6ee85a1defeb6a = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_b9d8adc7912968b7fef8ce975e532a803dd9912b7f3371b14c6ee85a1defeb6a->enter($__internal_b9d8adc7912968b7fef8ce975e532a803dd9912b7f3371b14c6ee85a1defeb6a_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "javascripts"));

        
        $__internal_b9d8adc7912968b7fef8ce975e532a803dd9912b7f3371b14c6ee85a1defeb6a->leave($__internal_b9d8adc7912968b7fef8ce975e532a803dd9912b7f3371b14c6ee85a1defeb6a_prof);

        
        $__internal_595aead8ae47e20fe5a438b88dba30305f540776f83e473c9ab481752750f054->leave($__internal_595aead8ae47e20fe5a438b88dba30305f540776f83e473c9ab481752750f054_prof);

    }

    public function getTemplateName()
    {
        return "base.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  117 => 11,  100 => 10,  83 => 6,  65 => 5,  53 => 12,  50 => 11,  48 => 10,  41 => 7,  39 => 6,  35 => 5,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("<!DOCTYPE html>
<html>
    <head>
        <meta charset=\"UTF-8\" />
        <title>{% block title %}Welcome!{% endblock %}</title>
        {% block stylesheets %}{% endblock %}
        <link rel=\"icon\" type=\"image/x-icon\" href=\"{{ asset('favicon.ico') }}\" />
    </head>
    <body>
        {% block body %}{% endblock %}
        {% block javascripts %}{% endblock %}
    </body>
</html>
", "base.html.twig", "/var/www/html/HUmanBeing/app/Resources/views/base.html.twig");
    }
}
