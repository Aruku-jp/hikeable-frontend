import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "./context/UseAuthContext";

interface CompletedTrailsProps {
  trailID: number;
  userID: number | undefined;
}

type trailCompletionObject = {
  id: number;
  user: number;
  trail_id: number;
  completion: true;
  date: string;
};

export const CompletedTrails = ({ userID, trailID }: CompletedTrailsProps) => {
  const [completed, setCompleted] = useState<boolean>(false);
  const [recordExists, setRecordExists] = useState<boolean>(false);
  const [recordID, setRecordID] = useState<number>(0);
  const [data, setData] = useState<trailCompletionObject[]>([]);

  const { user, userId } = useAuthContext();

  const handleCompletion = async () => {
    if (!recordExists) {
      await axios({
        method: "post",
        url: "https://hikeable-backend.herokuapp.com/api/trails/completions",
        data: {
          user: userID,
          trail_id: trailID,
          completion: true,
          date: "2022-12-6",
        },
      });

      fetchCompletionData();
    } else if (completed && recordExists) {
      await axios({
        method: "put",
        url: `https://hikeable-backend.herokuapp.com/api/trails/completions/${recordID}`,
        data: {
          user: userID,
          trail_id: trailID,
          completion: false,
          date: "2022-12-6",
        },
      });
      setCompleted(false);
    } else if (!completed && recordExists) {
      await axios({
        method: "put",
        url: `https://hikeable-backend.herokuapp.com/api/trails/completions/${recordID}`,
        data: {
          user: userID,
          trail_id: trailID,
          completion: true,
          date: "2022-12-6",
        },
      });
      setCompleted(true);
    }
  };

  const fetchCompletionData = async () => {
    const fetchedCompletionData = await axios.get(
      `https://hikeable-backend.herokuapp.com/api/trails/${trailID}/completions`
    );
    setData(fetchedCompletionData.data);
  };

  useEffect(() => {
    fetchCompletionData();
  }, []);

  useEffect(() => {
    for (let object of data) {
      if (object.user === userID) {
        setRecordExists(true);
        setRecordID(object.id);

        if (object.completion === true) setCompleted(true);
      }
    }
  }, [data]);

  return (
    <>
      {completed === true ? (
        <>
          <IconButton aria-label="favorite" onClick={handleCompletion}>
            <CheckBoxIcon></CheckBoxIcon>
          </IconButton>
        </>
      ) : (
        <>
          <IconButton aria-label="favorite-outline" onClick={handleCompletion}>
            <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
          </IconButton>
        </>
      )}
    </>
  );
};
