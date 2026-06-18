import { useEffect, useState } from "react";

import axios from "axios";

import Header from "../components/Header";

import MatchCard from "../components/MatchCard";

import CommentaryPanel from "../components/CommentaryPanel";

import type { Match, Commentary } from "../types";

const API = "http://localhost:8080";

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);

  const [commentary, setCommentary] = useState<Commentary[]>([]);

  const [selected, setSelected] = useState<number>();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    axios.get(`${API}/matches`).then((r) => setMatches(r.data.data));
  }, []);

  useEffect(() => {
    if (!selected) return;

    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => setConnected(true);

    ws.onclose = () => setConnected(false);

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "welcome") {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            matchId: selected,
          }),
        );
      }

      if (msg.type === "commentary") {
        setCommentary((prev) => [msg.data, ...prev]);
      }
    };

    return () => ws.close();
  }, [selected]);

  return (
    <div>
      <Header connected={connected} />

      <div className="layout">
        <div className="matches">
          <h2>Current Matches</h2>

          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              selected={selected === m.id}
              onSelect={setSelected}
            />
          ))}
        </div>

        <CommentaryPanel items={commentary} />
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";

// import { api } from "../api/api";

// import MatchCard from "../components/MatchCard";

// import type { Match } from "../types/match";

// export default function Dashboard() {
//   const [matches, setMatches] = useState<Match[]>([]);

//   useEffect(() => {
//     async function load() {
//       const res = await api.get("/matches?limit=20");

//       setMatches(res.data.data);
//     }

//     load();
//   }, []);

//   return (
//     <div
//       style={{
//         padding: 30,
//         background: "#e29a9a",
//         minHeight: "100vh",
//         color: "white",
//       }}
//     >
//       <h1>⚽ Live Sports App</h1>

//       {matches.map((match) => (
//         <MatchCard key={match.id} match={match} />
//       ))}
//     </div>
//   );
// }
