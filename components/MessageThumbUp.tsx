import { useState } from "react";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton } from "@mui/material";
import axios from "axios";

interface MessageThumbUpProps {
  recordExists: boolean;
  setRecordExists: Function;
  messageDetails: Object;
  userId: number | undefined;
  isLiked: boolean;
  setIsLiked: Function;
  likeID: number;
}

const MessageThumbUp = ({
  recordExists,
  setRecordExists,
  messageDetails,
  userId,
  isLiked,
  setIsLiked,
  likeID,
}: MessageThumbUpProps) => {
  const handleClick = async () => {
    const messageID = messageDetails["data"]["id"];
    
    let current = new Date();

    if (!recordExists) {
      await axios({
        method: "post",
        url: "https://hikeable-backend.herokuapp.com/api/trails/messages/likes",
        data: {
          user: userId,
          message_id: messageID,
          value: 1,
          create_date: `${current.getFullYear()}-${
            current.getMonth() + 1
          }-${current.getDate()}`,
          update_date: null,
        },
      });
      setIsLiked(true);
      setRecordExists(true);
    } else if (isLiked && recordExists) {
      await axios({
        method: "put",
        url: `https://hikeable-backend.herokuapp.com/api/trails/messages/likes/${likeID}`,
        data: {
          user: userId,
          message_id: messageID,
          value: 0,
          // needs to be fixed
          create_date: `${current.getFullYear()}-${
            current.getMonth() + 1
          }-${current.getDate()}`,
          update_date: null,
        },
      });
      setIsLiked(false);
    } else if (!isLiked && recordExists) {
      await axios({
        method: "put",
        url: `https://hikeable-backend.herokuapp.com/api/trails/messages/likes/${likeID}`,
        data: {
          user: userId,
          message_id: messageID,
          value: 1,
          // needs to be fixed
          create_date: `${current.getFullYear()}-${
            current.getMonth() + 1
          }-${current.getDate()}`,
          update_date: null,
        },
      });
      setIsLiked(true);
    }
    console.log(messageID);
  };

  return (
    <>
      {isLiked === true ? (
        <>
          <IconButton onClick={handleClick}>
            <ThumbUpIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={handleClick}>
            <ThumbUpOutlinedIcon />
          </IconButton>
        </>
      )}
    </>
  );
};

export default MessageThumbUp;
