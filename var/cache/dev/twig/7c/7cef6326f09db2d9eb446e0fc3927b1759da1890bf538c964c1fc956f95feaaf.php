<?php

/* @WebProfiler/Collector/request.html.twig */
class __TwigTemplate_510ca8ae18d472812e386d3f1a63309e1176b2add2fc4bce1fe58a85024edd66 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/request.html.twig", 1);
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
        $__internal_5357a258fb4bb25ff7f8620b75edb1ec1646d8e3976e915927d3ded65bad42a8 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_5357a258fb4bb25ff7f8620b75edb1ec1646d8e3976e915927d3ded65bad42a8->enter($__internal_5357a258fb4bb25ff7f8620b75edb1ec1646d8e3976e915927d3ded65bad42a8_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/request.html.twig"));

        $__internal_b79f1e91268d4ebea047499a22a4d73f0506780e7782c2f6e4dc91dfb46e9ef8 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_b79f1e91268d4ebea047499a22a4d73f0506780e7782c2f6e4dc91dfb46e9ef8->enter($__internal_b79f1e91268d4ebea047499a22a4d73f0506780e7782c2f6e4dc91dfb46e9ef8_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/request.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_5357a258fb4bb25ff7f8620b75edb1ec1646d8e3976e915927d3ded65bad42a8->leave($__internal_5357a258fb4bb25ff7f8620b75edb1ec1646d8e3976e915927d3ded65bad42a8_prof);

        
        $__internal_b79f1e91268d4ebea047499a22a4d73f0506780e7782c2f6e4dc91dfb46e9ef8->leave($__internal_b79f1e91268d4ebea047499a22a4d73f0506780e7782c2f6e4dc91dfb46e9ef8_prof);

    }

    // line 3
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_d8a0bac119847a6def87d9a83229f986a573c3ac1863106e3c9a34fc4698853d = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_d8a0bac119847a6def87d9a83229f986a573c3ac1863106e3c9a34fc4698853d->enter($__internal_d8a0bac119847a6def87d9a83229f986a573c3ac1863106e3c9a34fc4698853d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        $__internal_acd52278c63c5e530107f97166c343ddccdae6b9e004f47547c8d72b56c80760 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_acd52278c63c5e530107f97166c343ddccdae6b9e004f47547c8d72b56c80760->enter($__internal_acd52278c63c5e530107f97166c343ddccdae6b9e004f47547c8d72b56c80760_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        // line 4
        echo "    ";
        ob_start();
        // line 5
        echo "        ";
        $context["helper"] = $this;
        // line 6
        echo "        ";
        echo $context["helper"]->getset_handler($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "controller", array()));
        echo "
    ";
        $context["request_handler"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 8
        echo "
    ";
        // line 9
        if ($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array())) {
            // line 10
            echo "        ";
            ob_start();
            // line 11
            echo "            ";
            $context["helper"] = $this;
            // line 12
            echo "            ";
            echo $context["helper"]->getset_handler($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "controller", array()), $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "route", array()), ((("GET" != $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "method", array()))) ? ($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "method", array())) : ("")));
            echo "
        ";
            $context["redirect_handler"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
            // line 14
            echo "    ";
        }
        // line 15
        echo "
    ";
        // line 16
        if ((($this->getAttribute(($context["collector"] ?? null), "forward", array(), "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["collector"] ?? null), "forward", array()), false)) : (false))) {
            // line 17
            echo "        ";
            ob_start();
            // line 18
            echo "            ";
            $context["helper"] = $this;
            // line 19
            echo "            ";
            echo $context["helper"]->getset_handler($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "forward", array()), "controller", array()));
            echo "
        ";
            $context["forward_handler"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
            // line 21
            echo "    ";
        }
        // line 22
        echo "
    ";
        // line 23
        $context["request_status_code_color"] = ((($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "statuscode", array()) >= 400)) ? ("red") : (((($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "statuscode", array()) >= 300)) ? ("yellow") : ("green"))));
        // line 24
        echo "
    ";
        // line 25
        ob_start();
        // line 26
        echo "        <span class=\"sf-toolbar-status sf-toolbar-status-";
        echo twig_escape_filter($this->env, ($context["request_status_code_color"] ?? $this->getContext($context, "request_status_code_color")), "html", null, true);
        echo "\">";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "statuscode", array()), "html", null, true);
        echo "</span>
        ";
        // line 27
        if ($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "route", array())) {
            // line 28
            echo "            ";
            if ($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array())) {
                echo twig_include($this->env, $context, "@WebProfiler/Icon/redirect.svg");
            }
            // line 29
            echo "            ";
            if ((($this->getAttribute(($context["collector"] ?? null), "forward", array(), "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["collector"] ?? null), "forward", array()), false)) : (false))) {
                echo twig_include($this->env, $context, "@WebProfiler/Icon/forward.svg");
            }
            // line 30
            echo "            <span class=\"sf-toolbar-label\">";
            echo twig_escape_filter($this->env, ((("GET" != $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "method", array()))) ? ($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "method", array())) : ("")), "html", null, true);
            echo " @</span>
            <span class=\"sf-toolbar-value sf-toolbar-info-piece-additional\">";
            // line 31
            echo twig_escape_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "route", array()), "html", null, true);
            echo "</span>
        ";
        }
        // line 33
        echo "    ";
        $context["icon"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 34
        echo "
    ";
        // line 35
        ob_start();
        // line 36
        echo "        <div class=\"sf-toolbar-info-group\">
            <div class=\"sf-toolbar-info-piece\">
                <b>HTTP status</b>
                <span>";
        // line 39
        echo twig_escape_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "statuscode", array()), "html", null, true);
        echo " ";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "statustext", array()), "html", null, true);
        echo "</span>
            </div>

            ";
        // line 42
        if (("GET" != $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "method", array()))) {
            // line 43
            echo "<div class=\"sf-toolbar-info-piece\">
                    <b>Method</b>
                    <span>";
            // line 45
            echo twig_escape_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "method", array()), "html", null, true);
            echo "</span>
                </div>";
        }
        // line 48
        echo "
            <div class=\"sf-toolbar-info-piece\">
                <b>Controller</b>
                <span>";
        // line 51
        echo twig_escape_filter($this->env, ($context["request_handler"] ?? $this->getContext($context, "request_handler")), "html", null, true);
        echo "</span>
            </div>

            ";
        // line 54
        if ($this->getAttribute($this->getAttribute(($context["collector"] ?? null), "controller", array(), "any", false, true), "class", array(), "any", true, true)) {
            // line 55
            echo "<div class=\"sf-toolbar-info-piece\">
                    <b>Controller class</b>
                    <span>";
            // line 57
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "controller", array()), "class", array()), "html", null, true);
            echo "</span>
                </div>";
        }
        // line 60
        echo "
            <div class=\"sf-toolbar-info-piece\">
                <b>Route name</b>
                <span>";
        // line 63
        echo twig_escape_filter($this->env, (($this->getAttribute(($context["collector"] ?? null), "route", array(), "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["collector"] ?? null), "route", array()), "NONE")) : ("NONE")), "html", null, true);
        echo "</span>
            </div>

            <div class=\"sf-toolbar-info-piece\">
                <b>Has session</b>
                <span>";
        // line 68
        if (twig_length_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "sessionmetadata", array()))) {
            echo "yes";
        } else {
            echo "no";
        }
        echo "</span>
            </div>
        </div>

        ";
        // line 72
        if (array_key_exists("redirect_handler", $context)) {
            // line 73
            echo "<div class=\"sf-toolbar-info-group\">
                <div class=\"sf-toolbar-info-piece\">
                    <b>
                        <span class=\"sf-toolbar-redirection-status sf-toolbar-status-yellow\">";
            // line 76
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "status_code", array()), "html", null, true);
            echo "</span>
                        Redirect from
                    </b>
                    <span>
                        ";
            // line 80
            echo twig_escape_filter($this->env, ($context["redirect_handler"] ?? $this->getContext($context, "redirect_handler")), "html", null, true);
            echo "
                        (<a href=\"";
            // line 81
            echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler", array("token" => $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "token", array()))), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "redirect", array()), "token", array()), "html", null, true);
            echo "</a>)
                    </span>
                </div>
            </div>
        ";
        }
        // line 86
        echo "
        ";
        // line 87
        if (array_key_exists("forward_handler", $context)) {
            // line 88
            echo "            <div class=\"sf-toolbar-info-group\">
                <div class=\"sf-toolbar-info-piece\">
                    <b>Forwarded to</b>
                    <span>
                        ";
            // line 92
            echo twig_escape_filter($this->env, ($context["forward_handler"] ?? $this->getContext($context, "forward_handler")), "html", null, true);
            echo "
                        (<a href=\"";
            // line 93
            echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler", array("token" => $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "forward", array()), "token", array()))), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "forward", array()), "token", array()), "html", null, true);
            echo "</a>)
                    </span>
                </div>
            </div>
        ";
        }
        // line 98
        echo "    ";
        $context["text"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 99
        echo "
    ";
        // line 100
        echo twig_include($this->env, $context, "@WebProfiler/Profiler/toolbar_item.html.twig", array("link" => ($context["profiler_url"] ?? $this->getContext($context, "profiler_url"))));
        echo "
";
        
        $__internal_acd52278c63c5e530107f97166c343ddccdae6b9e004f47547c8d72b56c80760->leave($__internal_acd52278c63c5e530107f97166c343ddccdae6b9e004f47547c8d72b56c80760_prof);

        
        $__internal_d8a0bac119847a6def87d9a83229f986a573c3ac1863106e3c9a34fc4698853d->leave($__internal_d8a0bac119847a6def87d9a83229f986a573c3ac1863106e3c9a34fc4698853d_prof);

    }

    // line 103
    public function block_menu($context, array $blocks = array())
    {
        $__internal_c794938b96fd57e63466b76417e4b944b98ff31113e38a5afb07637a45e3bca0 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_c794938b96fd57e63466b76417e4b944b98ff31113e38a5afb07637a45e3bca0->enter($__internal_c794938b96fd57e63466b76417e4b944b98ff31113e38a5afb07637a45e3bca0_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        $__internal_594ce54264d4fa2f05656b5acf866c7ad9c53f1c6e12972b031402187a5ddd8d = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_594ce54264d4fa2f05656b5acf866c7ad9c53f1c6e12972b031402187a5ddd8d->enter($__internal_594ce54264d4fa2f05656b5acf866c7ad9c53f1c6e12972b031402187a5ddd8d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 104
        echo "    <span class=\"label\">
        <span class=\"icon\">";
        // line 105
        echo twig_include($this->env, $context, "@WebProfiler/Icon/request.svg");
        echo "</span>
        <strong>Request / Response</strong>
    </span>
";
        
        $__internal_594ce54264d4fa2f05656b5acf866c7ad9c53f1c6e12972b031402187a5ddd8d->leave($__internal_594ce54264d4fa2f05656b5acf866c7ad9c53f1c6e12972b031402187a5ddd8d_prof);

        
        $__internal_c794938b96fd57e63466b76417e4b944b98ff31113e38a5afb07637a45e3bca0->leave($__internal_c794938b96fd57e63466b76417e4b944b98ff31113e38a5afb07637a45e3bca0_prof);

    }

    // line 110
    public function block_panel($context, array $blocks = array())
    {
        $__internal_d6a8c7df455b122eab5d8a5033015b3df10fd6d131d200d8eaebb44316626cad = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_d6a8c7df455b122eab5d8a5033015b3df10fd6d131d200d8eaebb44316626cad->enter($__internal_d6a8c7df455b122eab5d8a5033015b3df10fd6d131d200d8eaebb44316626cad_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        $__internal_42c96628cbe018922f341f4faad423766a2ed34ad202fa02a33095e4f83e551c = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_42c96628cbe018922f341f4faad423766a2ed34ad202fa02a33095e4f83e551c->enter($__internal_42c96628cbe018922f341f4faad423766a2ed34ad202fa02a33095e4f83e551c_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 111
        echo "    <div class=\"sf-tabs\">
        <div class=\"tab\">
            <h3 class=\"tab-title\">Request</h3>

            <div class=\"tab-content\">
                <h3>GET Parameters</h3>

                ";
        // line 118
        if (twig_test_empty($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestquery", array()), "all", array()))) {
            // line 119
            echo "                    <div class=\"empty\">
                        <p>No GET parameters</p>
                    </div>
                ";
        } else {
            // line 123
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestquery", array()), "maxDepth" => 1), false);
            echo "
                ";
        }
        // line 125
        echo "
                <h3>POST Parameters</h3>

                ";
        // line 128
        if (twig_test_empty($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestrequest", array()), "all", array()))) {
            // line 129
            echo "                    <div class=\"empty\">
                        <p>No POST parameters</p>
                    </div>
                ";
        } else {
            // line 133
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestrequest", array()), "maxDepth" => 1), false);
            echo "
                ";
        }
        // line 135
        echo "
                <h3>Request Attributes</h3>

                ";
        // line 138
        if (twig_test_empty($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestattributes", array()), "all", array()))) {
            // line 139
            echo "                    <div class=\"empty\">
                        <p>No attributes</p>
                    </div>
                ";
        } else {
            // line 143
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestattributes", array())), false);
            echo "
                ";
        }
        // line 145
        echo "
                <h3>Cookies</h3>

                ";
        // line 148
        if (twig_test_empty($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestcookies", array()), "all", array()))) {
            // line 149
            echo "                    <div class=\"empty\">
                        <p>No cookies</p>
                    </div>
                ";
        } else {
            // line 153
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestcookies", array())), false);
            echo "
                ";
        }
        // line 155
        echo "
                <h3>Request Headers</h3>
                ";
        // line 157
        echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestheaders", array()), "labels" => array(0 => "Header", 1 => "Value"), "maxDepth" => 1), false);
        echo "

                <h3>Request Content</h3>

                ";
        // line 161
        if (($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "content", array()) == false)) {
            // line 162
            echo "                    <div class=\"empty\">
                        <p>Request content not available (it was retrieved as a resource).</p>
                    </div>
                ";
        } elseif ($this->getAttribute(        // line 165
($context["collector"] ?? $this->getContext($context, "collector")), "content", array())) {
            // line 166
            echo "                    <div class=\"card\">
                        <pre class=\"break-long-words\">";
            // line 167
            echo twig_escape_filter($this->env, $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "content", array()), "html", null, true);
            echo "</pre>
                    </div>
                ";
        } else {
            // line 170
            echo "                    <div class=\"empty\">
                        <p>No content</p>
                    </div>
                ";
        }
        // line 174
        echo "
                <h3>Server Parameters</h3>
                ";
        // line 176
        echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "requestserver", array())), false);
        echo "
            </div>
        </div>

        <div class=\"tab\">
            <h3 class=\"tab-title\">Response</h3>

            <div class=\"tab-content\">
                <h3>Response Headers</h3>

                ";
        // line 186
        echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "responseheaders", array()), "labels" => array(0 => "Header", 1 => "Value"), "maxDepth" => 1), false);
        echo "
            </div>
        </div>

        <div class=\"tab ";
        // line 190
        echo ((twig_test_empty($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "sessionmetadata", array()))) ? ("disabled") : (""));
        echo "\">
            <h3 class=\"tab-title\">Session</h3>

            <div class=\"tab-content\">
                <h3>Session Metadata</h3>

                ";
        // line 196
        if (twig_test_empty($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "sessionmetadata", array()))) {
            // line 197
            echo "                    <div class=\"empty\">
                        <p>No session metadata</p>
                    </div>
                ";
        } else {
            // line 201
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/table.html.twig", array("data" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "sessionmetadata", array())), false);
            echo "
                ";
        }
        // line 203
        echo "
                <h3>Session Attributes</h3>

                ";
        // line 206
        if (twig_test_empty($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "sessionattributes", array()))) {
            // line 207
            echo "                    <div class=\"empty\">
                        <p>No session attributes</p>
                    </div>
                ";
        } else {
            // line 211
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/table.html.twig", array("data" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "sessionattributes", array()), "labels" => array(0 => "Attribute", 1 => "Value")), false);
            echo "
                ";
        }
        // line 213
        echo "            </div>
        </div>

        <div class=\"tab ";
        // line 216
        echo ((twig_test_empty($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "flashes", array()))) ? ("disabled") : (""));
        echo "\">
            <h3 class=\"tab-title\">Flashes</h3>

            <div class=\"tab-content\">
                <h3>Flashes</h3>

                ";
        // line 222
        if (twig_test_empty($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "flashes", array()))) {
            // line 223
            echo "                    <div class=\"empty\">
                        <p>No flash messages were created.</p>
                    </div>
                ";
        } else {
            // line 227
            echo "                    ";
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/table.html.twig", array("data" => $this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "flashes", array())), false);
            echo "
                ";
        }
        // line 229
        echo "            </div>
        </div>

        ";
        // line 232
        if ($this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "parent", array())) {
            // line 233
            echo "        <div class=\"tab\">
            <h3 class=\"tab-title\">Parent Request</h3>

            <div class=\"tab-content\">
                <h3>
                    <a href=\"";
            // line 238
            echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler", array("token" => $this->getAttribute($this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "parent", array()), "token", array()))), "html", null, true);
            echo "\">Return to parent request</a>
                    <small>(token = ";
            // line 239
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "parent", array()), "token", array()), "html", null, true);
            echo ")</small>
                </h3>

                ";
            // line 242
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute($this->getAttribute($this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "parent", array()), "getcollector", array(0 => "request"), "method"), "requestattributes", array())), false);
            echo "
            </div>
        </div>
        ";
        }
        // line 246
        echo "
        ";
        // line 247
        if (twig_length_filter($this->env, $this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "children", array()))) {
            // line 248
            echo "        <div class=\"tab\">
            <h3 class=\"tab-title\">Sub Requests <span class=\"badge\">";
            // line 249
            echo twig_escape_filter($this->env, twig_length_filter($this->env, $this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "children", array())), "html", null, true);
            echo "</span></h3>

            <div class=\"tab-content\">
                ";
            // line 252
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["profile"] ?? $this->getContext($context, "profile")), "children", array()));
            foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
                // line 253
                echo "                    <h3>
                        <a href=\"";
                // line 254
                echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler", array("token" => $this->getAttribute($context["child"], "token", array()))), "html", null, true);
                echo "\">";
                // line 255
                echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute($context["child"], "getcollector", array(0 => "request"), "method"), "identifier", array()), "html", null, true);
                // line 256
                echo "</a>
                        <small>(token = ";
                // line 257
                echo twig_escape_filter($this->env, $this->getAttribute($context["child"], "token", array()), "html", null, true);
                echo ")</small>
                    </h3>

                    ";
                // line 260
                echo twig_include($this->env, $context, "@WebProfiler/Profiler/bag.html.twig", array("bag" => $this->getAttribute($this->getAttribute($context["child"], "getcollector", array(0 => "request"), "method"), "requestattributes", array())), false);
                echo "
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 262
            echo "            </div>
        </div>
        ";
        }
        // line 265
        echo "    </div>
