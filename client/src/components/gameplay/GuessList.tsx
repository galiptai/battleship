import { Fragment, useEffect, useRef } from "react";
import { Guess } from "./Board";
import { convertCoordinateToLetter } from "../../logic/gameLogic";
import "./GuessList.css";

type guessListProps = {
  container: HTMLDivElement | null;
  player1: string;
  player2: string;
  guesses: Guess[];
};

export function GuessList({ container, guesses, player1, player2 }: guessListProps) {
  const guessBottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    guessBottom.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    if (
      container &&
      guessBottom.current &&
      container.getBoundingClientRect().bottom >= guessBottom.current.getBoundingClientRect().top
    ) {
      console.log(true);
      guessBottom.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <>
      <div className="guess-list guess-list-header">
        <div>Round</div>
        <div>{player1}</div>
        <div>{player2}</div>
      </div>
      <div className="guess-list">
        {guesses.map((guess, i) => (
          <Fragment key={i}>
            {i % 2 === 0 && <div>{Math.ceil((i + 1) / 2)}.</div>}
            <div className={guess.hit ? "guess-hit" : ""}>
              {convertCoordinateToLetter(guess.coordinate.x)}
              {guess.coordinate.y + 1}
            </div>
          </Fragment>
        ))}
        <div ref={guessBottom}></div>
      </div>
    </>
  );
}