import React from "react";

// eslint-disable-next-line react/prop-types
function ShowResult({ result = null, resetGame }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-0'>
      <div className='w-full max-w-[400px] bg-white border-[1px] border-slate-800 drop-shadow-sm rounded-md text-slate-950 py-6 flex justify-center items-center flex-col space-y-2'>
        {result ? (
          <>
            <h1 className=' font-medium text-xl  '>Congratulations!!!</h1>
            <h2 className='text-2xl font-bold '>
              Winner: <span className='text-green-500'>{result}</span>
            </h2>{" "}
          </>
        ) : (
          <>
            <h1 className=' font-medium text-xl  '>It&apos;s a draw!!!</h1>
            <h2 className='text-2xl font-bold text-gray-500 '>
              No winner found!!!
            </h2>
          </>
        )}
        <button
          className='px-4 py-1 bg-[#f8fafa] border-[1px] border-slate-800/10 drop-shadow-sm rounded-sm hover:bg-gray-400 hover:text-slate-50 transition'
          onClick={resetGame}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default ShowResult;
