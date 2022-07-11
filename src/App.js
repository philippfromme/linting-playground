import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import Modeler from 'bpmn-js/lib/Modeler';

import { Linter } from '@camunda/linting';

import zeebeModdlePackage from 'zeebe-bpmn-moddle/resources/zeebe';
import zeebeModdleExtension from 'zeebe-bpmn-moddle/lib';

import {
  BpmnPropertiesPanelModule as propertiesPanelModule,
  BpmnPropertiesProviderModule as bpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule as zeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';

import lintingModule from './features/linting';

import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import './styles.css';

const diagram = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_10h1baj" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.0.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="8.0.0">
  <bpmn:message id="Message_10da3fn" name="Message_1">
    <bpmn:extensionElements>
      <zeebe:subscription correlationKey="foo" />
    </bpmn:extensionElements>
  </bpmn:message>
  <bpmn:message id="Message_0fksgui" name="Message_2" />
  <bpmn:error id="Error_09cos3p" name="Error_1" errorCode="123" />
  <bpmn:collaboration id="Collaboration_0m61s8z">
    <bpmn:participant id="Participant_1" processRef="Process_1" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" name="Process" isExecutable="true">
    <bpmn:laneSet id="LaneSet_0t8kl0p">
      <bpmn:lane id="Lane_0uzpx6i">
        <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>SendTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_194geuy</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_1i31ds7</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_1dqipbw</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_01h9a13</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ServiceTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ScriptTask_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>CallActivity_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Event_1vq7a1u</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>SendTask_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ReceiveTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>UserTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ManualTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>BusinessRuleTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ServiceTask_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ScriptTask_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>EndEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>StartEvent_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>MessageIntermediateCatchEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>IntermediateThrowEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>IntermediateCatchEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Event_0qu7bne</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Gateway_0t15hwa</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Gateway_1juv0sp</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>CallActivity_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Event_02hrcdy</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>SubProcess_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_1lo2nry</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>TimerBoundaryEvent_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>MessageBoundaryEvent_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>ErrorBoundaryEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>TimerBoundaryEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>MessageBoundaryEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>IntermediateThrowEvent_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Event_1wpfzvg</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_0useuse</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_0xb7ghs</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_1wbnra1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Event_07d9afb</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_060t1vc</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Event_1dev4s0</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_1kck2lv" />
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_1qcdxkj</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sendTask id="SendTask_1" name="Send Task">
      <bpmn:extensionElements>
        <zeebe:taskHeaders>
          <zeebe:header key="foo" value="bar" />
        </zeebe:taskHeaders>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1qcdxkj</bpmn:incoming>
      <bpmn:outgoing>Flow_1ffibkc</bpmn:outgoing>
    </bpmn:sendTask>
    <bpmn:receiveTask id="Activity_194geuy" name="Receive Task">
      <bpmn:extensionElements>
        <zeebe:ioMapping>
          <zeebe:output source="= source" target="OutputVariable_1" />
        </zeebe:ioMapping>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1ffibkc</bpmn:incoming>
      <bpmn:outgoing>Flow_0k57p06</bpmn:outgoing>
    </bpmn:receiveTask>
    <bpmn:userTask id="Activity_1i31ds7">
      <bpmn:incoming>Flow_0k57p06</bpmn:incoming>
      <bpmn:outgoing>Flow_0x2531b</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:manualTask id="Activity_1dqipbw">
      <bpmn:incoming>Flow_0x2531b</bpmn:incoming>
      <bpmn:outgoing>Flow_0vv7yv3</bpmn:outgoing>
    </bpmn:manualTask>
    <bpmn:businessRuleTask id="Activity_01h9a13">
      <bpmn:extensionElements>
        <zeebe:calledDecision decisionId="foo" resultVariable="bar" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0vv7yv3</bpmn:incoming>
      <bpmn:outgoing>Flow_1jsrrif</bpmn:outgoing>
    </bpmn:businessRuleTask>
    <bpmn:serviceTask id="ServiceTask_1" name="Send Email">
      <bpmn:incoming>Flow_1jsrrif</bpmn:incoming>
      <bpmn:outgoing>Flow_12f4slg</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:scriptTask id="ScriptTask_2">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="foo" retries="1" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_12f4slg</bpmn:incoming>
      <bpmn:outgoing>Flow_1fx57yk</bpmn:outgoing>
    </bpmn:scriptTask>
    <bpmn:callActivity id="CallActivity_2">
      <bpmn:extensionElements>
        <zeebe:calledElement processId="foo" propagateAllChildVariables="false" />
        <zeebe:ioMapping>
          <zeebe:input source="= source" target="InputVariable_1" />
          <zeebe:output source="= source" target="OutputVariable_1" />
        </zeebe:ioMapping>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1fx57yk</bpmn:incoming>
      <bpmn:outgoing>Flow_0ckmae9</bpmn:outgoing>
    </bpmn:callActivity>
    <bpmn:startEvent id="Event_1vq7a1u">
      <bpmn:outgoing>Flow_1r2dblf</bpmn:outgoing>
      <bpmn:timerEventDefinition id="TimerEventDefinition_0lrr49r" />
    </bpmn:startEvent>
    <bpmn:sendTask id="SendTask_2">
      <bpmn:incoming>Flow_1r2dblf</bpmn:incoming>
      <bpmn:outgoing>Flow_0ke5chc</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics>
        <bpmn:extensionElements>
          <zeebe:loopCharacteristics outputCollection="foo" />
        </bpmn:extensionElements>
      </bpmn:multiInstanceLoopCharacteristics>
    </bpmn:sendTask>
    <bpmn:receiveTask id="ReceiveTask_1">
      <bpmn:incoming>Flow_0ke5chc</bpmn:incoming>
      <bpmn:outgoing>Flow_1oz4j7x</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true">
        <bpmn:extensionElements>
          <zeebe:loopCharacteristics outputElement="bar" />
        </bpmn:extensionElements>
      </bpmn:multiInstanceLoopCharacteristics>
    </bpmn:receiveTask>
    <bpmn:userTask id="UserTask_1">
      <bpmn:incoming>Flow_1oz4j7x</bpmn:incoming>
      <bpmn:outgoing>Flow_1oowgn8</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics />
    </bpmn:userTask>
    <bpmn:manualTask id="ManualTask_1">
      <bpmn:incoming>Flow_1oowgn8</bpmn:incoming>
      <bpmn:outgoing>Flow_0ntpfg9</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" />
    </bpmn:manualTask>
    <bpmn:businessRuleTask id="BusinessRuleTask_1">
      <bpmn:extensionElements>
        <zeebe:taskDefinition />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0ntpfg9</bpmn:incoming>
      <bpmn:outgoing>Flow_1llzfgb</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics />
    </bpmn:businessRuleTask>
    <bpmn:serviceTask id="ServiceTask_2">
      <bpmn:incoming>Flow_1llzfgb</bpmn:incoming>
      <bpmn:outgoing>Flow_1onziz3</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" />
    </bpmn:serviceTask>
    <bpmn:scriptTask id="ScriptTask_1">
      <bpmn:incoming>Flow_1onziz3</bpmn:incoming>
      <bpmn:outgoing>Flow_18orpt5</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics />
    </bpmn:scriptTask>
    <bpmn:subProcess id="SubProcess_1">
      <bpmn:incoming>Flow_0ckmae9</bpmn:incoming>
      <bpmn:outgoing>Flow_1r4x1c5</bpmn:outgoing>
    </bpmn:subProcess>
    <bpmn:endEvent id="EndEvent_1">
      <bpmn:incoming>Flow_1r4x1c5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:startEvent id="StartEvent_2">
      <bpmn:outgoing>Flow_1qkhyx8</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:intermediateCatchEvent id="MessageIntermediateCatchEvent_1">
      <bpmn:incoming>Flow_1qkhyx8</bpmn:incoming>
      <bpmn:outgoing>Flow_0xv1my6</bpmn:outgoing>
      <bpmn:messageEventDefinition id="MessageEventDefinition_09vl9i7" messageRef="Message_0fksgui" />
    </bpmn:intermediateCatchEvent>
    <bpmn:intermediateThrowEvent id="IntermediateThrowEvent_1">
      <bpmn:incoming>Flow_0xv1my6</bpmn:incoming>
      <bpmn:outgoing>Flow_1dy63n1</bpmn:outgoing>
      <bpmn:messageEventDefinition id="MessageEventDefinition_15ny2x5" />
    </bpmn:intermediateThrowEvent>
    <bpmn:intermediateCatchEvent id="IntermediateCatchEvent_1">
      <bpmn:incoming>Flow_1dy63n1</bpmn:incoming>
      <bpmn:outgoing>Flow_1q080hm</bpmn:outgoing>
      <bpmn:timerEventDefinition id="TimerEventDefinition_06nd7i8">
        <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">123</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:intermediateCatchEvent>
    <bpmn:startEvent id="Event_0qu7bne">
      <bpmn:outgoing>Flow_11vr31i</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="Gateway_0t15hwa">
      <bpmn:incoming>Flow_11vr31i</bpmn:incoming>
      <bpmn:outgoing>Flow_1e69gva</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:parallelGateway id="Gateway_1juv0sp">
      <bpmn:incoming>Flow_1e69gva</bpmn:incoming>
      <bpmn:outgoing>Flow_04wjgyp</bpmn:outgoing>
    </bpmn:parallelGateway>
    <bpmn:subProcess id="Activity_1lo2nry" triggeredByEvent="true">
      <bpmn:startEvent id="MessageStartEvent_1">
        <bpmn:outgoing>Flow_0wcd8zj</bpmn:outgoing>
        <bpmn:messageEventDefinition id="MessageEventDefinition_1pnl1ck" />
      </bpmn:startEvent>
      <bpmn:sequenceFlow id="Flow_0wcd8zj" sourceRef="MessageStartEvent_1" targetRef="Activity_0oqv069" />
      <bpmn:endEvent id="Event_12bmeg8">
        <bpmn:incoming>Flow_1dp8vmy</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="Flow_1dp8vmy" sourceRef="Activity_0oqv069" targetRef="Event_12bmeg8" />
      <bpmn:businessRuleTask id="Activity_0oqv069">
        <bpmn:extensionElements>
          <zeebe:calledDecision decisionId="foo" resultVariable="bar" />
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_0wcd8zj</bpmn:incoming>
        <bpmn:outgoing>Flow_1dp8vmy</bpmn:outgoing>
      </bpmn:businessRuleTask>
      <bpmn:boundaryEvent id="BoundaryEvent_1" attachedToRef="Activity_0oqv069">
        <bpmn:messageEventDefinition id="MessageEventDefinition_1t0jruc" messageRef="Message_3tj5qjn" />
      </bpmn:boundaryEvent>
      <bpmn:boundaryEvent id="BoundaryEvent_2" attachedToRef="Activity_0oqv069">
        <bpmn:errorEventDefinition id="ErrorEventDefinition_13bfypt" errorRef="Error_13xx9ja" />
      </bpmn:boundaryEvent>
    </bpmn:subProcess>
    <bpmn:boundaryEvent id="TimerBoundaryEvent_2" cancelActivity="false" attachedToRef="ScriptTask_2">
      <bpmn:timerEventDefinition id="TimerEventDefinition_04x8bk0" />
    </bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="MessageBoundaryEvent_2" cancelActivity="false" attachedToRef="ServiceTask_1">
      <bpmn:messageEventDefinition id="MessageEventDefinition_17j2ihu" />
    </bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="ErrorBoundaryEvent_1" attachedToRef="Activity_01h9a13">
      <bpmn:errorEventDefinition id="ErrorEventDefinition_14jabpp" errorRef="Error_09cos3p" />
    </bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="TimerBoundaryEvent_1" attachedToRef="Activity_1dqipbw">
      <bpmn:timerEventDefinition id="TimerEventDefinition_07jn56w" />
    </bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="MessageBoundaryEvent_1" attachedToRef="Activity_1i31ds7">
      <bpmn:messageEventDefinition id="MessageEventDefinition_01khy5o" messageRef="Message_0fksgui" />
    </bpmn:boundaryEvent>
    <bpmn:sequenceFlow id="Flow_1e69gva" sourceRef="Gateway_0t15hwa" targetRef="Gateway_1juv0sp" />
    <bpmn:sequenceFlow id="Flow_11vr31i" sourceRef="Event_0qu7bne" targetRef="Gateway_0t15hwa" />
    <bpmn:sequenceFlow id="Flow_1dy63n1" sourceRef="IntermediateThrowEvent_1" targetRef="IntermediateCatchEvent_1" />
    <bpmn:sequenceFlow id="Flow_0xv1my6" sourceRef="MessageIntermediateCatchEvent_1" targetRef="IntermediateThrowEvent_1" />
    <bpmn:sequenceFlow id="Flow_1qkhyx8" sourceRef="StartEvent_2" targetRef="MessageIntermediateCatchEvent_1" />
    <bpmn:sequenceFlow id="Flow_1r4x1c5" sourceRef="SubProcess_1" targetRef="EndEvent_1" />
    <bpmn:sequenceFlow id="Flow_0ckmae9" sourceRef="CallActivity_2" targetRef="SubProcess_1" />
    <bpmn:sequenceFlow id="Flow_1fx57yk" sourceRef="ScriptTask_2" targetRef="CallActivity_2" />
    <bpmn:sequenceFlow id="Flow_12f4slg" sourceRef="ServiceTask_1" targetRef="ScriptTask_2" />
    <bpmn:sequenceFlow id="Flow_1jsrrif" sourceRef="Activity_01h9a13" targetRef="ServiceTask_1" />
    <bpmn:sequenceFlow id="Flow_0vv7yv3" sourceRef="Activity_1dqipbw" targetRef="Activity_01h9a13" />
    <bpmn:sequenceFlow id="Flow_0x2531b" sourceRef="Activity_1i31ds7" targetRef="Activity_1dqipbw" />
    <bpmn:sequenceFlow id="Flow_0k57p06" sourceRef="Activity_194geuy" targetRef="Activity_1i31ds7" />
    <bpmn:sequenceFlow id="Flow_1ffibkc" sourceRef="SendTask_1" targetRef="Activity_194geuy" />
    <bpmn:sequenceFlow id="Flow_1qcdxkj" sourceRef="StartEvent_1" targetRef="SendTask_1" />
    <bpmn:sequenceFlow id="Flow_1r2dblf" sourceRef="Event_1vq7a1u" targetRef="SendTask_2" />
    <bpmn:sequenceFlow id="Flow_0ke5chc" sourceRef="SendTask_2" targetRef="ReceiveTask_1" />
    <bpmn:sequenceFlow id="Flow_1oz4j7x" sourceRef="ReceiveTask_1" targetRef="UserTask_1" />
    <bpmn:sequenceFlow id="Flow_1oowgn8" sourceRef="UserTask_1" targetRef="ManualTask_1" />
    <bpmn:sequenceFlow id="Flow_0ntpfg9" sourceRef="ManualTask_1" targetRef="BusinessRuleTask_1" />
    <bpmn:sequenceFlow id="Flow_1llzfgb" sourceRef="BusinessRuleTask_1" targetRef="ServiceTask_2" />
    <bpmn:sequenceFlow id="Flow_1onziz3" sourceRef="ServiceTask_2" targetRef="ScriptTask_1" />
    <bpmn:sequenceFlow id="Flow_18orpt5" sourceRef="ScriptTask_1" targetRef="CallActivity_1" />
    <bpmn:callActivity id="CallActivity_1">
      <bpmn:extensionElements>
        <zeebe:calledElement propagateAllChildVariables="false" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_18orpt5</bpmn:incoming>
      <bpmn:outgoing>Flow_1kg1u9r</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" />
    </bpmn:callActivity>
    <bpmn:sequenceFlow id="Flow_1kg1u9r" sourceRef="CallActivity_1" targetRef="Event_02hrcdy" />
    <bpmn:endEvent id="Event_02hrcdy">
      <bpmn:extensionElements>
        <zeebe:taskDefinition retries="bar" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1kg1u9r</bpmn:incoming>
      <bpmn:messageEventDefinition id="MessageEventDefinition_1xs3v1c" />
    </bpmn:endEvent>
    <bpmn:intermediateThrowEvent id="IntermediateThrowEvent_2">
      <bpmn:incoming>Flow_1q080hm</bpmn:incoming>
      <bpmn:outgoing>Flow_04m4ti5</bpmn:outgoing>
    </bpmn:intermediateThrowEvent>
    <bpmn:sequenceFlow id="Flow_1q080hm" sourceRef="IntermediateCatchEvent_1" targetRef="IntermediateThrowEvent_2" />
    <bpmn:boundaryEvent id="Event_1wpfzvg" attachedToRef="Activity_194geuy" />
    <bpmn:task id="Activity_0useuse">
      <bpmn:incoming>Flow_04wjgyp</bpmn:incoming>
      <bpmn:outgoing>Flow_0zmadu3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_04wjgyp" sourceRef="Gateway_1juv0sp" targetRef="Activity_0useuse" />
    <bpmn:sequenceFlow id="Flow_0zmadu3" sourceRef="Activity_0useuse" targetRef="Activity_0xb7ghs" />
    <bpmn:businessRuleTask id="Activity_0xb7ghs">
      <bpmn:extensionElements>
        <zeebe:calledDecision />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0zmadu3</bpmn:incoming>
      <bpmn:outgoing>Flow_0lrqe1h</bpmn:outgoing>
    </bpmn:businessRuleTask>
    <bpmn:sequenceFlow id="Flow_0lrqe1h" sourceRef="Activity_0xb7ghs" targetRef="Activity_1wbnra1" />
    <bpmn:businessRuleTask id="Activity_1wbnra1">
      <bpmn:extensionElements>
        <zeebe:taskDefinition />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0lrqe1h</bpmn:incoming>
      <bpmn:outgoing>Flow_1xucoqn</bpmn:outgoing>
    </bpmn:businessRuleTask>
    <bpmn:sequenceFlow id="Flow_04m4ti5" sourceRef="IntermediateThrowEvent_2" targetRef="Event_07d9afb" />
    <bpmn:endEvent id="Event_07d9afb">
      <bpmn:incoming>Flow_04m4ti5</bpmn:incoming>
      <bpmn:messageEventDefinition id="MessageEventDefinition_1m5jnt1" />
    </bpmn:endEvent>
    <bpmn:businessRuleTask id="Activity_060t1vc">
      <bpmn:incoming>Flow_1xucoqn</bpmn:incoming>
      <bpmn:outgoing>Flow_05l1251</bpmn:outgoing>
    </bpmn:businessRuleTask>
    <bpmn:sequenceFlow id="Flow_1xucoqn" sourceRef="Activity_1wbnra1" targetRef="Activity_060t1vc" />
    <bpmn:sequenceFlow id="Flow_05l1251" sourceRef="Activity_060t1vc" targetRef="Event_1dev4s0" />
    <bpmn:endEvent id="Event_1dev4s0">
      <bpmn:incoming>Flow_05l1251</bpmn:incoming>
      <bpmn:errorEventDefinition id="ErrorEventDefinition_1i6owg0" />
    </bpmn:endEvent>
    <bpmn:textAnnotation id="TextAnnotation_2">
      <bpmn:text>zeebe:TaskDefinition
&gt; zeebe:type</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="TextAnnotation_3">
      <bpmn:text>zeebe:CalledElement
&gt; zeebe:processId</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="TextAnnotation_1">
      <bpmn:text>bpmn:messageRef (bpmn:Message)
&gt; zeebe:Subscription
&gt;&gt; zeebe:correlationKey</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="TextAnnotation_5">
      <bpmn:text>bpmn:errorRef (bpmn:Error)
&gt; bpmn:errorCode</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="TextAnnotation_0wirl1t">
      <bpmn:text>if only one outgoing sequence flow it must have condition or be default flow</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:association id="Association_1cdcioy" sourceRef="SendTask_1" targetRef="TextAnnotation_2" />
    <bpmn:association id="Association_09n1vql" sourceRef="Activity_194geuy" targetRef="TextAnnotation_1" />
    <bpmn:association id="Association_0dlw6o5" sourceRef="Activity_01h9a13" targetRef="TextAnnotation_2" />
    <bpmn:association id="Association_0eqqbru" sourceRef="ServiceTask_1" targetRef="TextAnnotation_2" />
    <bpmn:association id="Association_1bkauiy" sourceRef="ScriptTask_2" targetRef="TextAnnotation_2" />
    <bpmn:association id="Association_1xvecgj" sourceRef="CallActivity_2" targetRef="TextAnnotation_3" />
    <bpmn:association id="Association_0bp4pwl" sourceRef="Gateway_0t15hwa" targetRef="TextAnnotation_0wirl1t" />
    <bpmn:association id="Association_0m5isxa" sourceRef="ErrorBoundaryEvent_1" targetRef="TextAnnotation_5" />
    <bpmn:association id="Association_1jgfw2n" sourceRef="Activity_01h9a13" targetRef="TextAnnotation_4" />
    <bpmn:textAnnotation id="TextAnnotation_4">
      <bpmn:text>zeebe:CalledDecision
&gt; zeebe:decisionId
&gt; zeebe:resultVariable</bpmn:text>
    </bpmn:textAnnotation>
  </bpmn:process>
  <bpmn:message id="Message_3tj5qjn" />
  <bpmn:error id="Error_13xx9ja" name="Error_2" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0m61s8z">
      <bpmndi:BPMNShape id="Participant_0g3bqh2_di" bpmnElement="Participant_1" isHorizontal="true">
        <dc:Bounds x="125" y="60" width="2003" height="1050" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_1kck2lv_di" bpmnElement="Lane_1kck2lv" isHorizontal="true">
        <dc:Bounds x="155" y="990" width="1973" height="120" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_0uzpx6i_di" bpmnElement="Lane_0uzpx6i" isHorizontal="true">
        <dc:Bounds x="155" y="60" width="1973" height="930" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_05l1251_di" bpmnElement="Flow_05l1251">
        <di:waypoint x="1330" y="540" />
        <di:waypoint x="1462" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1xucoqn_di" bpmnElement="Flow_1xucoqn">
        <di:waypoint x="1100" y="540" />
        <di:waypoint x="1230" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_04m4ti5_di" bpmnElement="Flow_04m4ti5">
        <di:waypoint x="608" y="410" />
        <di:waypoint x="672" y="410" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0lrqe1h_di" bpmnElement="Flow_0lrqe1h">
        <di:waypoint x="870" y="540" />
        <di:waypoint x="1000" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0zmadu3_di" bpmnElement="Flow_0zmadu3">
        <di:waypoint x="640" y="540" />
        <di:waypoint x="770" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_04wjgyp_di" bpmnElement="Flow_04wjgyp">
        <di:waypoint x="415" y="540" />
        <di:waypoint x="540" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1q080hm_di" bpmnElement="Flow_1q080hm">
        <di:waypoint x="508" y="410" />
        <di:waypoint x="572" y="410" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1kg1u9r_di" bpmnElement="Flow_1kg1u9r">
        <di:waypoint x="1930" y="870" />
        <di:waypoint x="1992" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_18orpt5_di" bpmnElement="Flow_18orpt5">
        <di:waypoint x="1770" y="870" />
        <di:waypoint x="1830" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1onziz3_di" bpmnElement="Flow_1onziz3">
        <di:waypoint x="1610" y="870" />
        <di:waypoint x="1670" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1llzfgb_di" bpmnElement="Flow_1llzfgb">
        <di:waypoint x="1450" y="870" />
        <di:waypoint x="1510" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ntpfg9_di" bpmnElement="Flow_0ntpfg9">
        <di:waypoint x="1290" y="870" />
        <di:waypoint x="1350" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1oowgn8_di" bpmnElement="Flow_1oowgn8">
        <di:waypoint x="1130" y="870" />
        <di:waypoint x="1190" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1oz4j7x_di" bpmnElement="Flow_1oz4j7x">
        <di:waypoint x="970" y="870" />
        <di:waypoint x="1030" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ke5chc_di" bpmnElement="Flow_0ke5chc">
        <di:waypoint x="810" y="870" />
        <di:waypoint x="870" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1r2dblf_di" bpmnElement="Flow_1r2dblf">
        <di:waypoint x="658" y="870" />
        <di:waypoint x="710" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1qcdxkj_di" bpmnElement="Flow_1qcdxkj">
        <di:waypoint x="215" y="277" />
        <di:waypoint x="270" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1ffibkc_di" bpmnElement="Flow_1ffibkc">
        <di:waypoint x="370" y="277" />
        <di:waypoint x="430" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0k57p06_di" bpmnElement="Flow_0k57p06">
        <di:waypoint x="530" y="277" />
        <di:waypoint x="590" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0x2531b_di" bpmnElement="Flow_0x2531b">
        <di:waypoint x="690" y="277" />
        <di:waypoint x="750" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0vv7yv3_di" bpmnElement="Flow_0vv7yv3">
        <di:waypoint x="850" y="277" />
        <di:waypoint x="910" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1jsrrif_di" bpmnElement="Flow_1jsrrif">
        <di:waypoint x="1010" y="277" />
        <di:waypoint x="1070" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_12f4slg_di" bpmnElement="Flow_12f4slg">
        <di:waypoint x="1170" y="277" />
        <di:waypoint x="1230" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1fx57yk_di" bpmnElement="Flow_1fx57yk">
        <di:waypoint x="1330" y="277" />
        <di:waypoint x="1390" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ckmae9_di" bpmnElement="Flow_0ckmae9">
        <di:waypoint x="1490" y="277" />
        <di:waypoint x="1550" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1r4x1c5_di" bpmnElement="Flow_1r4x1c5">
        <di:waypoint x="1650" y="277" />
        <di:waypoint x="1712" y="277" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1qkhyx8_di" bpmnElement="Flow_1qkhyx8">
        <di:waypoint x="215" y="410" />
        <di:waypoint x="272" y="410" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0xv1my6_di" bpmnElement="Flow_0xv1my6">
        <di:waypoint x="308" y="410" />
        <di:waypoint x="372" y="410" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1dy63n1_di" bpmnElement="Flow_1dy63n1">
        <di:waypoint x="408" y="410" />
        <di:waypoint x="472" y="410" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_11vr31i_di" bpmnElement="Flow_11vr31i">
        <di:waypoint x="215" y="540" />
        <di:waypoint x="265" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1e69gva_di" bpmnElement="Flow_1e69gva">
        <di:waypoint x="315" y="540" />
        <di:waypoint x="365" y="540" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="259" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1q5c4sv_di" bpmnElement="SendTask_1">
        <dc:Bounds x="270" y="237" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1yttjlf_di" bpmnElement="Activity_194geuy">
        <dc:Bounds x="430" y="237" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1lnnp5r_di" bpmnElement="Activity_1i31ds7">
        <dc:Bounds x="590" y="237" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0fo3yiy_di" bpmnElement="Activity_1dqipbw">
        <dc:Bounds x="750" y="237" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0mr7vxt_di" bpmnElement="Activity_01h9a13">
        <dc:Bounds x="910" y="237" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_19f38aq_di" bpmnElement="ServiceTask_1">
        <dc:Bounds x="1070" y="237" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_00r02ry_di" bpmnElement="ScriptTask_2">
        <dc:Bounds x="1230" y="237" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_05dqv4q_di" bpmnElement="CallActivity_2">
        <dc:Bounds x="1390" y="237" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0xmm7pp_di" bpmnElement="Event_1vq7a1u">
        <dc:Bounds x="622" y="852" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0s26i4q_di" bpmnElement="SendTask_2">
        <dc:Bounds x="710" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1c6nuc3_di" bpmnElement="ReceiveTask_1">
        <dc:Bounds x="870" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_105ky6z_di" bpmnElement="UserTask_1">
        <dc:Bounds x="1030" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1kzc1gx_di" bpmnElement="ManualTask_1">
        <dc:Bounds x="1190" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1u5fpxm_di" bpmnElement="BusinessRuleTask_1">
        <dc:Bounds x="1350" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1hy9nv0_di" bpmnElement="ServiceTask_2">
        <dc:Bounds x="1510" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1was2bk_di" bpmnElement="ScriptTask_1">
        <dc:Bounds x="1670" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0lslnwo_di" bpmnElement="SubProcess_1">
        <dc:Bounds x="1550" y="237" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0kbs6kn_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="1712" y="259" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0skz3ay_di" bpmnElement="StartEvent_2">
        <dc:Bounds x="179" y="392" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1qso0lo_di" bpmnElement="MessageIntermediateCatchEvent_1">
        <dc:Bounds x="272" y="392" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1qtnbcg_di" bpmnElement="IntermediateThrowEvent_1">
        <dc:Bounds x="372" y="392" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_111z3ee_di" bpmnElement="IntermediateCatchEvent_1">
        <dc:Bounds x="472" y="392" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0qu7bne_di" bpmnElement="Event_0qu7bne">
        <dc:Bounds x="179" y="522" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0t15hwa_di" bpmnElement="Gateway_0t15hwa" isMarkerVisible="true">
        <dc:Bounds x="265" y="515" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_048dgce_di" bpmnElement="Gateway_1juv0sp">
        <dc:Bounds x="365" y="515" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_07gw40i_di" bpmnElement="Activity_1lo2nry" isExpanded="true">
        <dc:Bounds x="180" y="770" width="368" height="200" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1dp8vmy_di" bpmnElement="Flow_1dp8vmy">
        <di:waypoint x="410" y="870" />
        <di:waypoint x="472" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0wcd8zj_di" bpmnElement="Flow_0wcd8zj">
        <di:waypoint x="256" y="870" />
        <di:waypoint x="310" y="870" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1suzerz_di" bpmnElement="MessageStartEvent_1">
        <dc:Bounds x="220" y="852" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_12bmeg8_di" bpmnElement="Event_12bmeg8">
        <dc:Bounds x="472" y="852" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_182lblu_di" bpmnElement="Activity_0oqv069">
        <dc:Bounds x="310" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1opxxim_di" bpmnElement="BoundaryEvent_2">
        <dc:Bounds x="292" y="892" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_07vctcc_di" bpmnElement="BoundaryEvent_1">
        <dc:Bounds x="392" y="892" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1ifx34f_di" bpmnElement="CallActivity_1">
        <dc:Bounds x="1830" y="830" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_09ja59l_di" bpmnElement="Event_02hrcdy">
        <dc:Bounds x="1992" y="852" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1eg6ztl_di" bpmnElement="IntermediateThrowEvent_2">
        <dc:Bounds x="572" y="392" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0useuse_di" bpmnElement="Activity_0useuse">
        <dc:Bounds x="540" y="500" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1938n5p_di" bpmnElement="Activity_0xb7ghs">
        <dc:Bounds x="770" y="500" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1epwypo_di" bpmnElement="Activity_1wbnra1">
        <dc:Bounds x="1000" y="500" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0w15dlm_di" bpmnElement="Event_07d9afb">
        <dc:Bounds x="672" y="392" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0uogrdu_di" bpmnElement="Activity_060t1vc">
        <dc:Bounds x="1230" y="500" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1ae5cyy_di" bpmnElement="Event_1dev4s0">
        <dc:Bounds x="1462" y="522" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_1w8noad_di" bpmnElement="TextAnnotation_2">
        <dc:Bounds x="1010" y="80" width="160" height="41" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_0e5mzp3_di" bpmnElement="TextAnnotation_3">
        <dc:Bounds x="1490" y="150" width="160" height="40" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_111yr6d_di" bpmnElement="TextAnnotation_1">
        <dc:Bounds x="410" y="140" width="210" height="55" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_07xf6gp_di" bpmnElement="TextAnnotation_5">
        <dc:Bounds x="990" y="397" width="162" height="59" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_0wirl1t_di" bpmnElement="TextAnnotation_0wirl1t">
        <dc:Bounds x="240" y="600" width="100" height="97" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_1ofk08a_di" bpmnElement="TextAnnotation_4">
        <dc:Bounds x="780" y="400" width="160" height="54" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0fcaw0j_di" bpmnElement="Event_1wpfzvg">
        <dc:Bounds x="512" y="299" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1m8mh8h_di" bpmnElement="MessageBoundaryEvent_1">
        <dc:Bounds x="672" y="299" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_00k811t_di" bpmnElement="TimerBoundaryEvent_1">
        <dc:Bounds x="832" y="299" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0ci7zd5_di" bpmnElement="ErrorBoundaryEvent_1">
        <dc:Bounds x="992" y="299" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_14m0njj_di" bpmnElement="MessageBoundaryEvent_2">
        <dc:Bounds x="1152" y="299" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0h5u6tl_di" bpmnElement="TimerBoundaryEvent_2">
        <dc:Bounds x="1312" y="299" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Association_1cdcioy_di" bpmnElement="Association_1cdcioy">
        <di:waypoint x="370" y="266" />
        <di:waypoint x="1035" y="121" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_09n1vql_di" bpmnElement="Association_09n1vql">
        <di:waypoint x="473" y="237" />
        <di:waypoint x="467" y="195" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_0dlw6o5_di" bpmnElement="Association_0dlw6o5">
        <di:waypoint x="981" y="237" />
        <di:waypoint x="1041" y="121" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_0eqqbru_di" bpmnElement="Association_0eqqbru">
        <di:waypoint x="1111" y="237" />
        <di:waypoint x="1086" y="121" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_1bkauiy_di" bpmnElement="Association_1bkauiy">
        <di:waypoint x="1236" y="238" />
        <di:waypoint x="1104" y="121" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_1xvecgj_di" bpmnElement="Association_1xvecgj">
        <di:waypoint x="1476" y="237" />
        <di:waypoint x="1518" y="190" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_0bp4pwl_di" bpmnElement="Association_0bp4pwl">
        <di:waypoint x="290" y="565" />
        <di:waypoint x="290" y="600" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_0m5isxa_di" bpmnElement="Association_0m5isxa">
        <di:waypoint x="1015" y="334" />
        <di:waypoint x="1035" y="397" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_1jgfw2n_di" bpmnElement="Association_1jgfw2n">
        <di:waypoint x="922" y="317" />
        <di:waypoint x="844" y="400" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
  <bpmndi:BPMNDiagram id="BPMNDiagram_0hb0b00">
    <bpmndi:BPMNPlane id="BPMNPlane_0fxgcus" bpmnElement="SubProcess_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

// const diagramSimple = `<?xml version="1.0" encoding="UTF-8"?>
// <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_10h1baj" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.0.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="1.0.0">
//   <bpmn:message id="Message_10da3fn" name="Message_1">
//     <bpmn:extensionElements>
//       <zeebe:subscription correlationKey="foo" />
//     </bpmn:extensionElements>
//   </bpmn:message>
//   <bpmn:message id="Message_0fksgui" name="Message_2" />
//   <bpmn:error id="Error_09cos3p" name="Error_1" errorCode="123" />
//   <bpmn:message id="Message_3tj5qjn" />
//   <bpmn:error id="Error_13xx9ja" name="Error_2" />
//   <bpmn:process id="Process_0rbm51l">
//     <bpmn:serviceTask id="Task_1">
//       <bpmn:extensionElements>
//         <zeebe:taskDefinition type="foo" />
//       </bpmn:extensionElements>
//     </bpmn:serviceTask>
//     <bpmn:serviceTask id="Task_2" />
//   </bpmn:process>
//   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
//     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0rbm51l">
//       <bpmndi:BPMNShape id="Activity_0sd8wa9_di" bpmnElement="Task_1">
//         <dc:Bounds x="240" y="280" width="100" height="80" />
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape id="Activity_0x4bf67_di" bpmnElement="Task_2">
//         <dc:Bounds x="390" y="280" width="100" height="80" />
//       </bpmndi:BPMNShape>
//     </bpmndi:BPMNPlane>
//   </bpmndi:BPMNDiagram>
// </bpmn:definitions>
// `;

const linter = new Linter({
  modeler: 'web'
});

export default function App() {
  const ref = useRef();

  const propertiesPanelRef = useRef();

  const [ modeler, setModeler ] = useState();

  const [ reports, setReports ] = useState([]);

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

      window.modeler = modeler;
    })();
  }, []);

  const onClick = (report) => () => {
    modeler.get('linting').showError(report);
  };

  return (
    <>
      <div id="modeler">
        <div id="container" ref={ ref }></div>
        <div id="properties-panel-container" ref={ propertiesPanelRef }></div>
      </div>
      <div id="linting" className={ classNames('panel', { open: lintingActive }) }>
        <div className="panel__links">
          <button className="panel__link panel__link--active" onClick={ toggleLinting }>
            <span className="panel__link-label">
              Issues
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
                      onClick={ onClick(report) } />
                  );
                }))
              }
            </div>
          </div>
        }
      </div>
    </>
  );
}

function LintingReport(props) {
  const {
    onClick,
    report
  } = props;

  const {
    id,
    label,
    message
  } = report;

  return <div className="linting-issue">
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
    if ((a.label || a.id).toLowerCase() <= (b.label || b.id).toLowerCase()) {
      return -1;
    } else {
      return 1;
    }
  });
}