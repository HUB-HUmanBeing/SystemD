<?php

/* @WebProfiler/Collector/exception.html.twig */
class __TwigTemplate_bd839a623d41e65c7ad875f8876c26b53612d034a2fd2ba100c18e03a3c8b771 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/exception.html.twig", 1);
        $this->blocks = array(
            'head' => array($this, 'block_head'),
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
        $__internal_53e166a87a5d4bb1cbb0adeb809704e0a22a4fc5afafb144dce0ebc5c14dae58 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_53e166a87a5d4bb1cbb0adeb809704e0a22a4fc5afafb144dce0ebc5c14dae58->enter($__internal_53e166a87a5d4bb1cbb0adeb809704e0a22a4fc5afafb144dce0ebc5c14dae58_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/exception.html.twig"));

        $__internal_d426a281ee6e79f70f5f459d78e419aee22cecc99279ae9d68158925c71b4117 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_d426a281ee6e79f70f5f459d78e419aee22cecc99279ae9d68158925c71b4117->enter($__internal_d426a281ee6e79f70f5f459d78e419aee22cecc99279ae9d68158925c71b4117_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/exception.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_53e166a87a5d4bb1cbb0adeb809704e0a22a4fc5afafb144dce0ebc5c14dae58->leave($__internal_53e166a87a5d4bb1cbb0adeb809704e0a22a4fc5afafb144dce0ebc5c14dae58_prof);

        
        $__internal_d426a281ee6e79f70f5f459d78e419aee22cecc99279ae9d68158925c71b4117->leave($__internal_d426a281ee6e79f70f5f459d78e419aee22cecc99279ae9d68158925c71b4117_prof);

    }

    // line 3
    public function block_head($context, array $blocks = array())
    {
        $__internal_fc7697a139e7dfa4d5b3678eebfb5e9b0b36e2338a9423d8ef34aacac758e1de = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_fc7697a139e7dfa4d5b3678eebfb5e9b0b36e2338a9423d8ef34aacac758e1de->enter($__internal_fc7697a139e7dfa4d5b3678eebfb5e9b0b36e2338a9423d8ef34aacac758e1de_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        $__internal_b19ee7c9dbf86866ed03f3f2fee0b7ea608e32635e668e3b94a77d6808901265 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_b19ee7c9dbf86866ed03f3f2fee0b7ea608e32635e668e3b94a77d6808901265->enter($__internal_b19ee7c9dbf86866ed03f3f2fee0b7ea608e32635e668e3b94a77d6808901265_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        // line 4
        echo "    ";
        if ($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "hasexception", array())) {
            // line 5
            echo "        <style>
            ";
            // line 6
            echo $this->env->getRuntime('Symfony\Bridge\Twig\Extension\HttpKernelRuntime')->renderFragment($this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler_exception_css", array("token" => ($context["token"] ?? $this->getContext($context, "token")))));
            echo "
        </style>
    ";
        }
        // line 9
        echo "    ";
        $this->displayParentBlock("head", $context, $blocks);
        echo "
";
        
        $__internal_b19ee7c9dbf86866ed03f3f2fee0b7ea608e32635e668e3b94a77d6808901265->leave($__internal_b19ee7c9dbf86866ed03f3f2fee0b7ea608e32635e668e3b94a77d6808901265_prof);

        
        $__internal_fc7697a139e7dfa4d5b3678eebfb5e9b0b36e2338a9423d8ef34aacac758e1de->leave($__internal_fc7697a139e7dfa4d5b3678eebfb5e9b0b36e2338a9423d8ef34aacac758e1de_prof);

    }

    // line 12
    public function block_menu($context, array $blocks = array())
    {
        $__internal_b4c219fad01f7e2008b3583f77bdd030a53eaa0cd36471e5a377857c284913b5 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_b4c219fad01f7e2008b3583f77bdd030a53eaa0cd36471e5a377857c284913b5->enter($__internal_b4c219fad01f7e2008b3583f77bdd030a53eaa0cd36471e5a377857c284913b5_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        $__internal_efa748b23b494c45784916009349930dcc66cf6295e8dc4b53b3250eb08dd641 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_efa748b23b494c45784916009349930dcc66cf6295e8dc4b53b3250eb08dd641->enter($__internal_efa748b23b494c45784916009349930dcc66cf6295e8dc4b53b3250eb08dd641_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 13
        echo "    <span class=\"label ";
        echo (($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "hasexception", array())) ? ("label-status-error") : ("disabled"));
        echo "\">
        <span class=\"icon\">";
        // line 14
        echo twig_include($this->env, $context, "@WebProfiler/Icon/exception.svg");
        echo "</span>
        <strong>Exception</strong>
        ";
        // line 16
        if ($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "hasexception", array())) {
            // line 17
            echo "            <span class=\"count\">
                <span>1</span>
            </span>
        ";
        }
        // line 21
        echo "    </span>
";
        
        $__internal_efa748b23b494c45784916009349930dcc66cf6295e8dc4b53b3250eb08dd641->leave($__internal_efa748b23b494c45784916009349930dcc66cf6295e8dc4b53b3250eb08dd641_prof);

        
        $__internal_b4c219fad01f7e2008b3583f77bdd030a53eaa0cd36471e5a377857c284913b5->leave($__internal_b4c219fad01f7e2008b3583f77bdd030a53eaa0cd36471e5a377857c284913b5_prof);

    }

    // line 24
    public function block_panel($context, array $blocks = array())
    {
        $__internal_25d462536b634dc7cfc9dc7c82603f08bb537418c7e05326d7b3541eea599dda = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_25d462536b634dc7cfc9dc7c82603f08bb537418c7e05326d7b3541eea599dda->enter($__internal_25d462536b634dc7cfc9dc7c82603f08bb537418c7e05326d7b3541eea599dda_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        $__internal_99b4c7ab04368c29f977b5cfe5b1af16195beca54035d3f3c254f9461c84c835 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_99b4c7ab04368c29f977b5cfe5b1af16195beca54035d3f3c254f9461c84c835->enter($__internal_99b4c7ab04368c29f977b5cfe5b1af16195beca54035d3f3c254f9461c84c835_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 25
        echo "    <h2>Exceptions</h2>

    ";
        // line 27
        if ( !$this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "hasexception", array())) {
            // line 28
            echo "        <div class=\"empty\">
            <p>No exception was thrown and caught during the request.</p>
        </div>
    ";
        } else {
            // line 32
            echo "        <div class=\"sf-reset\">
            ";
            // line 33
            echo $this->env->getRuntime('Symfony\Bridge\Twig\Extension\HttpKernelRuntime')->renderFragment($this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler_exception", array("token" => ($context["token"] ?? $this->getContext($context, "token")))));
            echo "
        </div>
    ";
        }
        
        $__internal_99b4c7ab04368c29f977b5cfe5b1af16195beca54035d3f3c254f9461c84c835->leave($__internal_99b4c7ab04368c29f977b5cfe5b1af16195beca54035d3f3c254f9461c84c835_prof);

        
        $__internal_25d462536b634dc7cfc9dc7c82603f08bb537418c7e05326d7b3541eea599dda->leave($__internal_25d462536b634dc7cfc9dc7c82603f08bb537418c7e05326d7b3541eea599dda_prof);

    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/exception.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  138 => 33,  135 => 32,  129 => 28,  127 => 27,  123 => 25,  114 => 24,  103 => 21,  97 => 17,  95 => 16,  90 => 14,  85 => 13,  76 => 12,  63 => 9,  57 => 6,  54 => 5,  51 => 4,  42 => 3,  11 => 1,);
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

{% block head %}
    {% if collector.hasexception %}
        <style>
            {{ render(path('_profiler_exception_css', { token: token })) }}
        </style>
    {% endif %}
    {{ parent() }}
{% endblock %}

{% block menu %}
    <span class=\"label {{ collector.hasexception ? 'label-status-error' : 'disabled' }}\">
        <span class=\"icon\">{{ include('@WebProfiler/Icon/exception.svg') }}</span>
        <strong>Exception</strong>
        {% if collector.hasexception %}
            <span class=\"count\">
                <span>1</span>
            </span>
        {% endif %}
    </span>
{% endblock %}

{% block panel %}
    <h2>Exceptions</h2>

    {% if not collector.hasexception %}
        <div class=\"empty\">
            <p>No exception was thrown and caught during the request.</p>
        </div>
    {% else %}
        <div class=\"sf-reset\">
            {{ render(path('_profiler_exception', { token: token })) }}
        </div>
    {% endif %}
{% endblock %}
", "@WebProfiler/Collector/exception.html.twig", "/var/www/html/HUmanBeing/vendor/symfony/symfony/src/Symfony/Bundle/WebProfilerBundle/Resources/views/Collector/exception.html.twig");
    }
}
