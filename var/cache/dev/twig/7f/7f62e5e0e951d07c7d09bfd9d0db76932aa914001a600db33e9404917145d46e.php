<?php

/* @WebProfiler/Collector/form.html.twig */
class __TwigTemplate_71a1ad0450a798cf579f234fe633de33c3f74a241ca3ef8f00c1cc1fab68c3c3 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/form.html.twig", 1);
        $this->blocks = array(
            'toolbar' => array($this, 'block_toolbar'),
            'menu' => array($this, 'block_menu'),
            'head' => array($this, 'block_head'),
            'panel' => array($this, 'block_panel'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@WebProfiler/Profiler/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_d3c8cadafb6428e5db63e2ccda9f6d01df4630d466c27cddf82db42dc0184f51 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_d3c8cadafb6428e5db63e2ccda9f6d01df4630d466c27cddf82db42dc0184f51->enter($__internal_d3c8cadafb6428e5db63e2ccda9f6d01df4630d466c27cddf82db42dc0184f51_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/form.html.twig"));

        $__internal_0973794401b51a42373d370a0bef9bc30ca0456ebd3176a14852186f9d75cfa7 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_0973794401b51a42373d370a0bef9bc30ca0456ebd3176a14852186f9d75cfa7->enter($__internal_0973794401b51a42373d370a0bef9bc30ca0456ebd3176a14852186f9d75cfa7_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/form.html.twig"));

        // line 3
        $context["__internal_57bb07264fdf7273f3d3dda7af3a5b29842b2e2922727087f4f6bfeb90cfe35a"] = $this;
        // line 1
        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_d3c8cadafb6428e5db63e2ccda9f6d01df4630d466c27cddf82db42dc0184f51->leave($__internal_d3c8cadafb6428e5db63e2ccda9f6d01df4630d466c27cddf82db42dc0184f51_prof);

        
        $__internal_0973794401b51a42373d370a0bef9bc30ca0456ebd3176a14852186f9d75cfa7->leave($__internal_0973794401b51a42373d370a0bef9bc30ca0456ebd3176a14852186f9d75cfa7_prof);

    }

    // line 5
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_bafe24fcc98a9e4bfc8a422ca0e1d02c234aaae10a5e4d256a19dab73d6d1a9d = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_bafe24fcc98a9e4bfc8a422ca0e1d02c234aaae10a5e4d256a19dab73d6d1a9d->enter($__internal_bafe24fcc98a9e4bfc8a422ca0e1d02c234aaae10a5e4d256a19dab73d6d1a9d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        $__internal_049238cd0b6857fc1b29e09160ae783f12c71af5a867d7866585af2f300a7565 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_049238cd0b6857fc1b29e09160ae783f12c71af5a867d7866585af2f300a7565->enter($__internal_049238cd0b6857fc1b29e09160ae783f12c71af5a867d7866585af2f300a7565_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        // line 6
        echo "    ";
        if ((($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array()) > 0) || twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array())))) {
            // line 7
            echo "        ";
            $context["status_color"] = (($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array())) ? ("red") : (""));
            // line 8
            echo "        ";
            ob_start();
            // line 9
            echo "            ";
            echo twig_include($this->env, $context, "@WebProfiler/Icon/form.svg");
            echo "
            <span class=\"sf-toolbar-value\">
                ";
            // line 11
            echo twig_escape_filter($this->env, (($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array())) ? ($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array())) : (twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array())))), "html", null, true);
            echo "
            </span>
        ";
            $context["icon"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
            // line 14
            echo "
        ";
            // line 15
            ob_start();
            // line 16
            echo "            <div class=\"sf-toolbar-info-piece\">
                <b>Number of forms</b>
                <span class=\"sf-toolbar-status\">";
            // line 18
            echo twig_escape_filter($this->env, twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array())), "html", null, true);
            echo "</span>
            </div>
            <div class=\"sf-toolbar-info-piece\">
                <b>Number of errors</b>
                <span class=\"sf-toolbar-status sf-toolbar-status-";
            // line 22
            echo ((($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array()) > 0)) ? ("red") : (""));
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array()), "html", null, true);
            echo "</span>
            </div>
        ";
            $context["text"] = ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
            // line 25
            echo "
        ";
            // line 26
            echo twig_include($this->env, $context, "@WebProfiler/Profiler/toolbar_item.html.twig", array("link" => ($context["profiler_url"] ?? $this->getContext($context, "profiler_url")), "status" => ($context["status_color"] ?? $this->getContext($context, "status_color"))));
            echo "
    ";
        }
        
        $__internal_049238cd0b6857fc1b29e09160ae783f12c71af5a867d7866585af2f300a7565->leave($__internal_049238cd0b6857fc1b29e09160ae783f12c71af5a867d7866585af2f300a7565_prof);

        
        $__internal_bafe24fcc98a9e4bfc8a422ca0e1d02c234aaae10a5e4d256a19dab73d6d1a9d->leave($__internal_bafe24fcc98a9e4bfc8a422ca0e1d02c234aaae10a5e4d256a19dab73d6d1a9d_prof);

    }

    // line 30
    public function block_menu($context, array $blocks = array())
    {
        $__internal_a841232a911d3dcc2a91afc4190ebc13f975d381ab381e7a1228645e0aa4f7d2 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_a841232a911d3dcc2a91afc4190ebc13f975d381ab381e7a1228645e0aa4f7d2->enter($__internal_a841232a911d3dcc2a91afc4190ebc13f975d381ab381e7a1228645e0aa4f7d2_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        $__internal_fc15330735957559c23e4637c4a86780b940b384719bdcf35ade0da9b62bd18f = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_fc15330735957559c23e4637c4a86780b940b384719bdcf35ade0da9b62bd18f->enter($__internal_fc15330735957559c23e4637c4a86780b940b384719bdcf35ade0da9b62bd18f_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 31
        echo "    <span class=\"label label-status-";
        echo (($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array())) ? ("error") : (""));
        echo " ";
        echo ((twig_test_empty($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array()))) ? ("disabled") : (""));
        echo "\">
        <span class=\"icon\">";
        // line 32
        echo twig_include($this->env, $context, "@WebProfiler/Icon/form.svg");
        echo "</span>
        <strong>Forms</strong>
        ";
        // line 34
        if (($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array()) > 0)) {
            // line 35
            echo "            <span class=\"count\">
                <span>";
            // line 36
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "nb_errors", array()), "html", null, true);
            echo "</span>
            </span>
        ";
        }
        // line 39
        echo "    </span>
