import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

const EditListingType = new ObjectType({
  name: 'EditListing',
  fields: {
    id: { type: IntType },
    title: { type: StringType },
    description: { type: StringType },
    roomType: { type: StringType },
    houseType: { type: StringType },
    residenceType: { type: StringType },
    bedrooms: { type: StringType },
    buildingSize: { type: StringType },
    bedType: { type: StringType },
    beds: { type: IntType },
    personCapacity: { type: IntType },
    bathrooms: { type: FloatType },
    bathroomType: { type: StringType },
    country: { type: StringType },
    street: { type: StringType },
    buildingName: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    status: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    amenities: { type: new List(IntType)},
    safetyAmenities: { type: new List(IntType)},
    spaces: { type: new List(IntType)},
    houseRules: { type: new List(IntType)},
    bookingNoticeTime: { type: StringType },
    checkInStart: { type: StringType },
    checkInEnd: { type: StringType },
    maxDaysNotice: { type: StringType },
    minNight: { type: StringType },
    maxNight: { type: StringType },
    basePrice: { type: FloatType },
    securityDeposit: { type: FloatType },
    cleaningPrice: { type: FloatType },
    currency: { type: StringType },
    weeklyDiscount: { type: IntType },
    monthlyDiscount: { type: IntType },
    coverPhoto: { type: IntType },
    blockedDates: { type: new List(StringType)},
    kitchen: { type: StringType },
    nonVeg: { type: StringType },
    aboutKitchen: { type: StringType },
    neigutPlaces: { type: StringType },
    abohourhood: { type: StringType },
    notes: { type: StringType },
    services: { type: new List(StringType) },
    moreDetails: { type: StringType },
    additionalRules: { type: StringType }
  },
});

export default EditListingType;
