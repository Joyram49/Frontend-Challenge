import DataTableWithPrime from "./components/DataTable";

const App: React.FC = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='container mt-10'>
        <h1 className='text-center text-3xl font-medium'>
          Artwork Table With Prime React
        </h1>

        <DataTableWithPrime />
      </div>
    </div>
  );
};

export default App;
