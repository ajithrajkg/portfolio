import type { Place } from "./types";

export type KeralaDistrict = {
  id: string;
  name: string;
  malayalamName: string;
  latitude: number;
  longitude: number;
};

export const KERALA_DISTRICTS: KeralaDistrict[] = [
  { id: "kasaragod", name: "Kasaragod", malayalamName: "കാസർഗോഡ്", latitude: 12.4221964, longitude: 75.1904446 },
  { id: "kannur", name: "Kannur", malayalamName: "കണ്ണൂർ", latitude: 11.9863343, longitude: 75.5479704 },
  { id: "wayanad", name: "Wayanad", malayalamName: "വയനാട്", latitude: 11.7151291, longitude: 76.1271185 },
  { id: "kozhikode", name: "Kozhikode", malayalamName: "കോഴിക്കോട്", latitude: 11.4655936, longitude: 75.89194 },
  { id: "malappuram", name: "Malappuram", malayalamName: "മലപ്പുറം", latitude: 11.1065685, longitude: 76.1101742 },
  { id: "palakkad", name: "Palakkad", malayalamName: "പാലക്കാട്", latitude: 10.7873692, longitude: 76.4742172 },
  { id: "thrissur", name: "Thrissur", malayalamName: "തൃശ്ശൂർ", latitude: 10.4786969, longitude: 76.2736512 },
  { id: "ernakulam", name: "Ernakulam", malayalamName: "എറണാകുളം", latitude: 10.0383947, longitude: 76.5074145 },
  { id: "idukki", name: "Idukki", malayalamName: "ഇടുക്കി", latitude: 9.8154785, longitude: 76.9991599 },
  { id: "kottayam", name: "Kottayam", malayalamName: "കോട്ടയം", latitude: 9.6287383, longitude: 76.6455326 },
  { id: "alappuzha", name: "Alappuzha", malayalamName: "ആലപ്പുഴ", latitude: 9.5003416, longitude: 76.4123364 },
  { id: "pathanamthitta", name: "Pathanamthitta", malayalamName: "പത്തനംതിട്ട", latitude: 9.2780841, longitude: 76.9737443 },
  { id: "kollam", name: "Kollam", malayalamName: "കൊല്ലം", latitude: 8.9674039, longitude: 76.8585783 },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", malayalamName: "തിരുവനന്തപുരം", latitude: 8.5769705, longitude: 77.0501246 },
];

export function isKeralaDistrictPlace(place: Place | null | undefined): boolean {
  return Boolean(
    place?.district
    && KERALA_DISTRICTS.some((district) => district.id === place.district),
  );
}
