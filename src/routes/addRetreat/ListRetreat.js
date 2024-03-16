import React from "react";
import PropTypes from "prop-types";
import { compose } from "react-apollo";

// Style
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListRetreat.css";
import cx from "classnames";
import * as FontAwesome from "react-icons/lib/fa";

// Component
import withoutTawkTo from "../../components/withoutTawkTo";
import Title from "../../components/ListRetreat/Title";
import Location from "../../components/ListRetreat/Location";
import Pricing from "../../components/ListRetreat/Pricing";
import Photos from "../../components/ListRetreat/Photos";
import RoomType from "../../components/ListRetreat/RoomType";

import { Button, FormGroup, Col, Grid, Row } from "react-bootstrap";

// Translation
import { injectIntl, FormattedMessage } from "react-intl";

// Locale
import messages from "../../locale/messages";
import Category from "../../components/ListRetreat/Category";
import YogaType from "../../components/ListRetreat/YogaType";
import RetreatAge from "../../components/ListRetreat/RetreatAge";
import Atmosphere from "../../components/ListRetreat/Atmosphere";
import SkillLevel from "../../components/ListRetreat/SkillLevel";
import Duration from "../../components/ListRetreat/Duration";
import Participants from "../../components/ListRetreat/Participants";
import CancellationPolicy from "../../components/ListRetreat/CancellationPolicy";
import Itinerary from "../../components/ListRetreat/Itinerary";
import Food from "../../components/ListRetreat/Food";
import InstructionLanguage from "../../components/ListRetreat/InstructionLanguage";
import Meal from "../../components/ListRetreat/Meal";
import Drink from "../../components/ListRetreat/Drink";
import LocalInformation from "../../components/ListRetreat/LocalInformation";
import Highlight from "../../components/ListRetreat/highlight";
import EventType from "../../components/ListRetreat/EventType";
import TeacherAlliance from "../../components/ListRetreat/TeacherAlliance";
import { connect } from "react-redux";
import RetreatStyle from "../../components/ListRetreat/RetreatStyle";
import ShortSummary from "../../components/ListRetreat/ShortSummary";
import RetreatSpecial from "../../components/ListRetreat/RetreatSpecial";
import FullDescription from "../../components/ListRetreat/FullDescription";
import RetreatBenefit from "../../components/ListRetreat/RetreatBenefit";
import RetreatIncluded from "../../components/ListRetreat/RetreatIncluded";
import RetreatNotIncluded from "../../components/ListRetreat/RetreatNotIncluded";
import AbilityToBook from "../../components/ListRetreat/AbilityToBook";
import RetreatFullPayment from "../../components/ListRetreat/RetreatFullPayment";
import RetreatPaymentMethod from "../../components/ListRetreat/RetreatPaymentMethod";
import Accommodation from "../../components/ListRetreat/Accommodation";
import RetreatAddons from "../../components/ListRetreat/RetreatAddons";
import Teacher from "../../components/ListRetreat/Teacher";
import {reduxForm} from "redux-form";
import validate from "../../components/ListRetreat/validate";
import submit from "../../components/ListRetreat/submit";

