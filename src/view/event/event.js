import {getDurationTime, getFormattedTime, getPathLabel} from '~/helpers';
import {TimeFormatType} from '~/common/enums';
import {eventTypeToTextMap} from '~/common/map';
import Abstract from '~/view/abstract/abstract';
import {createListOffersTemplate} from './list-offers/list-offers';

class Event extends Abstract {
  constructor(event) {
    super();
    this._event = event;

    this._onEditClick = this._onEditClick.bind(this);
  }

  get template() {
    const {type, price, start, end, destination, offers} = this._event;

    const pathLabel = getPathLabel(type);
    const duration = getDurationTime(start, end);

    const offersTemplate = createListOffersTemplate(offers);

    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">
            ${eventTypeToTextMap[type]} ${pathLabel} ${destination.city}
          </h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${start.toISOString()}">
                ${getFormattedTime(TimeFormatType.SHORT, start)}
              </time>
              —
              <time class="event__end-time" datetime="${end.toISOString()}">
                ${getFormattedTime(TimeFormatType.SHORT, end)}
              </time>
            </p>
            <p class="event__duration">${duration}</p>
          </div>
          <p class="event__price">
            €&nbsp;<span class="event__price-value">${price}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          ${offersTemplate}
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  _onEditClick(evt) {
    evt.preventDefault();

    this._callbacks.onEditClick();
  }

  setOnEditClick(callback) {
    const editBtnNode = this.node.querySelector(`.event__rollup-btn`);

    this._callbacks.onEditClick = callback;

    editBtnNode.addEventListener(`click`, this._onEditClick);
  }
}

export default Event;
