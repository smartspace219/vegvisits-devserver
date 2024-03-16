
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { change, submit as submitForm, formValueSelector, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListingRetreatItem.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Carousel,
  Label
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

import CurrencyConverter from '../../CurrencyConverter/CurrencyConverter';
import ListingPhotos from '../ListingPhotos/ListingPhotos';
import StarRating from '../../StarRating/StarRating';
import WishListIcon from '../../WishListIcon/WishListIcon';

// Locale
import messages from '../../../locale/messages';

import { formatURL } from '../../../helpers/formatURL';
import FreeCancellation from '../../FreeCancellation/FreeCancellation';
import Link from "../../Link";

const options = { month: 'long', day: 'numeric' };
const dateFormatter = new Intl.DateTimeFormat('en-US', options);

class ListingItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.state = {
      benefits: [],
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { listingFields } = props;

    if (listingFields && listingFields.benefitType && listingFields.benefitType.length > 0) {
      let benefitTypes = listingFields.benefitType;
      const benefitIDs = JSON.parse(props.listingRetreat.benefits);
      return { benefits: benefitTypes.filter(type => benefitIDs.includes(type.id))};
    } else {
      return null;
    }
  }

  static propTypes = {
    formatMessage: PropTypes.func,
    id: PropTypes.number,
    basePrice: PropTypes.number,
    currency: PropTypes.string,
    title: PropTypes.string,
    beds: PropTypes.number,
    personCapacity: PropTypes.number,
    roomType: PropTypes.string,
    houseType: PropTypes.string,
    listPhotos: PropTypes.array,
    coverPhoto: PropTypes.number,
    bookingType: PropTypes.string.isRequired,
    reviewsCount: PropTypes.number,
    reviewsStarRating: PropTypes.number,
    wishListStatus: PropTypes.bool,
    isListOwner: PropTypes.bool,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    listingRetreat: PropTypes.object
  };

  handleMouseOver(value) {
    const { change } = this.props;
    change('SearchForm', 'markerHighlight', { 'id': value, 'hover': 'true' });
  }

  handleMouseOut(value) {
    const { change } = this.props;
    change('SearchForm', 'markerHighlight', {});
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      id,
      basePrice,
      currency,
      title,
      beds,
      personCapacity,
      roomType,
      houseType,
      coverPhoto,
      listPhotos,
      bookingType,
      reviewsCount,
      reviewsStarRating,
      wishListStatus,
      isListOwner,
      isMapShow, kitchentype,
      city,
      state,
      country,
      listingRetreat
    } = this.props;
    const {benefits} = this.state;

    let bedsLabel = formatMessage(messages.bed).toLowerCase();
    let guestsLabel = formatMessage(messages.guest).toLowerCase();
    let heartIcon = 'heartIcon';
    if (beds > 1) {
      bedsLabel = formatMessage(messages.beds).toLowerCase();
    }

    if (personCapacity > 1) {
      guestsLabel = formatMessage(messages.guests).toLowerCase();
    }
    let starRatingValue = 0;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Number(reviewsStarRating / reviewsCount)
    }
    let activeItem = 0, photoTemp, photosList = listPhotos.slice();
    if (listPhotos && listPhotos.length > 1) {
      listPhotos.map((x, y) => { if (x.id === coverPhoto) activeItem = y });
      if (activeItem > 0) {
        photoTemp = photosList[0];
        photosList[0] = photosList[activeItem];
        photosList[activeItem] = photoTemp;
      }
    }

    return (
      <div className={cx(s.listItemContainer)} onMouseOver={() => this.handleMouseOver(id)} onMouseOut={() => this.handleMouseOut(id)}>
        {
          // !isListOwner && <WishListIcon listId={id} key={id} isChecked={wishListStatus} heartIcon={heartIcon} />
        }
        <Row className={s.itemRow}>
          <Col xs={12} md={4}>
            <ListingPhotos
              id={id}
              coverPhoto={coverPhoto ? coverPhoto : 0}
              listPhotos={photosList}
              formatURL={formatURL}
              title={title}
              isMapShow={isMapShow}
              link={"/retreats/" + id}
            />
          </Col>
          <Col xs={12} md={6}>
            <div className={s.listInfo}>
              <a className={s.listInfoLink} href={"/retreats/" + id} target={"_blank"}>
                <Row>
                  <Col xs={12} sm={12} md={12}
                    className={cx(s.textEllipsis, s.infoReview, s.infoSpaceTop1)}
                  >
                    <div className={cx(s.reviewStar, 'small-star-rating')}>
                      <StarRating
                        value={starRatingValue}
                        name={'review'}
                        className={s.displayInline}
                        starColor={'#fbb342'}
                        emptyStarColor={'#cccccc'}
                      />
                      <span className={s.textInline}>&nbsp; {starRatingValue.toFixed(1)} ({reviewsCount + ' '}{reviewsCount > 1 ? formatMessage(messages.reviews) : formatMessage(messages.review)})
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.listingTitle)}>
                    {title}
                  </Col>
                  <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.infoPrice, s.infoText, s.infoSpaceTop1)}>
                    <span>{city}, {state}, {country}</span>
                  </Col>
                  {
                    listingRetreat && listingRetreat.startDate && listingRetreat.endDate && (
                        <Col xs={12} sm={12} md={12} style={{ margin: "5px 0" }}>
                          <Label bsStyle="default" className={cx(s.label)}>{dateFormatter.format(new Date(listingRetreat.startDate))} ~ {dateFormatter.format(new Date(listingRetreat.endDate))}</Label>
                        </Col>
                    )
                  }

                  <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.infoDesc, s.infoText, s.infoSpace)}>
                    <div className={s.listingInfo}>
                      <ul>
                        {
                          listingRetreat.searchResultsBulletpoints && JSON.parse(listingRetreat.searchResultsBulletpoints).map(item => (
                              <li>
                                <span>{item}</span>
                              </li>
                          ))
                        }
                      </ul>
                    </div>
                  </Col>
                </Row>
              </a>
              <ul className={cx(s.pl5, s.pt4)}>
                {
                  benefits.map(benefit =>
                      <li key={benefit.id}>{ benefit.otherItemName }</li>
                  )
                }
              </ul>
            </div>
          </Col>
          <Col xs={12} md={2} className={s.itemActions}>
            <div className={cx(s.currencyWrapper)}>
              <span>{currency.toUpperCase()}</span>
              &nbsp;
              {
                <CurrencyConverter
                    amount={basePrice}
                    from={currency}
                />
              }
            </div>
            <FreeCancellation className={s.freeCancellation} />
          </Col>
          <Link to={"/retreats/" + id} className={s.detailButton} >
            Details
          </Link>
        </Row>
      </div>
    );
  }
}

// export default injectIntl(withStyles(s)(ListingItem));
//export default injectIntl(withStyles(s)(ListingItem));

const mapState = (state) => ({
  isMapShow: state.personalized.showMap,
  listingFields: state.listingFields.data
});

const mapDispatch = {
  change
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ListingItem)));