class ListRetreat extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showTip: false,
      tipForm: ''
    }

    this.titleRef = React.createRef();
  }

  componentDidMount() {
    if (this.titleRef.current) {
      const rect = this.titleRef.current;
      console.log('Element offset:', rect);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { formData } = props;

    if (formData && formData.values && formData.values.showTip) {
      return {
        showTip: true,
        tipForm: formData.values.tipForm
      };
    } else {
      return {
        showTip: false,
        tipForm: ''
      };
    }
  }

  render() {
    const {
      title,
      formBaseURI,
      mode,
      listId,
      handleSubmit,
      onSubmit,
      formData,
    } = this.props;
    const {showTip, tipForm} = this.state;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <EventType />
          <Title ref={this.titleRef}/>
          <Location />
          <Category />
          {formData &&
            formData.values &&
            formData.values.eventType &&
            formData.values.eventType === "Training" && <TeacherAlliance />}
          <RetreatStyle />
          <Atmosphere />
          <YogaType />
          <SkillLevel />
          <InstructionLanguage />
          <RetreatBenefit />
          <ShortSummary />
          <RetreatIncluded />
          <RetreatNotIncluded />
          <RetreatSpecial />
          <FullDescription />
          <Meal />
          <Drink />
          <Food />
          <Pricing />
          <Duration />
          <AbilityToBook />
          <RetreatFullPayment />
          <RetreatPaymentMethod />
          <Accommodation />
          <RetreatAddons />
          <CancellationPolicy />
          <Photos />
          <Teacher/>
          <Itinerary />
          <LocalInformation />

          {/*<RoomType />*/}
          {/*<RetreatAge />*/}
          {/*<Participants />*/}
          {/*<Highlight />*/}

        </div>
        {
          showTip && (
              <div className={s.tipContainer}>
                <span className={s.tipIcon}>
                  <FontAwesome.FaLightbulbO />
                </span>
                {
                  tipForm == 'EventType' && (
                      <div>
                        <p>Choose the most relevant retreat type so that guests can more easily connect with your unique retreat offering. We suggest choosing a maximum of 2 types.</p>
                      </div>
                  )
                }
                {
                  tipForm == 'Title' && (
                      <div>
                        <p>Take some time and write this title.</p>
                        <p>Along with the featured image, it will be the part of your listing that is seen first and by the most people. First impressions matter!</p>
                        <p>Be clear and descriptive while making it enticing in 65 characters.</p>
                        <p><b>To keep things consistent, we like to start all titles with the number of days and end with the city or country where the retreat will take place.</b></p>
                        <p>Here are some examples you can use for inspiration:</p>
                        <p>
                          <ul>
                            <li>8 Day “Inner Goddess” Wellness and Inspiration Yoga Retreat, Greece</li>
                            <li>7 Day Restore Your Vitality: Deep & Transforming Experience in Sardinia</li>
                            <li>10 Day Love and Yoga Retreat in the Heart of Sicily</li>
                          </ul>
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'Location' && (
                      <div>
                        <p>
                          The location should be the address of the venue. The name of the venue (eg resort/studio/retreat centre name) is better than a street address.
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'Category' && (
                      <div>
                        <p>
                          Retreat categories help guests connect with your retreat experience. When selecting the categories that apply to your retreat, try to put yourself in the shoes of the guest. Which categories truly embody the essence of what you are offering? Choose those :)
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'ShortSummary' && (
                      <div>
                        <p>
                          An example of a great summary:
                        </p>
                        <p>
                          Imagine a week on the magical ”Island of the Gods” – Bali.
                        </p>
                        <p>Yoga. Healthy Food. Surf. Adventures.</p>
                        <p>A chance to deepen and renew your yoga practice, through daily vinyasa flow classes and workshops. Including yin and restorative yoga.</p>
                        <p>Indulge in tropical fruits such as mango, jackfruit and durians. Eat nourishing vegetarian food and learn more about healthy living and nutrition.</p>
                        <p>Get to experience luscious green rice fields, try out surfing at the world-famous Echo Beach, learn about Balinese culture and watch the sunrise from the top of a mountain.</p>
                        <p>It’s happening – and we’d love for you to be a part of it</p>
                      </div>
                  )
                }
                {
                  tipForm == 'RetreatBenefit' && (
                      <div>
                        <p>
                          You can click each button multiple times to cycle through different pre-crafted benefits that come from our in-depth research into why people go on retreats.
                        </p>
                        <p>
                          Or if you prefer you can create your own. Just make sure they are benefits (connect to the deep and real you), not features (vegetarian meals).
                        </p>
                        <p>
                          If you create your own, talk about how your prospect’s challenges will be met by your offering. Share how the prospect’s lives will change. Tell them what the aspects of the retreat will do for them in clear, compelling language.
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'RetreatIncluded' && (
                      <div>
                        <p>
                          Use the buttons provided to add items that are included in the package price or create your own.
                        </p>
                        <p>
                          Great examples for inspiration:
                        </p>
                        <p>
                          <ul>
                            <li>6 nights beautiful and luxurious accommodation in a relaxing jungle valley</li>
                            <li>7 breakfasts, 6 lunches, and 6 dinners, lovingly prepared by our staff from locally sourced, vegetarian ingredients</li>
                            <li>Rejuvenating Hatha Yoga sessions in the afternoon with our resident expert, Ben</li>
                            <li>Dance and movement sessions with Janice in the mornings</li>
                            <li>FREE airport pickup and dropoff...because we want to meet you as soon as possible :)</li>
                            <li>Integration groups that will help you synthesize the deep transformations that occur during retreats</li>
                            <li>Swimming in the pristine river just 10km from the property</li>
                            <li>Deepening bonds through simple singing around the fire with everyone</li>
                            <li>60-minute massage from Anna, our Swedish-trained head masseuse</li>
                          </ul>
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'RetreatNotIncluded' && (
                      <div>
                        <p>
                          Use this section to indicate any additional costs your guests will encounter during their retreat experience.
                        </p>
                        <p>
                          You can use the buttons provided or create your own.
                        </p>
                        <p>
                          Letting guests know in advance what they should budget for helps them to have a stress-free holiday.
                        </p>
                        <p>Examples:</p>
                        <p>
                          <ul>
                            <li>Flights</li>
                            <li>Travel insurance</li>
                            <li>Airport transfers</li>
                            <li>Meals</li>
                          </ul>
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'RetreatSpecial' && (
                      <div>
                        <p>
                          Focus on who your retreat appeals to most. Women? Men? Ashtanga yogis? Surfers? Imagine you were talking to that person face-to-face and had to describe in one minute what makes your retreat so great. What’s unique about it? Ready, go!
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'FullDescription' && (
                      <div>
                        <p>
                          You’ll add your day-by-day, detailed program itinerary later, so you can leave it out of this section.
                        </p>
                        <p>Here, give a longer description of what it’s like to be on your retreat. Draw people in by describing rich imagery, vivid scenes, and storytelling.</p>
                        <p>Walk guests through the full retreat experience. Get them to feel what it’s really like to be on retreat, and to be a part of your program.</p>
                        <p>Speak to what they are really looking for, and what kind of experience they will get. Remember, they are thinking: what’s in it for me?</p>
                        <p>Pro tips:</p>
                        <p>
                          <ul>
                            <li>Make your paragraphs a maximum of 4 lines, 1-3 is best. This makes it easier to read.</li>
                            <li>Correct spelling and grammar make a big difference. Users have noted that a well-written listing adds an extra layer of trust and care.</li>
                          </ul>
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'Currency' && (
                      <div>
                        <p>
                          We suggest selecting the currency which is mentioned on your website to keep prices clear and consistent on all platforms.
                        </p>
                      </div>
                  )
                }
                {
                  tipForm == 'OftenRetreat0' && (
                      <div>
                          <p>
                              If your retreat is a one-time event, choose this option.
                          </p>
                          <p>
                              When choosing the start and end dates please be sure to select the dates when guests should arrive on-site to start the retreat and the final date of departure, even if there are no activities taking place on those days.
                          </p>
                      </div>
                  )
                }
                {
                  tipForm == 'OftenRetreat1' && (
                      <div>
                          <p>
                              If you are running the same retreat on multiple different dates, choose this option.
                          </p>
                          <p>
                              When choosing the start and end dates please be sure to select the dates when guests should arrive on-site to start the retreat and the final date of departure, even if there are no activities taking place on those days.
                          </p>
                      </div>
                  )
                }
                {
                  tipForm == 'OftenRetreat2' && (
                    <div>
                      <p>
                        This is for centers that offer retreats all year round. Or if you offer retreats for an open period like March to December. People can drop in anytime during this period and start the retreat.
                      </p>
                      <p>
                        Do your retreats have seasonal prices? Add the whole period you are open for here and the seasons dates and prices come further down the screen :)
                      </p>
                      <p>
                        When choosing the start and end dates please be sure to select the dates when guests should arrive on-site to start the retreat and the final date of departure, even if there are no activities taking place on those days.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'UnavailableDates' && (
                    <div>
                      <p>
                        Your unavailable dates will be the dates that guests will not be able to arrive on. So, you will need to extend the unavailable dates out at the beginning to ensure they can not book to arrive right before the unavailable dates.
                      </p>
                      <p>
                        Eg. If your retreat is 5 days and is unavailable from the 10th - 30th of March. You will need to add unavailable dates for the 6th - 30th of March.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'AbilityToBook' && (
                    <div>
                      <p>
                        Add here the number of days before the retreat starting date you want to block for booking. Ex. If you block 2 days before the retreat starting date customers won’t be able to book your retreat 2 days before the retreat starts. This way you will have a couple of days to get ready.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'AbilityToBook' && (
                    <div>
                      <p>
                        Full Payment
                      </p>
                      <p>
                        We recommend offering guests the choice to make the full payment for your retreat/training instead of only the deposit when they pay through ‘Book Instantly’ on our platform.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'AccommodationType' && (
                    <div>
                      <p>
                        Please select the room type that applies to this accommodation option.
                      </p>
                      <p>
                        If it is a shared room be sure to mention if you are able to match single travelers together in a room.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'AccommodationFullPrice' && (
                    <div>
                      <p>
                        Make sure you include at least one accommodation option that covers course fee and housing. This helps guests budget for their trip and have peace of mind that everything is taken care of.
                      </p>
                      <p>
                        We highly recommend having your retreat price end in 9. Why?
                      </p>
                      <p>
                        Because 8 studies published from 1987 to 2004 showed that "charm prices" ($199, $699, $1.49 etc.) boosted sales by an average of 24% compared to nearby prices. Example: list your $2000 retreat at $1999 instead. Simple.
                      </p>
                      <p>
                        Pro tip: the prices included on the listing should be the same price mentioned on your website. This allows us to get your event approved and published more quickly :)
                      </p>
                      <p>
                        Don’t forget to keep this section updated if your dates, prices, or availability change. Our team and guests interested in booking your retreat will thank you!
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'AccommodationDescription' && (
                    <div>
                      <p>
                        A great example for inspiration:
                      </p>
                      <p>
                        Our private accommodation offers guests a tranquil, rejuvenating, home away from home experience.
                      </p>
                      <p>
                        The room has its own bathroom, kitchen and a porch overlooking the jungle.
                      </p>
                      <p>
                        You also get free access to high-speed wifi internet.
                      </p>
                      <p>
                        The bedroom has a spacious and comfortable double bed.
                      </p>
                      <p>
                        Air-conditioning is provided to ensure your comfort during hot days.
                      </p>
                      <p>
                        The price listed is per person or for two people booking together.
                      </p>
                      <p>
                        Pro tip: Free Wi-Fi is often the most requested amenity for travelers. 89% want it. If you offer it, say so! But it’s also wonderful to offer a digital detox. People crave this without even knowing. So whatever you choose, tell them upfront about it.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'RetreatAddons' && (
                    <div>
                      <p>
                        Guests can now choose addons when they checkout.
                      </p>
                      <p>
                        We highly recommend adding multiple addons to your listing. Why?
                      </p>
                      <ul>
                        <li>
                          They increase your bookings.
                        </li>
                        <li>
                          They increase how much you make per booking.
                        </li>
                      </ul>
                      <p>
                        You can use the buttons provided or create your own customized add-ons. Once you have chosen the add-on you will be prompted to input the price.
                      </p>
                      <p>
                        Note: Be sure to select the correct currency when entering the price
                      </p>
                      <p>
                        Addons will be included in the total package price to calculate the commission rate
                      </p>
                      <p>
                        Examples:
                      </p>
                      <ul>
                        <li>Round trip airport transfer, Price: $100</li>
                        <li>Extra day extended stay. Price: $80</li>
                        <li>60-minute healing massage, Price: $75</li>
                      </ul>
                    </div>
                  )
                }
                {
                  tipForm == 'RetreatBeforeDays' && (
                    <div>
                      <p>
                        The remaining balance = total retreat price minus deposit.
                      </p>
                      <p>
                        Example: choosing 30 days here means that within 30 days of the start date, a guest must pay the rest of the balance owed if they had only paid a deposit before. Or if the guest is booking within 30 days of the start date, they must pay the full price up front.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'AllowFlexibility' && (
                    <div>
                      <p>
                        By allowing flexibility on date changes you are increasing the likelihood of bookings.
                      </p>
                      <p>
                        Most customers are very happy when they are able to make changes although they rarely use it.
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'IncreaseBookings' && (
                    <div>
                      <p>
                        By adding a thoughtful and exclusive free gift to your listing you will receive a boost in your ranking and can increase your bookings up to 50%.
                      </p>
                      <p>
                        “Heck, I’d go on that retreat if I got a free room upgrade.” (from an interview with a retreat guest)
                      </p>
                      <p>
                        You’ll also get a banner displayed on your listing to bring more guests to your offer.
                      </p>
                      <p>
                        Here are some of the most effective free gifts:
                      </p>
                      <ul>
                        <li>Packed lunch for guests to take with them on departure day</li>
                        <li>An additional night of accommodation</li>
                        <li>Airport pick-up and drop-off</li>
                        <li>60-minute massage</li>
                      </ul>
                      <p>Examples of free gifts that don’t qualify:</p>
                      <ul>
                        <li>Discounts</li>
                        <li>E-books</li>
                        <li>Mantra initiations</li>
                        <li>Branded tote bags, t-shirts, etc.</li>
                        <li>Anything really cheap, generic, or frivolous</li>
                      </ul>
                    </div>
                  )
                }
                {
                  tipForm == 'MediaInstaUrl' && (
                    <div>
                      <p>
                        We want to connect with you on all platforms to learn more about you and the unforgettable retreat experience you are creating. Share your Instagram handle with us so we can better optimize your retreat listing. More connection = more bookings!
                      </p>
                    </div>
                  )
                }
                {
                  tipForm == 'Itinerary' && (
                    <div>
                      <p>
                        Here you can put any general information about the schedule.
                      </p>
                      <p>Pro tip: include the day and time when guests should arrive. Don’t forget to mention when the first activity of the retreat begins that way no one misses out on anything.</p>
                      <p>Other items to consider including:</p>
                      <ul>
                        <li>Are there any days off?</li>
                        <li>Is everything mandatory, or are some parts optional?</li>
                        <li>When does the last activity finish and at what time are guests required to check out?</li>
                        <li>If your retreat has a set schedule, please enter it below.</li>
                      </ul>
                    </div>
                  )
                }
                {
                  tipForm == 'SeasonalWeather' && (
                    <div>
                      <p>
                        Example:
                      </p>
                      <p>While the weather can’t be predicted, it’s usually nice and sunny on the beach at Echo.</p>
                      <p>June, July, and August are the hottest months, and typically busier with tourists.</p>
                      <p>January, February, and March are the windiest, especially at night, which means it is a slower more peaceful time.</p>
                      <p>Tropical showers usually come through in August - November, but they usually pass quickly.</p>
                      <p>They leave clear blue skies, lots of warm weather, and sunshine making this our favorite season.</p>
                    </div>
                  )
                }
                {
                  tipForm == 'TravelHelp' && (
                    <div>
                      <p>
                        We recommend you provide information on the best flight options, directions, and options from the nearest airports, and driving directions or public transportation options from nearby big cities. Try and remove every obstacle from the guest’s mind about getting to your retreat.
                      </p>
                      <p>Pro tip: When including the best airport for guests to fly in to be sure to add the full airport name, the airport code, and the country.</p>
                      <p>Example: Book your flight to Indira Gandhi International Airport (DEL) in New Delhi, India.</p>
                    </div>
                  )
                }
              </div>
          )
        }
      </div>
    );
  }
}

ListRetreat = reduxForm({
  form: "RetreatForm", // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit,
})(ListRetreat);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
});

const mapDispatch = {};

export default injectIntl(
  compose(
    withoutTawkTo,
    withStyles(s)
  )(connect(mapState, mapDispatch)(ListRetreat))
);
