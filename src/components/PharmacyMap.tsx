"use client";


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";


import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function PharmacyMap({
  pharmacies,
  userPosition,
  
}: {
  pharmacies: any[];
  userPosition: [number, number] | null;
}) {
  return (
    <MapContainer
      center={userPosition || [12.3714, -1.5197]}
      zoom={12}
      style={{
        height: "600px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    {userPosition && (
  <Marker position={userPosition}>
    <Popup>
      📍 Ma position
    </Popup>
  </Marker>
)}
      {pharmacies
  .filter((pharmacy) => pharmacy.latitude && pharmacy.longitude)
  .map((pharmacy) => (
    <Marker
      key={pharmacy.id}
      position={[pharmacy.latitude, pharmacy.longitude]}
        >
          <Popup>
  <strong>{pharmacy.name}</strong>

  <br />

  {pharmacy.city}

  <br />

  {pharmacy.phone}

  <br />
  <br />

  <a
    href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 font-bold"
  >
    🧭 Itinéraire
  </a>
</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}