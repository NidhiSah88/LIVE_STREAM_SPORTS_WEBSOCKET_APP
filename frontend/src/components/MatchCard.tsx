import type { Match } from "../types";

interface Props {
  match: Match;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function MatchCard({ match, selected, onSelect }: Props) {
  return (
    <div
      className={`match ${selected ? "active" : ""}`}
      onClick={() => onSelect(match.id)}
    >
      <div className="sport">{match.sport}</div>

      <div className="status">
        <span className={match.status === "live" ? "pulse" : ""} />

        {match.status}
      </div>

      <div className="team">
        <span>{match.homeTeam}</span>
        <span className="score">{match.homeScore}</span>
      </div>

      <div className="team">
        <span>{match.awayTeam}</span>
        <span className="score">{match.awayScore}</span>
      </div>

      <button className="watch">Watch Live</button>

      {/* <h2>{match.homeTeam}</h2>

      <div className="score">
        <span>{match.homeScore}</span>:<span>{match.awayScore}</span>
      </div>

      <h2>{match.awayTeam}</h2>

      <button>Watch Live</button> */}
    </div>
  );
}

// import { useEffect, useState } from "react";

// import type { Match, Commentary } from "../types/match";

// import CommentaryFeed from "./CommentaryFeed";

// type Props = {
//   match: Match;
// };

// export default function MatchCard({ match }: Props) {
//   const [updates, setUpdates] = useState<Commentary[]>([]);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8080/ws");

//     ws.onmessage = (event) => {
//       const msg = JSON.parse(event.data);

//       if (msg.type === "welcome") {
//         ws.send(
//           JSON.stringify({
//             type: "subscribe",

//             matchId: match.id,
//           }),
//         );
//       }

//       if (msg.type === "commentary") {
//         setUpdates((prev) => [msg.data, ...prev]);
//       }
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         border: "1px solid #444",

//         padding: 20,

//         marginBottom: 20,
//       }}
//     >
//       <h2>
//         {match.homeTeam}
//         vs
//         {match.awayTeam}
//       </h2>

//       <p>
//         Status:
//         {match.status}
//       </p>

//       <CommentaryFeed updates={updates} />
//     </div>
//   );
// }