";
        
        $__internal_fc15330735957559c23e4637c4a86780b940b384719bdcf35ade0da9b62bd18f->leave($__internal_fc15330735957559c23e4637c4a86780b940b384719bdcf35ade0da9b62bd18f_prof);

        
        $__internal_a841232a911d3dcc2a91afc4190ebc13f975d381ab381e7a1228645e0aa4f7d2->leave($__internal_a841232a911d3dcc2a91afc4190ebc13f975d381ab381e7a1228645e0aa4f7d2_prof);

    }

    // line 42
    public function block_head($context, array $blocks = array())
    {
        $__internal_ead501ef2658110f0d39d351d6ca10d14034e8ccbe2411888180431255f91b5c = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_ead501ef2658110f0d39d351d6ca10d14034e8ccbe2411888180431255f91b5c->enter($__internal_ead501ef2658110f0d39d351d6ca10d14034e8ccbe2411888180431255f91b5c_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        $__internal_b4caa838bfa61e7ea2d4d82a7e4d83ae8c5e7740ac04735ee3372eaa61049116 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_b4caa838bfa61e7ea2d4d82a7e4d83ae8c5e7740ac04735ee3372eaa61049116->enter($__internal_b4caa838bfa61e7ea2d4d82a7e4d83ae8c5e7740ac04735ee3372eaa61049116_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        // line 43
        echo "    ";
        $this->displayParentBlock("head", $context, $blocks);
        echo "

    <style>
        #tree-menu {
            float: left;
            padding-right: 10px;
            width: 230px;
        }
        #tree-menu ul {
            list-style: none;
            margin: 0;
            padding-left: 0;
        }
        #tree-menu li {
            margin: 0;
            padding: 0;
            width: 100%;
        }
        #tree-menu .empty {
            border: 0;
            padding: 0;
        }
        #tree-details-container {
            border-left: 1px solid #DDD;
            margin-left: 250px;
            padding-left: 20px;
        }
        .tree-details {
            padding-bottom: 40px;
        }
        .tree-details h3 {
            font-size: 18px;
            position: relative;
        }

        .toggle-icon {
            display: inline-block;
            background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgBAMAAADpp+X/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDgwx4LcKwAAAABVQTFRFAAAA////////////////ZmZm////bvjBwAAAAAV0Uk5TABZwsuCVEUjgAAAAAWJLR0QF+G/pxwAAAE1JREFUGNNjSHMSYGBgUEljSGYAAzMGBwiDhUEBwmBiEIAwGBmwgTQgQGWgA7h2uIFwK+CWwp1BpHvYEqDuATEYkBlY3IOmBq6dCPcAAIT5Eg2IksjQAAAAAElFTkSuQmCC\") no-repeat top left #5eb5e0;
        }
        .closed .toggle-icon, .closed.toggle-icon {
            background-position: bottom left;
        }
        .toggle-icon.empty {
            background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAZgBmAGYHukptAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDhIf6CA40AAAAFRJREFUOMvtk7ENACEMA61vfx767MROWfO+AdGBHlNyTZrYUZRYDBII4NWE1pNdpFarfgLUbpDaBEgBYRiEVjsvDLa1l6O4Z3wkFWN+OfLKdpisOH/TlICzukmUJwAAAABJRU5ErkJggg==\");
        }

        .tree .tree-inner {
            cursor: pointer;
            padding: 5px 7px 5px 22px;
            position: relative;

        }
        .tree .toggle-button {
            /* provide a bigger clickable area than just 10x10px */
            width: 16px;
            height: 16px;
            margin-left: -18px;
        }
        .tree .toggle-icon {
            width: 10px;
            height: 10px;
            /* position the icon in the center of the clickable area */
            margin-left: 3px;
            margin-top: 3px;
            background-size: 10px 20px;
            background-color: #AAA;
        }
        .tree .toggle-icon.empty {
            width: 10px;
            height: 10px;
            position: absolute;
            top: 50%;
            margin-top: -5px;
            margin-left: -15px;
            background-size: 10px 10px;
        }
        .tree ul ul .tree-inner {
            padding-left: 37px;
        }
        .tree ul ul ul .tree-inner {
            padding-left: 52px;
        }
        .tree ul ul ul ul .tree-inner {
            padding-left: 67px;
        }
        .tree ul ul ul ul ul .tree-inner {
            padding-left: 82px;
        }
        .tree .tree-inner:hover {
            background: #dfdfdf;
        }
        .tree .tree-inner.active, .tree .tree-inner.active:hover {
            background: #E0E0E0;
            font-weight: bold;
        }
        .tree .tree-inner.active .toggle-icon, .tree .tree-inner:hover .toggle-icon, .tree .tree-inner.active:hover .toggle-icon {
            background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgBAMAAADpp+X/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDhEYXWn+sAAAABhQTFRFAAAA39/f39/f39/f39/fZmZm39/f////gc3YPwAAAAV0Uk5TAAtAc6ZeVyCYAAAAAWJLR0QF+G/pxwAAAE1JREFUGNNjSHMSYGBgUEljSGYAAzMGBwiDhUEBwmBiEIAwGBmwgXIgQGWgA7h2uIFwK+CWwp1BpHvYC6DuATEYkBlY3IOmBq6dCPcAADqLE4MnBi/fAAAAAElFTkSuQmCC\");
            background-color: #999;
        }
        .tree .tree-inner.active .toggle-icon.empty, .tree .tree-inner:hover .toggle-icon.empty, .tree .tree-inner.active:hover .toggle-icon.empty {
            background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDhoucSey4gAAABVQTFRFAAAA39/f39/f39/f39/fZmZm39/fD5Dx2AAAAAV0Uk5TAAtAc6ZeVyCYAAAAAWJLR0QF+G/pxwAAADJJREFUCNdjSHMSYGBgUEljSGYAAzMGBwiDhUEBwmBiEIAwGBnIA3DtcAPhVsAthTkDAFOfBKW9C1iqAAAAAElFTkSuQmCC\");
        }
        .tree-details .toggle-icon {
            width: 16px;
            height: 16px;
            /* vertically center the button */
            position: absolute;
            top: 50%;
            margin-top: -9px;
            margin-left: 6px;
        }
        .badge-error {
            float: right;
            background: #B0413E;
            color: #FFF;
            padding: 1px 4px;
            font-size: 10px;
            font-weight: bold;
            vertical-align: middle;
        }
        .has-error {
            color: #B0413E;
        }
        .errors h3 {
            color: #B0413E;
        }
        .errors th {
            background: #B0413E;
            color: #FFF;
        }
        .errors .toggle-icon {
            background-color: #B0413E;
        }
        h3 a, h3 a:hover, h3 a:focus {
            color: inherit;
            text-decoration: inherit;
        }
    </style>
