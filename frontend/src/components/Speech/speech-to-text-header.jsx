import Body from "./speech-to-text-body";
function Header() {
  return (
    <div className="flex items-center w-full h-[65px] px-4 bg-[#F7F9FB] border border-solid border-[#C6C6CD]">
      <span className="font-['Hanken_Grotesk'] font-bold text-[24px] leading-[32px] text-black">
        Speech Analysis
      </span>

      {/* right side container */}
      <div className="ml-auto flex items-center gap-3">
        <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[#F7F9FB]">
          🔔
        </button>

        <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[#F7F9FB]">
          ⚙️
        </button>

        <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors">
          D
        </button>
      </div>
    </div>
  );
}

export default Header;
