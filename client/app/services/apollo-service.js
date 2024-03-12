import Service from '@ember/service';
import { queryManager } from 'ember-apollo-client';
import GetEventsQuery from 'peek-client/gql/queries/events.graphql';
import GetBookingsQuery from 'peek-client/gql/queries/bookings.graphql'
import CreateBookingMutation from 'peek-client/gql/queries/create-booking.graphql'
/**
 * Emberjs planner service
 */
export default class ApolloService extends Service {
  @queryManager
  apollo;

  /**
   * Build an error status with proper message.
   * @param {*} e
   */
  returnErrorStatus(e) {
    const message = e.errors.map((item) => item.message).join(',');
    return { status: 'error', message };
  }

  /**
   * Fetch all data with our main query
   */
  async getEvents(dateISOString) {
    return await this.apollo.query(
      {
        query: GetEventsQuery,
        variables: {
          dateISOString: dateISOString,
        },
      },
      'events',
    );
  }

  async createBooking(eventId, firstName, lastName) {
    return await this.apollo.mutate(
      { 
        mutation: CreateBookingMutation, 
        variables: {
          eventId: eventId, 
          firstName: firstName, 
          lastName: lastName
        },
      }, 'booking'
    );
  }

  async getBookings(eventId) {
    return await this.apollo.query(
      {
        query: GetBookingsQuery,
        variables: {
          eventId: eventId,
        },
        fetchPolicy: 'network-only'
      },
      'bookings',
    );
  }
}
