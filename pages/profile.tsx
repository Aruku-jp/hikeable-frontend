import { Button } from "@mui/joy";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";
import { useState } from "react";
import { Filter } from "../components";
import { LineChart } from "../components/LineChart";


const Profile = () => {

const [label, setLabel] = useState<string>("daily")

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = [23, 50, 18, 0 , 100, 50, 100];

const dataFormatted = [{data: 23, date: `11/12/2022`},
{data: 50, date: `10/12/2022`}, {data: 18, date: `8/12/2022`},
{data: 10, date: `5/12/2022`}
]






    return (
        <>  
        <div> Testing</div>


            <LineChart dataSet={dataFormatted} ></LineChart>
          <div>
            User Profile
          </div>
          <div>
                First Name
          </div>
          <div>
                Last Name
          </div>
          <div>
                Change password
          </div>
          <div>
                Upload Picture
          </div>

        {/* <Filter trails = {data}></Filter> */}
            
        </>
    );
}

export default Profile;