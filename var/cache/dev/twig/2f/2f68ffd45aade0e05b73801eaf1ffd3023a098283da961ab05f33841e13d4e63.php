<?php

/* @WebProfiler/Collector/ajax.html.twig */
class __TwigTemplate_ee20e546a617b72acfa3f6b524eceed87a2784458018f669e386512df33bccea extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/ajax.html.twig", 1);
        $this->blocks = array(
            'toolbar' => array($this, 'block_toolbar'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@WebProfiler/Profiler/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_154d71da2965151c5b8a5ac817922f1c3c204dd50b3745b0f69563ae56069b95 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_154d71da2965151c5b8a5ac817922f1c3c204dd50b3745b0f69563ae56069b95->enter($__internal_154d71da2965151c5b8a5ac817922f1c3c204dd50b3745b0f69563ae56069b95_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/ajax.html.twig"));

        $__internal_7839f43ef84bfb5b44af4722fdf7e154004cea34248f4d43c4397164b3edbf56 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_7839f43ef84bfb5b44af4722fdf7e154004cea34248f4d43c4397164b3edbf56->enter($__internal_7839f43ef84bfb5b44af4722fdf7e154004cea34248f4d43c4397164b3edbf56_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/ajax.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_154d71da2965151c5b8a5ac817922f1c3c204dd50b3745b0f69563ae56069b95->leave($__internal_154d71da2965151c5b8a5ac817922f1c3c204dd50b3745b0f69563ae56069b95_prof);

        
        $__internal_7839f43ef84bfb5b44af4722fdf7e154004cea34248f4d43c4397164b3edbf56->leave($__internal_7839f43ef84bfb5b44af4722fdf7e154004cea34248f4d43c4397164b3edbf56_prof);

    }

    // line 3
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_66be194fee907852c3a42be6eef86582c12828cffd160e30e22f5277a5a4496d = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_66be194fee907852c3a42be6eef86582c12828cffd160e30e22f5277a5a4496d->enter($__internal_66be194fee907852c3a42be6eef86582c12828cffd160e30e22f5277a5a4496d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        $__internal_e5402808643d51c883e143fff78d64f53461ef13d7afc8c72f909ec000ae5d87 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_e5402808643d51c883e143fff78d64f53461ef13d7afc8c72f909ec000ae5d87->enter($__internal_e5402808643d51c883e143fff78d64f53461ef13d7afc8c72f909ec000ae5d87_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        // line 4
        echo "    ";
        ob_start();
        // line 5
        echo "        ";
        echo twig_include($this->env, $context, "@WebProfiler/Icon/ajax.svg");
        echo "
        <span class=\"sf-toolbar-value sf-toolbar-ajax-requests\">0</span>
    ";
        $context["icon"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 8
        echo "
    ";
        // line 9
        $context["text"] = ('' === $tmp = "        <div class=\"sf-toolbar-info-piece\">
            <b class=\"sf-toolbar-ajax-info\"></b>
        </div>
        <div class=\"sf-toolbar-info-piece\">
            <table class=\"sf-toolbar-ajax-requests\">
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>URL</th>
                        <th>Time</th>
                        <th>Profile</th>
                    </tr>
                </thead>
                <tbody class=\"sf-toolbar-ajax-request-list\"></tbody>
            </table>
        </div>
    ") ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 29
        echo "
    ";
        // line 30
        echo twig_include($this->env, $context, "@WebProfiler/Profiler/toolbar_item.html.twig", array("link" => false));
        echo "
";
        
        $__internal_e5402808643d51c883e143fff78d64f53461ef13d7afc8c72f909ec000ae5d87->leave($__internal_e5402808643d51c883e143fff78d64f53461ef13d7afc8c72f909ec000ae5d87_prof);

        
        $__internal_66be194fee907852c3a42be6eef86582c12828cffd160e30e22f5277a5a4496d->leave($__internal_66be194fee907852c3a42be6eef86582c12828cffd160e30e22f5277a5a4496d_prof);

    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/ajax.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  85 => 30,  82 => 29,  62 => 9,  59 => 8,  52 => 5,  49 => 4,  40 => 3,  11 => 1,);
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

{% block toolbar %}
    {% set icon %}
        {{ include('@WebProfiler/Icon/ajax.svg') }}
        <span class=\"sf-toolbar-value sf-toolbar-ajax-requests\">0</span>
    {% endset %}

    {% set text %}
        <div class=\"sf-toolbar-info-piece\">
            <b class=\"sf-toolbar-ajax-info\"></b>
        </div>
        <div class=\"sf-toolbar-info-piece\">
            <table class=\"sf-toolbar-ajax-requests\">
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>URL</th>
                        <th>Time</th>
                        <th>Profile</th>
                    </tr>
                </thead>
                <tbody class=\"sf-toolbar-ajax-request-list\"></tbody>
            </table>
        </div>
    {% endset %}

    {{ include('@WebProfiler/Profiler/toolbar_item.html.twig', { link: false }) }}
{% endblock %}
", "@WebProfiler/Collector/ajax.html.twig", "/var/www/html/HUmanBeing/vendor/symfony/symfony/src/Symfony/Bundle/WebProfilerBundle/Resources/views/Collector/ajax.html.twig");
    }
}