";
        
        $__internal_b4caa838bfa61e7ea2d4d82a7e4d83ae8c5e7740ac04735ee3372eaa61049116->leave($__internal_b4caa838bfa61e7ea2d4d82a7e4d83ae8c5e7740ac04735ee3372eaa61049116_prof);

        
        $__internal_ead501ef2658110f0d39d351d6ca10d14034e8ccbe2411888180431255f91b5c->leave($__internal_ead501ef2658110f0d39d351d6ca10d14034e8ccbe2411888180431255f91b5c_prof);

    }

    // line 183
    public function block_panel($context, array $blocks = array())
    {
        $__internal_cbef9c209a3d75d5a53f23a969ed67aef9f86af0ea3adcdc309f1226f84f0a7e = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
        $__internal_cbef9c209a3d75d5a53f23a969ed67aef9f86af0ea3adcdc309f1226f84f0a7e->enter($__internal_cbef9c209a3d75d5a53f23a969ed67aef9f86af0ea3adcdc309f1226f84f0a7e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        $__internal_e3000d713b34835125dfa537fc0d249c4a9d530e0c48d90bfa61e45d033a5902 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_e3000d713b34835125dfa537fc0d249c4a9d530e0c48d90bfa61e45d033a5902->enter($__internal_e3000d713b34835125dfa537fc0d249c4a9d530e0c48d90bfa61e45d033a5902_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 184
        echo "    <h2>Forms</h2>

    ";
        // line 186
        if (twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array()))) {
            // line 187
            echo "        <div id=\"tree-menu\" class=\"tree\">
            <ul>
            ";
            // line 189
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array()));
            foreach ($context['_seq'] as $context["formName"] => $context["formData"]) {
                // line 190
                echo "                ";
                echo $context["__internal_57bb07264fdf7273f3d3dda7af3a5b29842b2e2922727087f4f6bfeb90cfe35a"]->getform_tree_entry($context["formName"], $context["formData"], true);
                echo "
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['formName'], $context['formData'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 192
            echo "            </ul>
        </div>

        <div id=\"tree-details-container\">
            ";
            // line 196
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms", array()));
            $context['loop'] = array(
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            );
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["formName"] => $context["formData"]) {
                // line 197
                echo "                ";
                echo $context["__internal_57bb07264fdf7273f3d3dda7af3a5b29842b2e2922727087f4f6bfeb90cfe35a"]->getform_tree_details($context["formName"], $context["formData"], $this->getAttribute($this->getAttribute(($context["collector"] ?? $this->getContext($context, "collector")), "data", array()), "forms_by_hash", array()), $this->getAttribute($context["loop"], "first", array()));
                echo "
            ";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['formName'], $context['formData'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 199
            echo "        </div>
    ";
        } else {
            // line 201
            echo "        <div class=\"empty\">
            <p>No forms were submitted for this request.</p>
        </div>
    ";
        }
        // line 205
        echo "
    <script>
    function Toggler(storage) {
        \"use strict\";

        var STORAGE_KEY = 'sf_toggle_data',

            states = {},

            isCollapsed = function (button) {
                return Sfjs.hasClass(button, 'closed');
            },

            isExpanded = function (button) {
                return !isCollapsed(button);
            },

            expand = function (button) {
                var targetId = button.dataset.toggleTargetId,
                    target = document.getElementById(targetId);

                if (!target) {
                    throw \"Toggle target \" + targetId + \" does not exist\";
                }

                if (isCollapsed(button)) {
                    Sfjs.removeClass(button, 'closed');
                    Sfjs.removeClass(target, 'hidden');

                    states[targetId] = 1;
                    storage.setItem(STORAGE_KEY, states);
                }
            },

            collapse = function (button) {
                var targetId = button.dataset.toggleTargetId,
                    target = document.getElementById(targetId);

                if (!target) {
                    throw \"Toggle target \" + targetId + \" does not exist\";
                }

                if (isExpanded(button)) {
                    Sfjs.addClass(button, 'closed');
                    Sfjs.addClass(target, 'hidden');

                    states[targetId] = 0;
                    storage.setItem(STORAGE_KEY, states);
                }
            },

            toggle = function (button) {
                if (Sfjs.hasClass(button, 'closed')) {
                    expand(button);
                } else {
                    collapse(button);
                }
            },

            initButtons = function (buttons) {
                states = storage.getItem(STORAGE_KEY, {});

                // must be an object, not an array or anything else
                // `typeof` returns \"object\" also for arrays, so the following
                // check must be done
                // see http://stackoverflow.com/questions/4775722/check-if-object-is-array
                if ('[object Object]' !== Object.prototype.toString.call(states)) {
                    states = {};
                }

                for (var i = 0, l = buttons.length; i < l; ++i) {
                    var targetId = buttons[i].dataset.toggleTargetId,
                        target = document.getElementById(targetId);

                    if (!target) {
                        throw \"Toggle target \" + targetId + \" does not exist\";
                    }

                    // correct the initial state of the button
                    if (Sfjs.hasClass(target, 'hidden')) {
                        Sfjs.addClass(buttons[i], 'closed');
                    }

                    // attach listener for expanding/collapsing the target
                    clickHandler(buttons[i], toggle);

                    if (states.hasOwnProperty(targetId)) {
                        // open or collapse based on stored data
                        if (0 === states[targetId]) {
                            collapse(buttons[i]);
                        } else {
                            expand(buttons[i]);
                        }
                    }
                }
            };

        return {
            initButtons: initButtons,

            toggle: toggle,

            isExpanded: isExpanded,

            isCollapsed: isCollapsed,

            expand: expand,

            collapse: collapse
        };
    }

    function JsonStorage(storage) {
        var setItem = function (key, data) {
                storage.setItem(key, JSON.stringify(data));
            },

            getItem = function (key, defaultValue) {
                var data = storage.getItem(key);

                if (null !== data) {
                    try {
                        return JSON.parse(data);
                    } catch(e) {
                    }
                }

                return defaultValue;
            };

        return {
            setItem: setItem,

            getItem: getItem
        };
    }

    function TabView() {
        \"use strict\";

        var activeTab = null,

            activeTarget = null,

            select = function (tab) {
                var targetId = tab.dataset.tabTargetId,
                    target = document.getElementById(targetId);

                if (!target) {
                    throw \"Tab target \" + targetId + \" does not exist\";
                }

                if (activeTab) {
                    Sfjs.removeClass(activeTab, 'active');
                }

                if (activeTarget) {
                    Sfjs.addClass(activeTarget, 'hidden');
                }

                Sfjs.addClass(tab, 'active');
                Sfjs.removeClass(target, 'hidden');

                activeTab = tab;
                activeTarget = target;
            },

            initTabs = function (tabs) {
                for (var i = 0, l = tabs.length; i < l; ++i) {
                    var targetId = tabs[i].dataset.tabTargetId,
                        target = document.getElementById(targetId);

                    if (!target) {
                        throw \"Tab target \" + targetId + \" does not exist\";
                    }

                    clickHandler(tabs[i], select);

                    Sfjs.addClass(target, 'hidden');
                }

                if (tabs.length > 0) {
                    select(tabs[0]);
                }
            };

        return {
            initTabs: initTabs,

            select: select
        };
    }

    var tabTarget = new TabView(),
        toggler = new Toggler(new JsonStorage(sessionStorage)),
        clickHandler = function (element, callback) {
            Sfjs.addEventListener(element, 'click', function (e) {
                if (!e) {
                    e = window.event;
                }

                callback(this);

                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                e.stopPropagation();

                return false;
            });
        };

    tabTarget.initTabs(document.querySelectorAll('.tree .tree-inner'));
    toggler.initButtons(document.querySelectorAll('a.toggle-button'));
    </script>
";
        
        $__internal_e3000d713b34835125dfa537fc0d249c4a9d530e0c48d90bfa61e45d033a5902->leave($__internal_e3000d713b34835125dfa537fc0d249c4a9d530e0c48d90bfa61e45d033a5902_prof);

        
        $__internal_cbef9c209a3d75d5a53f23a969ed67aef9f86af0ea3adcdc309f1226f84f0a7e->leave($__internal_cbef9c209a3d75d5a53f23a969ed67aef9f86af0ea3adcdc309f1226f84f0a7e_prof);

    }

    // line 425
    public function getform_tree_entry($__name__ = null, $__data__ = null, $__is_root__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals(array(
            "name" => $__name__,
            "data" => $__data__,
            "is_root" => $__is_root__,
            "varargs" => $__varargs__,
        ));

        $blocks = array();

        ob_start();
        try {
            $__internal_5a40b932657053bbf568d8990c0195357e5dd97c9dafb8010a70dad26aa60413 = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
            $__internal_5a40b932657053bbf568d8990c0195357e5dd97c9dafb8010a70dad26aa60413->enter($__internal_5a40b932657053bbf568d8990c0195357e5dd97c9dafb8010a70dad26aa60413_prof = new Twig_Profiler_Profile($this->getTemplateName(), "macro", "form_tree_entry"));

            $__internal_1e2bf7b214100c13a793bdedac2fae0f62ae06783b87d4d86741d2ddaaf9b65b = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
            $__internal_1e2bf7b214100c13a793bdedac2fae0f62ae06783b87d4d86741d2ddaaf9b65b->enter($__internal_1e2bf7b214100c13a793bdedac2fae0f62ae06783b87d4d86741d2ddaaf9b65b_prof = new Twig_Profiler_Profile($this->getTemplateName(), "macro", "form_tree_entry"));

            // line 426
            echo "    ";
            $context["tree"] = $this;
            // line 427
            echo "    ";
            $context["has_error"] = ($this->getAttribute(($context["data"] ?? null), "errors", array(), "any", true, true) && (twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "errors", array())) > 0));
            // line 428
            echo "    <li>
        <div class=\"tree-inner\" data-tab-target-id=\"";
            // line 429
            echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
            echo "-details\">
            ";
            // line 430
            if (($context["has_error"] ?? $this->getContext($context, "has_error"))) {
                // line 431
                echo "                <div class=\"badge-error\">";
                echo twig_escape_filter($this->env, twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "errors", array())), "html", null, true);
                echo "</div>
            ";
            }
            // line 433
            echo "
            ";
            // line 434
            if ( !twig_test_empty($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "children", array()))) {
                // line 435
                echo "                <a class=\"toggle-button\" data-toggle-target-id=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-children\" href=\"#\"><span class=\"toggle-icon\"></span></a>
            ";
            } else {
                // line 437
                echo "                <div class=\"toggle-icon empty\"></div>
            ";
            }
            // line 439
            echo "
            <span ";
            // line 440
            if ((($context["has_error"] ?? $this->getContext($context, "has_error")) || (($this->getAttribute(($context["data"] ?? null), "has_children_error", array(), "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["data"] ?? null), "has_children_error", array()), false)) : (false)))) {
                echo "class=\"has-error\"";
            }
            echo ">
                ";
            // line 441
            echo twig_escape_filter($this->env, ((array_key_exists("name", $context)) ? (_twig_default_filter(($context["name"] ?? $this->getContext($context, "name")), "(no name)")) : ("(no name)")), "html", null, true);
            echo "
            </span>
        </div>

        ";
            // line 445
            if ( !twig_test_empty($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "children", array()))) {
                // line 446
                echo "            <ul id=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-children\" ";
                if (( !($context["is_root"] ?? $this->getContext($context, "is_root")) &&  !(($this->getAttribute(($context["data"] ?? null), "has_children_error", array(), "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["data"] ?? null), "has_children_error", array()), false)) : (false)))) {
                    echo "class=\"hidden\"";
                }
                echo ">
                ";
                // line 447
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "children", array()));
                foreach ($context['_seq'] as $context["childName"] => $context["childData"]) {
                    // line 448
                    echo "                    ";
                    echo $context["tree"]->getform_tree_entry($context["childName"], $context["childData"], false);
                    echo "
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['childName'], $context['childData'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 450
                echo "            </ul>
        ";
            }
            // line 452
            echo "    </li>
";
            
            $__internal_1e2bf7b214100c13a793bdedac2fae0f62ae06783b87d4d86741d2ddaaf9b65b->leave($__internal_1e2bf7b214100c13a793bdedac2fae0f62ae06783b87d4d86741d2ddaaf9b65b_prof);

            
            $__internal_5a40b932657053bbf568d8990c0195357e5dd97c9dafb8010a70dad26aa60413->leave($__internal_5a40b932657053bbf568d8990c0195357e5dd97c9dafb8010a70dad26aa60413_prof);

        } catch (Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
    }

    // line 455
    public function getform_tree_details($__name__ = null, $__data__ = null, $__forms_by_hash__ = null, $__show__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals(array(
            "name" => $__name__,
            "data" => $__data__,
            "forms_by_hash" => $__forms_by_hash__,
            "show" => $__show__,
            "varargs" => $__varargs__,
        ));

        $blocks = array();

        ob_start();
        try {
            $__internal_f3ddb379b68e85dddb42ee18b62b931ddb8a9e41ee9a429b95856b7c9d95d58e = $this->env->getExtension("Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension");
            $__internal_f3ddb379b68e85dddb42ee18b62b931ddb8a9e41ee9a429b95856b7c9d95d58e->enter($__internal_f3ddb379b68e85dddb42ee18b62b931ddb8a9e41ee9a429b95856b7c9d95d58e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "macro", "form_tree_details"));

            $__internal_31b6d5cbd4ee2f5ad34fbcce04aabbaaedae52523bcdbae6a6e15d506d9473a2 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
            $__internal_31b6d5cbd4ee2f5ad34fbcce04aabbaaedae52523bcdbae6a6e15d506d9473a2->enter($__internal_31b6d5cbd4ee2f5ad34fbcce04aabbaaedae52523bcdbae6a6e15d506d9473a2_prof = new Twig_Profiler_Profile($this->getTemplateName(), "macro", "form_tree_details"));

            // line 456
            echo "    ";
            $context["tree"] = $this;
            // line 457
            echo "    <div class=\"tree-details";
            if ( !((array_key_exists("show", $context)) ? (_twig_default_filter(($context["show"] ?? $this->getContext($context, "show")), false)) : (false))) {
                echo " hidden";
            }
            echo "\" ";
            if ($this->getAttribute(($context["data"] ?? null), "id", array(), "any", true, true)) {
                echo "id=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-details\"";
            }
            echo ">
        <h2 class=\"dump-inline\">
            ";
            // line 459
            echo twig_escape_filter($this->env, ((array_key_exists("name", $context)) ? (_twig_default_filter(($context["name"] ?? $this->getContext($context, "name")), "(no name)")) : ("(no name)")), "html", null, true);
            echo " ";
            if ($this->getAttribute(($context["data"] ?? null), "type_class", array(), "any", true, true)) {
                echo "(";
                echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "type_class", array())));
                echo ")";
            }
            // line 460
            echo "        </h2>

        ";
            // line 462
            if (($this->getAttribute(($context["data"] ?? null), "errors", array(), "any", true, true) && (twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "errors", array())) > 0))) {
                // line 463
                echo "        <div class=\"errors\">
            <h3>
                <a class=\"toggle-button\" data-toggle-target-id=\"";
                // line 465
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-errors\" href=\"#\">
                    Errors <span class=\"toggle-icon\"></span>
                </a>
            </h3>

            <table id=\"";
                // line 470
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-errors\">
                <thead>
                    <tr>
                        <th>Message</th>
                        <th>Origin</th>
                        <th>Cause</th>
                    </tr>
                </thead>
                <tbody>
                ";
                // line 479
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "errors", array()));
                foreach ($context['_seq'] as $context["_key"] => $context["error"]) {
                    // line 480
                    echo "                <tr>
                    <td>";
                    // line 481
                    echo twig_escape_filter($this->env, $this->getAttribute($context["error"], "message", array()), "html", null, true);
                    echo "</td>
                    <td>
                        ";
                    // line 483
                    if (twig_test_empty($this->getAttribute($context["error"], "origin", array()))) {
                        // line 484
                        echo "                            <em>This form.</em>
                        ";
                    } elseif ( !$this->getAttribute(                    // line 485
($context["forms_by_hash"] ?? null), $this->getAttribute($context["error"], "origin", array()), array(), "array", true, true)) {
                        // line 486
                        echo "                            <em>Unknown.</em>
                        ";
                    } else {
                        // line 488
                        echo "                            ";
                        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["forms_by_hash"] ?? $this->getContext($context, "forms_by_hash")), $this->getAttribute($context["error"], "origin", array()), array(), "array"), "name", array()), "html", null, true);
                        echo "
                        ";
                    }
                    // line 490
                    echo "                    </td>
                    <td>
                        ";
                    // line 492
                    if ($this->getAttribute($context["error"], "trace", array())) {
                        // line 493
                        echo "                            <span class=\"newline\">Caused by:</span>
                            ";
                        // line 494
                        $context['_parent'] = $context;
                        $context['_seq'] = twig_ensure_traversable($this->getAttribute($context["error"], "trace", array()));
                        foreach ($context['_seq'] as $context["_key"] => $context["stacked"]) {
                            // line 495
                            echo "                                ";
                            echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $context["stacked"]));
                            echo "
                            ";
                        }
                        $_parent = $context['_parent'];
                        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['stacked'], $context['_parent'], $context['loop']);
                        $context = array_intersect_key($context, $_parent) + $_parent;
                        // line 497
                        echo "                        ";
                    } else {
                        // line 498
                        echo "                            <em>Unknown.</em>
                        ";
                    }
                    // line 500
                    echo "                    </td>
                </tr>
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['error'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 503
                echo "                </tbody>
            </table>
        </div>
        ";
            }
            // line 507
            echo "
        ";
            // line 508
            if ($this->getAttribute(($context["data"] ?? null), "default_data", array(), "any", true, true)) {
                // line 509
                echo "        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"";
                // line 510
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-default_data\" href=\"#\">
                Default Data <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"";
                // line 515
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-default_data\">
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Model Format</th>
                        <td>
                            ";
                // line 527
                if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "default_data", array(), "any", false, true), "model", array(), "any", true, true)) {
                    // line 528
                    echo "                                ";
                    echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "default_data", array()), "model", array())));
                    echo "
                            ";
                } else {
                    // line 530
                    echo "                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            ";
                }
                // line 532
                echo "                        </td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Normalized Format</th>
                        <td>";
                // line 536
                echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "default_data", array()), "norm", array())));
                echo "</td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">View Format</th>
                        <td>
                            ";
                // line 541
                if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "default_data", array(), "any", false, true), "view", array(), "any", true, true)) {
                    // line 542
                    echo "                                ";
                    echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "default_data", array()), "view", array())));
                    echo "
                            ";
                } else {
                    // line 544
                    echo "                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            ";
                }
                // line 546
                echo "                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        ";
            }
            // line 552
            echo "
        ";
            // line 553
            if ($this->getAttribute(($context["data"] ?? null), "submitted_data", array(), "any", true, true)) {
                // line 554
                echo "        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"";
                // line 555
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-submitted_data\" href=\"#\">
                Submitted Data <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"";
                // line 560
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-submitted_data\">
        ";
                // line 561
                if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "submitted_data", array(), "any", false, true), "norm", array(), "any", true, true)) {
                    // line 562
                    echo "            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">View Format</th>
                        <td>
                            ";
                    // line 573
                    if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "submitted_data", array(), "any", false, true), "view", array(), "any", true, true)) {
                        // line 574
                        echo "                                ";
                        echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "submitted_data", array()), "view", array())));
                        echo "
                            ";
                    } else {
                        // line 576
                        echo "                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            ";
                    }
                    // line 578
                    echo "                        </td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Normalized Format</th>
                        <td>";
                    // line 582
                    echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "submitted_data", array()), "norm", array())));
                    echo "</td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Model Format</th>
                        <td>
                            ";
                    // line 587
                    if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "submitted_data", array(), "any", false, true), "model", array(), "any", true, true)) {
                        // line 588
                        echo "                                ";
                        echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "submitted_data", array()), "model", array())));
                        echo "
                            ";
                    } else {
                        // line 590
                        echo "                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            ";
                    }
                    // line 592
                    echo "                        </td>
                    </tr>
                </tbody>
            </table>
        ";
                } else {
                    // line 597
                    echo "            <div class=\"empty\">
                <p>This form was not submitted.</p>
            </div>
        ";
                }
                // line 601
                echo "        </div>
        ";
            }
            // line 603
            echo "
        ";
            // line 604
            if ($this->getAttribute(($context["data"] ?? null), "passed_options", array(), "any", true, true)) {
                // line 605
                echo "        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"";
                // line 606
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-passed_options\" href=\"#\">
                Passed Options <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"";
                // line 611
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-passed_options\">
            ";
                // line 612
                if (twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "passed_options", array()))) {
                    // line 613
                    echo "            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Option</th>
                        <th>Passed Value</th>
                        <th>Resolved Value</th>
                    </tr>
                </thead>
                <tbody>
                ";
                    // line 622
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "passed_options", array()));
                    foreach ($context['_seq'] as $context["option"] => $context["value"]) {
                        // line 623
                        echo "                <tr>
                    <th>";
                        // line 624
                        echo twig_escape_filter($this->env, $context["option"], "html", null, true);
                        echo "</th>
                    <td>";
                        // line 625
                        echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $context["value"]));
                        echo "</td>
                    <td>
                        ";
                        // line 627
                        if (($this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "resolved_options", array()), $context["option"], array(), "array") == $context["value"])) {
                            // line 628
                            echo "                            <em class=\"font-normal text-muted\">same as passed value</em>
                        ";
                        } else {
                            // line 630
                            echo "                            ";
                            echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "resolved_options", array()), $context["option"], array(), "array")));
                            echo "
                        ";
                        }
                        // line 632
                        echo "                    </td>
                </tr>
                ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['option'], $context['value'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 635
                    echo "                </tbody>
            </table>
            ";
                } else {
                    // line 638
                    echo "                <div class=\"empty\">
                    <p>No options where passed when constructing this form.</p>
                </div>
            ";
                }
                // line 642
                echo "        </div>
        ";
            }
            // line 644
            echo "
        ";
            // line 645
            if ($this->getAttribute(($context["data"] ?? null), "resolved_options", array(), "any", true, true)) {
                // line 646
                echo "        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"";
                // line 647
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-resolved_options\" href=\"#\">
                Resolved Options <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"";
                // line 652
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-resolved_options\" class=\"hidden\">
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Option</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                ";
                // line 661
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "resolved_options", array()));
                foreach ($context['_seq'] as $context["option"] => $context["value"]) {
                    // line 662
                    echo "                <tr>
                    <th scope=\"row\">";
                    // line 663
                    echo twig_escape_filter($this->env, $context["option"], "html", null, true);
                    echo "</th>
                    <td>";
                    // line 664
                    echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $context["value"]));
                    echo "</td>
                </tr>
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['option'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 667
                echo "                </tbody>
            </table>
        </div>
        ";
            }
            // line 671
            echo "
        ";
            // line 672
            if ($this->getAttribute(($context["data"] ?? null), "view_vars", array(), "any", true, true)) {
                // line 673
                echo "        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"";
                // line 674
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-view_vars\" href=\"#\">
                View Variables <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"";
                // line 679
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "id", array()), "html", null, true);
                echo "-view_vars\" class=\"hidden\">
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Variable</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                ";
                // line 688
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "view_vars", array()));
                foreach ($context['_seq'] as $context["variable"] => $context["value"]) {
                    // line 689
                    echo "                <tr>
                    <th scope=\"row\">";
                    // line 690
                    echo twig_escape_filter($this->env, $context["variable"], "html", null, true);
                    echo "</th>
                    <td>";
                    // line 691
                    echo call_user_func_array($this->env->getFunction('profiler_dump')->getCallable(), array($this->env, $context["value"]));
                    echo "</td>
                </tr>
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['variable'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 694
                echo "                </tbody>
            </table>
        </div>
        ";
            }
            // line 698
            echo "    </div>

    ";
            // line 700
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? $this->getContext($context, "data")), "children", array()));
            foreach ($context['_seq'] as $context["childName"] => $context["childData"]) {
                // line 701
                echo "        ";
                echo $context["tree"]->getform_tree_details($context["childName"], $context["childData"], ($context["forms_by_hash"] ?? $this->getContext($context, "forms_by_hash")));
                echo "
    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['childName'], $context['childData'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            
            $__internal_31b6d5cbd4ee2f5ad34fbcce04aabbaaedae52523bcdbae6a6e15d506d9473a2->leave($__internal_31b6d5cbd4ee2f5ad34fbcce04aabbaaedae52523bcdbae6a6e15d506d9473a2_prof);

            
            $__internal_f3ddb379b68e85dddb42ee18b62b931ddb8a9e41ee9a429b95856b7c9d95d58e->leave($__internal_f3ddb379b68e85dddb42ee18b62b931ddb8a9e41ee9a429b95856b7c9d95d58e_prof);

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
        return "@WebProfiler/Collector/form.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  1265 => 701,  1261 => 700,  1257 => 698,  1251 => 694,  1242 => 691,  1238 => 690,  1235 => 689,  1231 => 688,  1219 => 679,  1211 => 674,  1208 => 673,  1206 => 672,  1203 => 671,  1197 => 667,  1188 => 664,  1184 => 663,  1181 => 662,  1177 => 661,  1165 => 652,  1157 => 647,  1154 => 646,  1152 => 645,  1149 => 644,  1145 => 642,  1139 => 638,  1134 => 635,  1126 => 632,  1120 => 630,  1116 => 628,  1114 => 627,  1109 => 625,  1105 => 624,  1102 => 623,  1098 => 622,  1087 => 613,  1085 => 612,  1081 => 611,  1073 => 606,  1070 => 605,  1068 => 604,  1065 => 603,  1061 => 601,  1055 => 597,  1048 => 592,  1044 => 590,  1038 => 588,  1036 => 587,  1028 => 582,  1022 => 578,  1018 => 576,  1012 => 574,  1010 => 573,  997 => 562,  995 => 561,  991 => 560,  983 => 555,  980 => 554,  978 => 553,  975 => 552,  967 => 546,  963 => 544,  957 => 542,  955 => 541,  947 => 536,  941 => 532,  937 => 530,  931 => 528,  929 => 527,  914 => 515,  906 => 510,  903 => 509,  901 => 508,  898 => 507,  892 => 503,  884 => 500,  880 => 498,  877 => 497,  868 => 495,  864 => 494,  861 => 493,  859 => 492,  855 => 490,  849 => 488,  845 => 486,  843 => 485,  840 => 484,  838 => 483,  833 => 481,  830 => 480,  826 => 479,  814 => 470,  806 => 465,  802 => 463,  800 => 462,  796 => 460,  788 => 459,  774 => 457,  771 => 456,  750 => 455,  728 => 452,  724 => 450,  715 => 448,  711 => 447,  702 => 446,  700 => 445,  693 => 441,  687 => 440,  684 => 439,  680 => 437,  674 => 435,  672 => 434,  669 => 433,  663 => 431,  661 => 430,  657 => 429,  654 => 428,  651 => 427,  648 => 426,  628 => 425,  400 => 205,  394 => 201,  390 => 199,  373 => 197,  356 => 196,  350 => 192,  341 => 190,  337 => 189,  333 => 187,  331 => 186,  327 => 184,  318 => 183,  168 => 43,  159 => 42,  148 => 39,  142 => 36,  139 => 35,  137 => 34,  132 => 32,  125 => 31,  116 => 30,  103 => 26,  100 => 25,  92 => 22,  85 => 18,  81 => 16,  79 => 15,  76 => 14,  70 => 11,  64 => 9,  61 => 8,  58 => 7,  55 => 6,  46 => 5,  36 => 1,  34 => 3,  11 => 1,);
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

{% from _self import form_tree_entry, form_tree_details %}

{% block toolbar %}
    {% if collector.data.nb_errors > 0 or collector.data.forms|length %}
        {% set status_color = collector.data.nb_errors ? 'red' : '' %}
        {% set icon %}
            {{ include('@WebProfiler/Icon/form.svg') }}
            <span class=\"sf-toolbar-value\">
                {{ collector.data.nb_errors ?: collector.data.forms|length }}
            </span>
        {% endset %}

        {% set text %}
            <div class=\"sf-toolbar-info-piece\">
                <b>Number of forms</b>
                <span class=\"sf-toolbar-status\">{{ collector.data.forms|length }}</span>
            </div>
            <div class=\"sf-toolbar-info-piece\">
                <b>Number of errors</b>
                <span class=\"sf-toolbar-status sf-toolbar-status-{{ collector.data.nb_errors > 0 ? 'red' }}\">{{ collector.data.nb_errors }}</span>
            </div>
        {% endset %}

        {{ include('@WebProfiler/Profiler/toolbar_item.html.twig', { link: profiler_url, status: status_color }) }}
    {% endif %}
{% endblock %}

{% block menu %}
    <span class=\"label label-status-{{ collector.data.nb_errors ? 'error' }} {{ collector.data.forms is empty ? 'disabled' }}\">
        <span class=\"icon\">{{ include('@WebProfiler/Icon/form.svg') }}</span>
        <strong>Forms</strong>
        {% if collector.data.nb_errors > 0 %}
            <span class=\"count\">
                <span>{{ collector.data.nb_errors }}</span>
            </span>
        {% endif %}
    </span>
{% endblock %}

{% block head %}
    {{ parent() }}

    <style>
        #tree-menu {
            float: left;
            padding-right: 10px;
            width: 230px;
        }
        #tree-menu ul {
            list-style: none;
            margin: 0;
            padding-left: 0;
        }
        #tree-menu li {
            margin: 0;
            padding: 0;
            width: 100%;
        }
        #tree-menu .empty {
            border: 0;
            padding: 0;
        }
        #tree-details-container {
            border-left: 1px solid #DDD;
            margin-left: 250px;
            padding-left: 20px;
        }
        .tree-details {
            padding-bottom: 40px;
        }
        .tree-details h3 {
            font-size: 18px;
            position: relative;
        }

        .toggle-icon {
            display: inline-block;
            background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgBAMAAADpp+X/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDgwx4LcKwAAAABVQTFRFAAAA////////////////ZmZm////bvjBwAAAAAV0Uk5TABZwsuCVEUjgAAAAAWJLR0QF+G/pxwAAAE1JREFUGNNjSHMSYGBgUEljSGYAAzMGBwiDhUEBwmBiEIAwGBmwgTQgQGWgA7h2uIFwK+CWwp1BpHvYEqDuATEYkBlY3IOmBq6dCPcAAIT5Eg2IksjQAAAAAElFTkSuQmCC\") no-repeat top left #5eb5e0;
        }
        .closed .toggle-icon, .closed.toggle-icon {
            background-position: bottom left;
        }
        .toggle-icon.empty {
            background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAZgBmAGYHukptAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDhIf6CA40AAAAFRJREFUOMvtk7ENACEMA61vfx767MROWfO+AdGBHlNyTZrYUZRYDBII4NWE1pNdpFarfgLUbpDaBEgBYRiEVjsvDLa1l6O4Z3wkFWN+OfLKdpisOH/TlICzukmUJwAAAABJRU5ErkJggg==\");
        }

        .tree .tree-inner {
            cursor: pointer;
            padding: 5px 7px 5px 22px;
            position: relative;

        }
        .tree .toggle-button {
            /* provide a bigger clickable area than just 10x10px */
            width: 16px;
            height: 16px;
            margin-left: -18px;
        }
        .tree .toggle-icon {
            width: 10px;
            height: 10px;
            /* position the icon in the center of the clickable area */
            margin-left: 3px;
            margin-top: 3px;
            background-size: 10px 20px;
            background-color: #AAA;
        }
        .tree .toggle-icon.empty {
            width: 10px;
            height: 10px;
            position: absolute;
            top: 50%;
            margin-top: -5px;
            margin-left: -15px;
            background-size: 10px 10px;
        }
        .tree ul ul .tree-inner {
            padding-left: 37px;
        }
        .tree ul ul ul .tree-inner {
            padding-left: 52px;
        }
        .tree ul ul ul ul .tree-inner {
            padding-left: 67px;
        }
        .tree ul ul ul ul ul .tree-inner {
            padding-left: 82px;
        }
        .tree .tree-inner:hover {
            background: #dfdfdf;
        }
        .tree .tree-inner.active, .tree .tree-inner.active:hover {
            background: #E0E0E0;
            font-weight: bold;
        }
        .tree .tree-inner.active .toggle-icon, .tree .tree-inner:hover .toggle-icon, .tree .tree-inner.active:hover .toggle-icon {
            background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgBAMAAADpp+X/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDhEYXWn+sAAAABhQTFRFAAAA39/f39/f39/f39/fZmZm39/f////gc3YPwAAAAV0Uk5TAAtAc6ZeVyCYAAAAAWJLR0QF+G/pxwAAAE1JREFUGNNjSHMSYGBgUEljSGYAAzMGBwiDhUEBwmBiEIAwGBmwgXIgQGWgA7h2uIFwK+CWwp1BpHvYC6DuATEYkBlY3IOmBq6dCPcAADqLE4MnBi/fAAAAAElFTkSuQmCC\");
            background-color: #999;
        }
        .tree .tree-inner.active .toggle-icon.empty, .tree .tree-inner:hover .toggle-icon.empty, .tree .tree-inner.active:hover .toggle-icon.empty {
            background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QweDhoucSey4gAAABVQTFRFAAAA39/f39/f39/f39/fZmZm39/fD5Dx2AAAAAV0Uk5TAAtAc6ZeVyCYAAAAAWJLR0QF+G/pxwAAADJJREFUCNdjSHMSYGBgUEljSGYAAzMGBwiDhUEBwmBiEIAwGBnIA3DtcAPhVsAthTkDAFOfBKW9C1iqAAAAAElFTkSuQmCC\");
        }
        .tree-details .toggle-icon {
            width: 16px;
            height: 16px;
            /* vertically center the button */
            position: absolute;
            top: 50%;
            margin-top: -9px;
            margin-left: 6px;
        }
        .badge-error {
            float: right;
            background: #B0413E;
            color: #FFF;
            padding: 1px 4px;
            font-size: 10px;
            font-weight: bold;
            vertical-align: middle;
        }
        .has-error {
            color: #B0413E;
        }
        .errors h3 {
            color: #B0413E;
        }
        .errors th {
            background: #B0413E;
            color: #FFF;
        }
        .errors .toggle-icon {
            background-color: #B0413E;
        }
        h3 a, h3 a:hover, h3 a:focus {
            color: inherit;
            text-decoration: inherit;
        }
    </style>
{% endblock %}

