interface Props {
  connected: boolean;
}

export default function Header({ connected }: Props) {
  return (
    // <header className="header">
    //   <div>
    //     <h1 className="logo">⚽ Sportz+</h1>

    //     <p>Real-time Sports Platform</p>
    //   </div>

    //   <div className="live">
    //     <span className={connected ? "dot active" : "dot"} />

    //     {connected ? "LIVE CONNECTED" : "OFFLINE"}
    //   </div>
    // </header>

    <header className="header">
      <h1 className="logo">
        ⚽ Sport<span>Live</span>
      </h1>

      <div className="live">
        <div className="dot active" />
        LIVE CONNECTED
      </div>
    </header>
  );
}
