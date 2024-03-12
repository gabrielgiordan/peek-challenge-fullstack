defmodule PeekWeb.Resolvers.BookingResolver do
  alias Peek.Bookings

  def create_booking(_parent, args, _resolution) do
    Bookings.create_booking(args.event_id, args)
  end

  def get_bookings(_parent, args, _resolution) do
    Bookings.get_bookings(args.event_id)
  end
end
