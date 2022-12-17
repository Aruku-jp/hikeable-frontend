import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import styles from "../styles/mapview.module.css";

type MessageDataObject = {
  id: number;
  user: number;
  trail_id: number;
  latitude: string;
  longitude: string;
  message: string;
  likes: number;
  dislikes: number;
  date: string;
};

const LargeMap = ({
  lat,
  lon,
  trailID,
  isSubmitted,
  setIsSubmitted,
  currentPosition,
  setCurrentPosition,
}) => {
  const latNumber = parseFloat(lat);
  const lonNumber = parseFloat(lon);
  const [messageData, setMessageData] = useState<MessageDataObject[]>([]);
  const messageIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
    popupAnchor: [2, -40],
  });
  const locationIcon = L.icon({
    iconUrl: "https://i.postimg.cc/FsTwfJdB/location-Marker.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
    popupAnchor: [2, -40],
  });

  const fetchMessageData = async () => {
    const fetchedMessageData = await axios.get(
      `https://hikeable-backend.herokuapp.com/api/trails/${trailID}/messages`
    );
    if (!messageData) {
      setMessageData(fetchedMessageData.data);
    } else {
      setMessageData([...fetchedMessageData.data]);
    }
    setIsSubmitted(false);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setCurrentPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return currentPosition === null ? null : (
      <Marker position={currentPosition} icon={locationIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    fetchMessageData();
  }, []);

  useEffect(() => {
    fetchMessageData();
  }, [isSubmitted]);

  return (
    <MapContainer
      className={styles.map__wrapper}
      center={[latNumber, lonNumber]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=${process.env.NEXT_PUBLIC_MAP_API}`}
      />
      {messageData.map((message) => {
        const messageLatNumber = parseFloat(message.latitude);
        const messageLonNumber = parseFloat(message.longitude);
        return (
          <Marker
            key={message.id}
            position={[messageLatNumber, messageLonNumber]}
            icon={messageIcon}
          >
            <Popup>{message.message}</Popup>
          </Marker>
        );
      })}
      <LocationMarker />
    </MapContainer>
  );
};

export default LargeMap;