";
        
        $__internal_42c96628cbe018922f341f4faad423766a2ed34ad202fa02a33095e4f83e551c->leave($__internal_42c96628cbe018922f341f4faad423766a2ed34ad202fa02a33095e4f83e551c_prof);

        
        $__internal_d6a8c7df455b122eab5d8a5033015b3df10fd6d131d200d8eaebb44316626cad->leave($__internal_d6a8c7df455b122eab5d8a5033015b3df10fd6d131d200d8eaebb44316626cad_prof);

    }

    // line 268
    public function getset_handler($__controller__ = null, $__route__ = null, $__method__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals(array(
            "controller" => $__controller__,
            "route" => $__route__,
            "method" => $__method__,
            "varargs" => $__varargs__,
        ));

        $blocks = array();

        ob_start();
        try {
            $__internal_d1bab1f3d4209f038c3221f584f0510408770527ce357af056fcf6cbbf2069de = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
            $__internal_d1bab1f3d4209f038c3221f584f0510408770527ce357af056fcf6cbbf2069de->enter($__internal_d1bab1f3d4209f038c3221f584f0510408770527ce357af056fcf6cbbf2069de_prof = new Twig_Profiler_Profile($this->getTemplateName(), "macro", "set_handler"));

            $__internal_7d01bdfe76f28aad4291efbf66880b77ec08e53f8dace8cd9fc82fe4aee96c6d = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
            $__internal_7d01bdfe76f28aad4291efbf66880b77ec08e53f8dace8cd9fc82fe4aee96c6d->enter($__internal_7d01bdfe76f28aad4291efbf66880b77ec08e53f8dace8cd9fc82fe4aee96c6d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "macro", "set_handler"));

            // line 269
            echo "    ";
            if ($this->getAttribute(($context["controller"] ?? null), "class", array(), "any", true, true)) {
                // line 270
                if (((array_key_exists("method", $context)) ? (_twig_default_filter(($context["method"] ?? $this->getContext($context, "method")), false)) : (false))) {
                    echo "<span class=\"sf-toolbar-status sf-toolbar-redirection-method\">";
                    echo twig_escape_filter($this->env, ($context["method"] ?? $this->getContext($context, "method")), "html", null, true);
                    echo "</span>";
                }
                // line 271
                $context["link"] = $this->env->getExtension('Symfony\Bridge\Twig\Extension\CodeExtension')->getFileLink($this->getAttribute(($context["controller"] ?? $this->getContext($context, "controller")), "file", array()), $this->getAttribute(($context["controller"] ?? $this->getContext($context, "controller")), "line", array()));
                // line 272
                if (($context["link"] ?? $this->getContext($context, "link"))) {
                    echo "<a href=\"";
                    echo twig_escape_filter($this->env, ($context["link"] ?? $this->getContext($context, "link")), "html", null, true);
                    echo "\" title=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["controller"] ?? $this->getContext($context, "controller")), "file", array()), "html", null, true);
                    echo "\">";
                } else {
                    echo "<span>";
                }
                // line 274
                if (((array_key_exists("route", $context)) ? (_twig_default_filter(($context["route"] ?? $this->getContext($context, "route")), false)) : (false))) {
                    // line 275
                    echo "@";
                    echo twig_escape_filter($this->env, ($context["route"] ?? $this->getContext($context, "route")), "html", null, true);
                } else {
                    // line 277
                    echo twig_escape_filter($this->env, strip_tags($this->env->getExtension('Symfony\Bridge\Twig\Extension\CodeExtension')->abbrClass($this->getAttribute(($context["controller"] ?? $this->getContext($context, "controller")), "class", array()))), "html", null, true);
                    // line 278
                    echo twig_escape_filter($this->env, (($this->getAttribute(($context["controller"] ?? $this->getContext($context, "controller")), "method", array())) ? ((" :: " . $this->getAttribute(($context["controller"] ?? $this->getContext($context, "controller")), "method", array()))) : ("")), "html", null, true);
                }
                // line 281
                if (($context["link"] ?? $this->getContext($context, "link"))) {
                    echo "</a>";
                } else {
                    echo "</span>";
                }
            } else {
                // line 283
                echo "<span>";
                echo twig_escape_filter($this->env, ((array_key_exists("route", $context)) ? (_twig_default_filter(($context["route"] ?? $this->getContext($context, "route")), ($context["controller"] ?? $this->getContext($context, "controller")))) : (($context["controller"] ?? $this->getContext($context, "controller")))), "html", null, true);
                echo "</span>";
            }
            
            $__internal_7d01bdfe76f28aad4291efbf66880b77ec08e53f8dace8cd9fc82fe4aee96c6d->leave($__internal_7d01bdfe76f28aad4291efbf66880b77ec08e53f8dace8cd9fc82fe4aee96c6d_prof);

            
            $__internal_d1bab1f3d4209f038c3221f584f0510408770527ce357af056fcf6cbbf2069de->leave($__internal_d1bab1f3d4209f038c3221f584f0510408770527ce357af056fcf6cbbf2069de_prof);

        } catch (Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/request.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  684 => 283,  677 => 281,  674 => 278,  672 => 277,  668 => 275,  666 => 274,  656 => 272,  654 => 271,  648 => 270,  645 => 269,  625 => 268,  614 => 265,  609 => 262,  601 => 260,  595 => 257,  592 => 256,  590 => 255,  587 => 254,  584 => 253,  580 => 252,  574 => 249,  571 => 248,  569 => 247,  566 => 246,  559 => 242,  553 => 239,  549 => 238,  542 => 233,  540 => 232,  535 => 229,  529 => 227,  523 => 223,  521 => 222,  512 => 216,  507 => 213,  501 => 211,  495 => 207,  493 => 206,  488 => 203,  482 => 201,  476 => 197,  474 => 196,  465 => 190,  458 => 186,  445 => 176,  441 => 174,  435 => 170,  429 => 167,  426 => 166,  424 => 165,  419 => 162,  417 => 161,  410 => 157,  406 => 155,  400 => 153,  394 => 149,  392 => 148,  387 => 145,  381 => 143,  375 => 139,  373 => 138,  368 => 135,  362 => 133,  356 => 129,  354 => 128,  349 => 125,  343 => 123,  337 => 119,  335 => 118,  326 => 111,  317 => 110,  303 => 105,  300 => 104,  291 => 103,  279 => 100,  276 => 99,  273 => 98,  263 => 93,  259 => 92,  253 => 88,  251 => 87,  248 => 86,  238 => 81,  234 => 80,  227 => 76,  222 => 73,  220 => 72,  209 => 68,  201 => 63,  196 => 60,  191 => 57,  187 => 55,  185 => 54,  179 => 51,  174 => 48,  169 => 45,  165 => 43,  163 => 42,  155 => 39,  150 => 36,  148 => 35,  145 => 34,  142 => 33,  137 => 31,  132 => 30,  127 => 29,  122 => 28,  120 => 27,  113 => 26,  111 => 25,  108 => 24,  106 => 23,  103 => 22,  100 => 21,  94 => 19,  91 => 18,  88 => 17,  86 => 16,  83 => 15,  80 => 14,  74 => 12,  71 => 11,  68 => 10,  66 => 9,  63 => 8,  57 => 6,  54 => 5,  51 => 4,  42 => 3,  11 => 1,);
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
    {% set request_handler %}
        {% import _self as helper %}
        {{ helper.set_handler(collector.controller) }}
    {% endset %}

    {% if collector.redirect %}
        {% set redirect_handler %}
            {% import _self as helper %}
            {{ helper.set_handler(collector.redirect.controller, collector.redirect.route, 'GET' != collector.redirect.method ? collector.redirect.method) }}
        {% endset %}
    {% endif %}

    {% if collector.forward|default(false) %}
        {% set forward_handler %}
            {% import _self as helper %}
            {{ helper.set_handler(collector.forward.controller) }}
        {% endset %}
    {% endif %}

    {% set request_status_code_color = (collector.statuscode >= 400) ? 'red' : (collector.statuscode >= 300) ? 'yellow' : 'green' %}

    {% set icon %}
        <span class=\"sf-toolbar-status sf-toolbar-status-{{ request_status_code_color }}\">{{ collector.statuscode }}</span>
        {% if collector.route %}
            {% if collector.redirect %}{{ include('@WebProfiler/Icon/redirect.svg') }}{% endif %}
            {% if collector.forward|default(false) %}{{ include('@WebProfiler/Icon/forward.svg') }}{% endif %}
            <span class=\"sf-toolbar-label\">{{ 'GET' != collector.method ? collector.method }} @</span>
            <span class=\"sf-toolbar-value sf-toolbar-info-piece-additional\">{{ collector.route }}</span>
        {% endif %}
    {% endset %}

    {% set text %}
        <div class=\"sf-toolbar-info-group\">
            <div class=\"sf-toolbar-info-piece\">
                <b>HTTP status</b>
                <span>{{ collector.statuscode }} {{ collector.statustext }}</span>
            </div>

            {% if 'GET' != collector.method -%}
                <div class=\"sf-toolbar-info-piece\">
                    <b>Method</b>
                    <span>{{ collector.method }}</span>
                </div>
            {%- endif %}

            <div class=\"sf-toolbar-info-piece\">
                <b>Controller</b>
                <span>{{ request_handler }}</span>
            </div>

            {% if collector.controller.class is defined -%}
                <div class=\"sf-toolbar-info-piece\">
                    <b>Controller class</b>
                    <span>{{ collector.controller.class }}</span>
                </div>
            {%- endif %}

            <div class=\"sf-toolbar-info-piece\">
                <b>Route name</b>
                <span>{{ collector.route|default('NONE') }}</span>
            </div>

            <div class=\"sf-toolbar-info-piece\">
                <b>Has session</b>
                <span>{% if collector.sessionmetadata|length %}yes{% else %}no{% endif %}</span>
            </div>
        </div>

        {% if redirect_handler is defined -%}
            <div class=\"sf-toolbar-info-group\">
                <div class=\"sf-toolbar-info-piece\">
                    <b>
                        <span class=\"sf-toolbar-redirection-status sf-toolbar-status-yellow\">{{ collector.redirect.status_code }}</span>
                        Redirect from
                    </b>
                    <span>
                        {{ redirect_handler }}
                        (<a href=\"{{ path('_profiler', { token: collector.redirect.token }) }}\">{{ collector.redirect.token }}</a>)
                    </span>
                </div>
            </div>
        {% endif %}

        {% if forward_handler is defined %}
            <div class=\"sf-toolbar-info-group\">
                <div class=\"sf-toolbar-info-piece\">
                    <b>Forwarded to</b>
                    <span>
                        {{ forward_handler }}
                        (<a href=\"{{ path('_profiler', { token: collector.forward.token }) }}\">{{ collector.forward.token }}</a>)
                    </span>
                </div>
            </div>
        {% endif %}
    {% endset %}

    {{ include('@WebProfiler/Profiler/toolbar_item.html.twig', { link: profiler_url }) }}
{% endblock %}

{% block menu %}
    <span class=\"label\">
        <span class=\"icon\">{{ include('@WebProfiler/Icon/request.svg') }}</span>
        <strong>Request / Response</strong>
    </span>
{% endblock %}

{% block panel %}
    <div class=\"sf-tabs\">
        <div class=\"tab\">
            <h3 class=\"tab-title\">Request</h3>

            <div class=\"tab-content\">
                <h3>GET Parameters</h3>

                {% if collector.requestquery.all is empty %}
                    <div class=\"empty\">
                        <p>No GET parameters</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.requestquery, maxDepth: 1 }, with_context = false) }}
                {% endif %}

                <h3>POST Parameters</h3>

                {% if collector.requestrequest.all is empty %}
                    <div class=\"empty\">
                        <p>No POST parameters</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.requestrequest, maxDepth: 1 }, with_context = false) }}
                {% endif %}

                <h3>Request Attributes</h3>

                {% if collector.requestattributes.all is empty %}
                    <div class=\"empty\">
                        <p>No attributes</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.requestattributes }, with_context = false) }}
                {% endif %}

                <h3>Cookies</h3>

                {% if collector.requestcookies.all is empty %}
                    <div class=\"empty\">
                        <p>No cookies</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.requestcookies }, with_context = false) }}
                {% endif %}

                <h3>Request Headers</h3>
                {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.requestheaders, labels: ['Header', 'Value'], maxDepth: 1 }, with_context = false) }}

                <h3>Request Content</h3>

                {% if collector.content == false %}
                    <div class=\"empty\">
                        <p>Request content not available (it was retrieved as a resource).</p>
                    </div>
                {% elseif collector.content %}
                    <div class=\"card\">
                        <pre class=\"break-long-words\">{{ collector.content }}</pre>
                    </div>
                {% else %}
                    <div class=\"empty\">
                        <p>No content</p>
                    </div>
                {% endif %}

                <h3>Server Parameters</h3>
                {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.requestserver }, with_context = false) }}
            </div>
        </div>

        <div class=\"tab\">
            <h3 class=\"tab-title\">Response</h3>

            <div class=\"tab-content\">
                <h3>Response Headers</h3>

                {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: collector.responseheaders, labels: ['Header', 'Value'], maxDepth: 1 }, with_context = false) }}
            </div>
        </div>

        <div class=\"tab {{ collector.sessionmetadata is empty ? 'disabled' }}\">
            <h3 class=\"tab-title\">Session</h3>

            <div class=\"tab-content\">
                <h3>Session Metadata</h3>

                {% if collector.sessionmetadata is empty %}
                    <div class=\"empty\">
                        <p>No session metadata</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/table.html.twig', { data: collector.sessionmetadata }, with_context = false) }}
                {% endif %}

                <h3>Session Attributes</h3>

                {% if collector.sessionattributes is empty %}
                    <div class=\"empty\">
                        <p>No session attributes</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/table.html.twig', { data: collector.sessionattributes, labels: ['Attribute', 'Value'] }, with_context = false) }}
                {% endif %}
            </div>
        </div>

        <div class=\"tab {{ collector.flashes is empty ? 'disabled' }}\">
            <h3 class=\"tab-title\">Flashes</h3>

            <div class=\"tab-content\">
                <h3>Flashes</h3>

                {% if collector.flashes is empty %}
                    <div class=\"empty\">
                        <p>No flash messages were created.</p>
                    </div>
                {% else %}
                    {{ include('@WebProfiler/Profiler/table.html.twig', { data: collector.flashes }, with_context = false) }}
                {% endif %}
            </div>
        </div>

        {% if profile.parent %}
        <div class=\"tab\">
            <h3 class=\"tab-title\">Parent Request</h3>

            <div class=\"tab-content\">
                <h3>
                    <a href=\"{{ path('_profiler', { token: profile.parent.token }) }}\">Return to parent request</a>
                    <small>(token = {{ profile.parent.token }})</small>
                </h3>

                {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: profile.parent.getcollector('request').requestattributes }, with_context = false) }}
            </div>
        </div>
        {% endif %}

        {% if profile.children|length %}
        <div class=\"tab\">
            <h3 class=\"tab-title\">Sub Requests <span class=\"badge\">{{ profile.children|length }}</span></h3>

            <div class=\"tab-content\">
                {% for child in profile.children %}
                    <h3>
                        <a href=\"{{ path('_profiler', { token: child.token }) }}\">
                            {{- child.getcollector('request').identifier -}}
                        </a>
                        <small>(token = {{ child.token }})</small>
                    </h3>

                    {{ include('@WebProfiler/Profiler/bag.html.twig', { bag: child.getcollector('request').requestattributes }, with_context = false) }}
                {% endfor %}
            </div>
        </div>
        {% endif %}
    </div>
{% endblock %}

{% macro set_handler(controller, route, method) %}
    {% if controller.class is defined -%}
        {%- if method|default(false) %}<span class=\"sf-toolbar-status sf-toolbar-redirection-method\">{{ method }}</span>{% endif -%}
        {%- set link = controller.file|file_link(controller.line) %}
        {%- if link %}<a href=\"{{ link }}\" title=\"{{ controller.file }}\">{% else %}<span>{% endif %}

            {%- if route|default(false) -%}
                @{{ route }}
            {%- else -%}
                {{- controller.class|abbr_class|striptags -}}
                {{- controller.method ? ' :: ' ~ controller.method -}}
            {%- endif -%}

        {%- if link %}</a>{% else %}</span>{% endif %}
    {%- else -%}
        <span>{{ route|default(controller) }}</span>
    {%- endif %}
{% endmacro %}
", "@WebProfiler/Collector/request.html.twig", "/var/www/html/HUmanBeing/vendor/symfony/symfony/src/Symfony/Bundle/WebProfilerBundle/Resources/views/Collector/request.html.twig");
    }
}
