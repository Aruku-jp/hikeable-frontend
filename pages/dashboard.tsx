import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../components/context/UseAuthContext';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Paper, Typography } from "@mui/material";
import {  Link as MuiLink } from "@mui/joy"
import Link, { NextLinkComposed } from "../src/Link"
import { Trail , trailCompletionObject} from '../global';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { LocationOn } from "@mui/icons-material";
import styles from "../styles/dashboard.module.css"
import axios from 'axios';
import { LineChart } from '../components/LineChart';
import { returnUniqueObjects, getValues } from '../src/ObjectFunctions';

type dummy = {

    "id": number,
    "name": string,
    "prefecture": string,
    "latitude": string,
    "longitude": string,
    "length": number,
    "difficulty": number,
    "photo_url": string,
    "map_url": string

}

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    maxWidth: '20rem',
    minWidth: '15rem',
    lineHeight: '60px',
  }));

const Dashboard  = () => {

    const {user, userId} = useAuthContext()
    const [hiked, setHiked] = useState(0);
    const [completedTrails, setCompleted] = useState<trailCompletionObject[] >([]);
    const [usersCompletedTrails, setUsersCompletedTrails] = useState<Trail[] >([]);
    const [data, setData] = useState<{date: string, length: number}[]>([]);

    const getCompleted = async () => {

        const url = "https://hikeable-backend.herokuapp.com/api/trails/completions";
        await axios.get(url).then( (response) => {
            const result = response.data.filter((completions) => completions.user === userId)  
            setCompleted(result); 
        });
   }

   const getTrails =  () => {
        
        return completedTrails.map( async (singleCompletedTrail) => {

            const response = await axios ({
                method: "get",
                url: `https://hikeable-backend.herokuapp.com/api/trails/${singleCompletedTrail.trail_id}`
            })

            const trail = response.data;

            if (usersCompletedTrails.length >= 0)
                setUsersCompletedTrails( usersCompletedTrails =>  [ ...trail, ...usersCompletedTrails] );
        });
    }
    
    useEffect(  () => {
        if (completedTrails.length === 0)
            getCompleted();
    },[userId])

    useEffect( () => {
        if (usersCompletedTrails.length === 0)
            getTrails();
    }, [completedTrails])

    useEffect( () => {

        console.log(completedTrails);
        let trailUserCompletions = returnUniqueObjects(usersCompletedTrails);
        let tupleArray = getValues(completedTrails, trailUserCompletions );
        setData([...data,...tupleArray]);

        let hikedDistance =  trailUserCompletions.reduce( (total, trail) => {  
            return   total + parseFloat(`${trail.length}`)}, 0.0);
        setHiked(hikedDistance);

    },[usersCompletedTrails])

    return (
        
        <>
            <Box
              sx={{
                flexDirection: "column",
              }}
            >
                <div className= {styles.page_header}>


                <Typography>Hi {user?.displayName} !</Typography>
                  
                    <Item key={7} elevation={7} >
                        {`You've hiked a distance of ${hiked} km` }
                    </Item>
                </div>

                {/* <Typography>You favourite trails are  !</Typography> */}
                {/* <Typography>You favourite trails are  !</Typography> */}

            </Box>
             {data.length >= 0 ?(
                <LineChart dataSet={data}></LineChart>
                ): <>Loading...</>
             }   

            <Typography>You have completed the following trails: !</Typography>

             <div className={styles.completed_trails}>
                {
                    usersCompletedTrails.map((trail: dummy) => {
                    return (  
                        <>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
       
                                <Button
                                    variant='outlined'
                                    
                                    component={NextLinkComposed}
                                    to={{
                                        pathname: "/singletrail",
                                        query: { trail: JSON.stringify(trail) },
                                    }}
                                    linkAs = {`/singletrail/${trail.id}`}
                                >
                                    <CardContent>
                                        <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
                                            {trail.name}  {trail.prefecture}  Difficulty: {trail.difficulty} 
                                        </Typography>
                                    </CardContent>
                                </Button>
                            </Box>
                        </>
                     
                     )
                    })
                } 
             </div> 


            
        </>
    );
}

export default Dashboard;