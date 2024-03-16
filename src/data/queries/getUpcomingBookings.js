import ReservationType from '../types/ReservationType';
import { Reservation, Threads, ThreadItems } from '../models';
import sequelize from '../sequelize';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

import Sequelize from 'sequelize';

const getUpcomingBookings = {


    type: ReservationType,


    args: {
        listId: { type: new NonNull(IntType) },
    },


    async resolve({ request }, { listId }) {

        const Op = Sequelize.Op;
        if (request.user) {
            const userId = request.user.id;
            let where, date = new Date();
            let checkIn = { [Op.gt]: date };
            let instantBook = 'intantBooking';

            const getReservation = await Reservation.count({
                where: {
                    listId,
                    paymentState: 'completed',
                    [Op.or]: [
                        {

                            reservationState: 'approved'
                        },
                        {
                            reservationState: 'pending'
                        }
                    ],
                },
            });


            // const getThreads = await Threads.findOne({
            //     where: {
            //         listId,
            //         [Op.or]: [
            //             {
            //                 guest: userId
            //             },
            //             {
            //                 host: userId
            //             }
            //         ],
            //     },
            // });

            // const getThreadItemsData = await ThreadItems.count({
            //     where: {
            //         //sentBy: userId,
            //         threadId: getThreads.id,
            //         //type: 'preApproved',
            //         [Op.and]: [
            //             {
            //                 type: {
            //                     [Op.notIn]: [
            //                         // sequelize.literal("SELECT type FROM ThreadItems WHERE type=" + instantBook)
            //                         'intantBooking'
            //                     ]
            //                 }
            //             }

            //         ]
            //     }
            // });


            // const getThreadItems = await Threads.count({
            //     where: {
            //         listId
            //     },
            //     [Op.or]: [
            //         {
            //             guest: userId
            //         },
            //         {
            //             host: userId
            //         }
            //     ],
            //     include: [{
            //         model: ThreadItems,
            //         as: 'threadItems',
            //         require: true,
            //         where: {
            //             type: 'preApproved',
            //             sentBy: userId,
            //             [Op.and]: [
            //                 {
            //                     type: {
            //                         [Op.notIn]: [
            //                             sequelize.literal("SELECT type FROM ThreadItems WHERE type=" + dates)
            //                         ]
            //                     }
            //                 }

            //             ]
            //         }
            //     }]
            // });


            return {
                count: getReservation
            }


        } else {
            return {
                status: "notLoggedIn",
            };
        }
    }
};


export default getUpcomingBookings;




/**


query getUpcomingBookings ($listId: Int!){
  getUpcomingBookings(listId: $listId){
    count
  }
}


**/