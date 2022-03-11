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
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0eb4e4b" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.12.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="1.1.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>SequenceFlow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="ServiceTask_1" />
    <bpmn:endEvent id="EndEvent_1">
      <bpmn:incoming>SequenceFlow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_2" sourceRef="ServiceTask_1" targetRef="EndEvent_1" />
    <bpmn:serviceTask id="ServiceTask_1">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="foo" retries="bar" />
        <zeebe:ioMapping>
          <zeebe:input source="= source" target="InputVariable_1" />
          <zeebe:input source="= source" target="InputVariable_2" />
        </zeebe:ioMapping>
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_1</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_2</bpmn:outgoing>
    </bpmn:serviceTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_0vlt3e2_di" bpmnElement="SequenceFlow_2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="432" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_12jbanz_di" bpmnElement="SequenceFlow_1">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1wdj3mr_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="432" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_158g8sh_di" bpmnElement="ServiceTask_1">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const MODES = {
  SHOW_ENTRY: 'showEntry',
  SHOW_ERROR: 'showError',
  SHOW_GROUP: 'showGroup'
}

export default function App() {
  const ref = useRef();

  const propertiesPanelRef = useRef();

  const [modeler, setModeler] = useState();
  const [imported, setImported] = useState(false);
  const [elements, setElements ] = useState([]);
  const [mode, setMode] = useState(MODES.SHOW_ENTRY);
  const [elementId, setElementId] = useState("ServiceTask_1");
  const [entryPath, setEntryPath] = useState("name");
  const [groupId, setGroupId] = useState("taskDefinition");
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

  const showEntry = () => {
    modeler.get("eventBus").fire("propertiesPanel.showEntry", {
      path: pathParse(entryPath),
      focus: true
    });
  };

  const showError = () => {
    modeler.get("eventBus").fire("propertiesPanel.showError", {
      path: pathParse(entryPath),
      error,
      focus: true
    });
  };

  const showGroup = () => {
    modeler.get("eventBus").fire("propertiesPanel.showGroup", {
      id: groupId,
      focus: true
    });
  }

  const onClick = useCallback(() => {
    const element = modeler.get("elementRegistry").get(elementId);

    const canvas = modeler.get('canvas'),
          eventBus = modeler.get('eventBus'),
          selection = modeler.get('selection');

    const selectedElements = selection.get();

    if (
      (!selectedElements.length && element === canvas.getRootElement())
      || (selectedElements.length === 1 && selectedElements[ 0 ] === element)
    ) {
      if (mode === MODES.SHOW_ENTRY) {
        showEntry();
      } else if (mode === MODES.SHOW_ERROR) {
        showError();
      } else if (mode === MODES.SHOW_GROUP) {
        showGroup();
      }
    } else {
      eventBus.once('selection.changed', () => {
        
        console.log('selection.changed');

        const onSubscribed = (event) => {
          console.log('subscribed', event);

          if (mode === MODES.SHOW_ENTRY && event.event === 'propertiesPanel.showEntry' && matchingPath(event, pathParse(entryPath))) {
            showEntry();

            eventBus.off('propertiesPanel.subscribed', onSubscribed);
          } else if (mode === MODES.SHOW_ERROR && event.event === 'propertiesPanel.showError' && matchingPath(event, pathParse(entryPath))) {
            showError();

            eventBus.off('propertiesPanel.subscribed', onSubscribed);
          } else if (mode === MODES.SHOW_GROUP && event.event === 'propertiesPanel.showGroup' && event.id === groupId) {
            showGroup();

            eventBus.off('propertiesPanel.subscribed', onSubscribed);
          }
        };

        eventBus.on('propertiesPanel.subscribed', onSubscribed);
      });
  
      selection.select(element);
    }
  }, [modeler, elementId, entryPath, error, mode]);

  let entryPathOptions = [
    'name',
    'id',
    'extensionElements.values.0.type',
    'extensionElements.values.1.inputParameters.0.target'
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
                { id: MODES.SHOW_ERROR, label: 'Show Error (propertiesPanel.showError)' },
                { id: MODES.SHOW_GROUP, label: 'Show Group (propertiesPanel.showGroup)' }
              ].map(({ id, label }) => {
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
          {
            mode !== MODES.SHOW_GROUP && (
              <>
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
              </>
            )
          }
          {
            mode === MODES.SHOW_GROUP && (
              <div className="controls-entry">
                <label htmlFor="group-id-input">Enter Group ID</label>
                <input
                  id="group-id-input"
                  spellCheck="false"
                  type="text"
                  value={groupId}
                  placeholder="general"
                  onInput={({ target }) => setGroupId(target.value)}
                />
              </div>
            )
          }
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
            <button onClick={onClick}>Show { error && error.length ? 'Error' : 'Entry' }</button>
          </div>
        </div>
      )}
    </>
  );
}

function matchingPath(event, path) {
  return has(event, 'path') && path && pathStringify(event.path) === pathStringify(path);
}