defmodule PeekWeb.Schema.Schema do
  @moduledoc """
  GraphQL Schema for bookings and events.
  """
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)

  alias PeekWeb.Resolvers.EventResolver
  alias PeekWeb.Resolvers.BookingResolver

  query do
    @desc "Get a list of events by date"
    field :events, list_of(:event) do
      arg :date, non_null(:date)
      resolve(&EventResolver.get_events/3)
    end

    @desc "Get a list of bookings from an event"
    field :bookings, list_of(:booking) do
      arg :event_id, non_null(:integer)
      resolve(&BookingResolver.get_bookings/3)
    end
  end

  mutation do
    @desc "Create a booking"
    field :create_booking, type: :booking do
      arg :event_id, non_null(:integer)
      arg :first_name, non_null(:string)
      arg :last_name, non_null(:string)

      resolve &BookingResolver.create_booking/3
    end
  end

  object :event do
    field :id, non_null(:id)
    field :start, non_null(:naive_datetime)
    field :duration, non_null(:integer)
    field :title, non_null(:string)
  end

  object :booking do
    field :first_name, non_null(:string)
    field :last_name, non_null(:string)
  end
end
