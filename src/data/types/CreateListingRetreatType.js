import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const CreateListingRetreatType = new ObjectType({
  name: 'CreateListingRetreat',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    accommodations: { type: StringType },
    teachers: {type: StringType},
    eventType: {type: StringType},
    category: {type: StringType},
    title: {type: StringType},
    location: {type: StringType},
    country: {type: StringType},
    street: {type: StringType},
    city: {type: StringType},
    state: {type: StringType},
    zipcode: {type: StringType},
    lat: {type: StringType},
    lng: {type: StringType},
    subCategory: {type: StringType},
    RetreatStyle: {type: StringType},
    atmospheres: {type: StringType},
    yogaTypes: {type: StringType},
    skillLevels: {type: StringType},
    languageId: {type: StringType},
    benefits: {type: StringType},
    summary: {type: StringType},
    includes: {type: StringType},
    not_includes: {type: StringType},
    special: {type: StringType},
    full_description: {type: StringType},
    instagram_url: {type: StringType},
    meal: {type: StringType},
    drink: {type: StringType},
    food: {type: StringType},
    currency: {type: StringType},
    retreat_dates: {type: StringType},
    duration: {type: IntType},
    min_days: {type: IntType},
    isAllowPayment: {type: BooleanType},
    isCash: {type: BooleanType},
    addons: {type: StringType},
    cancellationPolicy: {type: StringType},
    allow_flexibility: {type: StringType},
    use_increase_booking: {type: StringType},
    free_gift_name: {type: StringType},
    free_gift_desc: {type: StringType},
    itinerary: {type: StringType},
    localInfoDesc: {type: StringType},
    localInformation: {type: StringType},
    facilityFeatures: {type: StringType},
    seasonalInformation: {type: StringType},
    travelHelp: {type: StringType},
    basePrice: {type: StringType},
  },
});

export default CreateListingRetreatType;
