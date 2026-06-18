

import type { Commentary } from "../types";

interface Props {
  items: Commentary[];
}

export default function CommentaryPanel({ items }: Props) {
  return (
    <div className="commentary">
      <div className="panelTitle">Live Commentary</div>

      {items.length === 0 && <div className="empty">Select match</div>}

      {items.map((item) => (
        <div key={item.id} className="event">
          <div className="minute">{item.minute}'</div>

          <div>
            <b>{item.actor}</b>

            <p>{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