{% block panel %}
    <h2>Forms</h2>

    {% if collector.data.forms|length %}
        <div id=\"tree-menu\" class=\"tree\">
            <ul>
            {% for formName, formData in collector.data.forms %}
                {{ form_tree_entry(formName, formData, true) }}
            {% endfor %}
            </ul>
        </div>

        <div id=\"tree-details-container\">
            {% for formName, formData in collector.data.forms %}
                {{ form_tree_details(formName, formData, collector.data.forms_by_hash, loop.first) }}
            {% endfor %}
        </div>
    {% else %}
        <div class=\"empty\">
            <p>No forms were submitted for this request.</p>
        </div>
    {% endif %}

    <script>
    function Toggler(storage) {
        \"use strict\";

        var STORAGE_KEY = 'sf_toggle_data',

            states = {},

            isCollapsed = function (button) {
                return Sfjs.hasClass(button, 'closed');
            },

            isExpanded = function (button) {
                return !isCollapsed(button);
            },

            expand = function (button) {
                var targetId = button.dataset.toggleTargetId,
                    target = document.getElementById(targetId);

                if (!target) {
                    throw \"Toggle target \" + targetId + \" does not exist\";
                }

                if (isCollapsed(button)) {
                    Sfjs.removeClass(button, 'closed');
                    Sfjs.removeClass(target, 'hidden');

                    states[targetId] = 1;
                    storage.setItem(STORAGE_KEY, states);
                }
            },

            collapse = function (button) {
                var targetId = button.dataset.toggleTargetId,
                    target = document.getElementById(targetId);

                if (!target) {
                    throw \"Toggle target \" + targetId + \" does not exist\";
                }

                if (isExpanded(button)) {
                    Sfjs.addClass(button, 'closed');
                    Sfjs.addClass(target, 'hidden');

                    states[targetId] = 0;
                    storage.setItem(STORAGE_KEY, states);
                }
            },

            toggle = function (button) {
                if (Sfjs.hasClass(button, 'closed')) {
                    expand(button);
                } else {
                    collapse(button);
                }
            },

            initButtons = function (buttons) {
                states = storage.getItem(STORAGE_KEY, {});

                // must be an object, not an array or anything else
                // `typeof` returns \"object\" also for arrays, so the following
                // check must be done
                // see http://stackoverflow.com/questions/4775722/check-if-object-is-array
                if ('[object Object]' !== Object.prototype.toString.call(states)) {
                    states = {};
                }

                for (var i = 0, l = buttons.length; i < l; ++i) {
                    var targetId = buttons[i].dataset.toggleTargetId,
                        target = document.getElementById(targetId);

                    if (!target) {
                        throw \"Toggle target \" + targetId + \" does not exist\";
                    }

                    // correct the initial state of the button
                    if (Sfjs.hasClass(target, 'hidden')) {
                        Sfjs.addClass(buttons[i], 'closed');
                    }

                    // attach listener for expanding/collapsing the target
                    clickHandler(buttons[i], toggle);

                    if (states.hasOwnProperty(targetId)) {
                        // open or collapse based on stored data
                        if (0 === states[targetId]) {
                            collapse(buttons[i]);
                        } else {
                            expand(buttons[i]);
                        }
                    }
                }
            };

        return {
            initButtons: initButtons,

            toggle: toggle,

            isExpanded: isExpanded,

            isCollapsed: isCollapsed,

            expand: expand,

            collapse: collapse
        };
    }

    function JsonStorage(storage) {
        var setItem = function (key, data) {
                storage.setItem(key, JSON.stringify(data));
            },

            getItem = function (key, defaultValue) {
                var data = storage.getItem(key);

                if (null !== data) {
                    try {
                        return JSON.parse(data);
                    } catch(e) {
                    }
                }

                return defaultValue;
            };

        return {
            setItem: setItem,

            getItem: getItem
        };
    }

    function TabView() {
        \"use strict\";

        var activeTab = null,

            activeTarget = null,

            select = function (tab) {
                var targetId = tab.dataset.tabTargetId,
                    target = document.getElementById(targetId);

                if (!target) {
                    throw \"Tab target \" + targetId + \" does not exist\";
                }

                if (activeTab) {
                    Sfjs.removeClass(activeTab, 'active');
                }

                if (activeTarget) {
                    Sfjs.addClass(activeTarget, 'hidden');
                }

                Sfjs.addClass(tab, 'active');
                Sfjs.removeClass(target, 'hidden');

                activeTab = tab;
                activeTarget = target;
            },

            initTabs = function (tabs) {
                for (var i = 0, l = tabs.length; i < l; ++i) {
                    var targetId = tabs[i].dataset.tabTargetId,
                        target = document.getElementById(targetId);

                    if (!target) {
                        throw \"Tab target \" + targetId + \" does not exist\";
                    }

                    clickHandler(tabs[i], select);

                    Sfjs.addClass(target, 'hidden');
                }

                if (tabs.length > 0) {
                    select(tabs[0]);
                }
            };

        return {
            initTabs: initTabs,

            select: select
        };
    }

    var tabTarget = new TabView(),
        toggler = new Toggler(new JsonStorage(sessionStorage)),
        clickHandler = function (element, callback) {
            Sfjs.addEventListener(element, 'click', function (e) {
                if (!e) {
                    e = window.event;
                }

                callback(this);

                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                e.stopPropagation();

                return false;
            });
        };

    tabTarget.initTabs(document.querySelectorAll('.tree .tree-inner'));
    toggler.initButtons(document.querySelectorAll('a.toggle-button'));
    </script>
{% endblock %}

