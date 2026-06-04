function AudioPlaybackCard() {
  return (
    <div className="flex flex-col justify-center p-4 w-[600px] rounded-lg bg-base-200">
           {" "}
      <div className="flex flex-row items-center gap-4 w-full h-10">
               {" "}
        <button className="btn btn-circle btn-neutral btn-sm">▶️</button>       {" "}
        <div className="flex flex-col justify-center gap-1 w-full">
                   {" "}
          <div className="w-full h-1.5 rounded-full bg-base-300 overflow-hidden" />
                   {" "}
          <div className="flex justify-between w-full">
                       {" "}
            <span className="font-mono text-xs text-base-content/60">
                            12:00            {" "}
            </span>
                       {" "}
            <span className="font-mono text-xs text-base-content/60 ml-15">
                            24:00            {" "}
            </span>
                     {" "}
          </div>
                 {" "}
        </div>
                <button className="btn btn-ghost btn-sm btn-circle">🔊</button> 
           {" "}
      </div>
         {" "}
    </div>
  );
}
export default AudioPlaybackCard;
