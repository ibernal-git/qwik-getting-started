import { component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, Form, server$ } from "@builder.io/qwik-city"
import STYLES from "./index.css?inline"

export default component$(() => {

  // use-Hook and routeLoader$ to get info from server
  const dadJokeSignal = useDadJoke();

  // Send info to server with routeAction$
  const favoriteJokeAction = useJokeVoteAction();

  // Change State with Signals
  const isFavoriteSignal = useSignal(false);

  useTask$(({track}) => {
    track(isFavoriteSignal)
    console.log("FAVORITE (isomorphic)", isFavoriteSignal.value)
    server$(() => {
      console.log("FAVORITE (server)", isFavoriteSignal.value)
    })()
  })

  useStylesScoped$(STYLES)
  

  return (
    <div class="section bright">

      {/* Signals has a property value that contains the returned data */}
      <div>{dadJokeSignal.value.joke}</div>

      {/*
          QwikCity has a Form component that wraps the browser's native <form> element
          will prevent the browser from posting the form and instead post the data using
          JavaScript and emulate the browser's native form behavior without full refresh.
      */}
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id}/>
        <button name="vote" value="up">
          👍
        </button>
        <button name="vote" value="down">
          👎
        </button>

        {/* State is changed and interface is refreshed */}
        <button onClick$={() => isFavoriteSignal.value = !isFavoriteSignal.value}>
          {isFavoriteSignal.value ? "❤️" : "🤍"}
        </button>
      </Form>
    </div>
  )
})

// Use-Hook to get info from server
export const useDadJoke = routeLoader$(async () => {
  const response = await fetch("https://icanhazdadjoke.com", {
    headers: {Accept: "application/json"},
  })
  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  }
})

// use-Hook to send info to server
export const useJokeVoteAction = routeAction$((props) => {
  console.log("VOTE", props)
})