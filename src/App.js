import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import Modeler from 'bpmn-js/lib/Modeler';

import { Linter } from '@camunda/linting';
import lintingModule from '@camunda/linting/modeler';
import '@camunda/linting/assets/linting.css';

import zeebeModdlePackage from 'zeebe-bpmn-moddle/resources/zeebe';
import zeebeModdleExtension from 'zeebe-bpmn-moddle/lib';

import {
  BpmnPropertiesPanelModule as propertiesPanelModule,
  BpmnPropertiesProviderModule as bpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule as zeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';

import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import './styles.css';

import diagram from './diagram.js';

// query parameters
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const viewbox = urlParams.get('viewbox');

if (viewbox) {
  window.viewbox = viewbox;
}

const variant = urlParams.get('variant') || '1';

document.body.classList.add(`variant-${ variant }`);

window.variant = variant;

const position = urlParams.get('position') || 'bottom';

window.position = position;

const opacity = urlParams.get('opacity') || '0';

document.body.classList.add(`opacity-${ opacity }`);

const number = urlParams.get('number') || '0';

document.body.classList.add(`number-${ number }`);

window.number = number;

const toggle = urlParams.get('toggle') || '0';

window.toggle = toggle;

// linter
const linter = new Linter({
  modeler: 'web'
});

export default function App() {
  const ref = useRef();

  const propertiesPanelRef = useRef();

  const [ modeler, setModeler ] = useState();

  const [ reports, setReports ] = useState([]);

  const [ selectedReport, setSelectedReport ] = useState();

  const reportsRef = useRef([]);

  const [ lintingActive, setLintingActive ] = useState(true);

  const toggleLinting = () => {
    if (modeler) {
      if (lintingActive) {
        modeler.get('linting').deactivate();
      } else {
        modeler.get('linting').activate();
      }
    }

    setLintingActive(!lintingActive);
  };

  useEffect(() => {
    (async () => {
      const modeler = new Modeler({
        container: ref.current,
        additionalModules: [
          bpmnPropertiesProviderModule,
          propertiesPanelModule,
          zeebeModdleExtension,
          zeebePropertiesProviderModule,
          lintingModule
        ],
        propertiesPanel: {
          parent: propertiesPanelRef.current
        },
        moddleExtensions: {
          zeebe: zeebeModdlePackage
        },
        keyboard: {
          bindTo: document
        }
      });

      await modeler.importXML(diagram);

      setModeler(modeler);

      if (window.viewbox) {
        setViewbox(modeler, window.viewbox);
      }

      const lint = async () => {
        const reports = await linter.lint(modeler.getDefinitions());

        console.log('reports', reports);

        setReports(reports);
        reportsRef.current = reports;

        modeler.get('linting').setErrors(reports);
      };

      lint();

      modeler.on('commandStack.changed', () => {
        lint();
      });

      modeler.on('lintingAnnotations.click', ({ report }) => {
        setSelectedReport(report);
      });

      modeler.on('selection.changed', ({ newSelection }) => {
        setSelectedReport(null);
      });

      window.modeler = modeler;
    })();
  }, []);


  useEffect(() => {
    setSelectedReport(null);
  }, [ reports ]);

  const onClick = (report) => () => {
    modeler.get('linting').showError(report);

    setSelectedReport(report);
  };

  return (
    <>
      <div id="modeler">
        <div id="container" ref={ ref }></div>
        <div id="properties-panel-container">
          <div className="properties-panel-container__inner" ref={ propertiesPanelRef }></div>
        </div>
      </div>
      <div id="linting" className={ classNames('panel', { open: lintingActive }) }>
        <div className="panel__links">
          <button className="panel__link panel__link--active">
            <span className="panel__link-label">
              Problems
            </span>
            <span className="panel__link-number">
              { reports.length }
            </span>
          </button>
        </div>
        {
          lintingActive && <div className="panel__body">
            <div className="panel__inner">
              {
                sortReports(reports).map((report => {
                  const {
                    id,
                    message
                  } = report;

                  return (
                    <LintingReport
                      key={ `${ id }-${ message }` }
                      report={ report }
                      selected={ selectedReport && selectedReport === report }
                      onClick={ onClick(report) } />
                  );
                }))
              }
            </div>
          </div>
        }
      </div>
      <div className="status-bar">
        <span className="execution-platform">Camunda Platform 8.0</span>
        <button className={ classNames({
          'has-errors': !!reports.length,
          'active': lintingActive
        }) } onClick={ toggleLinting }>
          <svg viewBox="0 0 24 24">
            <path d="M12,5 C15.8659932,5 19,8.13400675 19,12 C19,15.8659932 15.8659932,19 12,19 C8.13400675,19 5,15.8659932 5,12 C5,8.13400675 8.13400675,5 12,5 Z M9.33333333,8 L8,9.33333333 L10.667,12 L8,14.6666667 L9.33333333,16 L12,13.333 L14.6666667,16 L16,14.6666667 L13.333,12 L16,9.33333333 L14.6666667,8 L12,10.666 L9.33333333,8 Z"></path>
          </svg>
          { `${ reports.length } ${ reports.length === 1 ? 'problem' : 'problems' }` }
        </button>
      </div>
    </>
  );
}

function LintingReport(props) {
  const {
    onClick,
    report,
    selected
  } = props;

  const {
    id,
    label,
    message
  } = report;

  const ref = useRef();

  useEffect(() => {
    if (selected) {
      ref.current && ref.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [ selected ]);

  return <div ref={ ref } className={ classNames('linting-issue', {
    'linting-issue--selected': selected
  }) }>
    <div className="linting-issue__icon">
      <svg viewBox="0 0 24 24">
        <path d="M12,5 C15.8659932,5 19,8.13400675 19,12 C19,15.8659932 15.8659932,19 12,19 C8.13400675,19 5,15.8659932 5,12 C5,8.13400675 8.13400675,5 12,5 Z M9.33333333,8 L8,9.33333333 L10.667,12 L8,14.6666667 L9.33333333,16 L12,13.333 L14.6666667,16 L16,14.6666667 L13.333,12 L16,9.33333333 L14.6666667,8 L12,10.666 L9.33333333,8 Z"></path>
      </svg>
    </div>
    <div className="linting-issue__text">
      Error : <span className="linting-issue__link" onClick={ onClick }>{ label || id }</span> - <span className="linting-issue__message">{ message }</span>
    </div>
  </div>;
}

function sortReports(issues) {
  return issues.sort((a, b) => {
    const labelA = (a.name || a.id).toLowerCase(),
          labelB = (b.name || b.id).toLowerCase();

    if (labelA === labelB) {
      return 0;
    } else if (labelA < labelB) {
      return -1;
    } else {
      return 1;
    }
  });
}

function setViewbox(modeler, viewBox) {
  const canvas = modeler.get('canvas');

  const [ x, y, width, height ] = viewBox.split('-');

  canvas.viewbox({
    x,
    y,
    width,
    height
  });
}