import { getErrors } from '@camunda/linting/properties-panel';

import { isDefined } from 'min-dash';

export default class Linting {
  constructor(canvas, elementRegistry, eventBus, lintingConfig = {}, lintingAnnotations, selection) {
    this._canvas = canvas;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._lintingAnnotations = lintingAnnotations;
    this._selection = selection;

    this._reports = [];
    this._active = isDefined(lintingConfig.active) ? lintingConfig.active : true;

    eventBus.on('selection.changed', () => this.update());

    eventBus.on('refactorMe', ({ report }) => this.showError(report));
  }

  showError(report) {
    const {
      id,
      propertiesPanel = {}
    } = report;

    const element = this._elementRegistry.get(id);

    if (element !== this._canvas.getRootElement()) {
      this._canvas.scrollToElement(element);
    }

    this._selection.select(element);

    const { entryId } = propertiesPanel;

    this._eventBus.fire('propertiesPanel.showEntry', {
      id: entryId
    });
  }

  setErrors(reports) {
    this._reports = reports;

    this.update();
  }

  activate() {
    this.update();
  }

  deactivate() {
    this.update([]);
  }

  update(reports) {
    if (!reports) {
      reports = this._reports;
    }

    // set annotations
    this._lintingAnnotations.setErrors(reports);

    // set properties panel errors
    const selectedElement = this._getSelectedElement();

    const elementErrors = getErrors(this._reports, selectedElement);

    this._eventBus.fire('propertiesPanel.setErrors', {
      errors: elementErrors
    });
  }

  _getSelectedElement() {
    const selection = this._selection.get();

    if (!selection || !selection.length) {
      return this._canvas.getRootElement();
    }

    const selectedElement = selection[ 0 ];

    if (isLabel(selectedElement)) {
      return selectedElement.labelTarget;
    }

    return selectedElement;
  }
}

Linting.$inject = [
  'canvas',
  'elementRegistry',
  'eventBus',
  'config.linting',
  'lintingAnnotations',
  'selection'
];

function isLabel(element) {
  return !!element.labelTarget;
}