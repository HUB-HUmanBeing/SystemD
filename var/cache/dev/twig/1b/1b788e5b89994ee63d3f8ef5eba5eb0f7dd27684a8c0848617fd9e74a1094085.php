<?php

/* @WebProfiler/Collector/router.html.twig */
class __TwigTemplate_e32fe7bbc587592d7d02b52fb0d248e7f6247282752466e0f9c5031b2c7e618c extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/router.html.twig", 1);
        $this->blocks = array(
            'toolbar' => array($this, 'block_toolbar'),
            'menu' => array($this, 'block_menu'),
            'panel' => array($this, 'block_panel'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@WebProfiler/Profiler/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_13f22d0dbf623764785248a3773f7ba9ded6edb1004b8338e76fb832e54a9929 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_13f22d0dbf623764785248a3773f7ba9ded6edb1004b8338e76fb832e54a9929->enter($__internal_13f22d0dbf623764785248a3773f7ba9ded6edb1004b8338e76fb832e54a9929_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/router.html.twig"));

        $__internal_9c294a533d633035ce82da7aa3d2826d59f88f9c50dcc4e9c355ef54026a0fdd = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_9c294a533d633035ce82da7aa3d2826d59f88f9c50dcc4e9c355ef54026a0fdd->enter($__internal_9c294a533d633035ce82da7aa3d2826d59f88f9c50dcc4e9c355ef54026a0fdd_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/router.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_13f22d0dbf623764785248a3773f7ba9ded6edb1004b8338e76fb832e54a9929->leave($__internal_13f22d0dbf623764785248a3773f7ba9ded6edb1004b8338e76fb832e54a9929_prof);

        
        $__internal_9c294a533d633035ce82da7aa3d2826d59f88f9c50dcc4e9c355ef54026a0fdd->leave($__internal_9c294a533d633035ce82da7aa3d2826d59f88f9c50dcc4e9c355ef54026a0fdd_prof);

    }

    // line 3
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_24954d57c5251f8ebc9f80ac855fb81169c3726e95c3a848661a32c63afa82c0 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_24954d57c5251f8ebc9f80ac855fb81169c3726e95c3a848661a32c63afa82c0->enter($__internal_24954d57c5251f8ebc9f80ac855fb81169c3726e95c3a848661a32c63afa82c0_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        $__internal_a26b0d8a8d84a48fb6bf1f1f87a8e6295743eabd107d37b30597ed780019cc95 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_a26b0d8a8d84a48fb6bf1f1f87a8e6295743eabd107d37b30597ed780019cc95->enter($__internal_a26b0d8a8d84a48fb6bf1f1f87a8e6295743eabd107d37b30597ed780019cc95_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        
        $__internal_a26b0d8a8d84a48fb6bf1f1f87a8e6295743eabd107d37b30597ed780019cc95->leave($__internal_a26b0d8a8d84a48fb6bf1f1f87a8e6295743eabd107d37b30597ed780019cc95_prof);

        
        $__internal_24954d57c5251f8ebc9f80ac855fb81169c3726e95c3a848661a32c63afa82c0->leave($__internal_24954d57c5251f8ebc9f80ac855fb81169c3726e95c3a848661a32c63afa82c0_prof);

    }

    // line 5
    public function block_menu($context, array $blocks = array())
    {
        $__internal_8e8d6b3e5fa5690d4b471bc8dd3a727e05fa5f018bf0733c5cb1f6a65aab8865 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_8e8d6b3e5fa5690d4b471bc8dd3a727e05fa5f018bf0733c5cb1f6a65aab8865->enter($__internal_8e8d6b3e5fa5690d4b471bc8dd3a727e05fa5f018bf0733c5cb1f6a65aab8865_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        $__internal_e88446ed2c94dfec0b7fdbd64a8710d0bf884eb68001a8ce1cfcec8f97f319b9 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_e88446ed2c94dfec0b7fdbd64a8710d0bf884eb68001a8ce1cfcec8f97f319b9->enter($__internal_e88446ed2c94dfec0b7fdbd64a8710d0bf884eb68001a8ce1cfcec8f97f319b9_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 6
        echo "<span class=\"label\">
    <span class=\"icon\">";
        // line 7
        echo twig_include($this->env, $context, "@WebProfiler/Icon/router.svg");
        echo "</span>
    <strong>Routing</strong>
</span>
";
        
        $__internal_e88446ed2c94dfec0b7fdbd64a8710d0bf884eb68001a8ce1cfcec8f97f319b9->leave($__internal_e88446ed2c94dfec0b7fdbd64a8710d0bf884eb68001a8ce1cfcec8f97f319b9_prof);

        
        $__internal_8e8d6b3e5fa5690d4b471bc8dd3a727e05fa5f018bf0733c5cb1f6a65aab8865->leave($__internal_8e8d6b3e5fa5690d4b471bc8dd3a727e05fa5f018bf0733c5cb1f6a65aab8865_prof);

    }

    // line 12
    public function block_panel($context, array $blocks = array())
    {
        $__internal_6fe43744f84435eef4bd6b9a870eb0ef98b1f61f52e3eedb956ad3135a39e528 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_6fe43744f84435eef4bd6b9a870eb0ef98b1f61f52e3eedb956ad3135a39e528->enter($__internal_6fe43744f84435eef4bd6b9a870eb0ef98b1f61f52e3eedb956ad3135a39e528_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        $__internal_e50f831d71bb251184d0da297161bdf07665c9523ce72919917918e2e4f1d5e7 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_e50f831d71bb251184d0da297161bdf07665c9523ce72919917918e2e4f1d5e7->enter($__internal_e50f831d71bb251184d0da297161bdf07665c9523ce72919917918e2e4f1d5e7_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 13
        echo "    ";
        echo $this->env->getRuntime('Symfony\Bridge\Twig\Extension\HttpKernelRuntime')->renderFragment($this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler_router", array("token" => ($context["token"] ?? $this->getContext($context, "token")))));
        echo "
";
        
        $__internal_e50f831d71bb251184d0da297161bdf07665c9523ce72919917918e2e4f1d5e7->leave($__internal_e50f831d71bb251184d0da297161bdf07665c9523ce72919917918e2e4f1d5e7_prof);

        
        $__internal_6fe43744f84435eef4bd6b9a870eb0ef98b1f61f52e3eedb956ad3135a39e528->leave($__internal_6fe43744f84435eef4bd6b9a870eb0ef98b1f61f52e3eedb956ad3135a39e528_prof);

    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/router.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  94 => 13,  85 => 12,  71 => 7,  68 => 6,  59 => 5,  42 => 3,  11 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("{% extends '@WebProfiler/Profiler/layout.html.twig' %}

{% block toolbar %}{% endblock %}

{% block menu %}
<span class=\"label\">
    <span class=\"icon\">{{ include('@WebProfiler/Icon/router.svg') }}</span>
    <strong>Routing</strong>
</span>
{% endblock %}

{% block panel %}
    {{ render(path('_profiler_router', { token: token })) }}
{% endblock %}
", "@WebProfiler/Collector/router.html.twig", "/var/www/html/HUmanBeing/vendor/symfony/symfony/src/Symfony/Bundle/WebProfilerBundle/Resources/views/Collector/router.html.twig");
    }
}
