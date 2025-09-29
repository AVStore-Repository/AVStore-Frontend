import React, { useState, useContext, useEffect, useRef } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { CartContext } from "../context/CartContext";
import { BASE_URL } from "../config/config";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const productCategories = [
  { name: "All Products" },
  {
    name: 'Mixers',
    subcategories: ['Analog Mixers', 'Digital Mixers']
  },
  {
    name: 'Speakers',
    subcategories: ['Active speaker', 'Passive speaker', 'Portable speaker']
  },
  {
    name: 'Microphones',
    subcategories: ['Wired microphone', 'Wireless microphone', 'Podium microphone']
  },
  {
    name: 'Amplifiers',
    subcategories: []
  }
];

// ✅ Full products list with unique IDs
const products = [
  {
    id: 1,
    name: "Lab Gruppen CPA2402 ",
    price: 297000,
    images: ["/images/1.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Amplifire",
  },
  {
    id: 2,
    name: "Behringer KM750",
    price: 155000,
    images: ["/images/2.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Amplifire",
  },
  {
    id: 3,
    name: "Behringer KM1700",
    price: 199000,
    images: ["/images/3.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Amplifire",
  },
  {
    id: 4,
    name: "Behringer EP2000",
    price: 275000,
    images: ["/images/4.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Amplifire",
  },
  {
    id: 5,
    name: "Behringer EP4000",
    price: 329000,
    images: ["/images/5.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Amplifire",
  },
  {
    id: 6,
    name: "Behringer B-5",
    price: 53000,
    images: ["/images/6.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Studio Microphones",
  },
  {
    id: 7,
    name: "Behringer LIVE BUDS",
    price: 24000,
    images: ["/images/7.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Ear buds",
  },
  {
    id: 8,
    name: "Behringer TRUE BUDS",
    price: 56000,
    images: ["/images/8.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Earbuds",
  },
  {
    id: 9,
    name: "Behringer FBQ3102HD",
    price: 125000,
    images: ["/images/9.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Equalizers",
  },
  {
    id: 10,
    name: "Behringer XENYX 1202SFX",
    price: 77000,
    images: ["/images/10.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Analog Mixers",
  },
  {
    id: 11,
    name: "Behringer XENYX RX1202FX",
    price: 111000,
    images: ["/images/11.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Analog Mixers",
  },
  {
    id: 12,
    name: "Behringer XENYX X1204USB",
    price: 117000,
    images: ["/images/12.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Analog Mixers",
  },
  {
    id: 13,
    name: "Behringer XENYX X1222USB",
    price: 146000,
    images: ["/images/13.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Analog Mixers",
  },
  {
    id: 14,
    name: "Behringer XENYX QX1222USB",
    price: 157000,
    images: ["/images/14.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Analog Mixers",
  },
  {
    id: 15,
    name: "Behringer XENYX QX2442USB",
    price: 207000,
    images: ["/images/15.PNG", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Analog Mixers",
  },
  {
    id: 16,
    name: "Behringer SX2442FX",
    price: 330500,
    images: ["/images/16.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category:"Analog Mixers",
  },
    {
    id: 17,
    name: "Behringer X32",
    price: 1500000,
    images: ["/images/17.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Digital Mixers",
  },
  {
    id: 18,
    name: "Behringer X32 COMPACT",
    price: 1154000,
    images: ["/images/18.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Digital Mixers",
  },
  {
    id: 19,
    name: "Midas M32 LIVE",
    price: 2000000,
    images: ["/images/19.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Digital Mixers",
  },
  {
    id: 20,
    name: "Midas M32R LIVE",
    price: 1415000,
    images: ["/images/20.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Digital Mixers",
  },
  {
    id: 21,
    name: "Behringer S32",
    price: 611000,
    images: ["/images/21.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Stage Boxes",
  },
  {
    id: 22,
    name: "Midas DL16",
    price: 606000,
    images: ["/images/22.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Stage Boxes",
  },
  {
    id: 23,
    name: "Behringer PK108",
    price: 40000,
    images: ["/images/23.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Passive Speakers",
  },
  {
    id: 24,
    name: "Behringer PK110",
    price: 54000,
    images: ["/images/24.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Passive Speakers",
  },
  {
    id: 25,
    name: "Behringer PK112",
    price: 73000,
    images: ["/images/25.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Passive Speakers",
  },
  {
    id: 26,
    name: "Behringer PK115 ",
    price: 93000,
    images: ["/images/26.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Passive Speakers",
  },
  {
    id: 27,
    name: "Behringer VP1220",
    price: 185000,
    images: ["/images/27.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Passive Speakers",
  },
  {
    id: 28,
    name: "Behringer VP1520",
    price: 227000,
    images: ["/images/28.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Passive Speakers",
  },
  {
    id: 29,
    name: "Behringer VP1800S",
    price: 243000,
    images: ["/images/29.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Passive Subwoofers",
  },
  {
    id: 30,
    name: "Behringer UMC404HD",
    price: 128000,
    images: ["/images/30.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Audio Interfaces",
  },
  {
    id: 31,
    name: "Behringer PK108A",
    price: 70000,
    images: ["/images/31.PNG", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Active Speakers",
  },
  {
    id: 32,
    name: "Behringer PK110A",
    price: 90000,
    images: ["/images/32.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Active Speakers",
  },
    {
    id: 33,
    name: "Behringer PK112A ",
    price: 115000,
    images: ["/images/33.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Active Speakers",
  },
  {
    id: 34,
    name: "Behringer PK115A",
    price: 135000,
    images: ["/images/34.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Active Speakers",
  },
  {
    id: 35,
    name: "Behringer B112W",
    price: 201000,
    images: ["/images/35.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Active Speakers",
  },
  {
    id: 36,
    name: "Behringer B112D",
    price: 179000,
    images: ["/images/36.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Active Speakers",
  },
  {
    id: 37,
    name: "Behringer B112MP3",
    price: 201000,
    images: ["/images/37.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Active Speakers",
  },
  {
    id: 38,
    name: "Behringer B115MP3",
    price: 251000,
    images: ["/images/38.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Active Speakers",
  },
  {
    id: 39,
    name: "Behringer B1200D-PRO",
    price: 226000,
    images: ["/images/39.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Active Subwoofers",
  },
  {
    id: 40,
    name: "Behringer PPA500BT",
    price: 395000,
    images: ["/images/40.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Portable Speakers",
  },
  {
    id: 41,
    name: "Behringer B1X",
    price: 330000,
    images: ["/images/41.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Portable Speakers",
  },
  {
    id: 42,
    name: "Behringer MPA30BT",
    price: 151000,
    images: ["/images/42.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Portable Speakers",
  },
  {
    id: 43,
    name: "Behringer MPA40BT",
    price: 168000,
    images: ["/images/43.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Portable Speakers",
  },
  {
    id: 44,
    name: "Behringer MPA100BT",
    price: 243000,
    images: ["/images/44.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Portable Speakers",
  },
  {
    id: 45,
    name: "Behringer MPA200BT",
    price: 320000,
    images: ["/images/45.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Portable Speakers",
  },
  {
    id: 46,
    name: "Behringer FX2000",
    price: 114000,
    images: ["/images/46.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Multi Effect Processor",
  },
  {
    id: 47,
    name: "Behringer HA8000",
    price: 117000,
    images: ["/images/47.PNG", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Headphone Amplifiers",
  },
  {
    id: 48,
    name: "Behringer PMP500",
    price: 184000,
    images: ["/images/48.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Powered Mixers",
  },
    {
    id: 49,
    name: "Behringer DI100 ",
    price: 31000,
    images: ["/images/49.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "DI Boxes",
  },
  {
    id: 50,
    name: "Behringer F1320D",
    price: 188000,
    images: ["/images/50.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Active Monitors",
  },
  {
    id: 51,
    name: "Behringer SAT 1004 BUNDLE",
    price: 311000,
    images: ["/images/51.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Active Speaker Bundles",
  },
  {
    id: 52,
    name: "Behringer DCX2496",
    price: 261000,
    images: ["/images/52.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Speaker Management",
  },
  {
    id: 53,
    name: "Behringer DCX2496LE",
    price: 239000,
    images: ["/images/53.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Speaker Management",
  },
  {
    id: 54,
    name: "Behringer DS2800",
    price: 69000,
    images: ["/images/54.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Splitter",
  },
  {
    id: 55,
    name: "Behringer K5",
    price: 76000,
    images: ["/images/55.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Studio Monitors",
  },
  {
    id: 56,
    name: "Behringer B2030A",
    price: 120000,
    images: ["/images/56.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Studio Monitors",
  },
  {
    id: 57,
    name: "Klark Teknik DW-20BR",
    price: 48000,
    images: ["/images/57.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Wireless Audio ",
  },
  {
    id: 58,
    name: "Aston Microphones HALO SHADOW",
    price: 189000,
    images: ["/images/58.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Reflection Filter",
  },
  {
    id: 59,
    name: "Behringer XM1800S - 3 Pack",
    price: 30000,
    images: ["/images/59.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Wired Microphones",
  },
  {
    id: 60,
    name: "Sennheiser XS-1    ",
    price: 40000,
    images: ["/images/60.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Wired Microphones",
  },
  {
    id: 61,
    name: "Sennheiser E835S",
    price: 65000,
    images: ["/images/61.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Wired Microphones",
  },
  {
    id: 62,
    name: "Sennheiser E845S ",
    price: 65000,
    images: ["/images/62.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Wired Microphones",
  },
  {
    id: 63,
    name: "Turbosound IP1000 V2",
    price: 550000,
    images: ["/images/63.PNG", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Column Speakers",
  },
  {
    id: 64,
    name: "Turbosound IP2000 V2",
    price: 780000,
    images: ["/images/64.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Column Speakers",
  },
  {
    id: 65,
    name: "Turbosound IP500 V2  ",
    price: 442000,
    images: ["/images/65.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Column Speakers",
  },
  {
    id: 66,
    name: "Turbosound IQ12",
    price: 531000,
    images: ["/images/66.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Active Speakers",
  },
  {
    id: 67,
    name: "Turbosound IQ15",
    price: 591000,
    images: ["/images/67.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Active Speakers",
  },
  {
    id: 68,
    name: "Turbosound IQ18B",
    price: 656000,
    images: ["/images/68.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Active Subwoofers",
  },
  {
    id: 69,
    name: "Turbosound M12",
    price: 305000,
    images: ["/images/69.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Active Speakers",
  },
  {
    id: 70,
    name: "Behringer ULM300MIC",
    price: 76000,
    images: ["/images/70.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Wireless Microphones",
  },
  {
    id: 71,
    name: "Behringer ULM302MIC",
    price: 118000,
    images: ["/images/71.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Wireless Microphones",
  },
  {
    id: 72,
    name: "Behringer ULM300LAV",
    price: 97000,
    images: ["/images/72.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Wireless Microphones",
  },
  {
    id: 73,
    name: "Behringer ULM300USB",
    price: 70000,
    images: ["/images/73.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "USB Microphones",
  },
  {
    id: 74,
    name: "Behringer ULM202USB",
    price: 84000,
    images: ["/images/74.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "USB Microphones",
  },
  {
    id: 75,
    name: "Sennheiser XSW2 835",
    price: 350000,
    images: ["/images/75.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Wireless Microphones",
  },
  {
    id: 76,
    name: "Sennheiser EW-DX 835",
    price: 1500000,
    images: ["/images/76.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Wireless Microphones",
  },
  {
    id: 77,
    name: "Sennheiser XSWD VOCAL SET",
    price: 323000,
    images: ["/images/77.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Wireless Microphones",
  },
  {
    id: 78,
    name: "Speaker Stand",
    price: 16000,
    images: ["/images/78.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Speaker Stand",
  },
  {
    id: 79,
    name: "Behringer MS2050-L",
    price: 16000,
    images: ["/images/79.PNG", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Microphpne Stand",
  },
  {
    id: 80,
    name: "2M XLR-XLR CABLE",
    price: 3000,
    images: ["/images/80.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Cables",
  },
    {
    id: 81,
    name: "5M XLR-XLR CABLE ",
    price: 4500,
    images: ["/images/81.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Cables",
  },
  {
    id: 82,
    name: "10M XLR-XLR CABLE",
    price: 7000,
    images: ["/images/82.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Cables",
  },
  {
    id: 83,
    name: "15M XLR-XLR CABLE",
    price: 9500,
    images: ["/images/83.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Cables",
  },
  {
    id: 84,
    name: "20.M XLR-XLR CABLE",
    price: 12000,
    images: ["/images/84.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Cables",
  },
  {
    id: 85,
    name: "2M MINI STEREO-TS MONO CABLE",
    price: 4000,
    images: ["/images/85.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Cables",
  },
  {
    id: 86,
    name: "5M MINI STEREO-TS MONO CABLE",
    price: 5500,
    images: ["/images/86.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Cables",
  },
  {
    id: 87,
    name: "10M MINI STEREO-TS MONO CABLE",
    price: 8000,
    images: ["/images/87.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Cables",
  },
  {
    id: 88,
    name: "2M MINI STEREO-RC CABLE",
    price: 4000,
    images: ["/images/88.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Cables",
  },
  {
    id: 89,
    name: "5M MINI STEREO-RC CABLE",
    price: 5500,
    images: ["/images/89.png", "/images/3-2.jpg", "/images/3-3.jpg", "/images/3-4.jpg"],
    description: "High-quality sound box for events with deep bass and clear treble.",
    category: "Cables",
  },
  {
    id: 90,
    name: "2M TS-TS CABLE",
    price: 3000,
    images: ["/images/90.png", "/images/mixer-2.jpg", "/images/mixer-3.jpg", "/images/mixer-4.jpg"],
    description: "Professional audio mixer for DJs and live performances.",
    category: "Cables",
  },
  {
    id: 91,
    name: "5M TS-TS CABLE",
    price: 4500,
    images: ["/images/91.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Clear sound microphone for recording and live shows.",
    category: "Cables",
  },
  {
    id: 92,
    name: "10M TS-TS CABLE",
    price: 7000,
    images: ["/images/92.png", "/images/microphone-2.jpg", "/images/microphone-3.jpg", "/images/microphone-4.jpg"],
    description: "Wireless microphone with excellent range.",
    category: "Cables",
  },
];

export default function Shop() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const { cart, addToCart } = useContext(CartContext);
  const [availableProduct, setAvailableProduct] = useState([]);

  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOpenCategory(null);
  };

  const filteredProducts = availableProduct.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Products" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      productCategories.some(
        (category) =>
          category.name === selectedCategory &&
          category.subcategories &&
          category.subcategories.some(
            (sub) => sub.toLowerCase() === p.category.toLowerCase()
          )
      );
    return matchesSearch && matchesCategory;
  });

  const getAvailableProduct = async ()=>{
     const response = await fetch(
        `${BASE_URL}/products/`, 
        {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
          }
        }
      );
      const data = await response.json();
      setAvailableProduct(data);
      
  }

  useEffect(()=>{
     getAvailableProduct();
  },[])
  

  console.log(availableProduct);
  

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative">
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mt-24 mb-4 relative" ref={dropdownRef}>
        {productCategories.map((category) => (
          <div key={category.name} className="relative w-auto">
            <button
              className={`text-lg font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded ${
                selectedCategory === category.name
                  ? "text-yellow-400 underline"
                  : "text-black hover:text-yellow-300"
              }`}
              onClick={() => {
                if (category.subcategories && category.subcategories.length > 0) {
                  setOpenCategory(openCategory === category.name ? null : category.name);
                } else {
                  handleCategorySelect(category.name);
                }
              }}
            >
              {category.name}
              {category.subcategories && (
                <span
                  className={`text-xs inline-block transition-transform duration-300 ${
                    openCategory === category.name ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              )}
            </button>

            {category.subcategories && openCategory === category.name && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-slideDown">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleCategorySelect(subcategory)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedCategory === subcategory ? "bg-blue-100 font-medium" : ""
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Shop Heading */}
      <h1 className="text-4xl font-bold text-center mb-6 text-black drop-shadow-lg">Shop</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg w-full max-w-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* Active filter */}
      {selectedCategory && selectedCategory !== "All Products" && (
        <div className="mb-4 flex items-center justify-center">
          <span className="bg-blue-100/70 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
            {selectedCategory}
          </span>
          <button
            onClick={() => setSelectedCategory("All Products")}
            className="text-sm text-gray-500 hover:text-black"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, index) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105"
            >
              <img src={p.images[0]} alt={p.name} className="w-full h-50 object-cover rounded-md mb-3" />
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="mt-1 text-gray-700 text-base">{formatCurrency(p.price)}</p>
              <p className="text-xs text-gray-500">{p.category}</p>
              <p className="text-xs text-gray-500">{p.stock}</p>

              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={() => addToCart(p)}
                  className="bg-gray-200/70 p-2 rounded-full hover:bg-gray-300/70 transition-colors"
                >
                  {cart.some((item) => item.name === p.name) ? (
                    <FaCheck className="text-green-600 text-lg" />
                  ) : (
                    <FaShoppingCart className="text-black text-lg" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedProduct(p)}
                  className="bg-blue-500/90 text-white px-3 py-1 rounded-lg hover:bg-blue-400/90 transition-colors text-sm"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-700 py-10">
            <p className="text-xl mb-2">No products found</p>
            {(search || selectedCategory !== "All Products") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All Products");
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product details modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)}>
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedProduct.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${selectedProduct.name} ${i}`}
                  className="w-50 h-40 object-cover rounded"
                />
              ))}
            </div>

            <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
            <p className="text-gray-600 mb-4">Category: {selectedProduct.category}</p>
            <p className="font-bold text-lg mb-6">{formatCurrency(selectedProduct.price)}</p>

            <button
              onClick={() => setSelectedProduct(null)}
              className="bg-red-500/90 text-white px-4 py-2 rounded-lg hover:bg-red-400/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}