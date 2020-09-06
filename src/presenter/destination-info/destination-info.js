import {
  renderElement,
  getTotalPrice,
  getUniqueTripDays,
  replaceWithElement,
  removeElement,
} from '~/helpers';
import {RenderPosition} from '~/common/enums';
import DestinationInfoView from '~/view/destination-info/destination-info';
import TripPriceView from '~/view/trip-price/trip-price';
import TripInfoView from '~/view/trip-info/trip-info';

class DestinationInfo {
  constructor({containerNode, destinationsModel, eventsModel}) {
    this._containerNode = containerNode;
    this._destinationsModel = destinationsModel;
    this._eventsModel = eventsModel;

    this._destinationInfoComponent = null;
    this._tripPriceComponent = null;

    this._tripInfoComponent = new TripInfoView();

    this._changeEventsModel = this._changeEventsModel.bind(this);
    this._changeDestinationModel = this._changeDestinationModel.bind(this);

    this._eventsModel.addObserver(this._changeEventsModel);
    this._destinationsModel.addObserver(this._changeDestinationModel);
  }

  get destinations() {
    return this._destinationsModel.destinations;
  }

  get events() {
    return this._eventsModel.events;
  }

  _initDestinationInfoComponent() {
    if (!this.events.length) {
      return;
    }

    const tripDays = getUniqueTripDays(this.events);
    const prevDestinationInfoComponent = this._destinationInfoComponent;

    this._destinationInfoComponent = new DestinationInfoView(
        this.destinations,
        tripDays
    );

    if (!prevDestinationInfoComponent) {
      renderElement(
          this._tripInfoComponent,
          this._destinationInfoComponent,
          RenderPosition.AFTER_BEGIN
      );

      return;
    }

    replaceWithElement(prevDestinationInfoComponent, this._destinationInfoComponent);

    removeElement(prevDestinationInfoComponent);
  }

  _initTripPriceComponent() {
    const totalPrice = getTotalPrice(this.events);
    const prevTripPriceComponent = this._tripPriceComponent;

    this._tripPriceComponent = new TripPriceView(totalPrice);

    if (!prevTripPriceComponent) {
      renderElement(
          this._tripInfoComponent,
          this._tripPriceComponent,
          RenderPosition.BEFORE_END
      );

      return;
    }

    replaceWithElement(prevTripPriceComponent, this._tripPriceComponent);

    removeElement(prevTripPriceComponent);
  }

  _changeEventsModel() {
    this._initTripPriceComponent();
    this._initDestinationInfoComponent();
  }

  _changeDestinationModel() {
    this._initDestinationInfoComponent();
  }

  init() {
    renderElement(this._containerNode, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);

    this._initDestinationInfoComponent();
    this._initTripPriceComponent();
  }
}

export default DestinationInfo;