/* global JSZip saveAs */

let haikunate = require('haikunator');
let url = require('url');
let cx = require('classnames');

import React from 'react';
import ReactDOM from 'react-dom';
import {isArray, forOwn, clone} from 'lodash';

import InlineSvg from './InlineSvg';

const dependencies = {
  node: {
    framework: ['express', 'hapi', 'sails', 'meteor'],
    templateEngine: ['jade', 'handlebars', 'nunjucks', 'none'],
    cssFramework: ['bootstrap', 'foundation', 'bourbonNeat'],
    cssFrameworkOptions: ['css', 'less', 'sass'],
    cssPreprocessor: ['css', 'less', 'sass'],

  },
  html5: {
    framework: null,
    templateEngine: null,
    appName: null,
    cssFramework: ['bootstrap', 'foundation', 'bourbonNeat'],
    cssFrameworkOptions: ['css'],
    cssPreprocessor: ['css'],
    cssBuildOptions: null,
    database: null,
    jsFramework: ['react', 'angular', 'none'],
    reactOptions: null,
    reactBuildSystem: null,
    deployment: null
  },

  css: ['none', 'bootstrap', 'foundation', 'bourbonNeat'],
  sass: ['none', 'bootstrap', 'foundation', 'bourbonNeat'],
  less: ['none', 'bootstrap'],
  stylus: ['none'],
  cssnext: ['none'],

  cssBuildOptions: ['less', 'sass', 'stylus', 'cssnext']
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.clickDownload = this.clickDownload.bind(this);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);

    this.state = {
      platform: null,
      framework: null,
      appName: null,
      templateEngine: null,
      cssFramework: null,
      cssPreprocessor: null,
      cssBuildOptions: null,
      database: null,
      authentication: null,
      jsFramework: null,
      reactOptions: null,
      reactBuildSystem: null,
      deployment: null
    };
  }

  componentDidUpdate() {
    $(ReactDOM.findDOMNode(this)).find('[data-toggle="popover"]').popover({ trigger: 'hover' });
  }

  clickDownload() {
    let state = this.state;
    let downloadBtn = this.refs.downloadBtn;
    //$(downloadBtn).attr('disabled', 'disabled');


    // Google Analytics event
    //ga("send","event","Customize","Download","Customize and Download")


    //$.when(
    //  generateCSS(preamble),
    //  generateJS(preamble),
    //  generateFonts()
    //).done(function (css, js, fonts) {
    //  generateZip(css, js, fonts, configJson, function(blob) {
    //    $(downloadBtn).removeAttr('disabled');
    //    setTimeout(function () {
    //      saveAs(blob, 'bootstrap.zip')
    //    }, 0)
    //  })
    //});

    let data = clone(state);
    data.appName = haikunate({ tokenLength: 0 });
    data.authentication = Array.from(data.authentication);

    $.ajax({
        url: '/download',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      })
      .success((response, status, request) => {
        $(downloadBtn).removeAttr('disabled');

        var disp = request.getResponseHeader('Content-Disposition');
        if (disp && disp.search('attachment') != -1) {
          var form = $('<form method="POST" action="/download">');
          $.each(data, function(k, v) {
            form.append($('<input type="hidden" name="' + k +
              '" value="' + v + '">'));
          });
          $('body').append(form);
          form.submit();
        }
      });
  }

  handleAppNameChange(e) {
    let state = this.state;
    state.appName = e.target.value;
    this.setState(state);
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let isChecked = e.target.checked;
    let state = this.state;
    switch (name) {
      case 'platformRadios':
        state.platform = value;
        break;

      case 'frameworkRadios':
        if (dependencies[state.platform].framework.includes(value)) {
          state.framework = value;
        } else {
          state.framework = null;
        }
        break;

      case 'templateEngineRadios':
        if (dependencies[state.platform].templateEngine.includes(value)) {
          state.templateEngine = value;
        } else {
          state.templateEngine = null;
        }
        break;

      case 'cssFrameworkRadios':
        state.cssFramework = value;
        break;

      case 'cssPreprocessorRadios':
        if (value === 'none') {
          delete state.cssBuildOptions;
        }
        state.cssPreprocessor = value;
        break;
      case 'cssBuildOptionsRadios':
        state.cssBuildOptions = value;
        break;
      case 'databaseRadios':
        if (value === 'none') {
          state.authentication.clear();
          state.authentication.add('none');
        }
        state.database = value;
        break;
      case 'authenticationCheckboxes':
        state.authentication = state.authentication || new Set();
        if (isChecked) {
          if (value === 'none') {
            state.authentication.clear();
          } else {
            state.authentication.add(value);
          }
        } else {
          state.authentication.delete(value);
        }
        break;
      case 'jsFrameworkRadios':
        state.jsFramework = value;
        break;
      case 'reactOptionsCheckboxes':
        state.reactOptions = state.reactOptions || new Set();
        if (isChecked) {
          state.reactOptions.add(value);
        } else {
          state.reactOptions.delete(value);
        }
        break;
      case 'reactBuildSystemRadios':
        state.reactBuildSystem = value;
        break;
      case 'deploymentRadios':
        state.deployment = value;
        break;
    }

    //// Cleanup
    //forOwn(dependencies[state.platform], function (value, key) {
    //  if (!isArray(dependencies[state.platform][key])) {
    //    state[key] = null;
    //  }
    //});


    console.log(state);

    this.setState(state);
  }

  handleThemeClick(theme) {
    let state = this.state;
    state.theme = theme;
    this.setState(state);
  }

  render() {
    let state = this.state;

    let platform = (
      <section className={cx('fadeIn', 'animated', state.platform)}>
        <h6><InlineSvg name="platform" width="18px" height="20px"/> {state.platform || 'Platform'}</h6>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/node-logo.svg" alt="Node.js Logo"/>
          <input type="radio" id="nodeRadio" name="platformRadios" value="node" onChange={this.handleChange} defaultChecked={state.platform === 'node'} /> Node.js
        </label>
        <ul className="nav nav-stacked" id="platformAccordion">
          <li>
            <a data-toggle="collapse" data-parent="#platformAccordion" href="#platformCollapse1">
              <i className="ion-help-circled"/>
              Support for other languages?
            </a>
            <div id="platformCollapse1" className="collapse">
              <div className="panel-collapse">
                Currently <strong>Node.js</strong> is the only supported platform. Adding support for <strong>Ruby</strong>, <strong>Python</strong>, <strong>PHP</strong>, <strong>C#</strong> and other languages might be tedious, but not difficult. GitHub contributions and pull requests are welcome!
              </div>
            </div>
          </li>
        </ul>
      </section>
    );

    let framework = state.platform && isArray(dependencies[state.platform].framework) ? (
      <section className={cx('fadeIn', 'animated', state.framework)}>
        <h6><InlineSvg name="framework" width="18px" height="20px"/> {state.framework || 'Framework'}</h6>
        <br/>
        <label className="radio-inline">
          <span className="express-logo">Express</span>
          <input type="radio" id="expressRadio" name="frameworkRadios" value="express" onChange={this.handleChange} defaultChecked={state.framework === 'express'} /> Express
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/hapi-logo.png" alt="Hapi Logo"/>
          <input type="radio" name="frameworkRadios" value="hapi" onChange={this.handleChange} defaultChecked={state.framework === 'hapi'} /> Hapi
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/sails-logo.png" alt="Sails.js Logo"/>
          <input type="radio" name="frameworkRadios" value="sails" onChange={this.handleChange} defaultChecked={state.framework === 'sails'} /> Sails.js
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/meteor-logo.png" alt="Meteor Logo"/>
          <input type="radio" name="frameworkRadios" value="meteor" onChange={this.handleChange} defaultChecked={state.framework === 'meteor'} /> Meteor
        </label>

        <div className="row">
          <div className="col-sm-6">

            <ul className="nav nav-stacked" id="frameworkAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#frameworkAccordion" href="#frameworkCollapse1">
                  <i className="ion-help-circled"/>
                  Which framework is right for me?
                </a>
                <div id="frameworkCollapse1" className=" collapse">
                  <div className="panel-collapse">
                    lorem ipsum dolor
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#frameworkAccordion" href="#frameworkCollapse1">
                  <i className="ion-help-circled"/>
                  Hapi vs Express?
                </a>
                <div id="frameworkCollapse1" className=" collapse">
                  <div className="panel-collapse">
                    lorem ipsum dolor
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#frameworkAccordion" href="#frameworkCollapse1">
                  <i className="ion-help-circled"/>
                  Should I use Meteor or Sails.js for real-time apps?
                </a>
                <div id="frameworkCollapse1" className=" collapse">
                  <div className="panel-collapse">
                    lorem ipsum dolor
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </section>
    ) : null;

    let templateEngine = state.framework && isArray(dependencies[state.platform].templateEngine) ? (
      <section className={cx('fadeIn', 'animated', state.templateEngine)}>
        <h6><InlineSvg name="template-engine"/> {!state.templateEngine || state.templateEngine === 'none' ? 'Template Engine' : state.templateEngine}</h6>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/jade-logo.svg" height="60" alt="Jade Logo"/>
          <input type="radio" name="templateEngineRadios" value="jade" onChange={this.handleChange} checked={state.templateEngine === 'jade'}/> Jade
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/handlebars-logo.svg" alt="Handlebars Logo"/>
          <input type="radio" name="templateEngineRadios" value="handlebars" onChange={this.handleChange} checked={state.templateEngine === 'handlebars'}/> Handlebars
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/nunjucks-logo.png" alt="Nunjucks Logo"/>
          <input type="radio" name="templateEngineRadios" value="nunjucks" onChange={this.handleChange} checked={state.templateEngine === 'nunjucks'}/> Nunjucks
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/none.png"/>
          <input type="radio" name="templateEngineRadios" value="none" onChange={this.handleChange} checked={state.templateEngine === 'none'}/> None
        </label>

        <div className="row">
          <div className="col-sm-6">

            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />What's a template engine?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />When should I use a template engine?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>

              <li>
                <a data-toggle="collapse" data-parent="#accordion" href="#templateEngineCollapse2">
                  <i className="ion-help-circled" />Jade vs Handlebars vs Nunjucks?
                </a>
                <div id="templateEngineCollapse2" className="panel-collapse collapse">
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
                  moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                  Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                  shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea
                  proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim
                  aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </div>
              </li>
            </ul>


          </div>
        </div>

      </section>
    ) : null;

    let cssFrameworkNoTemplateEngineAlert = (state.cssFramework && state.cssFramework !== 'none' && state.templateEngine === 'none') ? (
      <div className="alert alert-info fadeIn animated">
        <strong>Important!</strong> You have NOT selected a template engine. CSS Framework files are still going to be generated, but you will be responsible for importing these files manually.
      </div>
    ) : null;

    let cssFrameworkOptions = state.cssFramework && state.cssFramework !== 'none' ? (
      <div>
        <h5 className="subcategory">Framework Options</h5>
        <label className="radio-inline">
          <img className="btn-logo small" src="/img/svg/css3-logo.svg" alt="CSS Logo"/>
          <input type="radio" name="cssFrameworkOptionsRadios" value="css" onChange={this.handleChange} checked={state.cssFrameworkOptions === 'css'} /> CSS
        </label>
        <label className="radio-inline">
          <img className="btn-logo small" src="/img/svg/less-logo.svg" alt="LESS Logo"/>
          <input type="radio" name="cssFrameworkOptionsRadios" value="less" onChange={this.handleChange} checked={state.cssFrameworkOptions === 'less'} /> LESS
        </label>
        <label className="radio-inline">
          <img className="btn-logo small" src="/img/svg/sass-logo.svg" alt="Sass Logo"/>
          <input type="radio" name="cssFrameworkOptionsRadios" value="sass" onChange={this.handleChange} checked={state.cssFrameworkOptions === 'sass'} /> Sass
        </label>

        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  What's the difference between CSS, LESS and Sass?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ) : null;

    let cssFramework = state.templateEngine ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/css-framework.png" alt=""/>CSS Framework</h6>
        {cssFrameworkNoTemplateEngineAlert}
        <label className="radio-inline">
            <img className="btn-logo" src="/img/svg/none.png" />
            <input type="radio" name="cssFrameworkRadios" value="none" onChange={this.handleChange} defaultChecked={state.cssFramework === 'none'} /> None
        </label>
        <label className="radio-inline">
            <img className="btn-logo" src="/img/svg/bootstrap-logo.svg" alt="Bootstrap Logo"/>
            <input type="radio" name="cssFrameworkRadios" value="bootstrap" onChange={this.handleChange} defaultChecked={state.cssFramework === 'bootstrap'} /> Bootstrap
        </label>
        <label className="radio-inline">
            <img className="btn-logo" src="/img/svg/foundation-logo.svg" alt="Foundation Logo"/>
            <input type="radio" name="cssFrameworkRadios" value="foundation" onChange={this.handleChange} defaultChecked={state.cssFramework === 'foundation'} /> Foundation
        </label>
        <label className="radio-inline">
            <img className="btn-logo" src="/img/svg/bourbon-logo.svg" alt="Bourbon Neat Logo"/>
            <input type="radio" name="cssFrameworkRadios" value="bourbonNeat" onChange={this.handleChange} defaultChecked={state.cssFramework === 'bourbonNeat'} /> Bourbon Neat
        </label>



        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Should I use a CSS Framework?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Which CSS framework is the best?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </section>
    ) : null;

    let cssRadio = dependencies.css.includes(state.cssFramework) ? (
      <label className="radio-inline">
        <img className="btn-logo" src="/img/svg/css3-logo.svg" alt="CSS Logo"/>
        <input type="radio" name="cssPreprocessorRadios" value="css" onChange={this.handleChange} checked={state.cssPreprocessor === 'css'} /> None / CSS
      </label>
    ) : null;
    let sassRadio = dependencies.sass.includes(state.cssFramework) ? (
      <label className="radio-inline">
        <img className="btn-logo" src="/img/svg/sass-logo.svg" alt="Sass Logo"/>

        <input type="radio" name="cssPreprocessorRadios" value="sass" onChange={this.handleChange} checked={state.cssPreprocessor === 'sass'} /> Sass
      </label>
    ) : null;
    let lessRadio = dependencies.less.includes(state.cssFramework) ? (
      <label className="radio-inline">
        <img className="btn-logo" src="/img/svg/less-logo.svg" alt="LESS Logo"/>

        <input type="radio" name="cssPreprocessorRadios" value="less" onChange={this.handleChange} checked={state.cssPreprocessor === 'less'} /> LESS
      </label>
    ) : null;
    let cssnextRadio = dependencies.cssnext.includes(state.cssFramework) ? (
      <label className="radio-inline">
        <img className="btn-logo" src="/img/svg/cssnext-logo.svg" height="60" alt="cssnext Logo"/>
        <input type="radio" name="cssPreprocessorRadios" value="cssnext" onChange={this.handleChange} checked={state.cssPreprocessor === 'cssnext'} /> cssnext
      </label>
    ) : null;
    let stylusRadio = dependencies.stylus.includes(state.cssFramework) ? (
      <label className="radio-inline">
        <img className="btn-logo" src="/img/svg/stylus-logo.svg" alt="Stylus Logo"/>
        <input type="radio" name="cssPreprocessorRadios" value="stylus" onChange={this.handleChange} checked={state.cssPreprocessor === 'stylus'} /> Stylus
      </label>
    ) : null;

    let cssPreprocessor = state.cssFramework ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/css-preprocessor.png" alt=""/>CSS Preprocessor</h6>
        {cssRadio}
        {sassRadio}
        {lessRadio}
        {stylusRadio}
        {cssnextRadio}

        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  CSS Preprocessor Comparison
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    ) : null;

    let cssBuildOptions = dependencies.cssBuildOptions.includes(state.cssPreprocessor) ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/css-build-options2.png" alt=""/>CSS Build Options</h6>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/npm-logo.svg" alt="Middleware Logo"/>
          <input type="radio" name="cssBuildOptionsRadios" value="middleware" onChange={this.handleChange} defaultChecked={state.cssBuildOptions === 'middleware'} /> Middleware
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/gulp-logo.png" alt="Gulp Logo"/>
          <input type="radio" name="cssBuildOptionsRadios" value="gulp" onChange={this.handleChange} defaultChecked={state.cssBuildOptions === 'gulp'} /> Gulp
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/webpack-logo.svg" alt="Webpack Logo"/>

          <input type="radio" name="cssBuildOptionsRadios" value="webpack" onChange={this.handleChange} defaultChecked={state.cssBuildOptions === 'webpack'} /> Webpack
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/grunt-logo.svg" alt="Grunt Logo"/>
          <input type="radio" name="cssBuildOptionsRadios" value="grunt" onChange={this.handleChange} defaultChecked={state.cssBuildOptions === 'grunt'} /> Grunt
        </label>

        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Gulp vs Webpack vs Grunt?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Should I use middleware?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    ) : null;

    let database = state.cssFramework ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/database.png" alt=""/>Database</h6>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/none.png" alt="None Icon" />
          <input type="radio" name="databaseRadios" value="none" onChange={this.handleChange} defaultChecked={state.database === 'none'} /> None
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/mongodb-logo.svg" />

          <input type="radio" name="databaseRadios" value="mongodb" onChange={this.handleChange} defaultChecked={state.database === 'mongodb'} /> MongoDB
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/mysql-logo.svg" />

          <input type="radio" name="databaseRadios" value="mysql" onChange={this.handleChange} defaultChecked={state.database === 'mysql'} /> MySQL
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/postgresql-logo.svg" />

          <input type="radio" name="databaseRadios" value="postgresql" onChange={this.handleChange} defaultChecked={state.database === 'postgresql'} /> PostgreSQL
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/rethinkdb-logo.svg" />

          <input type="radio" name="databaseRadios" value="rethinkdb" onChange={this.handleChange} defaultChecked={state.database === 'rethinkdb'} /> RethinkDB
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>

        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Do I need a database?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Database Comparison
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </section>
    ) : null;

    let authenticationCheckboxes = state.database === 'none' ? (
      <div className="alert alert-info">
        <strong>Important!</strong> To enable authentication you must choose a database.
      </div>
    ) : (
      <div>
        <label className="checkbox-inline">
          <img className="btn-logo" src="/img/svg/none.png" alt="None Icon" />
          <input type="checkbox" name="authenticationCheckboxes" value="none" onChange={this.handleChange} checked={state.authentication && state.authentication.size === 0} disabled={state.database === 'none'} /> None
        </label>
        <label className="checkbox-inline">
          <img className="btn-logo" src="/img/svg/passportjs-logo.svg" height="60" />
          <input type="checkbox" name="authenticationCheckboxes" value="email" onChange={this.handleChange} checked={state.authentication && state.authentication.has('email')} disabled={state.database === 'none'} /> Email / Password
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/facebook-logo.svg" />
          <input type="checkbox" name="authenticationCheckboxes" value="facebook" onChange={this.handleChange} checked={state.authentication && state.authentication.has('facebook')} disabled={state.database === 'none'} /> Facebook
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/google-logo.svg" />
          <input type="checkbox" name="authenticationCheckboxes" value="google" onChange={this.handleChange} checked={state.authentication && state.authentication.has('google')} disabled={state.database === 'none'} /> Google
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/twitter-logo.svg" />
          <input type="checkbox" name="authenticationCheckboxes" value="twitter" onChange={this.handleChange} checked={state.authentication && state.authentication.has('twitter')} disabled={state.database === 'none'} /> Twitter
        </label>

        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Is "Forgot Password" included?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
    let authentication = state.database ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/authentication.png" alt=""/>Authentication</h6>
        {authenticationCheckboxes}
      </section>
    ) : null;

    let reactOptions = state.jsFramework === 'react' ? (
      <div className="fadeIn animated">
        <h5 className="subcategory">React Features</h5>
        <label className="checkbox-inline">
          <img className="btn-logo" src="/img/svg/alt-logo.png" />
          <input type="checkbox" name="reactOptionsCheckboxes" value="fluxAlt" onChange={this.handleChange} checked={state.reactOptions.has('fluxAlt')} /> Flux (Alt)
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="checkbox-inline">
          <img className="btn-logo" src="/img/svg/flux-logo.svg" />
          <input type="checkbox" name="reactOptionsCheckboxes" value="fluxRedux" onChange={this.handleChange} checked={state.reactOptions.has('fluxRedux')} /> Flux (Redux)
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/react-router-logo.png" />

          <input type="checkbox" name="reactOptionsCheckboxes" value="reactRouter" onChange={this.handleChange} checked={state.reactOptions.has('reactRouter')} /> React Router
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/relay-logo.svg" />

          <input type="checkbox" name="reactOptionsCheckboxes" value="graphql" onChange={this.handleChange} checked={state.reactOptions.has('graphql')} /> GraphQL + Relay
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/babel-logo.png" />

          <input type="checkbox" name="reactOptionsCheckboxes" value="es6" onChange={this.handleChange} checked={state.reactOptions.has('es6')} /> ES6
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
      </div>
    ) : null;

    let reactBuildSystem = state.jsFramework === 'react' ? (
      <div className="fadeIn animated">
        <h5 className="subcategory">React Build System</h5>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/browserify-logo.svg" />
          <input type="radio" name="reactBuildSystemRadios" value="browserify" onChange={this.handleChange} defaultChecked={state.reactBuildSystem === 'browserify'} /> Browserify / Gulp
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/webpack-logo.svg" />
          <input type="radio" name="reactBuildSystemRadios" value="webpack" onChange={this.handleChange} defaultChecked={state.reactBuildSystem === 'webpack'} /> Webpack
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/none.png" alt="None Icon" />
          <input type="radio" name="reactBuildSystemRadios" value="none" onChange={this.handleChange} defaultChecked={state.reactBuildSystem === 'none'} /> None
        </label>
      </div>
    ) : null;

    let jsFramework = state.database ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/js-framework.png" alt=""/>JavaScript Framework</h6>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/none.png" alt="None Icon" />
          <input type="radio" name="jsFrameworkRadios" value="none" onChange={this.handleChange} defaultChecked={state.jsFramework === 'none'} /> None
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/react-logo.svg" />
          <input type="radio" name="jsFrameworkRadios" value="react" onChange={this.handleChange} defaultChecked={state.jsFramework === 'react'} /> React
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/angularjs-logo.png" />
          <input type="radio" name="jsFrameworkRadios" value="angular" onChange={this.handleChange} defaultChecked={state.jsFramework === 'angular'} /> AngularJS
          <i className="ion-help-circled" data-container="body" data-toggle="popover" data-placement="top" data-content="Lorem" />
        </label>

        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-stacked" id="templateEngineAccordion">
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Should I use a client-side JavaScript Framework?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>

              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  Single Page Application: Advantages and Disadvantages
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
              <li>
                <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
                  <i className="ion-help-circled" />
                  React vs Angular?
                </a>
                <div id="templateEngineCollapse1" className="collapse">
                  <div className="panel-collapse">
                    Select <strong>None</strong> if you are building an API server or a single-page application.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {reactOptions}
        {reactBuildSystem}
      </section>
    ) : null;


    let theme = state.jsFramework ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/theme.png" alt=""/>Theme</h6>
        <div className="row">
          <div className="col-xs-6 col-md-3">
            <a className={cx("thumbnail", { 'active': this.state.theme === 'theme1' })} onClick={this.handleThemeClick.bind(this, 'theme1')}>
              <img src="http://foundry.mediumra.re/img/chooser/fashion.png" />
            </a>
          </div>
          <div className="col-xs-6 col-md-3">
            <a className={cx("thumbnail", { 'active': this.state.theme === 'theme2' })} onClick={this.handleThemeClick.bind(this, 'theme2')}>
              <img src="http://foundry.mediumra.re/img/chooser/classic.png" />
            </a>
          </div>
          <div className="col-xs-6 col-md-3">
            <a className={cx("thumbnail", { 'active': this.state.theme === 'theme3' })} onClick={this.handleThemeClick.bind(this, 'theme3')}>
              <img src="http://foundry.mediumra.re/img/chooser/winery.png" />
            </a>
          </div>
        </div>
      </section>
    ) : null;

    let deployment = state.theme ? (
      <section className="fadeIn animated">
        <h6><img className="category-icon" src="/img/svg/deployment.svg" alt=""/>Deployment</h6>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/heroku-logo.svg" height="60" alt="Heroku Logo"/>
          <input type="radio" name="deploymentRadios" value="heroku" onChange={this.handleChange} defaultChecked={state.deployment === 'heroku'} /> Heroku
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/azure-logo.svg" height="60" alt="Azure Logo"/>
          <input type="radio" name="deploymentRadios" value="azure" onChange={this.handleChange} defaultChecked={state.deployment === 'azure'} /> Microsoft Azure
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/bluemix-logo.svg" alt="IBM Bluemix Logo"/>
          <input type="radio" name="deploymentRadios" value="bluemix" onChange={this.handleChange} defaultChecked={state.deployment === 'bluemix'} /> IBM Bluemix
        </label>
        <label className="radio-inline">
          <img className="btn-logo" src="/img/svg/none.png" />
          <input type="radio" name="deploymentRadios" value="none" onChange={this.handleChange} defaultChecked={state.deployment === 'none'} /> None
        </label>

        <ul className="nav nav-stacked" id="templateEngineAccordion">
          <li>
            <a data-toggle="collapse" data-parent="#templateEngineAccordion" href="#templateEngineCollapse1">
              <i className="ion-help-circled" />
              Pricing Comparison
            </a>
            <div id="templateEngineCollapse1" className="collapse">
              <div className="panel-collapse">
                Select <strong>None</strong> if you are building an API server or a single-page application.
              </div>
            </div>
          </li>
        </ul>
      </section>
    ) : null;

    let summary = state.deployment ? (
      <section>
        <h6><img className="category-icon" src="/img/svg/deployment.svg" alt=""/>Summary</h6>
        <ul>
          <li>Platform <span className="label label-success">{state.platform}</span></li>
          <li>Framework <span className="label label-success">{state.framework}</span></li>
          <li>Template Engine <span className="label label-success">{state.templateEngine}</span></li>
          <li>Framework <span className="label label-success">{state.cssFramework === 'none' ? state.cssFramework : state.cssFramework + ' (' + state.cssFrameworkOptions + ')'}</span></li>
          <li>CSS Preprocessor <span className="label label-success">{state.cssPreprocessor || state.cssFrameworkOptions}</span></li>
          <li>Database <span className="label label-success">{state.database}</span></li>
          <li>Authentication <span className="label label-success">{Array.from(state.authentication).join(', ')}</span></li>
          <li>JS Framework <span className="label label-success">{state.jsFramework}</span></li>
          <li>Theme <span className="label label-success">{state.theme}</span></li>
          <li>Deployment <span className="label label-success">{state.deployment}</span></li>
        </ul>
      </section>
    ) : null;

    let download = (
      <div>
        <br/>
        <button ref="downloadBtn" className="btn btn-block btn-mega" onClick={this.clickDownload}>Compile and Download</button>
      </div>
    );

    return (
      <div className="container">
        <br/>
        {platform}
        {framework}
        {templateEngine}
        {cssFramework}
        {cssPreprocessor}
        {cssBuildOptions}
        {database}
        {authentication}
        {jsFramework}
        {theme}
        {deployment}
        {summary}
        {download}
        <br/>
        <a className="twitter-share-button" href="https://twitter.com/intent/tweet">Tweet</a>&nbsp;
        <a className="twitter-follow-button" href="https://twitter.com/EvNowAndForever" data-show-count="false">
          Follow @EvNowAndForever</a>
      </div>
    );
  }
}

export default Home;
