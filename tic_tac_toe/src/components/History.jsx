// eslint-disable-next-line react/prop-types
function History({ currentStep, history = [], jumpToStep }) {
  return (
    <div className='min-w-[280px] self-start  pt-5 lg:pt-0 lg:pl-5'>
      <h1 className='text-xl font-bold'>History</h1>
      <ol className='mt-2'>
        {history.map((_, step) => (
          <li key={step} className='mb-2'>
            <button
              className={` text-slate-800 px-4 py-2 rounded-md text-lg font-sans ${
                step === currentStep
                  ? "cursor-auto bg-gray-400"
                  : "bg-gray-50 cursor-pointer hover:bg-gray-400"
              } transition duration-100 ease-linear `}
              onClick={() => jumpToStep(step)}
            >
              {step === 0 ? (
                "Go to Start"
              ) : (
                <>
                  Go to move #<span className='font-bold'>{step}</span>
                </>
              )}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default History;
