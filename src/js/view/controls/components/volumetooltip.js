import Tooltip from 'view/controls/components/tooltip';
import Slider from 'view/controls/components/slider';
import UI from 'utils/ui';
import { setAttribute } from 'utils/dom';

export default class VolumeTooltip extends Tooltip {
    constructor(_model, name, ariaText, svgIcons) {
        super(name, ariaText, true, svgIcons);

        const localization = _model.get('localization');

        this._model = _model;
        this.volumeSlider = new Slider('jw-slider-volume jw-volume-tip', 'vertical');
        this.volumeSlider.setup();

        const volumeSliderElement = this.volumeSlider.element();
        volumeSliderElement.classList.remove('jw-background-color');

        setAttribute(volumeSliderElement, 'aria-label', localization.volumeSlider);
        setAttribute(this.container, 'tabindex', '0');

        this.addContent(volumeSliderElement);

        this.volumeSlider.on('update', function (evt) {
            this.trigger('update', evt);
            this.el.focus();
        }, this);

        this.volumeSlider.el.parentElement.addEventListener('blur', () => {
            this.closeTooltip();
        });

        this.volumeSlider.el.parentElement.addEventListener('focus', () => {
            this.openTooltip();
        });

        this.ui = new UI(this.el, { directSelect: true })
            .on('click enter', this.toggleValue, this)
            .on('tap', this.toggleOpenState, this)
            .on('over', this.openTooltip, this)
            .on('out', this.closeTooltip, this);

        this._model.on('change:volume', this.onVolume, this);
    }

    toggleValue() {
        this.trigger('toggleValue');
    }
}
