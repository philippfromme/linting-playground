import { groupBy } from 'min-dash';

import { domify } from 'min-dom';

export default class LintingAnnotations {
  constructor(elementRegistry, eventBus, overlays) {
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._overlays = overlays;

    this._reportsByElement = {};

    this._overlayIds = {};
  }

  setErrors(reports) {
    this._reportsByElement = groupBy(reports, 'id');

    this.update();
  }

  update(reportsByElement) {
    if (!reportsByElement) {
      reportsByElement = this._reportsByElement;
    }

    this._overlays.remove({ type: 'linting' });

    Object.entries(reportsByElement).forEach(([ id, reports ]) => {
      const element = this._elementRegistry.get(id);

      if (!element) {
        return;
      }

      const isElementTypeNotAllowed = reports.length === 1
        && reports[ 0 ].error
        && reports[ 0 ].error.type === 'elementTypeNotAllowed';

      const overlay = domify(`
        <div class="linting-annotation" title="${ isElementTypeNotAllowed ? 'Not supported' : 'Show Problem' }">
          <svg viewBox="2 2 20 20">
            <path d="M12,5 C15.8659932,5 19,8.13400675 19,12 C19,15.8659932 15.8659932,19 12,19 C8.13400675,19 5,15.8659932 5,12 C5,8.13400675 8.13400675,5 12,5 Z M9.33333333,8 L8,9.33333333 L10.667,12 L8,14.6666667 L9.33333333,16 L12,13.333 L14.6666667,16 L16,14.6666667 L13.333,12 L16,9.33333333 L14.6666667,8 L12,10.666 L9.33333333,8 Z"></path>
          </svg>
          <span>${ reports.length }</span>
        </div>
      `);

      if (!isElementTypeNotAllowed) {
        overlay.addEventListener('click', () => {
          this._eventBus.fire('refactorMe', { report: reports[ 0 ] });
        });
      }

      const overlayId = this._overlays.add(element, 'linting', {
        position: this._getOverlayPosition(element),
        html: overlay,
        scale: {
          min: .9
        }
      });

      this._overlayIds[ id ] = overlayId;
    });
  }

  _getOverlayPosition(element) {

    switch (parseInt(window.variant)) {
    case 1:
      return {
        bottom: 10,
        left: -10
      };
    case 2:
      return {
        bottom: -5,
        left: 0
      };
    default:
      return {
        top: 0,
        left: 0
      };
    }
  }
}

LintingAnnotations.$inject = [
  'elementRegistry',
  'eventBus',
  'overlays'
];