{% macro form_tree_entry(name, data, is_root) %}
    {% import _self as tree %}
    {% set has_error = data.errors is defined and data.errors|length > 0 %}
    <li>
        <div class=\"tree-inner\" data-tab-target-id=\"{{ data.id }}-details\">
            {% if has_error %}
                <div class=\"badge-error\">{{ data.errors|length }}</div>
            {% endif %}

            {% if data.children is not empty %}
                <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-children\" href=\"#\"><span class=\"toggle-icon\"></span></a>
            {% else %}
                <div class=\"toggle-icon empty\"></div>
            {% endif %}

            <span {% if has_error or data.has_children_error|default(false) %}class=\"has-error\"{% endif %}>
                {{ name|default('(no name)') }}
            </span>
        </div>

        {% if data.children is not empty %}
            <ul id=\"{{ data.id }}-children\" {% if not is_root and not data.has_children_error|default(false) %}class=\"hidden\"{% endif %}>
                {% for childName, childData in data.children %}
                    {{ tree.form_tree_entry(childName, childData, false) }}
                {% endfor %}
            </ul>
        {% endif %}
    </li>
{% endmacro %}

{% macro form_tree_details(name, data, forms_by_hash, show) %}
    {% import _self as tree %}
    <div class=\"tree-details{% if not show|default(false) %} hidden{% endif %}\" {% if data.id is defined %}id=\"{{ data.id }}-details\"{% endif %}>
        <h2 class=\"dump-inline\">
            {{ name|default('(no name)') }} {% if data.type_class is defined %}({{ profiler_dump(data.type_class) }}){% endif %}
        </h2>

        {% if data.errors is defined and data.errors|length > 0 %}
        <div class=\"errors\">
            <h3>
                <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-errors\" href=\"#\">
                    Errors <span class=\"toggle-icon\"></span>
                </a>
            </h3>

            <table id=\"{{ data.id }}-errors\">
                <thead>
                    <tr>
                        <th>Message</th>
                        <th>Origin</th>
                        <th>Cause</th>
                    </tr>
                </thead>
                <tbody>
                {% for error in data.errors %}
                <tr>
                    <td>{{ error.message }}</td>
                    <td>
                        {% if error.origin is empty %}
                            <em>This form.</em>
                        {% elseif forms_by_hash[error.origin] is not defined %}
                            <em>Unknown.</em>
                        {% else %}
                            {{ forms_by_hash[error.origin].name }}
                        {% endif %}
                    </td>
                    <td>
                        {% if error.trace %}
                            <span class=\"newline\">Caused by:</span>
                            {% for stacked in error.trace %}
                                {{ profiler_dump(stacked) }}
                            {% endfor %}
                        {% else %}
                            <em>Unknown.</em>
                        {% endif %}
                    </td>
                </tr>
                {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}

        {% if data.default_data is defined %}
        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-default_data\" href=\"#\">
                Default Data <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"{{ data.id }}-default_data\">
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Model Format</th>
                        <td>
                            {% if data.default_data.model is defined %}
                                {{ profiler_dump(data.default_data.model) }}
                            {% else %}
                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            {% endif %}
                        </td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Normalized Format</th>
                        <td>{{ profiler_dump(data.default_data.norm) }}</td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">View Format</th>
                        <td>
                            {% if data.default_data.view is defined %}
                                {{ profiler_dump(data.default_data.view) }}
                            {% else %}
                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            {% endif %}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        {% endif %}

        {% if data.submitted_data is defined %}
        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-submitted_data\" href=\"#\">
                Submitted Data <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"{{ data.id }}-submitted_data\">
        {% if data.submitted_data.norm is defined %}
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">View Format</th>
                        <td>
                            {% if data.submitted_data.view is defined %}
                                {{ profiler_dump(data.submitted_data.view) }}
                            {% else %}
                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            {% endif %}
                        </td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Normalized Format</th>
                        <td>{{ profiler_dump(data.submitted_data.norm) }}</td>
                    </tr>
                    <tr>
                        <th class=\"font-normal\" scope=\"row\">Model Format</th>
                        <td>
                            {% if data.submitted_data.model is defined %}
                                {{ profiler_dump(data.submitted_data.model) }}
                            {% else %}
                                <em class=\"font-normal text-muted\">same as normalized format</em>
                            {% endif %}
                        </td>
                    </tr>
                </tbody>
            </table>
        {% else %}
            <div class=\"empty\">
                <p>This form was not submitted.</p>
            </div>
        {% endif %}
        </div>
        {% endif %}

        {% if data.passed_options is defined %}
        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-passed_options\" href=\"#\">
                Passed Options <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"{{ data.id }}-passed_options\">
            {% if data.passed_options|length %}
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Option</th>
                        <th>Passed Value</th>
                        <th>Resolved Value</th>
                    </tr>
                </thead>
                <tbody>
                {% for option, value in data.passed_options %}
                <tr>
                    <th>{{ option }}</th>
                    <td>{{ profiler_dump(value) }}</td>
                    <td>
                        {% if data.resolved_options[option] == value %}
                            <em class=\"font-normal text-muted\">same as passed value</em>
                        {% else %}
                            {{ profiler_dump(data.resolved_options[option]) }}
                        {% endif %}
                    </td>
                </tr>
                {% endfor %}
                </tbody>
            </table>
            {% else %}
                <div class=\"empty\">
                    <p>No options where passed when constructing this form.</p>
                </div>
            {% endif %}
        </div>
        {% endif %}

        {% if data.resolved_options is defined %}
        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-resolved_options\" href=\"#\">
                Resolved Options <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"{{ data.id }}-resolved_options\" class=\"hidden\">
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Option</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                {% for option, value in data.resolved_options %}
                <tr>
                    <th scope=\"row\">{{ option }}</th>
                    <td>{{ profiler_dump(value) }}</td>
                </tr>
                {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}

        {% if data.view_vars is defined %}
        <h3>
            <a class=\"toggle-button\" data-toggle-target-id=\"{{ data.id }}-view_vars\" href=\"#\">
                View Variables <span class=\"toggle-icon\"></span>
            </a>
        </h3>

        <div id=\"{{ data.id }}-view_vars\" class=\"hidden\">
            <table>
                <thead>
                    <tr>
                        <th width=\"180\">Variable</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                {% for variable, value in data.view_vars %}
                <tr>
                    <th scope=\"row\">{{ variable }}</th>
                    <td>{{ profiler_dump(value) }}</td>
                </tr>
                {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}
    </div>

    {% for childName, childData in data.children %}
        {{ tree.form_tree_details(childName, childData, forms_by_hash) }}
    {% endfor %}
{% endmacro %}
", "@WebProfiler/Collector/form.html.twig", "/var/www/html/HUmanBeing/vendor/symfony/symfony/src/Symfony/Bundle/WebProfilerBundle/Resources/views/Collector/form.html.twig");
    }
}
