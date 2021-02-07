/*
* Image component for FTUI version 3
*
* Copyright (c) 2020 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { notAvailable } from './image_not_available.js';
import * as ftui from '../../modules/ftui/ftui.helper.js';

export class FtuiImage extends FtuiElement {
  constructor(properties) {

    super(Object.assign(FtuiImage.properties, properties));

    this.imageElement = this.shadowRoot.querySelector('img');
    this.updateImage();
    document.addEventListener('ftuiVisibilityChanged', () => this.updateImage());
  }

  template() {
    return `
    <style>
      :host([shape="round"]) img {
        border-radius: 1.5em;
      }
      :host([shape="circle"]) img {
        border-radius: 50%;
      }
    </style>
    <img></img>`;
  }

  static get properties() {
    return {
      base: '',
      src: '',
      width: '100%',
      height: 'auto',
      interval: 0,
      refresh: ''
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiImage.properties), ...super.observedAttributes];
  }

  connectedCallback() {
    this.imageElement.style.width = this.width;
    this.imageElement.style.height = this.height;
  }

  onAttributeChanged(name) {
    switch (name) {
      case 'src':
      case 'refresh':
        this.updateImage();
        break;
      case 'width':
        this.imageElement.style.width = this.width;
        break;
      case 'height':
        this.imageElement.style.height = this.height;
        break;
      case 'interval':
        this.checkInterval();
        break;
    }
  }

  onError() {
    this.imageElement.src = notAvailable;
    this.imageElement.onerror = null;
  }

  updateImage() {
    if (ftui.isVisible(this.imageElement)) {
      this.imageElement.onerror = this.onError.bind(this);
      this.imageElement.src = this.getUrl();
    }
  }

  getUrl() {
    const src = this.base + this.src;
    if (src && (this.hasAttribute('nocache') || this.refresh)) {
      const url = new URL(src);
      url.searchParams.set('_', Date.now());
      return url;
    }
    return src
  }

  checkInterval() {
    clearInterval(this.intervalTimer);
    if (this.interval) {
      this.intervalTimer = setInterval(() => this.updateImage(), this.interval * 1000);
    }
  }
}

window.customElements.define('ftui-image', FtuiImage);
