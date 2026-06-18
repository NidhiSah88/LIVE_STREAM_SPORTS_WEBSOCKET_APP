import type { Commentary } from "../types";

type Props = {
  updates: Commentary[];
};

export default function CommentaryFeed({ updates }: Props) {
  return (
    <div>
      <h3>Live Commentary</h3>

      {updates.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 10,

            background: "#222",

            marginTop: 10,
          }}
        >
          <div>⏱{item.minute}'</div>

          <div>{item.message}</div>
        </div>
      ))}
    </div>
  );
}
