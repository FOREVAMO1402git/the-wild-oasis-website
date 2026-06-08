import CabinCard from "../_components/CabinCard";
import { getCabins } from "../_lib/data-service";
// import { connection } from "next/server";

async function CabinList({ filter }) {
  // await connection(); // This page will never be cached and will always be rendered on the server, but it will also wait for the database connection to be established before rendering

  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins;
  if (filter === "all") {
    displayedCabins = cabins;
  } 
  if(filter === 'small'){
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity <= 3)
  }
  if(filter === 'medium'){
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7)
  }
  if(filter === 'large'){
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity >= 8)
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
      {displayedCabins.map(cabin => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
