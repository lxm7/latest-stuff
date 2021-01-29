import {
  CardTypes,
  PaymentCardType,
} from 'components/travelBookings/common/CardDropdown';

/** Example of payment cards previously saved by user  */
export const paymentCardsWithUserType = {
  user: {
    cards: {
      cards: [
        {
          card: {
            brand: 'visa' as CardTypes,
            description: '**** **** **** 5556',
            expiry: '1/2021',
            id: 'f87b461b-a029-4cb6-8884-8f6a992b7767',
            lastFour: '5556',
            type: PaymentCardType.USER,
          },
        },
      ],
    },
  },
};

/** Example of payment cards previously saved by user with hotel */
export const paymentCardsWithUserAndHotelType = {
  user: {
    cards: {
      cards: [
        {
          card: {
            brand: 'visa' as CardTypes,
            description: '**** **** **** 5556',
            expiry: '1/2021',
            id: 'f87b461b-a029-4cb6-8884-8f6a992b7767',
            lastFour: '5556',
            type: PaymentCardType.USER,
          },
        },
        {
          card: {
            brand: 'visa' as CardTypes,
            description: '**** **** **** 5556',
            expiry: '1/2021',
            id: 'f87b461b-a029-4cb6-8884-8f6a992b7767',
            lastFour: '5556',
            type: PaymentCardType.HOTEL,
          },
        },
      ],
    },
  },
};
