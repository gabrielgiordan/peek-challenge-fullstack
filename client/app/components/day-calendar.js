import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

const MILLISECONDS_IN_A_DAY = 86400000;

export default class DayCalendarComponent extends Component {
  @service apolloService;

  @tracked date = new Date();
  @tracked events = [];
  @tracked showBookingModal = false;
  @tracked currentEvent;
  @tracked currentEventBookings = [];
  @tracked bookingFirstName
  @tracked bookingLastName

  hours = [
    '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'
  ];

  constructor() {
    super(...arguments);
    this.loadEvents();
  }

  get formattedDateISOString() {
    return this.date.toLocaleDateString('sv');
  }

  get formattedDate() {
    return this.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get dayOfWeek() {
    return this.date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  @action
  closeBookingModal() {
    this.showBookingModal = false;
  }

  async openBookingModal(event) {
    this.currentEvent = event;
    await this.loadCurrentEventBookings();

    this.showBookingModal = true;
  }

  @action
  async today() {
    this.date = new Date();
    await this.loadEvents();
  }

  @action
  async previous() {
    this.date = new Date(this.date.getTime() - MILLISECONDS_IN_A_DAY);
    console.log(this.date)
    await this.loadEvents();
  }

  @action
  async next() {
    this.date = new Date(this.date.getTime() + MILLISECONDS_IN_A_DAY);
    await this.loadEvents();
  }

  async loadEvents() {
    this.events = await this.apolloService.getEvents(this.formattedDateISOString);
  }

  async loadCurrentEventBookings() {
    this.currentEventBookings = await this.apolloService.getBookings(Number(this.currentEvent.id));
  }

  @action
  async createBooking() {
    await this.apolloService.createBooking(
      Number(this.currentEvent.id),
      this.bookingFirstName,
      this.bookingLastName,
    );

    this.showBookingModal = false;
    this.bookingFirstName = '';
    this.bookingLastName = ''
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true
    }); 
  }

  format12HourTime(date) {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  hourlyGridRowStyle(start, duration) {
    const ROWS_PER_HOUR = 12; // Each hour occupies 12 rows (288 rows per day)
    const ROW_TOP_OFFSET = 2; // Offset for starting a row
  
    const hour = new Date(start).getHours();
    const minute = new Date(start).getMinutes();
    const rowStart = (hour + minute / 60) * ROWS_PER_HOUR + ROW_TOP_OFFSET;
  
    const rowSpan = duration * (ROWS_PER_HOUR / 60);
  
    return htmlSafe(`grid-row: ${rowStart} / span ${rowSpan};`);
  }
}
