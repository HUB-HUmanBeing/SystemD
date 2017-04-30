<?php

/* @Twig/Exception/exception_full.html.twig */
class __TwigTemplate_04b0d5b68b2e7cad0dd94f8a266e92ef18dc421a23faaba9704df6a5f3ed9acd extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@Twig/layout.html.twig", "@Twig/Exception/exception_full.html.twig", 1);
        $this->blocks = array(
            'head' => array($this, 'block_head'),
            'title' => array($this, 'block_title'),
            'body' => array($this, 'block_body'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@Twig/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_e1b997fbfb358f1b2a6d71d0ba2fd889f33dff5e7911f5d98e2ee4c15940a3d3 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_e1b997fbfb358f1b2a6d71d0ba2fd889f33dff5e7911f5d98e2ee4c15940a3d3->enter($__internal_e1b997fbfb358f1b2a6d71d0ba2fd889f33dff5e7911f5d98e2ee4c15940a3d3_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@Twig/Exception/exception_full.html.twig"));

        $__internal_5d93e83e53b7a93a85179e6fb87ef63a468ba2f71794cab49a62ef10e995b31a = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_5d93e83e53b7a93a85179e6fb87ef63a468ba2f71794cab49a62ef10e995b31a->enter($__internal_5d93e83e53b7a93a85179e6fb87ef63a468ba2f71794cab49a62ef10e995b31a_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@Twig/Exception/exception_full.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_e1b997fbfb358f1b2a6d71d0ba2fd889f33dff5e7911f5d98e2ee4c15940a3d3->leave($__internal_e1b997fbfb358f1b2a6d71d0ba2fd889f33dff5e7911f5d98e2ee4c15940a3d3_prof);

        
        $__internal_5d93e83e53b7a93a85179e6fb87ef63a468ba2f71794cab49a62ef10e995b31a->leave($__internal_5d93e83e53b7a93a85179e6fb87ef63a468ba2f71794cab49a62ef10e995b31a_prof);

    }

    // line 3
    public function block_head($context, array $blocks = array())
    {
        $__internal_b5e3453fce7eccd490d5e78fa91b4d9dffba59226edb98c18b8dcd6c7ef18e1a = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_b5e3453fce7eccd490d5e78fa91b4d9dffba59226edb98c18b8dcd6c7ef18e1a->enter($__internal_b5e3453fce7eccd490d5e78fa91b4d9dffba59226edb98c18b8dcd6c7ef18e1a_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        $__internal_087c27f5a3e09faa5b5d945950dad57c5103cb1090ab02df5b8a2f026601dc0e = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_087c27f5a3e09faa5b5d945950dad57c5103cb1090ab02df5b8a2f026601dc0e->enter($__internal_087c27f5a3e09faa5b5d945950dad57c5103cb1090ab02df5b8a2f026601dc0e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        // line 4
        echo "    <style>
        .sf-reset .traces {
            padding-bottom: 14px;
        }
        .sf-reset .traces li {
            font-size: 12px;
            color: #868686;
            padding: 5px 4px;
            list-style-type: decimal;
            margin-left: 20px;
        }
        .sf-reset #logs .traces li.error {
            font-style: normal;
            color: #AA3333;
            background: #f9ecec;
        }
        .sf-reset #logs .traces li.warning {
            font-style: normal;
            background: #ffcc00;
        }
        /* fix for Opera not liking empty <li> */
        .sf-reset .traces li:after {
            content: \"\\00A0\";
        }
        .sf-reset .trace {
            border: 1px solid #D3D3D3;
            padding: 10px;
            overflow: auto;
            margin: 10px 0 20px;
        }
        .sf-reset .block-exception {
            -moz-border-radius: 16px;
            -webkit-border-radius: 16px;
            border-radius: 16px;
            margin-bottom: 20px;
            background-color: #f6f6f6;
            border: 1px solid #dfdfdf;
            padding: 30px 28px;
            word-wrap: break-word;
            overflow: hidden;
        }
        .sf-reset .block-exception div {
            color: #313131;
            font-size: 10px;
        }
        .sf-reset .block-exception-detected .illustration-exception,
        .sf-reset .block-exception-detected .text-exception {
            float: left;
        }
        .sf-reset .block-exception-detected .illustration-exception {
            width: 152px;
        }
        .sf-reset .block-exception-detected .text-exception {
            width: 670px;
            padding: 30px 44px 24px 46px;
            position: relative;
        }
        .sf-reset .text-exception .open-quote,
        .sf-reset .text-exception .close-quote {
            font-family: Arial, Helvetica, sans-serif;
            position: absolute;
            color: #C9C9C9;
            font-size: 8em;
        }
        .sf-reset .open-quote {
            top: 0;
            left: 0;
        }
        .sf-reset .close-quote {
            bottom: -0.5em;
            right: 50px;
        }
        .sf-reset .block-exception p {
            font-family: Arial, Helvetica, sans-serif;
        }
        .sf-reset .block-exception p a,
        .sf-reset .block-exception p a:hover {
            color: #565656;
        }
        .sf-reset .logs h2 {
            float: left;
            width: 654px;
        }
        .sf-reset .error-count, .sf-reset .support {
            float: right;
            width: 170px;
            text-align: right;
        }
        .sf-reset .error-count span {
             display: inline-block;
             background-color: #aacd4e;
             -moz-border-radius: 6px;
             -webkit-border-radius: 6px;
             border-radius: 6px;
             padding: 4px;
             color: white;
             margin-right: 2px;
             font-size: 11px;
             font-weight: bold;
        }

        .sf-reset .support a {
            display: inline-block;
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            border-radius: 6px;
            padding: 4px;
            color: #000000;
            margin-right: 2px;
            font-size: 11px;
            font-weight: bold;
        }

        .sf-reset .toggle {
            vertical-align: middle;
        }
        .sf-reset .linked ul,
        .sf-reset .linked li {
            display: inline;
        }
        .sf-reset #output-content {
            color: #000;
            font-size: 12px;
        }
        .sf-reset #traces-text pre {
            white-space: pre;
            font-size: 12px;
            font-family: monospace;
        }
    </style>
";
        
        $__internal_087c27f5a3e09faa5b5d945950dad57c5103cb1090ab02df5b8a2f026601dc0e->leave($__internal_087c27f5a3e09faa5b5d945950dad57c5103cb1090ab02df5b8a2f026601dc0e_prof);

        
        $__internal_b5e3453fce7eccd490d5e78fa91b4d9dffba59226edb98c18b8dcd6c7ef18e1a->leave($__internal_b5e3453fce7eccd490d5e78fa91b4d9dffba59226edb98c18b8dcd6c7ef18e1a_prof);

    }

    // line 136
    public function block_title($context, array $blocks = array())
    {
        $__internal_41b70142ce0a564894b55fb910e8946c296a32ea9f4f18cc0223fab171e86bd4 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_41b70142ce0a564894b55fb910e8946c296a32ea9f4f18cc0223fab171e86bd4->enter($__internal_41b70142ce0a564894b55fb910e8946c296a32ea9f4f18cc0223fab171e86bd4_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        $__internal_5eaffdeabb0df565ab6a4476bcbff7e39309c90e1d2f4ae6b6e4ab1b2d4643da = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_5eaffdeabb0df565ab6a4476bcbff7e39309c90e1d2f4ae6b6e4ab1b2d4643da->enter($__internal_5eaffdeabb0df565ab6a4476bcbff7e39309c90e1d2f4ae6b6e4ab1b2d4643da_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        // line 137
        echo "    ";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["exception"] ?? $this->getContext($context, "exception")), "message", array()), "html", null, true);
        echo " (";
        echo twig_escape_filter($this->env, ($context["status_code"] ?? $this->getContext($context, "status_code")), "html", null, true);
        echo " ";
        echo twig_escape_filter($this->env, ($context["status_text"] ?? $this->getContext($context, "status_text")), "html", null, true);
        echo ")
";
        
        $__internal_5eaffdeabb0df565ab6a4476bcbff7e39309c90e1d2f4ae6b6e4ab1b2d4643da->leave($__internal_5eaffdeabb0df565ab6a4476bcbff7e39309c90e1d2f4ae6b6e4ab1b2d4643da_prof);

        
        $__internal_41b70142ce0a564894b55fb910e8946c296a32ea9f4f18cc0223fab171e86bd4->leave($__internal_41b70142ce0a564894b55fb910e8946c296a32ea9f4f18cc0223fab171e86bd4_prof);

    }

    // line 140
    public function block_body($context, array $blocks = array())
    {
        $__internal_fe8ab03a3d9188b3feb256ab1c4d6f5db45b1c6c795e42186fa901ab5f0ff24a = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_fe8ab03a3d9188b3feb256ab1c4d6f5db45b1c6c795e42186fa901ab5f0ff24a->enter($__internal_fe8ab03a3d9188b3feb256ab1c4d6f5db45b1c6c795e42186fa901ab5f0ff24a_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        $__internal_5ef365298cdc3ed824a98c27f68d925f8209f70305e9de42946a1a0ff5e8a578 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_5ef365298cdc3ed824a98c27f68d925f8209f70305e9de42946a1a0ff5e8a578->enter($__internal_5ef365298cdc3ed824a98c27f68d925f8209f70305e9de42946a1a0ff5e8a578_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        // line 141
        echo "    ";
        $this->loadTemplate("@Twig/Exception/exception.html.twig", "@Twig/Exception/exception_full.html.twig", 141)->display($context);
        
        $__internal_5ef365298cdc3ed824a98c27f68d925f8209f70305e9de42946a1a0ff5e8a578->leave($__internal_5ef365298cdc3ed824a98c27f68d925f8209f70305e9de42946a1a0ff5e8a578_prof);

        
        $__internal_fe8ab03a3d9188b3feb256ab1c4d6f5db45b1c6c795e42186fa901ab5f0ff24a->leave($__internal_fe8ab03a3d9188b3feb256ab1c4d6f5db45b1c6c795e42186fa901ab5f0ff24a_prof);

    }

    public function getTemplateName()
    {
        return "@Twig/Exception/exception_full.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  226 => 141,  217 => 140,  200 => 137,  191 => 136,  51 => 4,  42 => 3,  11 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("{% extends '@Twig/layout.html.twig' %}

{% block head %}
    <style>
        .sf-reset .traces {
            padding-bottom: 14px;
        }
        .sf-reset .traces li {
            font-size: 12px;
            color: #868686;
            padding: 5px 4px;
            list-style-type: decimal;
            margin-left: 20px;
        }
        .sf-reset #logs .traces li.error {
            font-style: normal;
            color: #AA3333;
            background: #f9ecec;
        }
        .sf-reset #logs .traces li.warning {
            font-style: normal;
            background: #ffcc00;
        }
        /* fix for Opera not liking empty <li> */
        .sf-reset .traces li:after {
            content: \"\\00A0\";
        }
        .sf-reset .trace {
            border: 1px solid #D3D3D3;
            padding: 10px;
            overflow: auto;
            margin: 10px 0 20px;
        }
        .sf-reset .block-exception {
            -moz-border-radius: 16px;
            -webkit-border-radius: 16px;
            border-radius: 16px;
            margin-bottom: 20px;
            background-color: #f6f6f6;
            border: 1px solid #dfdfdf;
            padding: 30px 28px;
            word-wrap: break-word;
            overflow: hidden;
        }
        .sf-reset .block-exception div {
            color: #313131;
            font-size: 10px;
        }
        .sf-reset .block-exception-detected .illustration-exception,
        .sf-reset .block-exception-detected .text-exception {
            float: left;
        }
        .sf-reset .block-exception-detected .illustration-exception {
            width: 152px;
        }
        .sf-reset .block-exception-detected .text-exception {
            width: 670px;
            padding: 30px 44px 24px 46px;
            position: relative;
        }
        .sf-reset .text-exception .open-quote,
        .sf-reset .text-exception .close-quote {
            font-family: Arial, Helvetica, sans-serif;
            position: absolute;
            color: #C9C9C9;
            font-size: 8em;
        }
        .sf-reset .open-quote {
            top: 0;
            left: 0;
        }
        .sf-reset .close-quote {
            bottom: -0.5em;
            right: 50px;
        }
        .sf-reset .block-exception p {
            font-family: Arial, Helvetica, sans-serif;
        }
        .sf-reset .block-exception p a,
        .sf-reset .block-exception p a:hover {
            color: #565656;
        }
        .sf-reset .logs h2 {
            float: left;
            width: 654px;
        }
        .sf-reset .error-count, .sf-reset .support {
            float: right;
            width: 170px;
            text-align: right;
        }
        .sf-reset .error-count span {
             display: inline-block;
             background-color: #aacd4e;
             -moz-border-radius: 6px;
             -webkit-border-radius: 6px;
             border-radius: 6px;
             padding: 4px;
             color: white;
             margin-right: 2px;
             font-size: 11px;
             font-weight: bold;
        }

        .sf-reset .support a {
            display: inline-block;
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            border-radius: 6px;
            padding: 4px;
            color: #000000;
            margin-right: 2px;
            font-size: 11px;
            font-weight: bold;
        }

        .sf-reset .toggle {
            vertical-align: middle;
        }
        .sf-reset .linked ul,
        .sf-reset .linked li {
            display: inline;
        }
        .sf-reset #output-content {
            color: #000;
            font-size: 12px;
        }
        .sf-reset #traces-text pre {
            white-space: pre;
            font-size: 12px;
            font-family: monospace;
        }
    </style>
{% endblock %}

{% block title %}
    {{ exception.message }} ({{ status_code }} {{ status_text }})
{% endblock %}

{% block body %}
    {% include '@Twig/Exception/exception.html.twig' %}
{% endblock %}
", "@Twig/Exception/exception_full.html.twig", "/var/www/html/HUmanBeing/vendor/symfony/symfony/src/Symfony/Bundle/TwigBundle/Resources/views/Exception/exception_full.html.twig");
    }
}
