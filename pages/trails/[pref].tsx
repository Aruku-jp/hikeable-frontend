import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { Filter, TrailCard } from "../../components";
import { Trail } from "../../global";
import { useEffect, useState } from "react";

const _ = require("lodash");


async function fetcher(url: string) {
  const { data } = await axios.get(url);
  return data;
}

function GetTrailData() {
  const { data, error } = useSWR(
    "https://hikeable-backend.herokuapp.com/api/trails",
    fetcher
  );
  return data;
}

const ResultList = () => {
  const router = useRouter();
  const { pref } = router.query;
  const allTrails = GetTrailData() || [];
  
  useEffect(() => { 
    setTrail(filteredTrails);
  },[])
  
  
  const capitalizePref = _.capitalize(pref);
  const filteredTrails = allTrails
  .filter((trail: Trail) => {
    return pref === trail.prefecture;
  });
  
  const [trails, setTrail] = useState<Trail[] | []>(filteredTrails);

  console.log("🐓 ", trails);


  return (
    <>
      <h1>Trails in {capitalizePref}</h1>
      { 
      // allTrails
      //   .filter((trail: Trail) => {
        
        trails.map((filteredTrail: Trail) => {
          return (
            <TrailCard key={filteredTrail.id} trail={filteredTrail} />
          )}
      //     return pref === trail.prefecture;
      //   })
        )}
        <Filter trails={filteredTrails} setTrail = {setTrail} />
    </>
  );
};

export default ResultList;