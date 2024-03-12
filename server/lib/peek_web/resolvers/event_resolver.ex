defmodule PeekWeb.Resolvers.EventResolver do
  alias Peek.Events

  def get_events(_parent, %{date: date}, _resolution) do
    {:ok, Events.get_events(date)}
  end

  def events(_parent, _args, _resolution) do
    {:ok, Events.list_events()}
  end
end
