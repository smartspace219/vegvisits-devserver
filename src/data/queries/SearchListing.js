import searchListingType from '../types/searchListingType';
import {
  Listing,
  ListBlockedDates,
  UserListingSteps,
  ListPhotos,
  ListingRetreats,
} from '../../data/models';
import sequelize from '../sequelize';
import { convert } from '../../helpers/currencyConvertion';
import { convert_objects, isEmpty } from '../../helpers/mergeObjects';
import isValidNumber from '../../helpers/isValidNumber';
import logger from '../../core/logger';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BoolType
} from 'graphql';

import Sequelize from 'sequelize';

const SearchListing = {

  type: searchListingType,

  args: {
    category: { type: new List(IntType) },
    atmosphere: { type: new List(IntType) },
    listType: { type: StringType },
    personCapacity: { type: IntType },
    dates: { type: StringType },
    currentPage: { type: IntType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    roomType: { type: new List(IntType) },
    meal: { type: new List(IntType) },
    houseType: { type: new List(IntType) },
    kitchenType: { type: new List(StringType) },
    dietType: { type: new List(IntType) },
    bedrooms: { type: IntType },
    bathrooms: { type: IntType },
    beds: { type: IntType },
    amenities: { type: new List(IntType) },
    spaces: { type: new List(IntType) },
    houseRules: { type: new List(IntType) },
    priceRange: { type: new List(IntType) },
    durationRange: { type: new List(IntType) },
    geography: { type: StringType },
    bookingType: { type: StringType },
    geoType: { type: StringType },
    searchByMap: { type: BoolType },
    sw_lat: { type: FloatType },
    sw_lng: { type: FloatType },
    ne_lat: { type: FloatType },
    ne_lng: { type: FloatType },
    petsAllowed: { type: BoolType }
  },

  async resolve({ request }, {
    category,
    atmosphere,
    listType,
    personCapacity,
    dates,
    currentPage,
    lat,
    lng,
    roomType,
    meal,
    houseType,
    kitchenType,
    dietType,
    bedrooms,
    bathrooms,
    beds,
    amenities,
    spaces,
    houseRules,
    priceRange,
    durationRange,
    geography,
    bookingType,
    geoType,
    searchByMap,
    sw_lat,
    sw_lng,
    ne_lat,
    ne_lng,
    petsAllowed
  }) {
    const Op = Sequelize.Op;
    let filter = {};
    let limit = 12;
    let offset = 0;
    let attributesParam = ['id', 'title', 'personCapacity', 'lat', 'lng', 'city', 'state', 'country', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount', 'kitchen', 'listType', 'experienceCategory'];
    if (isValidNumber(lng) && isValidNumber(lat)) {
      attributesParam.push(
        [Sequelize.literal(
          `CASE 
                WHEN ST_DISTANCE(ST_GeomFromText('POINT(${lat} ${lng})', 4326), ST_GeomFromText(concat('POINT(',lat,' ',lng,')'), 4326), 'kilometre') <= 5 THEN 1
                WHEN ST_DISTANCE(ST_GeomFromText('POINT(${lat} ${lng})', 4326), ST_GeomFromText(concat('POINT(',lat,' ',lng,')'), 4326), 'kilometre') <= 10 THEN 2
                WHEN ST_DISTANCE(ST_GeomFromText('POINT(${lat} ${lng})', 4326), ST_GeomFromText(concat('POINT(',lat,' ',lng,')'), 4326), 'kilometre') <= 20 THEN 3
                WHEN ST_DISTANCE(ST_GeomFromText('POINT(${lat} ${lng})', 4326), ST_GeomFromText(concat('POINT(',lat,' ',lng,')'), 4326), 'kilometre') <= 30 THEN 4
                WHEN ST_DISTANCE(ST_GeomFromText('POINT(${lat} ${lng})', 4326), ST_GeomFromText(concat('POINT(',lat,' ',lng,')'), 4326), 'kilometre') <= 40 THEN 5
                ELSE 6
                END`
        ), 'distanceClass']
      );
    }
    // Just for debugging purposes to see the distance value:
    // attributesParam.push([sequelize.fn('ST_DISTANCE', sequelize.fn('POINT', lng, lat), sequelize.fn('POINT', sequelize.col('lng'), sequelize.col('lat'))), 'distance']);
    let havingParam = ['id > ?', 0];
    let publishedStatus = {}, personCapacityFilter = {}, datesFilter = {}, locationFilter = {}, listTypeFilter = {}, categoryFilter = {}, atmosphereFilter = {};
    let mealFilter = {};
    let roomTypeFilter = {}, houseTypeFilter = {}, bedroomsFilter = {}, bathroomsFilter = {}, bedsFilter = {};
    let amenitiesFilter = {}, spacesFilter = {}, houseRulesFilter = {}, priceRangeFilter = {}, durationRangeFilter = {}, geographyFilter = {};
    let bookingTypeFilter = {}, unAvailableFilter = {}, kitchenTypeFilter = {}, petsAllowedFilter = {}, dietTypeFilter = {};

    if (bookingType && bookingType === 'instant') {
      bookingTypeFilter = {
        bookingType
      }
    } /*else {
      bookingTypeFilter = {
        bookingType: 'instant'
      }
    }*/
    // In case the 180° meridian is in our area of interest
    if (searchByMap && sw_lat && ne_lat && sw_lng && ne_lng && sw_lng > ne_lng) {
      geographyFilter = {
        id: {
          [Op.in]: [
            sequelize.literal(`
                SELECT
                    id
                FROM
                    Listing
                WHERE
                    (
                       lat BETWEEN ${sw_lat} AND ${ne_lat} 
                    ) AND (
                       lng >= ${sw_lng} OR lng <= ${ne_lng}
                    )
              `)
          ]
        }
      };
    } else if (searchByMap && sw_lat && ne_lat && sw_lng && ne_lng) {
      geographyFilter = {
        id: {
          [Op.in]: [
            sequelize.literal(`
                SELECT
                    id
                FROM
                    Listing
                WHERE
                    (
                       lat BETWEEN ${sw_lat} AND ${ne_lat} 
                    ) AND (
                       lng BETWEEN ${sw_lng} AND ${ne_lng}
                    )
              `)
          ]
        }
      };
    } else {
      if (geoType) {
        let geographyConverted = await JSON.parse(geography);
        if (geoType === 'state') {
          geographyFilter = {
            [Op.or]: [
              {
                state: geographyConverted.administrative_area_level_1_short
              },
              {
                state: {
                  [Op.like]: geographyConverted.administrative_area_level_1_long + '%'
                }
              }
            ]
          };
          if (sw_lat && ne_lat && sw_lng && ne_lng) {
            geographyFilter[Op.or].push(
              {
                id: {
                  [Op.in]: [
                    sequelize.literal(`
                        SELECT
                            id
                        FROM
                            Listing
                        WHERE
                            (
                               lat BETWEEN ${sw_lat} AND ${ne_lat} 
                            ) AND (
                               lng BETWEEN ${sw_lng} AND ${ne_lng}
                            )
                      `)
                  ]
                }
              }
            )
          }
        } else if (geoType === 'country') {
          geographyFilter = {
            country: geographyConverted.country
          };
        }
      } else {
        if (lat && lng) {
          let distanceValue = 50;
          geographyFilter = {
            id: {
              [Op.in]: [
                sequelize.literal(`
                SELECT
                    id
                FROM
                    Listing
                WHERE
                    (
                        6371 *
                        acos(
                            cos( radians( ${lat} ) ) *
                            cos( radians( lat ) ) *
                            cos(
                                radians( lng ) - radians( ${lng} )
                            ) +
                            sin(radians( ${lat} )) *
                            sin(radians( lat ))
                        )
                    ) < ${distanceValue}
              `)
              ]
            }
          };
        }
      }
    }

    /* if(geography != undefined){
      let geographyConverted;
      // Convert string to JSON object
      geographyConverted = await JSON.parse(geography);

      if('route' in geographyConverted) {
        geographyFilter = {
          [Op.or]: [
            {
              street: geographyConverted.route
            },
            {
              city: {
                [Op.like]: geographyConverted.locality + '%'
              }
            },
            {
              city: {
                [Op.like]: geographyConverted.administrative_area_level_2  + '%'
              }
            }
          ]
        };
      } else if('street_address' in geographyConverted) {
        geographyFilter = {
          [Op.or]: [
            {
              street: geographyConverted.street_address
            },
            {
              city: {
                [Op.like]: geographyConverted.locality + '%'
              }
            },
            {
              city: {
                [Op.like]: geographyConverted.administrative_area_level_2  + '%'
              }
            }
          ]
        };
      } else if('postal_code' in geographyConverted) {
         geographyFilter = {
          [Op.or]: [
            {
              zipcode: geographyConverted.postal_code
            },
            {
              city: {
                [Op.like]: geographyConverted.locality + '%'
              }
            },
            {
              city: {
                [Op.like]: geographyConverted.administrative_area_level_2  + '%'
              }
            }
          ]
        };
      } else if('locality' in geographyConverted || 'administrative_area_level_2' in geographyConverted || 'political' in geographyConverted) {
         geographyFilter = {
          [Op.or]: [
            {
              city: {
                [Op.like]: geographyConverted.locality + '%'
              }
            },
            {
              city: {
                [Op.like]: geographyConverted.administrative_area_level_2  + '%'
              }
            },
            {
              city: {
                [Op.like]: geographyConverted.political  + '%'
              }
            }
          ]
        };
      } else if('administrative_area_level_1_short' in geographyConverted || 'administrative_area_level_1_long' in geographyConverted) {
         geographyFilter = {

          [Op.or]: [
            {
              state: geographyConverted.administrative_area_level_1_short
            },
            {
              state: {
                [Op.like]: geographyConverted.administrative_area_level_1_long  + '%'
              }
            }
          ]
        };
      } else if('country' in geographyConverted) {
         geographyFilter = {
           country: geographyConverted.country
          };
      }


    } */



    if (priceRange != undefined && priceRange.length > 0) {

      priceRangeFilter = {
        // [Op.and]: [
        // {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM ListingData WHERE (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode=currency limit 1)) BETWEEN ${priceRange[0]} AND ${priceRange[1]}`)
          ]
        }
        //  }
        //]
      };
    }

    if (durationRange != undefined && durationRange.length > 0 && listType === 'retreats') {
      let rangeCondition;
      if (durationRange[1] < 30) rangeCondition = `DATEDIFF(endDate, startDate) BETWEEN ${durationRange[0]} AND ${durationRange[1]}`;
      else rangeCondition = `DATEDIFF(endDate, startDate) > ${durationRange[0]}`;

      durationRangeFilter = {
        // [Op.and]: [
        // {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM ListingRetreats WHERE ${rangeCondition}`)
          ]
        }
        //  }
        //]
      };
      console.log("duration filter:", `SELECT listId FROM ListingRetreats WHERE ${rangeCondition}; `, durationRangeFilter);
    }

    unAvailableFilter = {
      // [Op.and]: [
      // {
      id: {
        [Op.notIn]: [
          sequelize.literal(`SELECT listId FROM ListingData WHERE maxDaysNotice='unavailable'`)
        ]
      }
      //  }
      //]
    };


    // Offset from Current Page
    if (currentPage) {
      offset = (currentPage - 1) * limit;
    }

    // Published Status
    publishedStatus = {
      isPublished: true,
    };

    // Bedrooms Filter
    if (bedrooms) {
      bedroomsFilter = {
        bedrooms: {
          [Op.gte]: bedrooms
        }
      };
    }

    // Bathrooms Filter
    if (bathrooms) {
      bathroomsFilter = {
        bathrooms: {
          [Op.gte]: bathrooms
        }
      };
    }

    // Beds Filter
    if (beds) {
      bedsFilter = {
        beds: {
          [Op.gte]: beds
        }
      };
    }


    // Person Capacity Filter
    if (personCapacity && (listType == 'stays' || listType == 'stays_with')) {
      personCapacityFilter = {
        personCapacity: {
          [Op.gte]: personCapacity
        }
      };
    }
    
    if (category && Array.isArray(category) && category.length > 0 && listType == 'stays_with') {
      categoryFilter = {
        experienceCategory: {
          [Op.in]: category
        }
      };
    }

    // Person Capacity Filter
    if (category && Array.isArray(category) && category.length > 0 && listType === 'retreats') {
      const categories = await ListingRetreats.findAll({
        where: {
          category: {
            [Op.in]: category
          }
        },
      })
      categoryFilter = {
        id: {
          [Op.in]: categories.map(item => item.listId)
        }
      };
    }

    if (atmosphere && Array.isArray(atmosphere) && atmosphere.length > 0 && listType === 'retreats') {
      console.log('===== Search Listing Atmosphere ===', atmosphere);
      let queries = [];
      for (let i = 0; i < atmosphere.length; i ++) {
        queries.push({
          [Op.like]: `%${atmosphere[i]}%`
        })
      }
      const atmospheres = await ListingRetreats.findAll({
        where: {
          atmospheres: {
            [Op.or]: queries
          }
        },
      })
      atmosphereFilter = {
        id: {
          [Op.in]: atmospheres.map(item => item.listId)
        }
      };
    }

    // Kitchen Type Filter
    if (kitchenType && kitchenType.length > 0) {
      kitchenTypeFilter = {
        kitchen: {
          [Op.in]: kitchenType
        }
      };
    }

    // Host Diet Filter
    if (dietType && dietType.length > 0) {
      dietTypeFilter = {
        userId: {
          [Op.in]: [
            sequelize.literal(`SELECT DISTINCT userId FROM UserDiets WHERE dietId IN (${dietType.toString()})`)
          ]
        }
      };
    }

    // Date Range Filter
    const regex = /CAST\('\d{4}-\d\d-\d\d \d\d:\d\d:\d\d' AS DATETIME\) AND CAST\('\d{4}-\d\d-\d\d \d\d:\d\d:\d\d' AS DATETIME\)/;
    const validDates = regex.test(dates);
    if (dates && !validDates) {
      logger.warn(`data.queries.SearchListing.SearchListing.resolve: Invalid dates parameter specified: ${dates}`);
    }
    if (dates && validDates) {
      datesFilter = {
        [Op.or]: [
          {
            id: {
              [Op.notIn]: [
                sequelize.literal("SELECT DISTINCT listId FROM ListBlockedDates Where calendarStatus!='available'")
              ]
            }
          },
          {
            id: {
              [Op.notIn]: [
                sequelize.literal("SELECT DISTINCT listId FROM ListBlockedDates WHERE blockedDates BETWEEN" + dates + "and calendarStatus!='available'")
              ]
            }
          }
        ]
      }
    }


    // Meal Filter
    if (meal != undefined && meal.length > 0 && listType == 'retreats') {

      mealFilter = {
        // [Op.and]: [
        //   {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM ListingRetreats WHERE id in (SELECT listingRetreatId FROM HasRetreatMeals WHERE mealId in(${meal.toString()}))`)
          ]
        }
        //  }
        // ]
      };
    }

    // Room type Filter
    if (roomType != undefined && roomType.length > 0 && (listType === 'stays' || listType === 'stays_with')) {

      //roomTypeFilter = ` AND id in` + sequelize.literal(`SELECT listId FROM UserListingData WHERE settingsId in(${roomType.toString()})`);
      roomTypeFilter = {
        // [Op.and]: [
        //   {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM UserListingData WHERE settingsId in(${roomType.toString()})`)
          ]
        }
        //  }
        // ]
      };
    }
    //House Type Filter
    if (houseType != undefined && houseType.length > 0) {
      houseTypeFilter = {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM UserListingData WHERE settingsId in(${houseType.toString()})`)
          ]
        }
      };
    }
    // Amenities Filter
    if (amenities != undefined && amenities.length > 0) {
      //amenitiesFilter = ` AND id in` + sequelize.literal(`SELECT listId FROM UserAmenities WHERE amenitiesId in(${amenities.toString()}) GROUP BY listId HAVING COUNT(listId) >= ${amenities.length}`);
      amenitiesFilter = {
        //[Op.and]: [
        // {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM UserAmenities WHERE amenitiesId in(${amenities.toString()}) GROUP BY listId HAVING COUNT(listId) >= ${amenities.length}`)
          ]
        }
        // }
        // ]
      };
    }


    // Spaces Filter
    if (spaces != undefined && spaces.length > 0) {
      spacesFilter = {
        //[Op.and]: [
        //  {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM UserSpaces WHERE spacesId in(${spaces.toString()}) GROUP BY listId HAVING COUNT(listId) >= ${spaces.length}`)
          ]
        }
        //   }
        //  ]
      };
    }

    // House Rules Filter
    if (houseRules != undefined && houseRules.length > 0) {
      houseRulesFilter = {
        // [Op.and]: [
        //   {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT listId FROM UserHouseRules WHERE houseRulesId in(${houseRules.toString()}) GROUP BY listId HAVING COUNT(listId) >= ${houseRules.length}`)
          ]
        }
        //   }
        //  ]
      };
    }

    // Companian Animals Filter
    if (petsAllowed === true) {
      petsAllowedFilter = {
        id: {
          [Op.in]: [
            sequelize.literal(`SELECT DISTINCT listId FROM UserHouseRules WHERE houseRulesId=103`)
          ]
        }
      };
    }

    // Listing Type Filter
    if (listType && (listType == 'stays' || listType == 'stays_with' || listType == 'retreats')) {
      switch (listType) {
        case 'stays':
          listTypeFilter = {
            listType: 'Stays'
          };
          break;

        case 'stays_with':
          listTypeFilter = {
            listType: 'Stays',
            experienceCategory: {[Op.not]: null}
          };
          break;

        default:
          listTypeFilter = {
            listType: 'Retreats'
          };
          break;
      }
    }

    // SQL query for count
    const listingCount = await Listing.findAll({
      attributes: attributesParam,
      where: {
        [Op.and]: [
          bookingTypeFilter,
          publishedStatus,
          personCapacityFilter,
          datesFilter,
          roomTypeFilter,
          houseTypeFilter,
          kitchenTypeFilter,
          dietTypeFilter,
          bedroomsFilter,
          bathroomsFilter,
          bedsFilter,
          amenitiesFilter,
          spacesFilter,
          houseRulesFilter,
          priceRangeFilter,
          durationRangeFilter,
          geographyFilter,
          unAvailableFilter,
          petsAllowedFilter,
          categoryFilter,
          atmosphereFilter,
          listTypeFilter,
          mealFilter
        ],
      },
    });

    let countLength = Object.keys(listingCount).length;

    // SQL query for results
    let orderArray = [
      ['reviewsCount', 'DESC'],
    ];
    // If we have a geography filter then order also by the distance to the searched location
    if (geographyFilter && !isEmpty(geographyFilter) && isValidNumber(lng) && isValidNumber(lat)) {
      orderArray.unshift(Sequelize.literal('distanceClass ASC')); // an alternative would be to do this only when searchByMap is not true
      orderArray.push([sequelize.fn('ST_DISTANCE', sequelize.fn('POINT', lng, lat), sequelize.fn('POINT', sequelize.col('lng'), sequelize.col('lat'))), 'ASC']);
    } else { // add onother order attribute to avoid unexpected paging (offset/limit) behaviour by MySQL
      orderArray.push(['id', 'ASC']);
    }

    console.log('=====================================================> category filter:', bookingTypeFilter,
      publishedStatus,
      personCapacityFilter,
      datesFilter,
      roomTypeFilter,
      houseTypeFilter,
      kitchenTypeFilter,
      dietTypeFilter,
      bedroomsFilter,
      bathroomsFilter,
      bedsFilter,
      amenitiesFilter,
      spacesFilter,
      houseRulesFilter,
      priceRangeFilter,
      durationRangeFilter,
      geographyFilter,
      unAvailableFilter,
      petsAllowedFilter,
      categoryFilter,
      atmosphereFilter,
      listTypeFilter,
      mealFilter)

    const listingData = await Listing.findAll({
      attributes: attributesParam,
      where: {
        [Op.and]: [
          bookingTypeFilter,
          publishedStatus,
          personCapacityFilter,
          datesFilter,
          roomTypeFilter,
          houseTypeFilter,
          kitchenTypeFilter,
          dietTypeFilter,
          bedroomsFilter,
          bathroomsFilter,
          bedsFilter,
          amenitiesFilter,
          spacesFilter,
          houseRulesFilter,
          priceRangeFilter,
          durationRangeFilter,
          geographyFilter,
          unAvailableFilter,
          petsAllowedFilter,
          categoryFilter,
          atmosphereFilter,
          listTypeFilter,
          mealFilter
        ],
      },
      limit: limit,
      offset: offset,
      order: orderArray,
    });

    // console.log("******************************Search Listing Result**********************************");
    // console.log(listingData);
    return {
      count: countLength,
      results: listingData
    }

  },
};

export default SearchListing;
