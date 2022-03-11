import { useCallback, useEffect, useRef, useState } from "react";

import Modeler from "bpmn-js/lib/Modeler";

import zeebeModdlePackage from "zeebe-bpmn-moddle/resources/zeebe";
import zeebeModdleExtension from "zeebe-bpmn-moddle/lib";

import {
  BpmnPropertiesPanelModule as propertiesPanelModule,
  BpmnPropertiesProviderModule as bpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule as zeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';

import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import {
  pathParse,
  pathStringify
} from '@philippfromme/moddle-helpers';

import { has } from 'min-dash';

import "./styles.css";

const diagram = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0pvrnhd" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.0.0-alpha.1-linting-7" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="1.3.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_09sex17</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_09sex17" sourceRef="StartEvent_1" targetRef="BusinessRuleTask_1" />
    <bpmn:endEvent id="EndEvent_1">
      <bpmn:incoming>Flow_12suhn4</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_12suhn4" sourceRef="BusinessRuleTask_1" targetRef="EndEvent_1" />
    <bpmn:businessRuleTask id="BusinessRuleTask_1">
      <bpmn:extensionElements>
        <zeebe:ioMapping>
          <zeebe:input source="= source" target="InputVariable_1" />
        </zeebe:ioMapping>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_09sex17</bpmn:incoming>
      <bpmn:outgoing>Flow_12suhn4</bpmn:outgoing>
    </bpmn:businessRuleTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_12suhn4_di" bpmnElement="Flow_12suhn4">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="432" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_09sex17_di" bpmnElement="Flow_09sex17">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_06z1km1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="432" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0ixo7m2_di" bpmnElement="BusinessRuleTask_1">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const MODES = {
  SHOW_ENTRY: 'showEntry',
  SHOW_ERROR: 'showError'
}

export default function App() {
  const ref = useRef();

  const propertiesPanelRef = useRef();

  const [modeler, setModeler] = useState();
  const [imported, setImported] = useState(false);
  const [elements, setElements ] = useState([]);
  const [mode, setMode] = useState(MODES.SHOW_ENTRY);
  const [elementId, setElementId] = useState("BusinessRuleTask_1");
  const [entryPath, setEntryPath] = useState("name");
  const [error, setError] = useState("Must not be empty.");

  useEffect(() => {
    if (!modeler) {
      return;
    }

    const eventBus = modeler.get('eventBus');

    const updateElements = () => {
      const elementRegistry = modeler.get("elementRegistry");

      setElements(elementRegistry.getAll());
    };

    updateElements();

    eventBus.on('elements.changed', updateElements);

    return () => eventBus.off('elements.changed', updateElements);
  }, [modeler]);

  useEffect(() => {
    (async () => {
      const _modeler = new Modeler({
        container: ref.current,
        additionalModules: [
          bpmnPropertiesProviderModule,
          propertiesPanelModule,
          zeebeModdleExtension,
          zeebePropertiesProviderModule
        ],
        propertiesPanel: {
          parent: propertiesPanelRef.current
        },
        moddleExtensions: {
          zeebe: zeebeModdlePackage
        }
      });
  
      await _modeler.importXML(diagram).then(() => setImported(true));
  
      setModeler(_modeler);
    })();
  }, []);

  const onClick = useCallback(() => {
    const canvas = modeler.get('canvas'),
          elementRegistry = modeler.get('elementRegistry'),
          eventBus = modeler.get('eventBus'),
          selection = modeler.get('selection');
  
    const element = elementRegistry.get(elementId);
  
    if (element !== canvas.getRootElement()) {
      canvas.scrollToElement(element);
    }
  
    selection.select(element);
  
    if (mode === MODES.SHOW_ENTRY) {
      eventBus.fire('propertiesPanel.showEntry', {
        focus: true,
        id: elementId,
        path: pathParse(entryPath)
      });
    } else if (mode === MODES.SHOW_ERROR) {
      eventBus.fire('propertiesPanel.showError', {
        message: error,
        focus: true,
        id: elementId,
        path: pathParse(entryPath)
      });
    }
  }, [modeler, elementId, entryPath, error, mode]);

  const showImplementationSelect = () => {
    const canvas = modeler.get('canvas'),
          elementRegistry = modeler.get('elementRegistry'),
          eventBus = modeler.get('eventBus'),
          selection = modeler.get('selection');
  
    const element = elementRegistry.get(elementId);
  
    canvas.scrollToElement(element);
  
    selection.select(element);

    eventBus.fire('propertiesPanel.showError', {
      error: 'Must have an implementation.',
      focus: true,
      id: elementId,
      options: {
        type: 'missingExtensionElement',
        missingExtensionElementType: 'zeebe:TaskDefinition'
      }
    });
  };

  let entryPathOptions = [
    'name',
    'id',
    'isExecutable',
    'extensionElements.values.0.inputParameters.0.target',
    'extensionElements.values.1.type'
  ];

  if (!entryPathOptions.includes(entryPath)) {
    entryPathOptions = [
      entryPath,
      ...entryPathOptions
    ];
  }

  return (
    <>
      <div id="container" ref={ref}></div>
      <div id="properties-panel-container" ref={propertiesPanelRef}></div>
      {imported && (
        <div id="controls">
          <div className="controls-entry">
            <label htmlFor="element-id">Element</label>
            <select
              id="element-id"
              value={elementId}
              onChange={({ target }) => setElementId(target.value)}
            >
              {elements.map(({ id }) => {
                return (
                  <option key={id} value={id}>
                    {id}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="controls-entry">
            <label htmlFor="mode">Event</label>
            <select
              id="mode"
              value={mode}
              onChange={({ target }) => setMode(target.value)}
            >
              {[
                { id: MODES.SHOW_ENTRY, label: 'Show Entry (propertiesPanel.showEntry)' },
                { id: MODES.SHOW_ERROR, label: 'Show Error (propertiesPanel.showError)' }
              ].map(({ id, label }) => {
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="controls-entry">
            <label htmlFor="entry-path-input">Enter Entry Path</label>
            <input
              id="entry-path-input"
              spellCheck="false"
              type="text"
              value={entryPath}
              placeholder="name"
              onInput={({ target }) => setEntryPath(target.value)}
            />
          </div>
          <div className="controls-entry">
            <label htmlFor="entry-path-select">Select Entry Path</label>
            <select
              id="entry-path-select"
              value={entryPath}
              onChange={({ target }) => setEntryPath(target.value)}
            >
              {entryPathOptions.map((id) => {
                return (
                  <option key={id} value={id}>
                    {id}
                  </option>
                );
              })}
            </select>
          </div>
          {
            mode === MODES.SHOW_ERROR && (
              <div className="controls-entry">
                <label htmlFor="error">Error</label>
                <input
                  id="error"
                  spellCheck="false"
                  type="text"
                  value={error}
                  placeholder="Must not be empty."
                  onInput={({ target }) => setError(target.value)}
                />
              </div>
            )
          }
          <div className="controls-entry">
            <button onClick={onClick}>Show { mode === MODES.SHOW_ERROR ? 'Error' : 'Entry' }</button>
          </div>
          <div className="controls-entry">
            <button onClick={showImplementationSelect}>Show <i>Implementation</i> Select</button>
          </div>
        </div>
      )}
    </>
  );
}