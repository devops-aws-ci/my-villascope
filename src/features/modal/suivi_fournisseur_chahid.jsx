import "./css/villascope.css";
import { useState, useEffect, useMemo, useRef } from "react";
import * as XLSX from "xlsx";

const TND = "TND";

function exportToExcel(data, columns, filename) {
  const ws = XLSX.utils.json_to_sheet(data.map(row => {
    const obj = {};
    columns.forEach(col => { obj[col.header] = row[col.key]; });
    return obj;
  }));
  ws['!cols'] = columns.map(col => ({wch: Math.max(col.header.length, 14)}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export");
  XLSX.writeFile(wb, filename);
}
const fmt = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtD = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n);

const CATEGORIES = ["Achat du terrain","Conception et \u00e9tudes","Gros \u0153uvre","\u00c9lectricit\u00e9","Plomberie","Second \u0153uvre","Menuiserie","Finition","Placo","Sanitaire","Divers","Autres"];
const CAT_COLORS = {"Achat du terrain":"#8b5cf6","Conception et \u00e9tudes":"#3b82f6","Gros \u0153uvre":"#0891b2","\u00c9lectricit\u00e9":"#eab308","Plomberie":"#06b6d4","Second \u0153uvre":"#10b981","Menuiserie":"#a3694a","Finition":"#ec4899","Placo":"#f97316","Sanitaire":"#14b8a6","Divers":"#6b7280","Autres":"#9ca3af"};
const CAT_ICONS = {"Achat du terrain":"\ud83c\udfdd\ufe0f","Conception et \u00e9tudes":"\ud83d\udcd0","Gros \u0153uvre":"\ud83c\udfd7\ufe0f","\u00c9lectricit\u00e9":"\u26a1","Plomberie":"\ud83d\udd27","Second \u0153uvre":"\ud83e\ade0","Menuiserie":"\ud83e\udeb5","Finition":"\u2728","Placo":"\ud83e\uddf1","Sanitaire":"\ud83d\udebf","Divers":"\ud83d\udce6","Autres":"\ud83d\udd39"};
const ETAPES = ["Terrain","Plan","Controle","Muraille","Garage","Fas9iya","Chappe","Dalle","Dalle rdc","Dalle etage","Terrasse","Piscine","Brique ext\u00e9rieur","Brique int\u00e9rieur","Enduit ext\u00e9rieur","Enduit int\u00e9rieur","Revetement","Aluminum","Electricit\u00e9","Plomberie","Menuiserie","Finition","Carrelage","Marbre","9omma","Sanitaire","Mat\u00e9riaux","STEG","Sonede","Extra","Autres"];
const CONTRES = ["Saif","El Chahid","KL BETON","Idriss Trax","Tarek Jrade","Ben ya9oub","Ihab","Telwine","BelHaj mhmed","Lotfi placo","SANI DECOR","COBAM","Mohamed ben gerdani","9aysse sfaxi","Bricola","Satourie Amina","Satouri Meryem","Nouriddine Jlidi","Yajini","Ben hamouda","Pisciniste","Menuiserie","Sonede","STEG","Administration","Impot","Notaire","Avocat","Frais Agence Immo","Kalid rais","Divers","Autres"];
const SC = {"Fer":"#ef4444","Ciment":"#64748b","Briques":"#f97316","Gravier":"#06b6d4","Dwirette":"#eab308","Clous":"#94a3b8","Sika":"#8b5cf6","Soudure":"#ec4899","Pl\u00e2tre":"#f1f5f9","Transport":"#10b981","Divers":"#6b7280"};


const NEW_PDF_DATA = [
  {date:"28/07/2025",designation:"CIMENT CPA G",qte:40,prix:19.1,ttc:764,categorie:"Ciment"},
  {date:"28/07/2025",designation:"BRIQUE DE 12",qte:152,prix:0.85,ttc:129.148,categorie:"Briques"},
  {date:"12/08/2025",designation:"CIMENT CPA G",qte:40,prix:19.1,ttc:764,categorie:"Ciment"},
  {date:"27/08/2025",designation:"CIMENT CPA G",qte:20,prix:19,ttc:380,categorie:"Ciment"},
  {date:"10/09/2025",designation:"CIMENT CPA G",qte:40,prix:19,ttc:759.999,categorie:"Ciment"},
  {date:"14/09/2025",designation:"GRILLAGE 30CM",qte:1,prix:23,ttc:23,categorie:"Divers"},
  {date:"15/09/2025",designation:"FRAIS DE TRANSPORT",qte:1,prix:10,ttc:10,categorie:"Transport"},
  {date:"15/09/2025",designation:"BRIQUE DE 12",qte:152,prix:0.85,ttc:129.148,categorie:"Briques"},
  {date:"24/09/2025",designation:"CIMENT CPA G",qte:20,prix:19.2,ttc:384,categorie:"Ciment"},
  {date:"24/09/2025",designation:"BRIQUE DE 12",qte:152,prix:0.85,ttc:129.148,categorie:"Briques"},
  {date:"05/10/2025",designation:"CIMENT CPA G",qte:40,prix:19.2,ttc:768,categorie:"Ciment"},
  {date:"13/10/2025",designation:"FER DE 12",qte:5,prix:25.7,ttc:128.5,categorie:"Fer"},
  {date:"13/10/2025",designation:"FER DE 10",qte:50,prix:18.5,ttc:925,categorie:"Fer"},
  {date:"13/10/2025",designation:"FER DE 6",qte:10,prix:3.1,ttc:31,categorie:"Fer"},
  {date:"13/10/2025",designation:"FIL D'ATTACHE",qte:10,prix:5,ttc:50,categorie:"Fer"},
  {date:"18/10/2025",designation:"CIMENT CPA G",qte:80,prix:19.2,ttc:1536,categorie:"Ciment"},
  {date:"19/10/2025",designation:"BERLET GRAVIER BLEU SANS T",qte:2,prix:440,ttc:880,categorie:"Gravier"},
  {date:"19/10/2025",designation:"BERLET DWIRETTE SANS T",qte:2,prix:330,ttc:660,categorie:"Dwirette"},
  {date:"21/10/2025",designation:"CIMENT CPA G",qte:20,prix:19.2,ttc:384,categorie:"Ciment"},
  {date:"21/10/2025",designation:"CIMENT CPA G",qte:40,prix:19.2,ttc:768,categorie:"Ciment"},
  {date:"30/11/2025",designation:"FRAIS DE TRANSPORT",qte:1,prix:10,ttc:10,categorie:"Transport"},
  {date:"30/11/2025",designation:"BRIQUE de 12 BCM",qte:296,prix:0.92,ttc:272.282,categorie:"Briques"},
  {date:"11/12/2025",designation:"CIMENT CPA G",qte:20,prix:18.75,ttc:375,categorie:"Ciment"},
  {date:"11/12/2025",designation:"BRIQUE DE 6",qte:60,prix:0.4,ttc:23.99,categorie:"Briques"},
  {date:"16/12/2025",designation:"SIKA POUDRE OR 1KG",qte:20,prix:9.5,ttc:189.995,categorie:"Sika"},
  {date:"16/12/2025",designation:"SIKAFLEX PRO 11 FC BLANC 300ML",qte:1,prix:25,ttc:25,categorie:"Sika"},
  {date:"16/12/2025",designation:"SIKA LATEX ETANCHE 20L",qte:1,prix:300,ttc:300,categorie:"Sika"},
  {date:"16/12/2025",designation:"CIMENT HRS GABES",qte:20,prix:20.5,ttc:410,categorie:"Ciment"},
  {date:"23/12/2025",designation:"CIMENT CPA G",qte:20,prix:18.8,ttc:376,categorie:"Ciment"},
  {date:"25/12/2025",designation:"FRAIS DE TRANSPORT",qte:1,prix:10,ttc:10,categorie:"Transport"},
  {date:"25/12/2025",designation:"BRIQUE PLATERIELLE",qte:200,prix:0.8,ttc:159.936,categorie:"Briques"},
  {date:"30/12/2025",designation:"FRAIS DE TRANSPORT",qte:1,prix:10,ttc:10,categorie:"Transport"},
  {date:"30/12/2025",designation:"BRIQUE DE 12",qte:70,prix:0.9,ttc:62.975,categorie:"Briques"},
  {date:"07/01/2026",designation:"CIMENT CPA G",qte:20,prix:19.25,ttc:385,categorie:"Ciment"},
  {date:"11/01/2026",designation:"BERLET DWIRETTE SANS T",qte:1,prix:350,ttc:350,categorie:"Dwirette"},
  {date:"11/01/2026",designation:"BERLET BEN GERDAN SANS T",qte:1,prix:300,ttc:300,categorie:"Gravier"},
  {date:"11/01/2026",designation:"CIMENT CPA G",qte:60,prix:19.25,ttc:1155,categorie:"Ciment"},
  {date:"24/01/2026",designation:"CIMENT CPA G",qte:60,prix:19.25,ttc:1155,categorie:"Ciment"},
  {date:"25/01/2026",designation:"BERLET DWIRETTE SANS T",qte:1,prix:350,ttc:350,categorie:"Dwirette"},
  {date:"25/01/2026",designation:"CIMENT CPA G",qte:40,prix:19.25,ttc:770,categorie:"Ciment"},
  {date:"25/01/2026",designation:"BERLET GRAVIER BLEU SANS T",qte:1,prix:440,ttc:440,categorie:"Gravier"},
  {date:"28/01/2026",designation:"BERLET DWIRETTE SANS T",qte:1,prix:350,ttc:350,categorie:"Dwirette"},
  {date:"28/01/2026",designation:"CIMENT CPA G",qte:60,prix:19.25,ttc:1155,categorie:"Ciment"},
];

const CHAHID_DATA = [{"id": 5000, "date": "06/11/2024", "designation": "FER DE 6", "qte": 100.0, "prix": 3.2, "ttc": 320.0, "categorie": "Fer"}, {"id": 5001, "date": "06/02/2025", "designation": "PLATRE", "qte": 1.0, "prix": 7.299, "ttc": 7.299, "categorie": "Plâtre"}, {"id": 5002, "date": "12/05/2024", "designation": "SEMI GRAVIER BLEU", "qte": 1.0, "prix": 1250.0, "ttc": 1250.0, "categorie": "Gravier"}, {"id": 5003, "date": "14/05/2024", "designation": "CIMENT CPA KR", "qte": 80.0, "prix": 18.5, "ttc": 1479.979, "categorie": "Ciment"}, {"id": 5004, "date": "14/05/2024", "designation": "CLOUX 7", "qte": 2.96, "prix": 6.0, "ttc": 17.76, "categorie": "Clous"}, {"id": 5005, "date": "14/05/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5006, "date": "15/05/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5007, "date": "15/05/2024", "designation": "FER DE 10", "qte": 50.0, "prix": 19.0, "ttc": 950.0, "categorie": "Fer"}, {"id": 5008, "date": "21/05/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5009, "date": "21/05/2024", "designation": "FER DE 10", "qte": 30.0, "prix": 19.0, "ttc": 570.0, "categorie": "Fer"}, {"id": 5010, "date": "21/05/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5011, "date": "21/05/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5012, "date": "23/05/2024", "designation": "FER DE 6", "qte": 50.0, "prix": 3.2, "ttc": 160.0, "categorie": "Fer"}, {"id": 5013, "date": "26/05/2024", "designation": "CIMENT CPA KR", "qte": 40.0, "prix": 18.5, "ttc": 739.99, "categorie": "Ciment"}, {"id": 5014, "date": "26/05/2024", "designation": "SIKA LAIT 5 l OR", "qte": 1.0, "prix": 85.001, "ttc": 85.001, "categorie": "Sika"}, {"id": 5015, "date": "30/05/2024", "designation": "CIMENT CPA KR", "qte": 40.0, "prix": 18.5, "ttc": 739.99, "categorie": "Ciment"}, {"id": 5016, "date": "01/06/2024", "designation": "PLATRE", "qte": 1.0, "prix": 8.0, "ttc": 8.0, "categorie": "Plâtre"}, {"id": 5017, "date": "05/06/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.6, "ttc": 371.994, "categorie": "Ciment"}, {"id": 5018, "date": "05/06/2024", "designation": "CIMENT CPA KR", "qte": 40.0, "prix": 18.6, "ttc": 744.0, "categorie": "Ciment"}, {"id": 5019, "date": "06/06/2024", "designation": "FER DE 12", "qte": 100.0, "prix": 26.0, "ttc": 2600.0, "categorie": "Fer"}, {"id": 5020, "date": "06/06/2024", "designation": "FER DE 10", "qte": 50.0, "prix": 19.0, "ttc": 950.0, "categorie": "Fer"}, {"id": 5021, "date": "08/06/2024", "designation": "FER DE 8", "qte": 20.0, "prix": 15.0, "ttc": 300.0, "categorie": "Fer"}, {"id": 5022, "date": "09/06/2024", "designation": "CLOUX 7", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5023, "date": "09/06/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5024, "date": "09/06/2024", "designation": "SEMI DWIRETTE Jaune", "qte": 1.0, "prix": 890.0, "ttc": 890.0, "categorie": "Dwirette"}, {"id": 5025, "date": "12/05/2024", "designation": "Semi Gros Biton", "qte": 1.0, "prix": 900.0, "ttc": 900.0, "categorie": "Gravier"}, {"id": 5026, "date": "12/05/2024", "designation": "SEMI DWIRETTE Jaune", "qte": 1.0, "prix": 950.0, "ttc": 950.0, "categorie": "Dwirette"}, {"id": 5027, "date": "10/06/2024", "designation": "SEMI GRAVIER BLEU", "qte": 1.0, "prix": 1250.0, "ttc": 1250.0, "categorie": "Gravier"}, {"id": 5028, "date": "11/06/2024", "designation": "CIMENT CPA KR", "qte": 6.0, "prix": 18.5, "ttc": 110.998, "categorie": "Ciment"}, {"id": 5029, "date": "22/06/2024", "designation": "CIMENT CPA KR", "qte": 40.0, "prix": 18.5, "ttc": 739.99, "categorie": "Ciment"}, {"id": 5030, "date": "25/06/2024", "designation": "BRIQUE DE 12 BCM", "qte": 322.0, "prix": 0.82, "ttc": 264.011, "categorie": "Briques"}, {"id": 5031, "date": "25/06/2024", "designation": "BRIQUE DE 12 BCM", "qte": 322.0, "prix": 0.82, "ttc": 264.011, "categorie": "Briques"}, {"id": 5032, "date": "29/06/2024", "designation": "SIKA POUDRE OR 1 KG", "qte": 15.0, "prix": 9.0, "ttc": 135.0, "categorie": "Sika"}, {"id": 5033, "date": "29/06/2024", "designation": "SIKA LAIT 5 l OR", "qte": 1.0, "prix": 85.001, "ttc": 85.001, "categorie": "Sika"}, {"id": 5034, "date": "30/06/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5035, "date": "30/06/2024", "designation": "FER DE 10", "qte": 50.0, "prix": 19.0, "ttc": 950.0, "categorie": "Fer"}, {"id": 5036, "date": "30/06/2024", "designation": "FER DE 6", "qte": 500.0, "prix": 2.9, "ttc": 1450.0, "categorie": "Fer"}, {"id": 5037, "date": "30/06/2024", "designation": "BRIQUE DE 12 cloture", "qte": 356.0, "prix": 0.82, "ttc": 291.888, "categorie": "Briques"}, {"id": 5038, "date": "30/06/2024", "designation": "BRIQUE DE 12 cloture", "qte": 300.0, "prix": 0.82, "ttc": 245.973, "categorie": "Briques"}, {"id": 5039, "date": "30/06/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.5, "ttc": 369.995, "categorie": "Ciment"}, {"id": 5040, "date": "02/07/2024", "designation": "BRIQUE DE 12 cloture", "qte": 304.0, "prix": 0.8, "ttc": 243.2, "categorie": "Briques"}, {"id": 5041, "date": "03/07/2024", "designation": "BRIQUE DE 12 BCM", "qte": 453.0, "prix": 0.8, "ttc": 362.4, "categorie": "Briques"}, {"id": 5042, "date": "03/07/2024", "designation": "BRIQUE DE 12 cloture", "qte": 30.0, "prix": 0.8, "ttc": 24.0, "categorie": "Briques"}, {"id": 5043, "date": "03/07/2024", "designation": "FER DE 12", "qte": 70.0, "prix": 26.0, "ttc": 1820.0, "categorie": "Fer"}, {"id": 5044, "date": "03/07/2024", "designation": "FER DE 10", "qte": 70.0, "prix": 19.0, "ttc": 1330.0, "categorie": "Fer"}, {"id": 5045, "date": "03/07/2024", "designation": "FER DE 8", "qte": 20.0, "prix": 15.0, "ttc": 300.0, "categorie": "Fer"}, {"id": 5046, "date": "03/07/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5047, "date": "03/07/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5048, "date": "04/07/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.6, "ttc": 372.0, "categorie": "Ciment"}, {"id": 5049, "date": "13/07/2024", "designation": "FER DE 8", "qte": 200.0, "prix": 14.5, "ttc": 2900.0, "categorie": "Fer"}, {"id": 5050, "date": "13/07/2024", "designation": "PLASTIC 1.5 M", "qte": 83.0, "prix": 2.7, "ttc": 224.1, "categorie": "Divers"}, {"id": 5051, "date": "17/07/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5052, "date": "17/07/2024", "designation": "PLASTIC 1.5 M", "qte": 8.0, "prix": 2.7, "ttc": 21.6, "categorie": "Divers"}, {"id": 5053, "date": "18/07/2024", "designation": "FER DE 8", "qte": 50.0, "prix": 15.0, "ttc": 750.0, "categorie": "Fer"}, {"id": 5054, "date": "18/07/2024", "designation": "FER DE 6", "qte": 100.0, "prix": 2.9, "ttc": 290.0, "categorie": "Fer"}, {"id": 5055, "date": "18/07/2024", "designation": "CIMENT CPA KR", "qte": 120.0, "prix": 18.35, "ttc": 2202.0, "categorie": "Ciment"}, {"id": 5056, "date": "18/07/2024", "designation": "SEMI DWIRETTE Jaune", "qte": 1.0, "prix": 890.0, "ttc": 890.0, "categorie": "Dwirette"}, {"id": 5057, "date": "20/07/2024", "designation": "CIMENT CPA KR", "qte": 120.0, "prix": 18.35, "ttc": 2201.976, "categorie": "Ciment"}, {"id": 5058, "date": "20/07/2024", "designation": "CIMENT CPA KR", "qte": 60.0, "prix": 18.35, "ttc": 1101.0, "categorie": "Ciment"}, {"id": 5059, "date": "20/07/2024", "designation": "SEMI GRAVIER BLEU", "qte": 1.0, "prix": 1320.0, "ttc": 1320.0, "categorie": "Gravier"}, {"id": 5060, "date": "21/07/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5061, "date": "27/07/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.25, "ttc": 365.0, "categorie": "Ciment"}, {"id": 5062, "date": "28/07/2024", "designation": "CLOUX 7", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5063, "date": "30/07/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5064, "date": "30/07/2024", "designation": "FER DE 10", "qte": 50.0, "prix": 19.0, "ttc": 950.0, "categorie": "Fer"}, {"id": 5065, "date": "30/07/2024", "designation": "FER DE 6", "qte": 500.0, "prix": 3.2, "ttc": 1600.0, "categorie": "Fer"}, {"id": 5066, "date": "30/07/2024", "designation": "FER DE 14", "qte": 4.0, "prix": 42.0, "ttc": 168.0, "categorie": "Fer"}, {"id": 5067, "date": "30/07/2024", "designation": "FER DE 16", "qte": 3.0, "prix": 55.0, "ttc": 165.0, "categorie": "Fer"}, {"id": 5068, "date": "30/07/2024", "designation": "FIL D'ATTACHE", "qte": 20.0, "prix": 5.0, "ttc": 100.0, "categorie": "Fer"}, {"id": 5069, "date": "31/07/2024", "designation": "FER DE 8", "qte": 30.0, "prix": 15.0, "ttc": 450.0, "categorie": "Fer"}, {"id": 5070, "date": "10/08/2024", "designation": "CLOUX 7", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5071, "date": "10/08/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5072, "date": "21/08/2024", "designation": "CIMENT HRS (KR)", "qte": 60.0, "prix": 19.85, "ttc": 1191.0, "categorie": "Ciment"}, {"id": 5073, "date": "25/08/2024", "designation": "BRIQUE DE 12 BCM", "qte": 500.0, "prix": 0.82, "ttc": 409.955, "categorie": "Briques"}, {"id": 5074, "date": "25/08/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5075, "date": "26/08/2024", "designation": "FER DE 12", "qte": 100.0, "prix": 26.0, "ttc": 2600.0, "categorie": "Fer"}, {"id": 5076, "date": "26/08/2024", "designation": "FER DE 10", "qte": 100.0, "prix": 19.0, "ttc": 1900.0, "categorie": "Fer"}, {"id": 5077, "date": "26/08/2024", "designation": "BRIQUE DE 12 BCM", "qte": 500.0, "prix": 0.82, "ttc": 409.955, "categorie": "Briques"}, {"id": 5078, "date": "29/08/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5079, "date": "29/08/2024", "designation": "FER DE 10", "qte": 100.0, "prix": 19.0, "ttc": 1900.0, "categorie": "Fer"}, {"id": 5080, "date": "29/08/2024", "designation": "FIL D'ATTACHE", "qte": 20.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5081, "date": "29/08/2024", "designation": "SEMI GRAVIER BLEU", "qte": 1.0, "prix": 1300.0, "ttc": 1300.0, "categorie": "Gravier"}, {"id": 5082, "date": "29/08/2024", "designation": "SEMI DWIRETTE Jaune", "qte": 1.0, "prix": 890.0, "ttc": 890.0, "categorie": "Dwirette"}, {"id": 5083, "date": "31/08/2024", "designation": "FER DE 8", "qte": 20.0, "prix": 14.5, "ttc": 290.0, "categorie": "Fer"}, {"id": 5084, "date": "31/08/2024", "designation": "FRAIS DE TRANSPORT", "qte": 1.0, "prix": 10.0, "ttc": 10.0, "categorie": "Transport"}, {"id": 5085, "date": "31/08/2024", "designation": "PLASTIC 1.5 M", "qte": 33.0, "prix": 2.7, "ttc": 89.1, "categorie": "Divers"}, {"id": 5086, "date": "01/09/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.35, "ttc": 367.0, "categorie": "Ciment"}, {"id": 5087, "date": "01/09/2024", "designation": "SIKA LAIT OR 1 L", "qte": 1.0, "prix": 18.0, "ttc": 18.0, "categorie": "Sika"}, {"id": 5088, "date": "01/09/2024", "designation": "CIMENT HRS (KR)", "qte": 40.0, "prix": 19.85, "ttc": 794.0, "categorie": "Ciment"}, {"id": 5089, "date": "02/09/2024", "designation": "FER DE 8", "qte": 50.0, "prix": 15.0, "ttc": 750.0, "categorie": "Fer"}, {"id": 5090, "date": "02/09/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.5, "ttc": 369.995, "categorie": "Ciment"}, {"id": 5091, "date": "02/09/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5092, "date": "02/09/2024", "designation": "BRIQUE DE 12 BCM", "qte": 60.0, "prix": 0.8, "ttc": 48.0, "categorie": "Briques"}, {"id": 5093, "date": "03/09/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.35, "ttc": 367.0, "categorie": "Ciment"}, {"id": 5094, "date": "03/09/2024", "designation": "CIMENT HRS (KR)", "qte": 20.0, "prix": 19.85, "ttc": 396.999, "categorie": "Ciment"}, {"id": 5095, "date": "14/09/2024", "designation": "FER DE 12", "qte": 100.0, "prix": 26.0, "ttc": 2600.0, "categorie": "Fer"}, {"id": 5096, "date": "14/09/2024", "designation": "FER DE 10", "qte": 100.0, "prix": 19.0, "ttc": 1900.0, "categorie": "Fer"}, {"id": 5097, "date": "14/09/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5098, "date": "16/09/2024", "designation": "CLOUX 7", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5099, "date": "16/09/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5100, "date": "18/09/2024", "designation": "FRAIS DE TRANSPORT", "qte": 1.0, "prix": 10.0, "ttc": 10.0, "categorie": "Transport"}, {"id": 5101, "date": "18/09/2024", "designation": "CIMENT CPA KR", "qte": 10.0, "prix": 17.85, "ttc": 178.5, "categorie": "Ciment"}, {"id": 5102, "date": "18/09/2024", "designation": "BRIQUE DE 12 BCM", "qte": 161.0, "prix": 0.82, "ttc": 132.006, "categorie": "Briques"}, {"id": 5103, "date": "21/09/2024", "designation": "CIMENT HRS (KR)", "qte": 100.0, "prix": 20.0, "ttc": 2000.033, "categorie": "Ciment"}, {"id": 5104, "date": "22/09/2024", "designation": "SIKA LAIT 5 l OR", "qte": 2.0, "prix": 85.0, "ttc": 170.001, "categorie": "Sika"}, {"id": 5105, "date": "24/09/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5106, "date": "24/09/2024", "designation": "FER DE 10", "qte": 100.0, "prix": 19.0, "ttc": 1900.0, "categorie": "Fer"}, {"id": 5107, "date": "24/09/2024", "designation": "FIL D'ATTACHE", "qte": 20.0, "prix": 5.0, "ttc": 100.0, "categorie": "Fer"}, {"id": 5108, "date": "24/09/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.5, "ttc": 369.995, "categorie": "Ciment"}, {"id": 5109, "date": "24/09/2024", "designation": "CIMENT HRS (KR)", "qte": 20.0, "prix": 20.0, "ttc": 399.999, "categorie": "Ciment"}, {"id": 5110, "date": "25/09/2024", "designation": "SIKA LAIT 5 l OR", "qte": 1.0, "prix": 85.001, "ttc": 85.001, "categorie": "Sika"}, {"id": 5111, "date": "25/09/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5112, "date": "25/09/2024", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.35, "ttc": 367.0, "categorie": "Ciment"}, {"id": 5113, "date": "25/09/2024", "designation": "CIMENT HRS (KR)", "qte": 10.0, "prix": 19.85, "ttc": 198.5, "categorie": "Ciment"}, {"id": 5114, "date": "26/09/2024", "designation": "FRAIS DE TRANSPORT", "qte": 1.0, "prix": 10.0, "ttc": 10.0, "categorie": "Transport"}, {"id": 5115, "date": "26/09/2024", "designation": "TRES A SOUDER 15/15 4 MM", "qte": 10.0, "prix": 45.999, "ttc": 459.994, "categorie": "Soudure"}, {"id": 5116, "date": "30/09/2024", "designation": "FER DE 10", "qte": 50.0, "prix": 19.0, "ttc": 950.0, "categorie": "Fer"}, {"id": 5117, "date": "06/10/2024", "designation": "SEMI GRAVIER BLEU", "qte": 1.0, "prix": 1300.0, "ttc": 1300.0, "categorie": "Gravier"}, {"id": 5118, "date": "06/10/2024", "designation": "SEMI DWIRETTE Jaune", "qte": 1.0, "prix": 890.0, "ttc": 890.0, "categorie": "Dwirette"}, {"id": 5119, "date": "29/10/2024", "designation": "CLOUX 7", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5120, "date": "29/10/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5121, "date": "29/10/2024", "designation": "CIMENT CPA KR", "qte": 2.0, "prix": 17.85, "ttc": 35.7, "categorie": "Ciment"}, {"id": 5122, "date": "02/11/2024", "designation": "FER DE 8", "qte": 30.0, "prix": 14.5, "ttc": 435.0, "categorie": "Fer"}, {"id": 5123, "date": "02/11/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5124, "date": "02/11/2024", "designation": "FRAIS DE TRANSPORT", "qte": 1.0, "prix": 10.0, "ttc": 10.0, "categorie": "Transport"}, {"id": 5125, "date": "12/11/2024", "designation": "FER DE 12", "qte": 50.0, "prix": 26.0, "ttc": 1300.0, "categorie": "Fer"}, {"id": 5126, "date": "12/11/2024", "designation": "FER DE 10", "qte": 50.0, "prix": 19.0, "ttc": 950.0, "categorie": "Fer"}, {"id": 5127, "date": "13/11/2024", "designation": "FER DE 10", "qte": 60.0, "prix": 19.0, "ttc": 1140.0, "categorie": "Fer"}, {"id": 5128, "date": "14/11/2024", "designation": "FIL D'ATTACHE", "qte": 10.0, "prix": 5.0, "ttc": 50.0, "categorie": "Fer"}, {"id": 5129, "date": "14/11/2024", "designation": "CIMENT CPA G", "qte": 2.0, "prix": 18.0, "ttc": 36.0, "categorie": "Ciment"}, {"id": 5130, "date": "18/11/2024", "designation": "SIKA ANCHORFIX-1Q 150ML", "qte": 1.0, "prix": 27.04, "ttc": 27.04, "categorie": "Sika"}, {"id": 5131, "date": "19/11/2024", "designation": "FRAIS DE TRANSPORT", "qte": 1.0, "prix": 10.0, "ttc": 10.0, "categorie": "Transport"}, {"id": 5132, "date": "19/11/2024", "designation": "BRIQUE DE 6", "qte": 10.0, "prix": 0.38, "ttc": 3.796, "categorie": "Briques"}, {"id": 5133, "date": "19/11/2024", "designation": "BRIQUE HOURDI 16 (PAL/104 P)", "qte": 35.0, "prix": 1.399, "ttc": 48.98, "categorie": "Briques"}, {"id": 5134, "date": "19/11/2024", "designation": "TRES A SOUDER 15/15 4 MM", "qte": 5.0, "prix": 45.999, "ttc": 229.997, "categorie": "Soudure"}, {"id": 5135, "date": "19/11/2024", "designation": "CLOUX 7", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5136, "date": "19/11/2024", "designation": "CLOUX 10", "qte": 5.0, "prix": 6.0, "ttc": 30.0, "categorie": "Clous"}, {"id": 5137, "date": "27/11/2024", "designation": "BRIQUE DE 12  Bani Hassen ", "qte": 2960.0, "prix": 0.79, "ttc": 2338.874, "categorie": "Briques"}, {"id": 5138, "date": "27/11/2024", "designation": "brique de 8 vente direct", "qte": 4480.0, "prix": 0.79, "ttc": 3539.2, "categorie": "Briques"}, {"id": 5139, "date": "02/12/2024", "designation": "Berlet Gravie Bleu", "qte": 1.0, "prix": 430.0, "ttc": 430.0, "categorie": "Gravier"}, {"id": 5140, "date": "02/12/2024", "designation": "BRIQUE DE 6", "qte": 675.0, "prix": 0.38, "ttc": 256.237, "categorie": "Briques"}, {"id": 5141, "date": "02/12/2024", "designation": "BRIQUE DE 12  Bani Hassen ", "qte": 6040.0, "prix": 0.77, "ttc": 4650.8, "categorie": "Briques"}, {"id": 5142, "date": "22/12/2024", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5143, "date": "28/12/2024", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5144, "date": "05/01/2025", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.35, "ttc": 367.0, "categorie": "Ciment"}, {"id": 5145, "date": "11/01/2025", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 18.35, "ttc": 367.0, "categorie": "Ciment"}, {"id": 5146, "date": "11/01/2025", "designation": "BRIQUE DE 8", "qte": 448.0, "prix": 0.8, "ttc": 358.257, "categorie": "Briques"}, {"id": 5147, "date": "18/01/2025", "designation": "PLATRE", "qte": 6.0, "prix": 7.3, "ttc": 43.797, "categorie": "Plâtre"}, {"id": 5148, "date": "18/01/2025", "designation": "CIMENT CPA KR", "qte": 60.0, "prix": 18.35, "ttc": 1101.0, "categorie": "Ciment"}, {"id": 5149, "date": "18/01/2025", "designation": "BRIQUE DE 6", "qte": 350.0, "prix": 0.38, "ttc": 132.864, "categorie": "Briques"}, {"id": 5150, "date": "06/02/2025", "designation": "FER DE 8", "qte": 24.0, "prix": 14.5, "ttc": 348.0, "categorie": "Fer"}, {"id": 5151, "date": "06/02/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5152, "date": "12/02/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5153, "date": "20/02/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5154, "date": "25/02/2025", "designation": "Berlet Gravie Bleu", "qte": 1.0, "prix": 430.0, "ttc": 430.0, "categorie": "Gravier"}, {"id": 5155, "date": "01/03/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5156, "date": "01/03/2025", "designation": "semi dwirette blanc", "qte": 1.0, "prix": 900.001, "ttc": 900.001, "categorie": "Dwirette"}, {"id": 5157, "date": "08/03/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5158, "date": "08/03/2025", "designation": "BRIQUE DE 8", "qte": 224.0, "prix": 0.8, "ttc": 179.128, "categorie": "Briques"}, {"id": 5159, "date": "23/04/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5160, "date": "29/04/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5161, "date": "04/05/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5162, "date": "10/05/2025", "designation": "CIMENT CPA KR", "qte": 20.0, "prix": 17.3, "ttc": 346.0, "categorie": "Ciment"}, {"id": 5163, "date": "14/05/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5164, "date": "18/05/2025", "designation": "CIMENT CPA G", "qte": 40.0, "prix": 18.5, "ttc": 740.0, "categorie": "Ciment"}, {"id": 5165, "date": "28/05/2025", "designation": "CIMENT CPA G", "qte": 40.0, "prix": 18.5, "ttc": 740.0, "categorie": "Ciment"}, {"id": 5166, "date": "01/06/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5167, "date": "01/06/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.5, "ttc": 370.0, "categorie": "Ciment"}, {"id": 5168, "date": "02/06/2025", "designation": "semi dwirette blanc", "qte": 1.0, "prix": 950.0, "ttc": 950.0, "categorie": "Dwirette"}, {"id": 5169, "date": "24/06/2025", "designation": "CIMENT CPA G", "qte": 40.0, "prix": 18.95, "ttc": 758.0, "categorie": "Ciment"}, {"id": 5170, "date": "30/06/2025", "designation": "sikadur 30- colle 1.200KG EPOXY", "qte": 1.0, "prix": 85.001, "ttc": 85.001, "categorie": "Sika"}, {"id": 5171, "date": "08/07/2025", "designation": "CIMENT CPA G", "qte": 20.0, "prix": 18.975, "ttc": 379.501, "categorie": "Ciment"}, {"id": 5172, "date": "08/07/2025", "designation": "GRILLAGE 30CM", "qte": 1.0, "prix": 23.0, "ttc": 23.0, "categorie": "Divers"}, {"id": 5173, "date": "14/07/2025", "designation": "CIMENT CPA G", "qte": 40.0, "prix": 19.4, "ttc": 776.0, "categorie": "Ciment"}];

const INIT_EXP = [
{id:1,date:"2020-08-01",montant:87003.12,categorie:"Achat du terrain",etape:"Terrain",contre:"Kalid rais",detail:"Acquisition terrain 1256m2"},
{id:2,date:"2020-08-25",montant:2380,categorie:"Achat du terrain",etape:"Terrain",contre:"Impot",detail:"Frais enregistrement"},
{id:3,date:"2022-10-06",montant:1750,categorie:"Achat du terrain",etape:"Terrain",contre:"Impot",detail:"Impot pr\u00e9value"},
{id:4,date:"",montant:500,categorie:"Achat du terrain",etape:"Terrain",contre:"Notaire",detail:"Frais Notaire"},
{id:5,date:"",montant:1750,categorie:"Achat du terrain",etape:"Terrain",contre:"Frais Agence Immo",detail:"Agent immobilier"},
{id:6,date:"",montant:150,categorie:"Achat du terrain",etape:"Terrain",contre:"Administration",detail:"Changement propri\u00e9taire"},
{id:7,date:"2022-12-12",montant:500,categorie:"Achat du terrain",etape:"Terrain",contre:"Avocat",detail:"Plainte voisin"},
{id:8,date:"2022-10-27",montant:180,categorie:"Achat du terrain",etape:"Terrain",contre:"Idriss Trax",detail:"Traxe"},
{id:9,date:"2025-02-07",montant:1000,categorie:"Achat du terrain",etape:"Terrain",contre:"Avocat",detail:"Fin plainte"},
{id:10,date:"",montant:600,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Administration",detail:"Autorisation"},
{id:11,date:"",montant:1750,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Yajini",detail:"1er plan"},
{id:12,date:"",montant:700,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Ben hamouda",detail:"Plan b\u00e9ton"},
{id:13,date:"2022-08-11",montant:400,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Satourie Amina",detail:"Facade 3D"},
{id:14,date:"2024-02-07",montant:2600,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Nouriddine Jlidi",detail:"2\u00e8me plan"},
{id:15,date:"2024-04-05",montant:2785,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Satouri Meryem",detail:"3\u00e8me plan U"},
{id:16,date:"2024-04-06",montant:1400,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Tarek Jrade",detail:"B\u00e9ton U"},
{id:17,date:"2024-04-27",montant:300,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Tarek Jrade",detail:"Devis final"},
{id:18,date:"2024-08-16",montant:800,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Tarek Jrade",detail:"Plan piscine"},
{id:19,date:"2024-08-16",montant:200,categorie:"Conception et \u00e9tudes",etape:"Controle",contre:"Tarek Jrade",detail:"Visite"},
{id:20,date:"2025-02-07",montant:1500,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Satourie Amina",detail:"Plan int\u00e9rieur"},
{id:21,date:"2025-06-10",montant:1570,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Satourie Amina",detail:"Payment"},
{id:22,date:"2025-03-08",montant:180,categorie:"Conception et \u00e9tudes",etape:"Controle",contre:"Tarek Jrade",detail:"2 visites"},
{id:23,date:"2025-03-08",montant:400,categorie:"Conception et \u00e9tudes",etape:"Plan",contre:"Tarek Jrade",detail:"Plan escalier"},
{id:24,date:"2022-11-17",montant:8000,categorie:"Gros \u0153uvre",etape:"Muraille",contre:"Saif",detail:"Muraille 143m"},
{id:25,date:"2022-11-20",montant:11000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Mat. muraille"},
{id:26,date:"2022-11-22",montant:5700,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Ciments garage"},
{id:27,date:"2024-01-09",montant:3200,categorie:"Gros \u0153uvre",etape:"Garage",contre:"Saif",detail:"Garage MO"},
{id:28,date:"2024-02-06",montant:1400,categorie:"Gros \u0153uvre",etape:"Fas9iya",contre:"Idriss Trax",detail:"Trax trou"},
{id:29,date:"2024-05-01",montant:1500,categorie:"Gros \u0153uvre",etape:"Fas9iya",contre:"Idriss Trax",detail:"Brise"},
{id:30,date:"2024-05-17",montant:2000,categorie:"Gros \u0153uvre",etape:"Chappe",contre:"Saif",detail:"D\u00e9but"},
{id:31,date:"2024-05-09",montant:20000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"B\u00e9ton chappe"},
{id:32,date:"2024-07-23",montant:12000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Virement b\u00e9ton"},
{id:33,date:"2024-07-23",montant:7920,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Ch\u00e8que 8000"},
{id:34,date:"2024-06-06",montant:5000,categorie:"Gros \u0153uvre",etape:"Chappe",contre:"Saif",detail:"Tranche"},
{id:35,date:"2024-07-17",montant:4000,categorie:"Gros \u0153uvre",etape:"Fas9iya",contre:"Saif",detail:"R\u00e9servoir T1"},
{id:36,date:"2024-07-23",montant:8000,categorie:"Gros \u0153uvre",etape:"Chappe",contre:"Saif",detail:"Fin chappe"},
{id:37,date:"2024-07-23",montant:2000,categorie:"Gros \u0153uvre",etape:"Fas9iya",contre:"Saif",detail:"Fin fas9iya"},
{id:38,date:"2024-09-26",montant:350,categorie:"Gros \u0153uvre",etape:"Piscine",contre:"Idriss Trax",detail:"Trax"},
{id:39,date:"2024-08-16",montant:2000,categorie:"Gros \u0153uvre",etape:"Dalle",contre:"Saif",detail:"T1 dalle"},
{id:40,date:"2024-08-21",montant:1200,categorie:"Gros \u0153uvre",etape:"Terrasse",contre:"Saif",detail:"48m2"},
{id:41,date:"2024-08-29",montant:5000,categorie:"Gros \u0153uvre",etape:"Dalle",contre:"Saif",detail:"T2 dalle"},
{id:42,date:"2024-09-02",montant:5000,categorie:"Gros \u0153uvre",etape:"Piscine",contre:"Saif",detail:"T1 piscine"},
{id:43,date:"2024-09-02",montant:5000,categorie:"Gros \u0153uvre",etape:"Piscine",contre:"Idriss Trax",detail:"Brise roche"},
{id:44,date:"2024-09-09",montant:1000,categorie:"Gros \u0153uvre",etape:"Piscine",contre:"Idriss Trax",detail:"Suite"},
{id:45,date:"2024-08-28",montant:10000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Mat\u00e9riaux"},
{id:46,date:"2024-09-02",montant:13000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Virement"},
{id:47,date:"2024-09-24",montant:7000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Virement"},
{id:48,date:"2024-09-26",montant:4000,categorie:"Gros \u0153uvre",etape:"Piscine",contre:"Saif",detail:"T2 piscine"},
{id:49,date:"2024-09-30",montant:10000,categorie:"Gros \u0153uvre",etape:"Dalle",contre:"Saif",detail:"T3 termin\u00e9"},
{id:50,date:"2024-09-30",montant:2480,categorie:"Gros \u0153uvre",etape:"Dalle rdc",contre:"KL BETON",detail:"52m3"},
{id:51,date:"2024-10-01",montant:10000,categorie:"Gros \u0153uvre",etape:"Dalle rdc",contre:"KL BETON",detail:"52m3 vir"},
{id:52,date:"2024-11-15",montant:2000,categorie:"Gros \u0153uvre",etape:"Extra",contre:"Saif",detail:"+9m2"},
{id:53,date:"2024-11-15",montant:800,categorie:"Gros \u0153uvre",etape:"Terrasse",contre:"Saif",detail:"80m2"},
{id:54,date:"2024-11-21",montant:7400,categorie:"Gros \u0153uvre",etape:"Dalle etage",contre:"KL BETON",detail:"31m3"},
{id:55,date:"2024-11-21",montant:2600,categorie:"Gros \u0153uvre",etape:"Dalle",contre:"Saif",detail:"Dalle2 T1"},
{id:56,date:"2024-11-25",montant:5400,categorie:"Gros \u0153uvre",etape:"Dalle",contre:"Saif",detail:"Dalle2 T2"},
{id:57,date:"2024-12-09",montant:480,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"Divers",detail:"Telescopie"},
{id:58,date:"2024-10-24",montant:6700,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Mat."},
{id:59,date:"2024-11-25",montant:4000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Mat."},
{id:60,date:"2024-12-21",montant:11260,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Yajour Murs"},
{id:61,date:"2025-01-02",montant:2000,categorie:"Gros \u0153uvre",etape:"Brique ext\u00e9rieur",contre:"Saif",detail:"Murs RDC"},
{id:62,date:"2025-01-16",montant:5500,categorie:"Gros \u0153uvre",etape:"Brique ext\u00e9rieur",contre:"Saif",detail:"Murs RDC"},
{id:63,date:"2025-02-15",montant:4000,categorie:"Gros \u0153uvre",etape:"Brique int\u00e9rieur",contre:"Saif",detail:"Murs \u00e9tage"},
{id:64,date:"2025-02-26",montant:3500,categorie:"Gros \u0153uvre",etape:"Brique int\u00e9rieur",contre:"Saif",detail:"Murs \u00e9tage"},
{id:65,date:"2025-01-25",montant:3100,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:""},
{id:66,date:"2025-03-04",montant:3250,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:""},
{id:67,date:"2025-05-20",montant:3115,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Ligga"},
{id:68,date:"2025-05-29",montant:7500,categorie:"Gros \u0153uvre",etape:"Enduit ext\u00e9rieur",contre:"Saif",detail:"LIGGA ext"},
{id:69,date:"2025-08-21",montant:2500,categorie:"Gros \u0153uvre",etape:"Enduit int\u00e9rieur",contre:"Saif",detail:"LIGGA int"},
{id:70,date:"2025-10-07",montant:4550,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Legga"},
{id:71,date:"2025-10-23",montant:5000,categorie:"Gros \u0153uvre",etape:"Enduit int\u00e9rieur",contre:"Saif",detail:"Fin"},
{id:72,date:"2025-01-09",montant:2000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:""},
{id:73,date:"2025-06-10",montant:2200,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:""},
{id:74,date:"2025-12-31",montant:2000,categorie:"Gros \u0153uvre",etape:"Extra",contre:"Saif",detail:"Escalier"},
{id:75,date:"2025-12-31",montant:2200,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:""},
{id:76,date:"2026-01-07",montant:500,categorie:"Gros \u0153uvre",etape:"9omma",contre:"Ihab",detail:"9omma"},
{id:77,date:"2026-01-07",montant:3000,categorie:"Gros \u0153uvre",etape:"Piscine",contre:"Saif",detail:"\u00c9tanch\u00e9it\u00e9"},
{id:78,date:"2026-01-21",montant:2500,categorie:"Gros \u0153uvre",etape:"Revetement",contre:"Saif",detail:"Chappe"},
{id:79,date:"2026-01-21",montant:1800,categorie:"Gros \u0153uvre",etape:"Extra",contre:"Saif",detail:"Caissons"},
{id:80,date:"2026-01-22",montant:800,categorie:"Gros \u0153uvre",etape:"9omma",contre:"Ihab",detail:"T2+dalle"},
{id:81,date:"2026-01-31",montant:4000,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:""},
{id:82,date:"2026-01-31",montant:2500,categorie:"Gros \u0153uvre",etape:"Revetement",contre:"Saif",detail:"Chappe"},
{id:83,date:"2026-02-05",montant:1000,categorie:"Gros \u0153uvre",etape:"9omma",contre:"Ihab",detail:"Fin"},
{id:84,date:"2026-03-03",montant:4100,categorie:"Gros \u0153uvre",etape:"Mat\u00e9riaux",contre:"El Chahid",detail:"Colle+sable"},
{id:85,date:"2024-05-22",montant:2850,categorie:"Divers",etape:"STEG",contre:"STEG",detail:"Branchement"},
{id:86,date:"2025-01-13",montant:150,categorie:"Divers",etape:"Sonede",contre:"Sonede",detail:"Dossier"},
{id:87,date:"2025-03-11",montant:5240,categorie:"Divers",etape:"Sonede",contre:"Sonede",detail:"EAU"},
{id:88,date:"2025-10-13",montant:1260,categorie:"Divers",etape:"Sonede",contre:"Sonede",detail:"Cr\u00e9dit"},
{id:89,date:"2024-10-18",montant:550,categorie:"Plomberie",etape:"Piscine",contre:"Pisciniste",detail:"\u00c9vacuation"},
{id:90,date:"2024-10-18",montant:530,categorie:"Plomberie",etape:"Piscine",contre:"Telwine",detail:"PVC"},
{id:91,date:"2024-08-27",montant:400,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"Ihab",detail:"Avance"},
{id:92,date:"2025-03-08",montant:2000,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"BelHaj mhmed",detail:"Fourniture"},
{id:93,date:"2025-03-08",montant:1000,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"Telwine",detail:"Compte"},
{id:94,date:"2025-03-11",montant:2000,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"Ihab",detail:"Tubes"},
{id:95,date:"2025-08-19",montant:4000,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"Ihab",detail:"Virement"},
{id:96,date:"2025-09-11",montant:3500,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"Telwine",detail:"Mat\u00e9riel"},
{id:97,date:"2025-12-31",montant:1700,categorie:"\u00c9lectricit\u00e9",etape:"Electricit\u00e9",contre:"Telwine",detail:"Esp."},
{id:98,date:"2025-01-06",montant:730,categorie:"Second \u0153uvre",etape:"Aluminum",contre:"Ben ya9oub",detail:"CAISSONS RDC"},
{id:99,date:"2025-01-13",montant:634,categorie:"Second \u0153uvre",etape:"Aluminum",contre:"Ben ya9oub",detail:"CAISSONS ETAGE"},
{id:100,date:"2025-05-22",montant:2490,categorie:"Second \u0153uvre",etape:"Aluminum",contre:"Ben ya9oub",detail:"FEN\u00caTRES"},
{id:101,date:"2025-09-29",montant:2490,categorie:"Second \u0153uvre",etape:"Aluminum",contre:"Ben ya9oub",detail:"Caisson 40cm"},
{id:102,date:"2025-10-16",montant:15000,categorie:"Second \u0153uvre",etape:"Aluminum",contre:"Ben ya9oub",detail:"Avance alu"},
{id:103,date:"2026-03-05",montant:8000,categorie:"Second \u0153uvre",etape:"Aluminum",contre:"Ben ya9oub",detail:"Rideaux"},
{id:104,date:"2025-03-11",montant:1440,categorie:"Menuiserie",etape:"Menuiserie",contre:"Menuiserie",detail:"Cadres portes"},
{id:105,date:"2025-10-13",montant:3000,categorie:"Placo",etape:"Finition",contre:"Lotfi placo",detail:"Avance"},
{id:106,date:"2025-10-24",montant:5000,categorie:"Placo",etape:"Finition",contre:"Lotfi placo",detail:"Fin"},
{id:107,date:"2025-12-12",montant:4000,categorie:"Placo",etape:"Finition",contre:"Lotfi placo",detail:"Virement"},
{id:108,date:"2025-11-11",montant:5000,categorie:"Finition",etape:"Carrelage",contre:"SANI DECOR",detail:"Avance"},
{id:109,date:"2026-02-02",montant:7880,categorie:"Finition",etape:"Carrelage",contre:"Mohamed ben gerdani",detail:"Esp."},
{id:110,date:"2026-02-15",montant:7122.89,categorie:"Finition",etape:"Carrelage",contre:"SANI DECOR",detail:"Fin RDC"},
{id:111,date:"2026-02-24",montant:4695,categorie:"Finition",etape:"Marbre",contre:"9aysse sfaxi",detail:"17m2"},
{id:112,date:"2026-03-04",montant:5000,categorie:"Finition",etape:"Carrelage",contre:"COBAM",detail:"\u00c9tage"},
{id:113,date:"2026-03-04",montant:3080,categorie:"Finition",etape:"Carrelage",contre:"SANI DECOR",detail:"Esp."},
{id:114,date:"2026-03-04",montant:777.9,categorie:"Sanitaire",etape:"Sanitaire",contre:"Bricola",detail:"Mitigeurs"},
];


const INIT_PROJ = [
{id:1,label:"Carrelage Sani D\u00e9cor 34M2",reste:3000,avance:0,devis:3000},
{id:2,label:"Carrelage \u00e9tage Cobam",reste:11000,avance:0,devis:11000},
{id:3,label:"Marbre escalier 19m2",reste:5854,avance:800,devis:6654},
{id:4,label:"Saif fin rev\u00eatements",reste:8000,avance:0,devis:8000},
{id:5,label:"Placo reste",reste:3200,avance:12000,devis:15200},
{id:6,label:"Carrelage terrasse",reste:10000,avance:0,devis:10000},
{id:7,label:"Murail entr\u00e9e",reste:5000,avance:0,devis:5000},
{id:8,label:"Alu rideaux extrud\u00e9",reste:26500,avance:15000,devis:41500},
{id:9,label:"Alu Fen\u00eatres+portes",reste:42000,avance:0,devis:42000},
{id:10,label:"Saif piscine",reste:6000,avance:0,devis:6000},
{id:11,label:"El Chahid reste",reste:1000,avance:0,devis:1000},
{id:12,label:"Peinture",reste:30000,avance:0,devis:0},
{id:13,label:"Jardin",reste:10000,avance:0,devis:0},
{id:14,label:"Cuisine",reste:20000,avance:0,devis:0},
{id:15,label:"Meubles",reste:30000,avance:0,devis:0},
];


const DEFAULT_PROJECTS = [
  {
    id: "tazdaine",
    name: "Villa Tazdaine",
    location: "Djerba",
    icon: "🏡",
    color: "#2563eb",
    currency: "TND",
    expenses: INIT_EXP,
    projections: INIT_PROJ,
    chahid: CHAHID_DATA,
  },
  {
    id: "ben-arous",
    name: "Appart Ben Arous",
    location: "Ben Arous",
    icon: "🏢",
    color: "#10b981",
    currency: "TND",
    expenses: [],
    projections: [],
    chahid: [],
  },
];

const PROJECT_ICONS = ["🏡","🏢","🏠","🏗️","🏘️","🌴","🏰","🏛️","🌇","🏖️","🏕️","🏭"];
const PROJECT_COLORS = ["#2563eb","#10b981","#8b5cf6","#f59e0b","#ef4444","#ec4899","#06b6d4","#f97316"];

// API backup server URL (configurable)
const BACKUP_API = "http://localhost:3001";
const inS = {width:"100%",padding:"10px 14px",background:"#ffffff",border:"1px solid #dbeafe",borderRadius:10,color:"#1e3a5f",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Plus Jakarta Sans',sans-serif"};
const selS = {...inS, appearance:"auto"};

function Btn({children, variant="primary", small, ...p}) {
  const bg = variant==="primary" ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "#ffffff";
  const col = variant==="primary" ? "#ffffff" : "#2563eb";
  return <button {...p} style={{padding:small?"5px 10px":"9px 18px",borderRadius:10,border:variant==="secondary"?"1px solid #bfdbfe":"none",fontSize:small?11:12,fontWeight:700,cursor:"pointer",background:bg,color:col,fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:.2,boxShadow:variant==="primary"?"0 2px 8px rgba(37,99,235,.25)":"none",...(p.style||{})}}>{children}</button>;
}

function Modal({title, onClose, children, wide}) {
  return (
    <div className="vs-modal-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className={`vs-modal ${wide?"wide":""}`}>
        <div className="vs-modal-header">
          <h3 className="vs-modal-title">{title}</h3>
          <button onClick={onClose} className="vs-modal-close">&#10005;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({label, children}) {
  return <div className="vs-field"><label className="vs-field-label">{label}</label>{children}</div>;
}

function Donut({pct, size=90, stroke=8, color="#2563eb", label}) {
  const r = (size-stroke)/2, c = 2*Math.PI*r, o = c - (Math.min(pct,100)/100)*c;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0effe" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s"}}/>
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill="#0f172a" fontSize={size*.19} fontWeight="800" style={{transform:"rotate(90deg)",transformOrigin:"center"}}>{Math.round(pct)}%</text>
      </svg>
      {label && <span style={{fontSize:10,color:"#64748b",marginTop:2}}>{label}</span>}
    </div>
  );
}


// ─── PERIMETRE SELECTOR ─────────────────────────────────────
function PerimetreSelector({ projects, activeId, onSelect, onAdd, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const active = projects.find(p => p.id === activeId);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalAll = projects.reduce((s, p) => s + p.expenses.reduce((a, e) => a + (e.montant || 0), 0), 0);

  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={() => setOpen(!open)}
        style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",background:open?"#eff6ff":"#f8fafc",border:"1px solid #dbeafe",borderRadius:10,cursor:"pointer",transition:"all .2s"}}>
        <span style={{fontSize:18}}>{active?.icon || "📁"}</span>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:12,fontWeight:800,color:"#0f172a",lineHeight:1.2}}>{active?.name || "Tous les projets"}</div>
          <div style={{fontSize:9,color:"#64748b",letterSpacing:1,textTransform:"uppercase"}}>{active?.location || `${projects.length} projets`}</div>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{marginLeft:4,transform:open?"rotate(180deg)":"",transition:"transform .2s"}}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,minWidth:320,maxWidth:380,background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:14,boxShadow:"0 20px 60px rgba(0,0,0,.15)",zIndex:200,animation:"fu .2s ease",overflow:"hidden"}}>
          <div style={{padding:"14px 16px 10px",borderBottom:"1px solid #e2e8f0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2}}>Périmètre</span>
              <span style={{fontSize:10,color:"#94a3b8"}}>{projects.length} projets</span>
            </div>
          </div>

          <div onClick={() => { onSelect(null); setOpen(false); }}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",transition:"background .15s",background:!activeId?"#eff6ff":"transparent",borderLeft:!activeId?"3px solid #2563eb":"3px solid transparent"}}
            onMouseEnter={e => { if(activeId) e.currentTarget.style.background="#f8fafc"; }}
            onMouseLeave={e => { if(activeId) e.currentTarget.style.background="transparent"; }}>
            <div style={{width:32,height:32,borderRadius:8,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏠</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>Tous les projets</div>
              <div style={{fontSize:10,color:"#64748b"}}>{fmt(totalAll)} TND total</div>
            </div>
            {!activeId && <div style={{width:8,height:8,borderRadius:4,background:"#2563eb"}}/>}
          </div>

          <div style={{height:1,background:"#e2e8f0",margin:"0 16px"}}/>

          {projects.map(proj => {
            const projTotal = proj.expenses.reduce((s, e) => s + (e.montant || 0), 0);
            const isActive = proj.id === activeId;
            return (
              <div key={proj.id}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",transition:"background .15s",background:isActive?"#eff6ff":"transparent",borderLeft:isActive?`3px solid ${proj.color}`:"3px solid transparent"}}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.background="#f8fafc"; }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.background=isActive?"#eff6ff":"transparent"; }}>
                <div onClick={() => { onSelect(proj.id); setOpen(false); }} style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                  <div style={{width:32,height:32,borderRadius:8,background:`${proj.color}12`,border:`1px solid ${proj.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{proj.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{proj.name}</div>
                    <div style={{fontSize:10,color:"#64748b"}}>{proj.location} · {fmt(projTotal)} {proj.currency}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {isActive && <div style={{width:8,height:8,borderRadius:4,background:proj.color}}/>}
                  <button onClick={(e) => { e.stopPropagation(); setEditProject(proj); setShowAdd(false); }}
                    style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:12,padding:4,borderRadius:4}}
                    onMouseEnter={e => e.currentTarget.style.color="#475569"}
                    onMouseLeave={e => e.currentTarget.style.color="#94a3b8"}>✎</button>
                </div>
              </div>
            );
          })}

          <div style={{padding:"8px 16px 12px",borderTop:"1px solid #e2e8f0"}}>
            <button onClick={() => { setShowAdd(true); setEditProject(null); }}
              style={{width:"100%",padding:"8px",borderRadius:8,border:"1px dashed #bfdbfe",background:"transparent",color:"#64748b",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .15s"}}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#2563eb"; e.currentTarget.style.color="#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#bfdbfe"; e.currentTarget.style.color="#64748b"; }}>
              <span style={{fontSize:14}}>+</span> Nouveau projet
            </button>
          </div>
        </div>
      )}

      {(showAdd || editProject) && (
        <Modal title={editProject ? "Modifier le projet" : "Nouveau projet"} onClose={() => { setShowAdd(false); setEditProject(null); }}>
          <ProjectForm item={editProject}
            onSave={(p) => { if (editProject) onEdit(p); else onAdd(p); setShowAdd(false); setEditProject(null); }}
            onDelete={editProject ? () => { onDelete(editProject.id); setEditProject(null); } : null}/>
        </Modal>
      )}
    </div>
  );
}

function ProjectForm({ item, onSave, onDelete }) {
  const [f, setF] = useState(item ? { name:item.name, location:item.location, icon:item.icon, color:item.color, currency:item.currency||"TND" } : { name:"", location:"", icon:"🏠", color:"#2563eb", currency:"TND" });
  const up = (k,v) => setF(p => ({...p,[k]:v}));
  return (
    <div>
      <Field label="Nom du projet"><input value={f.name} onChange={e => up("name",e.target.value)} style={inS} placeholder="Villa Tazdaine"/></Field>
      <Field label="Localisation"><input value={f.location} onChange={e => up("location",e.target.value)} style={inS} placeholder="Djerba"/></Field>
      <Field label="Devise">
        <select value={f.currency} onChange={e => up("currency",e.target.value)} style={selS}>
          <option value="TND">TND</option><option value="EUR">EUR</option><option value="USD">USD</option>
        </select>
      </Field>
      <Field label="Icône">
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {PROJECT_ICONS.map(ic => (
            <button key={ic} onClick={() => up("icon",ic)} style={{width:36,height:36,borderRadius:8,border:f.icon===ic?"2px solid #2563eb":"1px solid #e2e8f0",background:f.icon===ic?"#eff6ff":"#ffffff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</button>
          ))}
        </div>
      </Field>
      <Field label="Couleur">
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {PROJECT_COLORS.map(c => (
            <button key={c} onClick={() => up("color",c)} style={{width:28,height:28,borderRadius:7,border:f.color===c?"2px solid #0f172a":"2px solid transparent",background:c,cursor:"pointer"}}/>
          ))}
        </div>
      </Field>
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <Btn onClick={() => onSave(item ? {...item,...f} : {...f, id: `proj-${Date.now()}`, expenses:[], projections:[], chahid:[]})} style={{flex:1}}>{item ? "Modifier" : "Créer le projet"}</Btn>
        {onDelete && <Btn variant="secondary" onClick={onDelete} style={{color:"#ef4444",borderColor:"#fecaca"}}>Supprimer</Btn>}
      </div>
    </div>
  );
}

export default function VillaScope() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("tazdaine");
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({cat:"",contre:"",search:""});
  const [suppFilter, setSuppFilter] = useState({cat:"",search:""});
  const [depSort, setDepSort] = useState({col:"date",dir:"desc"});
  const [suppSort, setSuppSort] = useState({col:"date",dir:"desc"});
  const [importStep, setImportStep] = useState(0);
  const [importSel, setImportSel] = useState(new Set());
  const [importProg, setImportProg] = useState(0);
  const [backupModal, setBackupModal] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const [serverLastSave, setServerLastSave] = useState(null);
  const [serverSnapshots, setServerSnapshots] = useState([]);
  const fileInputRef = useRef(null);
  const nid = useRef(10000);

  const API = BACKUP_API;

  // Active project
  const activeProject = projects.find(p => p.id === activeProjectId);
  const isReadOnly = !activeProject;
  const accentColor = activeProject?.color || "#2563eb";
  const currency = activeProject?.currency || "TND";

  // Derived data from active project (or all)
  const expenses = useMemo(() => activeProject ? activeProject.expenses : projects.flatMap(p => p.expenses), [projects, activeProjectId]);
  const projections = useMemo(() => activeProject ? activeProject.projections : projects.flatMap(p => p.projections), [projects, activeProjectId]);
  const chahid = useMemo(() => activeProject ? activeProject.chahid : projects.flatMap(p => p.chahid), [projects, activeProjectId]);

  const setExpenses = (updater) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, expenses: typeof updater === "function" ? updater(p.expenses) : updater} : p));
  };
  const setProjections = (updater) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, projections: typeof updater === "function" ? updater(p.projections) : updater} : p));
  };
  const setChahid = (updater) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, chahid: typeof updater === "function" ? updater(p.chahid) : updater} : p));
  };

  const loadSnapshotsList = async () => {
    try {
      const res = await fetch(`${API}/api/backups`);
      const json = await res.json();
      if (json.ok) {
        const snaps = (json.backups || []).map(b => ({ key: b.filename, date: b.created, size: b.size }));
        setServerSnapshots(snaps);
        if (json.live) setServerLastSave(json.live.lastModified);
      }
    } catch (err) { console.warn("Backup server non disponible:", err.message); }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/load`);
        const json = await res.json();
        if (json.ok && json.data) {
          const d = json.data;
          // Support multi-project format
          if (d.projects) {
            setProjects(d.projects);
            if (d.activeProjectId) setActiveProjectId(d.activeProjectId);
          } else {
            // Legacy single-project format → load into Tazdaine
            setProjects(prev => prev.map(p => p.id === "tazdaine" ? {
              ...p,
              expenses: d.depenses?.length ? d.depenses : p.expenses,
              projections: d.projections?.length ? d.projections : p.projections,
              chahid: d.fournisseur_chahid?.length ? d.fournisseur_chahid : p.chahid,
            } : p));
          }
          if (json.lastModified) setServerLastSave(json.lastModified);
        }
      } catch(err) { console.warn("Pas de fichier serveur, données initiales utilisées"); }
      await loadSnapshotsList();
    })();
  }, []);

  const totalSpent = useMemo(() => expenses.reduce((s,e) => s + (e.montant||0), 0), [expenses]);
  const totalProj = useMemo(() => projections.reduce((s,p) => s + (p.reste||0), 0), [projections]);
  const chahidTotal = useMemo(() => chahid.reduce((s,e) => s + (e.ttc||0), 0), [chahid]);

  const byCat = useMemo(() => {
    const m = {};
    expenses.forEach(e => { const c = e.categorie||"Autres"; m[c] = (m[c]||0) + (e.montant||0); });
    return Object.entries(m).sort((a,b) => b[1]-a[1]);
  }, [expenses]);

  const byContre = useMemo(() => {
    const m = {};
    expenses.forEach(e => { const c = e.contre||"Autres"; m[c] = (m[c]||0) + (e.montant||0); });
    return Object.entries(m).sort((a,b) => b[1]-a[1]);
  }, [expenses]);

  const byYear = useMemo(() => {
    const m = {};
    expenses.forEach(e => { const y = e.date ? e.date.substring(0,4) : "N/A"; m[y] = (m[y]||0) + (e.montant||0); });
    return Object.entries(m).sort((a,b) => a[0].localeCompare(b[0]));
  }, [expenses]);

  const parseDate = (d) => {
    if (!d) return 0;
    if (d.includes("/")) { const [dd,mm,yy] = d.split("/"); return new Date(yy,mm-1,dd).getTime()||0; }
    return new Date(d).getTime()||0;
  };

  const filtered = useMemo(() => {
    let l = [...expenses];
    if (filters.cat) l = l.filter(e => e.categorie === filters.cat);
    if (filters.contre) l = l.filter(e => e.contre === filters.contre);
    if (filters.search) { const q = filters.search.toLowerCase(); l = l.filter(e => (e.detail||"").toLowerCase().includes(q) || (e.etape||"").toLowerCase().includes(q)); }
    const {col,dir} = depSort;
    l.sort((a,b) => {
      let va, vb;
      if (col === "date") { va = parseDate(a.date); vb = parseDate(b.date); }
      else if (col === "montant") { va = Number(a.montant)||0; vb = Number(b.montant)||0; }
      else { va = String(a[col]||""); vb = String(b[col]||""); }
      if (typeof va === "number") return dir === "asc" ? va - vb : vb - va;
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return l;
  }, [expenses, filters, depSort]);

  const suppFiltered = useMemo(() => {
    let l = [...chahid];
    if (suppFilter.cat) l = l.filter(e => e.categorie === suppFilter.cat);
    if (suppFilter.search) { const q = suppFilter.search.toLowerCase(); l = l.filter(e => e.designation.toLowerCase().includes(q)); }
    const {col,dir} = suppSort;
    l.sort((a,b) => {
      let va, vb;
      if (col === "date") { va = parseDate(a.date); vb = parseDate(b.date); }
      else if (["qte","prix","ttc"].includes(col)) { va = Number(a[col])||0; vb = Number(b[col])||0; }
      else { va = String(a[col]||""); vb = String(b[col]||""); }
      if (typeof va === "number") return dir === "asc" ? va - vb : vb - va;
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return l;
  }, [chahid, suppFilter, suppSort]);

  const suppByCat = useMemo(() => {
    const m = {};
    chahid.forEach(e => { m[e.categorie] = (m[e.categorie]||0) + e.ttc; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]);
  }, [chahid]);

  // ─── EXPORT / IMPORT (multi-project aware) ──────────────────
  const handleExport = () => {
    const backup = {
      _meta: { app: "VillaScope", version: "5.0-multiproject", exportDate: new Date().toISOString(), description: "Sauvegarde complète — Multi-projet" },
      projects: projects,
      activeProjectId: activeProjectId,
    };
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const ts = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}_${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}`;
    a.href = url; a.download = `VillaScope_backup_${ts}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    setExportStatus("success"); setTimeout(() => setExportStatus(null), 3000);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        // Multi-project format
        if (data.projects) {
          setImportPreview({ ...data, _fileName: file.name, _fileSize: file.size, _isMultiProject: true });
          return;
        }
        // Legacy single-project format
        if (data.depenses || (data.e && Array.isArray(data.e))) {
          const dep = data.depenses || data.e || [];
          const proj = data.projections || data.p || [];
          const forn = data.fournisseur_chahid || data.c || [];
          setImportPreview({
            _meta: data._meta || { app: "VillaScope", version: "legacy" },
            depenses: dep, projections: proj, fournisseur_chahid: forn,
            _fileName: file.name, _fileSize: file.size, _isMultiProject: false,
          });
          return;
        }
        setImportStatus("error"); setImportPreview(null);
      } catch (err) { setImportStatus("error"); setImportPreview(null); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportConfirm = () => {
    if (!importPreview) return;
    if (importPreview._isMultiProject && importPreview.projects) {
      setProjects(importPreview.projects);
      if (importPreview.activeProjectId) setActiveProjectId(importPreview.activeProjectId);
    } else {
      // Legacy: import into active project or Tazdaine
      const targetId = activeProjectId || "tazdaine";
      setProjects(prev => prev.map(p => p.id === targetId ? {
        ...p,
        expenses: importPreview.depenses || p.expenses,
        projections: importPreview.projections || p.projections,
        chahid: importPreview.fournisseur_chahid || p.chahid,
      } : p));
    }
    setImportStatus("success"); setImportPreview(null);
    setTimeout(() => { setImportStatus(null); }, 3000);
  };

  const handleServerSave = async () => {
    setServerStatus("saving");
    try {
      const res = await fetch(`${API}/api/save`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, activeProjectId }),
      });
      const json = await res.json();
      if (json.ok) { setServerLastSave(json.savedAt); await loadSnapshotsList(); setServerStatus("saved"); }
      else { setServerStatus("error"); }
      setTimeout(() => setServerStatus(null), 3000);
    } catch (err) { setServerStatus("error"); setTimeout(() => setServerStatus(null), 3000); }
  };

  const handleServerReload = async (specificFilename) => {
    setServerStatus("loading");
    try {
      let json;
      if (specificFilename) {
        const res = await fetch(`${API}/api/restore/${specificFilename}`, { method: "POST" });
        json = await res.json();
      } else {
        const res = await fetch(`${API}/api/load`);
        json = await res.json();
      }
      if (json.ok && json.data) {
        const d = json.data;
        if (d.projects) {
          setProjects(d.projects);
          if (d.activeProjectId) setActiveProjectId(d.activeProjectId);
        } else {
          // Legacy
          setProjects(prev => prev.map(p => p.id === "tazdaine" ? {
            ...p,
            expenses: d.depenses || p.expenses,
            projections: d.projections || p.projections,
            chahid: d.fournisseur_chahid || p.chahid,
          } : p));
        }
        if (d._meta?.savedAt) setServerLastSave(d._meta.savedAt);
        await loadSnapshotsList();
        setServerStatus("loaded");
      } else { setServerStatus("error"); }
      setTimeout(() => setServerStatus(null), 3000);
    } catch (err) { setServerStatus("error"); setTimeout(() => setServerStatus(null), 3000); }
  };

  const handleDeleteSnapshot = async (filename) => {
    try { await fetch(`${API}/api/backup/${filename}`, { method: "DELETE" }); await loadSnapshotsList(); } catch (err) {}
  };

  const handleExportCSV = () => {
    const rows = [["id","date","montant","categorie","etape","intervenant","detail"]];
    expenses.forEach(e => rows.push([e.id, e.date||"", e.montant||0, e.categorie||"", e.etape||"", e.contre||"", (e.detail||"").replace(/"/g,'""')]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const ts = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
    a.href = url; a.download = `VillaScope_depenses_${ts}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const VIEWS = [{k:"dashboard",l:"Dashboard",i:"📊"},{k:"depenses",l:"Dépenses",i:"💰"},{k:"fournisseurs",l:"Fournisseurs",i:"🏠"},{k:"intervenants",l:"Intervenants",i:"👷"},{k:"projections",l:"Projections",i:"📋"}];

  return (
    <div className="vs-root">

      {/* ─── PERIMETRE BAR ─── */}
      <div style={{background:"#ffffff",borderBottom:"1px solid #e2e8f0",padding:"8px 16px",position:"sticky",top:0,zIndex:200}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1.5}}>Périmètre</span>
            <PerimetreSelector
              projects={projects} activeId={activeProjectId}
              onSelect={(id) => { setActiveProjectId(id); setFilters({cat:"",contre:"",search:""}); setSuppFilter({cat:"",search:""}); }}
              onAdd={(p) => setProjects(prev => [...prev, p])}
              onEdit={(p) => setProjects(prev => prev.map(x => x.id === p.id ? {...x, name:p.name, location:p.location, icon:p.icon, color:p.color, currency:p.currency} : x))}
              onDelete={(id) => { setProjects(prev => prev.filter(x => x.id !== id)); if(activeProjectId===id) setActiveProjectId(projects[0]?.id || null); }}
            />
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            {[{l:"Dépensé",v:fmt(totalSpent),c:accentColor},{l:"Reste",v:fmt(totalProj),c:"#ef4444"}].map((s,i) => (
              <div key={i} style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:700,letterSpacing:.5}}>{s.l}</div>
                <div style={{fontSize:14,fontWeight:800,color:s.c}}>{s.v} <span style={{fontSize:9,color:"#94a3b8"}}>{currency}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="vs-header" style={{top:52}}>
        <div className="vs-header-inner">
          <div className="vs-logo-wrap">
            <div className="vs-logo-icon" style={{background:`linear-gradient(135deg,${accentColor},${accentColor}dd)`}}>{activeProject?.icon || "V"}</div>
            <div>
              <h1 className="vs-logo-title">My-Villa</h1>
              <p className="vs-logo-sub">{activeProject ? `${activeProject.name} · ${activeProject.location}` : "Vue consolidée"}</p>
            </div>
          </div>
          <nav className="vs-nav">
            {VIEWS.map(t => <button key={t.k} onClick={() => setView(t.k)} style={{padding:"6px 10px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:view===t.k?"#ffffff":"transparent",color:view===t.k?"#1e40af":"rgba(255,255,255,.8)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{t.i} {t.l}</button>)}
            <button onClick={() => { setBackupModal(true); setImportPreview(null); setImportStatus(null); setExportStatus(null); setServerStatus(null); loadSnapshotsList(); }} style={{padding:"6px 10px",borderRadius:7,border:"none",cursor:"pointer",fontSize:14,background:"transparent",color:"rgba(255,255,255,.6)",marginLeft:2,transition:"color .2s"}} title="Sauvegarde & Restauration">&#9881;</button>
          </nav>
          <input ref={fileInputRef} type="file" accept=".json" style={{display:"none"}} onChange={handleImportFile} />
        </div>
      </header>

      <main className="vs-main">

      {isReadOnly && (
        <div style={{background:"#eff6ff",borderRadius:12,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10,border:"1px solid #bfdbfe"}}>
          <span style={{fontSize:16}}>🔍</span>
          <div>
            <span style={{fontSize:12,color:"#1e40af",fontWeight:700}}>Vue consolidée</span>
            <span style={{fontSize:11,color:"#64748b",marginLeft:8}}>Sélectionnez un projet pour modifier les données</span>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div style={{animation:"fu .4s ease"}}>
          {/* Project cards when viewing all */}
          {!activeProject && projects.length > 1 && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginBottom:20}}>
              {projects.map(proj => {
                const t = proj.expenses.reduce((s,e) => s+(e.montant||0),0);
                const r = proj.projections.reduce((s,p) => s+(p.reste||0),0);
                return (
                  <div key={proj.id} onClick={() => setActiveProjectId(proj.id)} style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)",cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden",border:`1px solid ${proj.color}22`}}
                    onMouseEnter={e => e.currentTarget.style.boxShadow=`0 4px 20px ${proj.color}22`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${proj.color},transparent)`}}/>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <div style={{width:38,height:38,borderRadius:10,background:`${proj.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{proj.icon}</div>
                      <div>
                        <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{proj.name}</div>
                        <div style={{fontSize:10,color:"#64748b"}}>{proj.location}</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div><span style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:700}}>Dépensé</span><div style={{fontSize:16,fontWeight:800,color:proj.color}}>{fmt(t)}</div></div>
                      <div><span style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:700}}>Reste</span><div style={{fontSize:16,fontWeight:800,color:"#ef4444"}}>{fmt(r)}</div></div>
                    </div>
                    <div style={{marginTop:10,height:4,borderRadius:2,background:"#e0effe"}}>
                      <div style={{height:"100%",borderRadius:2,background:proj.color,width:`${Math.min((t/(t+r||1))*100,100)}%`,transition:"width .6s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:20}}>
            {[{l:"Total dépensé",v:fmt(totalSpent),c:accentColor},{l:"Reste a payer",v:fmt(totalProj),c:"#ef4444"},{l:"Budget estime",v:fmt(totalSpent+totalProj),c:"#3b82f6"},{l:"El Chahid detail",v:fmt(chahidTotal),c:"#10b981"}].map((c,i) => (
              <div key={i} style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
                <p style={{margin:"0 0 3px",fontSize:10,color:"#64748b",textTransform:"uppercase",fontWeight:700}}>{c.l}</p>
                <p style={{margin:0,fontSize:18,fontWeight:800,color:"#0f172a"}}>{c.v} <span style={{fontSize:10,color:"#64748b"}}>{currency}</span></p>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
              <p style={{margin:"0 0 10px",fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase"}}>Par categorie</p>
              {/* DONUT MULTI-SEGMENT */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                {(() => {
                  const size = 180, stroke = 22, r = (size - stroke) / 2, c = 2 * Math.PI * r;
                  let cumul = 0;
                  const segs = byCat.map(([cat, val]) => {
                    const pct = val / totalSpent;
                    const offset = c * cumul;
                    const len = c * pct;
                    cumul += pct;
                    return { cat, val, pct, offset, len, color: CAT_COLORS[cat] || "#6b7280" };
                  });
                  return (
                    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0effe" strokeWidth={stroke}/>
                      {segs.map((s, i) => (
                        <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
                          stroke={s.color} strokeWidth={stroke}
                          strokeDasharray={`${s.len} ${c - s.len}`}
                          strokeDashoffset={-s.offset}
                          style={{transition:"all .6s ease"}}/>
                      ))}
                      <text x={size/2} y={size/2 - 8} textAnchor="middle" dominantBaseline="central"
                        fill="#f8fafc" fontSize={20} fontWeight="800"
                        style={{transform:"rotate(90deg)",transformOrigin:"center"}}>
                        {fmt(totalSpent)}
                      </text>
                      <text x={size/2} y={size/2 + 12} textAnchor="middle" dominantBaseline="central"
                        fill="#64748b" fontSize={10} fontWeight="600"
                        style={{transform:"rotate(90deg)",transformOrigin:"center"}}>
                        {currency} total
                      </text>
                    </svg>
                  );
                })()}
              </div>
              {/* LEGEND BARS */}
              {byCat.map(([cat,val]) => (
                <div key={cat} style={{marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                    <span style={{color:"#334155"}}>
                      <span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:CAT_COLORS[cat]||"#6b7280",marginRight:5,verticalAlign:"middle"}}></span>
                      {CAT_ICONS[cat]||""} {cat}
                      <span style={{color:"#64748b",marginLeft:4,fontSize:10}}>({Math.round(val/totalSpent*100)}%)</span>
                    </span>
                    <span style={{color:accentColor,fontWeight:700}}>{fmt(val)}</span>
                  </div>
                  <div style={{height:4,background:"#e0effe",borderRadius:2}}>
                    <div style={{width:`${(val/totalSpent)*100}%`,height:"100%",borderRadius:2,background:CAT_COLORS[cat]||"#6b7280"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
              <p style={{margin:"0 0 10px",fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase"}}>Par annee</p>
              {byYear.map(([yr,val]) => (
                <div key={yr} style={{marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                    <span style={{color:"#334155",fontWeight:700}}>{yr}</span>
                    <span style={{color:accentColor,fontWeight:700}}>{fmt(val)} {currency}</span>
                  </div>
                  <div style={{height:5,background:"#e0effe",borderRadius:2}}>
                    <div style={{width:`${(val/Math.max(...byYear.map(y=>y[1])))*100}%`,height:"100%",borderRadius:2,background:"linear-gradient(90deg,#3b82f6,#2563eb)"}}/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <Donut pct={totalSpent/(totalSpent+totalProj)*100} size={70} stroke={7} label="Paye/Total"/>
                <div style={{textAlign:"right"}}>
                  <p style={{margin:0,fontSize:10,color:"#64748b"}}>Avancement</p>
                  <p style={{margin:"2px 0 0",fontSize:18,fontWeight:800,color:"#10b981"}}>{Math.round(totalSpent/(totalSpent+totalProj)*100)}%</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
            <p style={{margin:"0 0 10px",fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase"}}>Top intervenants</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>
              {byContre.slice(0,10).map(([n,v]) => (
                <div key={n} style={{background:"#f8fafc",borderRadius:10,padding:10,border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#334155",fontWeight:600}}>{n}</span>
                  <span style={{fontSize:12,color:accentColor,fontWeight:800}}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEPENSES */}
      {view === "depenses" && (
        <div style={{animation:"fu .4s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <h2 style={{margin:0,fontSize:17,fontWeight:800,color:"#0f172a",}}>Suivi detaille</h2>
            <div style={{display:"flex",gap:6}}>
              <Btn variant="secondary" onClick={() => exportToExcel(filtered, [
                {header:"Date",key:"date"},{header:"Montant (TND)",key:"montant"},{header:"Catégorie",key:"categorie"},
                {header:"Étape",key:"etape"},{header:"Intervenant",key:"contre"},{header:"Détail",key:"detail"}
              ], "depenses_export.xlsx")}>📥 Excel</Btn>
              {!isReadOnly && <Btn onClick={() => {setEditItem(null);setModal("expense")}}>+ Depense</Btn>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            <input placeholder="Rechercher..." value={filters.search} onChange={e => setFilters(f => ({...f,search:e.target.value}))} style={{...inS,width:170,fontSize:12}}/>
            <select value={filters.cat} onChange={e => setFilters(f => ({...f,cat:e.target.value}))} style={{...selS,width:150,fontSize:12}}>
              <option value="">Categorie</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.contre} onChange={e => setFilters(f => ({...f,contre:e.target.value}))} style={{...selS,width:140,fontSize:12}}>
              <option value="">Intervenant</option>
              {CONTRES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(filters.cat||filters.contre||filters.search) && <Btn variant="secondary" small onClick={() => setFilters({cat:"",contre:"",search:""})}>Reset</Btn>}
          </div>
          <p style={{margin:"0 0 6px",fontSize:11,color:"#64748b"}}>{filtered.length} ops - <strong style={{color:accentColor}}>{fmt(filtered.reduce((s,e) => s+(e.montant||0),0))} {currency}</strong></p>
          <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #e2e8f0"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:"#f8fafc"}}>
                {[{l:"Date",k:"date"},{l:"Montant",k:"montant"},{l:"Categorie",k:"categorie"},{l:"Etape",k:"etape"},{l:"Intervenant",k:"contre"},{l:"Detail",k:"detail"}].map(h => <th key={h.k} onClick={() => setDepSort(s => ({col:h.k, dir:s.col===h.k && s.dir==="asc"?"desc":"asc"}))} style={{padding:"8px 5px",textAlign:"left",color:depSort.col===h.k?"#2563eb":"#64748b",fontWeight:700,borderBottom:"1px solid #e2e8f0",fontSize:9,textTransform:"uppercase",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>{h.l} {depSort.col===h.k?(depSort.dir==="asc"?"▲":"▼"):""}</th>)}
                <th style={{padding:"8px",borderBottom:"1px solid #e2e8f0",width:35}}></th>
              </tr></thead>
              <tbody>{filtered.slice(0,100).map(e => (
                <tr key={e.id} style={{borderBottom:"1px solid #e2e8f0",cursor:"pointer"}} onClick={() => {setEditItem(e);setModal("expense")}}>
                  <td style={{padding:"6px",color:"#64748b",whiteSpace:"nowrap"}}>{e.date||"\u2014"}</td>
                  <td style={{padding:"6px",color:accentColor,fontWeight:700}}>{fmtD(e.montant)}</td>
                  <td style={{padding:"6px"}}><span style={{background:(CAT_COLORS[e.categorie]||"#6b7280")+"15",color:CAT_COLORS[e.categorie]||"#94a3b8",padding:"2px 5px",borderRadius:5,fontSize:10,fontWeight:600}}>{e.categorie}</span></td>
                  <td style={{padding:"6px",color:"#334155",fontSize:10}}>{e.etape||"\u2014"}</td>
                  <td style={{padding:"6px",color:"#334155",fontSize:10}}>{e.contre||"\u2014"}</td>
                  <td style={{padding:"6px",color:"#64748b",fontSize:10,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.detail||"\u2014"}</td>
                  <td style={{padding:"6px"}}><button onClick={ev => {ev.stopPropagation();setExpenses(p => p.filter(x => x.id!==e.id))}} style={{background:"#fef2f2",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11,borderRadius:5,padding:"2px 6px",fontWeight:600}}>X</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOURNISSEURS */}
      {view === "fournisseurs" && (
        <div style={{animation:"fu .4s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <h2 style={{margin:0,fontSize:17,fontWeight:800,color:"#0f172a",}}>El Chahid - Detail Materiaux</h2>
            <div style={{display:"flex",gap:6}}>
              <Btn variant="secondary" onClick={() => exportToExcel(suppFiltered, [
                {header:"Date",key:"date"},{header:"Désignation",key:"designation"},{header:"Type",key:"categorie"},
                {header:"Quantité",key:"qte"},{header:"Prix Unitaire",key:"prix"},{header:"TTC",key:"ttc"}
              ], "fournisseur_chahid_export.xlsx")}>📥 Excel</Btn>
              {!isReadOnly && <Btn variant="secondary" onClick={() => {setImportStep(0);setImportSel(new Set());setImportProg(0);setModal("import")}}>📄 Importer PDF</Btn>}
              {!isReadOnly && <Btn onClick={() => {setEditItem(null);setModal("suppItem")}}>+ Article</Btn>}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:14}}>
            <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
              <p style={{margin:"0 0 3px",fontSize:10,color:"#64748b",textTransform:"uppercase",fontWeight:700}}>Total achats</p>
              <p style={{margin:0,fontSize:20,fontWeight:800,color:accentColor}}>{fmt(chahidTotal)} <span style={{fontSize:11,color:"#64748b"}}>{currency}</span></p>
            </div>
            <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
              <p style={{margin:"0 0 3px",fontSize:10,color:"#64748b",textTransform:"uppercase",fontWeight:700}}>Lignes</p>
              <p style={{margin:0,fontSize:20,fontWeight:800,color:"#3b82f6"}}>{chahid.length}</p>
            </div>
            <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)"}}>
              <p style={{margin:"0 0 3px",fontSize:10,color:"#64748b",textTransform:"uppercase",fontWeight:700}}>Types</p>
              <p style={{margin:0,fontSize:20,fontWeight:800,color:"#10b981"}}>{suppByCat.length}</p>
            </div>
          </div>
          <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)",marginBottom:14}}>
            <p style={{margin:"0 0 10px",fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase"}}>Par type de materiau</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
              {suppByCat.map(([cat,val]) => (
                <div key={cat} onClick={() => setSuppFilter(f => ({...f,cat:f.cat===cat?"":cat}))} style={{background:suppFilter.cat===cat?"#eff6ff":"#f8fafc",borderRadius:8,padding:10,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",border:suppFilter.cat===cat?"1px solid "+(SC[cat]||"#6b7280"):"1px solid transparent"}}>
                  <span style={{fontSize:11,color:"#334155",fontWeight:600}}>
                    <span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:SC[cat]||"#6b7280",marginRight:6}}></span>{cat}
                  </span>
                  <span style={{fontSize:12,color:accentColor,fontWeight:800}}>{fmt(val)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <input placeholder="Rechercher article..." value={suppFilter.search} onChange={e => setSuppFilter(f => ({...f,search:e.target.value}))} style={{...inS,width:200,fontSize:12}}/>
            {(suppFilter.cat||suppFilter.search) && <Btn variant="secondary" small onClick={() => setSuppFilter({cat:"",search:""})}>Reset</Btn>}
          </div>
          <p style={{margin:"0 0 6px",fontSize:11,color:"#64748b"}}>{suppFiltered.length} lignes - <strong style={{color:accentColor}}>{fmt(suppFiltered.reduce((s,e) => s+(e.ttc||0),0))} {currency}</strong></p>
          <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #e2e8f0"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:"#f8fafc"}}>
                {[{l:"Date",k:"date"},{l:"Designation",k:"designation"},{l:"Type",k:"categorie"},{l:"Qte",k:"qte"},{l:"P.U.",k:"prix"},{l:"TTC",k:"ttc"}].map(h => <th key={h.k} onClick={() => setSuppSort(s => ({col:h.k, dir:s.col===h.k && s.dir==="asc"?"desc":"asc"}))} style={{padding:"8px 5px",textAlign:"left",color:suppSort.col===h.k?"#2563eb":"#64748b",fontWeight:700,borderBottom:"1px solid #e2e8f0",fontSize:9,textTransform:"uppercase",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>{h.l} {suppSort.col===h.k?(suppSort.dir==="asc"?"▲":"▼"):""}</th>)}
                <th style={{padding:"8px",borderBottom:"1px solid #e2e8f0",width:35}}></th>
              </tr></thead>
              <tbody>{suppFiltered.slice(0,150).map(e => (
                <tr key={e.id} style={{borderBottom:"1px solid #e2e8f0",cursor:"pointer"}} onClick={() => {setEditItem(e);setModal("suppItem")}}>
                  <td style={{padding:"6px",color:"#64748b",whiteSpace:"nowrap"}}>{e.date}</td>
                  <td style={{padding:"6px",color:"#0f172a",fontWeight:600}}>{e.designation}</td>
                  <td style={{padding:"6px"}}><span style={{background:(SC[e.categorie]||"#6b7280")+"15",color:SC[e.categorie]||"#94a3b8",padding:"2px 6px",borderRadius:5,fontSize:10,fontWeight:600}}>{e.categorie}</span></td>
                  <td style={{padding:"6px",color:"#334155",textAlign:"right"}}>{e.qte}</td>
                  <td style={{padding:"6px",color:"#334155",textAlign:"right"}}>{fmtD(e.prix)}</td>
                  <td style={{padding:"6px",color:accentColor,fontWeight:700,textAlign:"right"}}>{fmtD(e.ttc)}</td>
                  <td style={{padding:"6px"}}><button onClick={ev => {ev.stopPropagation();setChahid(p => p.filter(x => x.id!==e.id))}} style={{background:"#fef2f2",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11,borderRadius:5,padding:"2px 6px",fontWeight:600}}>X</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* INTERVENANTS */}
      {view === "intervenants" && (
        <div style={{animation:"fu .4s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <h2 style={{margin:"0",fontSize:17,fontWeight:800,color:"#0f172a",}}>Par intervenant</h2>
            <Btn variant="secondary" onClick={() => exportToExcel(byContre.map(([name,total]) => {
              const items = expenses.filter(e => e.contre===name);
              return {name, ops: items.length, total: Math.round(total)};
            }), [
              {header:"Intervenant",key:"name"},{header:"Nb Opérations",key:"ops"},{header:"Total (TND)",key:"total"}
            ], "intervenants_export.xlsx")}>📥 Excel</Btn>
          </div>
          {byContre.map(([name,total]) => {
            const items = expenses.filter(e => e.contre===name);
            return (
              <div key={name} style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <p style={{margin:0,fontWeight:800,fontSize:14,color:"#0f172a"}}>{name}</p>
                    <p style={{margin:"2px 0 0",fontSize:10,color:"#64748b"}}>{items.length} ops</p>
                  </div>
                  <p style={{margin:0,fontSize:18,fontWeight:800,color:accentColor}}>{fmt(total)} <span style={{fontSize:11,color:"#64748b"}}>{currency}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROJECTIONS */}
      {view === "projections" && (
        <div style={{animation:"fu .4s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <h2 style={{margin:0,fontSize:17,fontWeight:800,color:"#0f172a",}}>Projections</h2>
            <div style={{display:"flex",gap:6}}>
              <Btn variant="secondary" onClick={() => exportToExcel(projections, [
                {header:"Libellé",key:"label"},{header:"Devis (TND)",key:"devis"},
                {header:"Avance (TND)",key:"avance"},{header:"Reste (TND)",key:"reste"}
              ], "projections_export.xlsx")}>📥 Excel</Btn>
              {!isReadOnly && <Btn onClick={() => {setEditItem(null);setModal("projection")}}>+ Projection</Btn>}
            </div>
          </div>
          <div style={{background:"#ffffff",borderRadius:16,padding:18,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)",marginBottom:14,display:"flex",gap:20,flexWrap:"wrap"}}>
            <div><p style={{margin:0,fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Reste a payer</p><p style={{margin:"3px 0 0",fontSize:20,fontWeight:800,color:"#ef4444"}}>{fmt(totalProj)} {currency}</p></div>
            <div><p style={{margin:0,fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Devis</p><p style={{margin:"3px 0 0",fontSize:20,fontWeight:800,color:"#3b82f6"}}>{fmt(projections.reduce((s,p) => s+(p.devis||0),0))} {currency}</p></div>
          </div>
          {projections.map(p => (
            <div key={p.id} style={{background:"#ffffff",borderRadius:12,padding:14,boxShadow:"0 1px 4px rgba(15,23,42,.06),0 4px 16px rgba(15,23,42,.04)",marginBottom:8,display:"grid",gridTemplateColumns:"1fr auto auto",alignItems:"center",gap:12,cursor:"pointer"}} onClick={() => {setEditItem(p);setModal("projection")}}>
              <div>
                <p style={{margin:0,fontWeight:700,fontSize:12,color:"#0f172a"}}>{p.label}</p>
                {p.devis > 0 && <div style={{marginTop:4,height:4,background:"#e0effe",borderRadius:2,width:150}}><div style={{width:`${(p.avance||0)/p.devis*100}%`,height:"100%",borderRadius:2,background:"#10b981"}}/></div>}
                <p style={{margin:"3px 0 0",fontSize:10,color:"#64748b"}}>Av: {fmt(p.avance||0)} | Dev: {fmt(p.devis||0)}</p>
              </div>
              <p style={{margin:0,fontSize:16,fontWeight:800,color:"#ef4444"}}>{fmt(p.reste)} <span style={{fontSize:10,color:"#64748b"}}>{currency}</span></p>
              <button onClick={ev => {ev.stopPropagation();setProjections(pr => pr.filter(x => x.id!==p.id))}} style={{background:"#fef2f2",border:"none",color:"#ef4444",cursor:"pointer",fontSize:12,borderRadius:6,padding:"4px 8px",fontWeight:600}}>X</button>
            </div>
          ))}
        </div>
      )}

      </main>

      {/* MODALS */}
      {modal === "expense" && (
        <Modal title={editItem ? "Modifier" : "Nouvelle depense"} onClose={() => {setModal(null);setEditItem(null)}} wide>
          <ExpForm item={editItem} onSave={d => {
            if (editItem) setExpenses(p => p.map(e => e.id===d.id ? d : e));
            else setExpenses(p => [...p, {...d, id: nid.current++}]);
            setModal(null); setEditItem(null);
          }}/>
        </Modal>
      )}
      {modal === "projection" && (
        <Modal title={editItem ? "Modifier" : "Nouvelle projection"} onClose={() => {setModal(null);setEditItem(null)}}>
          <ProjForm item={editItem} onSave={d => {
            if (editItem) setProjections(p => p.map(x => x.id===d.id ? d : x));
            else setProjections(p => [...p, {...d, id: nid.current++}]);
            setModal(null); setEditItem(null);
          }}/>
        </Modal>
      )}
      {modal === "suppItem" && (
        <Modal title={editItem ? "Modifier" : "Nouvel article"} onClose={() => {setModal(null);setEditItem(null)}} wide>
          <SuppForm item={editItem} onSave={d => {
            if (editItem) setChahid(p => p.map(x => x.id===d.id ? d : x));
            else setChahid(p => [...p, {...d, id: nid.current++}]);
            setModal(null); setEditItem(null);
          }}/>
        </Modal>
      )}
      {modal === "import" && (
        <ImportModal
          step={importStep} setStep={setImportStep}
          sel={importSel} setSel={setImportSel}
          prog={importProg} setProg={setImportProg}
          accentColor={accentColor}
          onClose={() => {setModal(null);setImportStep(0);}}
          onImport={(items) => {
            const newItems = items.map((it) => ({...it, id: nid.current++}));
            setChahid(p => [...p, ...newItems]);
            setImportStep(3);
          }}
        />
      )}

      {/* BACKUP / RESTORE MODAL — MyBankin style */}
      {backupModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:12,animation:"fu .3s ease"}} onClick={() => { setBackupModal(false); setImportPreview(null); setImportStatus(null); setExportStatus(null); setServerStatus(null); }}>
          <div onClick={e => e.stopPropagation()} style={{background:"#f8fafc",borderRadius:16,padding:0,width:"100%",maxWidth:420,border:"1px solid #e2e8f0",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 25px 60px rgba(0,0,0,.5)"}}>

            {/* ── MENU HEADER ── */}
            <div style={{padding:"18px 20px 14px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#2563eb,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#0f172a"}}>V</div>
                <span style={{fontSize:16,fontWeight:800,color:"#0f172a"}}>VillaScope</span>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(37,99,235,.1)",color:accentColor,fontWeight:700}}>💾</span>
              </div>
              <button onClick={() => setBackupModal(false)} style={{background:"#f1f5f9",border:"none",color:"#64748b",fontSize:15,cursor:"pointer",width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>

            {/* ── MENU ITEMS ── */}
            <div style={{padding:"8px 10px"}}>

              {/* 1. Import JSON */}
              <label style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px",borderRadius:10,cursor:"pointer",transition:"background .15s",background:"transparent"}}
                onMouseEnter={e => e.currentTarget.style.background="#f8fafc"} onMouseLeave={e => e.currentTarget.style.background="transparent"}
                onClick={() => fileInputRef.current?.click()}>
                <div style={{width:38,height:38,borderRadius:9,background:"rgba(124,58,237,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:700,color:"#0f172a"}}>Import JSON</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#64748b"}}>CSV/JSON fichier de sauvegarde</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </label>

              {/* divider */}
              <div style={{height:1,background:"#e2e8f0",margin:"2px 14px"}}/>

              {/* 2. Recharger serveur */}
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px",borderRadius:10,cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e => e.currentTarget.style.background="#f8fafc"} onMouseLeave={e => e.currentTarget.style.background="transparent"}
                onClick={() => handleServerReload()}>
                <div style={{width:38,height:38,borderRadius:9,background:"rgba(6,182,212,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:700,color:"#0f172a"}}>Recharger serveur</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#64748b"}}>{serverLastSave ? `Re-télécharger villascope_complet_data.json` : "Aucun fichier sur le serveur"}</p>
                </div>
                {serverStatus === "loading" && <div style={{width:16,height:16,border:"2px solid #06b6d4",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .6s linear infinite"}}/>}
                {serverStatus === "loaded" && <span style={{fontSize:14}}>✅</span>}
                {!serverStatus && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>}
              </div>

              {/* divider */}
              <div style={{height:1,background:"#e2e8f0",margin:"2px 14px"}}/>

              {/* 3. Sauvegarder serveur */}
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px",borderRadius:10,cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e => e.currentTarget.style.background="#f8fafc"} onMouseLeave={e => e.currentTarget.style.background="transparent"}
                onClick={handleServerSave}>
                <div style={{width:38,height:38,borderRadius:9,background:"rgba(5,150,105,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:700,color:"#0f172a"}}>Sauvegarder serveur</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#64748b"}}>Enregistrer sur le serveur ({serverSnapshots.length} backup{serverSnapshots.length !== 1 ? "s" : ""})</p>
                </div>
                {serverStatus === "saving" && <div style={{width:16,height:16,border:"2px solid #10b981",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .6s linear infinite"}}/>}
                {serverStatus === "saved" && <span style={{fontSize:14}}>✅</span>}
                {!serverStatus && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>}
              </div>

              {/* divider */}
              <div style={{height:1,background:"#e2e8f0",margin:"2px 14px"}}/>

              {/* 4. Export JSON complet */}
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px",borderRadius:10,cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e => e.currentTarget.style.background="#f8fafc"} onMouseLeave={e => e.currentTarget.style.background="transparent"}
                onClick={handleExport}>
                <div style={{width:38,height:38,borderRadius:9,background:"rgba(37,99,235,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:700,color:"#0f172a"}}>Export JSON complet</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#64748b"}}>{expenses.length + projections.length + chahid.length} éléments + projections + fournisseur</p>
                </div>
                {exportStatus === "success" ? <span style={{fontSize:14}}>✅</span> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>}
              </div>

              {/* divider */}
              <div style={{height:1,background:"#e2e8f0",margin:"2px 14px"}}/>

              {/* 5. Export CSV */}
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px",borderRadius:10,cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e => e.currentTarget.style.background="#f8fafc"} onMouseLeave={e => e.currentTarget.style.background="transparent"}
                onClick={handleExportCSV}>
                <div style={{width:38,height:38,borderRadius:9,background:"rgba(217,119,6,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:700,color:"#0f172a"}}>Export CSV</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#64748b"}}>{expenses.length} dépenses (tableur)</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>

            </div>

            {/* ── DATA SUMMARY BAR ── */}
            <div style={{padding:"10px 20px 8px",borderTop:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Données en mémoire</span>
                {serverLastSave && <span style={{fontSize:9,color:"#475569"}}>Dernier snap: {new Date(serverLastSave).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                {[
                  {l:"Dépenses",v:expenses.length,c:accentColor},
                  {l:"Projections",v:projections.length,c:"#3b82f6"},
                  {l:"Fournisseur",v:chahid.length,c:"#10b981"},
                ].map((s,i) => (
                  <div key={i} style={{background:"#f8fafc",borderRadius:7,padding:"6px 8px",textAlign:"center"}}>
                    <span style={{fontSize:15,fontWeight:800,color:s.c}}>{s.v}</span>
                    <span style={{fontSize:9,color:"#475569",marginLeft:4}}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SNAPSHOTS HISTORY ── */}
            {serverSnapshots.length > 0 && (
              <div style={{padding:"4px 20px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Backups sur le serveur ({serverSnapshots.length})</span>
                </div>
                <div style={{maxHeight:160,overflowY:"auto",borderRadius:8,border:"1px solid #e2e8f0",background:"#f8fafc"}}>
                  {serverSnapshots.map((snap, i) => {
                    const d = new Date(snap.date);
                    const isLatest = i === 0;
                    const sizeKo = snap.size ? (snap.size / 1024).toFixed(0) : "?";
                    return (
                      <div key={snap.key} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:i < serverSnapshots.length - 1 ? "1px solid #f1f5f9" : "none"}}>
                        <div style={{width:6,height:6,borderRadius:3,background:isLatest ? "#10b981" : "#334155",flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{margin:0,fontSize:11,fontWeight:isLatest?700:500,color:isLatest?"#f1f5f9":"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                            {d.toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})} à {d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
                          </p>
                          <p style={{margin:0,fontSize:9,color:"#475569"}}>{snap.key} · {sizeKo} Ko</p>
                        </div>
                        {isLatest && <span style={{fontSize:8,padding:"2px 6px",borderRadius:4,background:"rgba(16,185,129,.15)",color:"#10b981",fontWeight:700,flexShrink:0}}>DERNIER</span>}
                        <button onClick={() => handleServerReload(snap.key)} title="Restaurer ce snapshot" style={{background:"none",border:"none",cursor:"pointer",padding:2,color:"#06b6d4",fontSize:12,flexShrink:0}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        </button>
                        <button onClick={() => handleDeleteSnapshot(snap.key)} title="Supprimer" style={{background:"none",border:"none",cursor:"pointer",padding:2,color:"#475569",fontSize:12,flexShrink:0}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STATUS TOASTS ── */}
            {serverStatus === "error" && (
              <div style={{margin:"0 20px 14px",padding:"10px 14px",borderRadius:8,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.3)",display:"flex",alignItems:"center",gap:8}}>
                <span>❌</span>
                <span style={{fontSize:12,color:"#ef4444",fontWeight:600}}>Erreur — Opération échouée</span>
              </div>
            )}

            {/* ── IMPORT PREVIEW (shown when file selected) ── */}
            {importPreview && (
              <div style={{padding:"0 20px 18px",animation:"fu .3s ease"}}>
                <div style={{background:"#111827",borderRadius:10,padding:14,border:"1px solid #e2e8f0",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{fontSize:15}}>📄</span>
                    <div style={{flex:1}}>
                      <p style={{margin:0,fontSize:12,fontWeight:700,color:"#0f172a"}}>{importPreview._fileName}</p>
                      <p style={{margin:0,fontSize:10,color:"#64748b"}}>{(importPreview._fileSize / 1024).toFixed(1)} Ko • v{importPreview._meta?.version || "?"}</p>
                    </div>
                    <span style={{padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:"rgba(16,185,129,.15)",color:"#10b981",border:"1px solid rgba(16,185,129,.3)"}}>Validé ✓</span>
                  </div>
                  {importPreview._meta?.exportDate && importPreview._meta.exportDate !== "inconnu" && (
                    <p style={{margin:"0 0 8px",fontSize:10,color:"#64748b"}}>Exporté le {new Date(importPreview._meta.exportDate).toLocaleString("fr-FR")}</p>
                  )}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                    {[
                      {l:"Dép.",v:importPreview.depenses?.length||0,c:accentColor,cur:expenses.length},
                      {l:"Proj.",v:importPreview.projections?.length||0,c:"#3b82f6",cur:projections.length},
                      {l:"Fourn.",v:importPreview.fournisseur_chahid?.length||0,c:"#10b981",cur:chahid.length},
                    ].map((s,i) => (
                      <div key={i} style={{background:"#f8fafc",borderRadius:6,padding:"6px",textAlign:"center"}}>
                        <p style={{margin:0,fontSize:15,fontWeight:800,color:s.c}}>{s.v}</p>
                        <p style={{margin:0,fontSize:9,color:s.v !== s.cur ? "#d97706" : "#cbd5e1"}}>{s.v !== s.cur ? `${s.cur} → ${s.v}` : "="}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:"8px 12px",borderRadius:8,background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)",marginBottom:10}}>
                  <p style={{margin:0,fontSize:11,color:accentColor,fontWeight:700}}>⚠️ Les données actuelles seront écrasées</p>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <button onClick={() => { setImportPreview(null); setImportStatus(null); }} style={{padding:"11px",borderRadius:9,border:"1px solid #e2e8f0",cursor:"pointer",fontSize:12,fontWeight:700,background:"#ffffff",color:"#475569"}}>Annuler</button>
                  <button onClick={handleImportConfirm} style={{padding:"11px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    ✓ Confirmer
                  </button>
                </div>
              </div>
            )}

            {/* Import file error */}
            {importStatus === "error" && !importPreview && (
              <div style={{margin:"0 20px 14px",padding:"10px 14px",borderRadius:8,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.3)"}}>
                <p style={{margin:0,fontSize:12,color:"#ef4444",fontWeight:600}}>❌ Fichier JSON invalide</p>
                <p style={{margin:"3px 0 0",fontSize:10,color:"#64748b"}}>Vérifiez qu'il s'agit d'un export VillaScope.</p>
              </div>
            )}
            {importStatus === "success" && !importPreview && (
              <div style={{margin:"0 20px 14px",padding:"10px 14px",borderRadius:8,background:"rgba(5,150,105,.08)",border:"1px solid rgba(16,185,129,.3)"}}>
                <p style={{margin:0,fontSize:12,color:"#10b981",fontWeight:600}}>✅ Données restaurées avec succès</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}


function ImportModal({step, setStep, sel, setSel, prog, setProg, accentColor, onClose, onImport}) {
  const newTotal = NEW_PDF_DATA.reduce((s,t) => s+t.ttc, 0);
  const selTotal = [...sel].reduce((s,i) => s+NEW_PDF_DATA[i].ttc, 0);
  const fmtI = (n) => n.toLocaleString("fr-FR",{minimumFractionDigits:3,maximumFractionDigits:3});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const ac = accentColor || "#2563eb";

  const handleFile = (file) => { if (file && file.type === "application/pdf") setUploadedFile({name:file.name, size:(file.size/1024).toFixed(1)+" Ko", file}); };
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  useEffect(() => {
    if (step===1) {
      let p=0;
      const iv=setInterval(()=>{
        p+=Math.random()*14+4;
        if(p>=100){p=100;clearInterval(iv);setTimeout(()=>{setStep(2);setSel(new Set(NEW_PDF_DATA.map((_,i)=>i)));},400);}
        setProg(p);
      },110);
      return ()=>clearInterval(iv);
    }
  },[step]);

  const toggleAll=()=>{sel.size===NEW_PDF_DATA.length?setSel(new Set()):setSel(new Set(NEW_PDF_DATA.map((_,i)=>i)));};
  const toggle=(i)=>{const n=new Set(sel);n.has(i)?n.delete(i):n.add(i);setSel(n);};

  const overlay={position:"fixed",inset:0,background:"rgba(15,23,42,.45)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:12,animation:"fu .3s ease"};
  const card={background:"#f8fafc",borderRadius:16,border:"1px solid #e2e8f0",boxShadow:"0 25px 60px rgba(0,0,0,.15)",overflow:"hidden"};

  // ── Step 0: File upload ──
  if(step===0) return(
    <div style={overlay} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{...card,padding:28,width:"100%",maxWidth:460,textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:14,background:`${ac}12`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>📄</div>
        <h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:800,color:"#0f172a"}}>Importer relevé fournisseur</h3>
        <p style={{color:"#64748b",fontSize:12,margin:"0 0 24px",lineHeight:1.6}}>Déposez ou sélectionnez le fichier PDF envoyé<br/>par votre fournisseur de matériaux</p>
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}}/>
        <div onClick={()=>fileRef.current?.click()} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          style={{border:`2px dashed ${dragOver?ac:uploadedFile?"#10b981":"#cbd5e1"}`,borderRadius:12,padding:uploadedFile?"16px":"32px 16px",background:dragOver?`${ac}08`:uploadedFile?"rgba(16,185,129,0.04)":"#ffffff",marginBottom:20,cursor:"pointer",transition:"all .25s"}}>
          {!uploadedFile?(
            <div>
              <div style={{fontSize:36,marginBottom:10,opacity:dragOver?1:.5}}>{dragOver?"📥":"☁️"}</div>
              <div style={{fontWeight:700,fontSize:13,color:dragOver?ac:"#0f172a",marginBottom:4}}>{dragOver?"Déposez le fichier ici":"Glissez-déposez votre PDF ici"}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>ou</div>
              <span style={{display:"inline-block",padding:"6px 16px",borderRadius:7,background:"#f1f5f9",color:"#334155",fontSize:12,fontWeight:600,border:"1px solid #e2e8f0"}}>Parcourir les fichiers</span>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:10}}>Format accepté : PDF uniquement</div>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:10,background:"rgba(239,68,68,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:14,fontWeight:800,color:"#ef4444"}}>PDF</span>
              </div>
              <div style={{textAlign:"left",flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{uploadedFile.name}</div>
                <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{uploadedFile.size}</div>
              </div>
              <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"#10b981",fontSize:14,fontWeight:900}}>✓</span>
              </div>
            </div>
          )}
        </div>
        {uploadedFile&&<div style={{marginBottom:14}}><span onClick={e=>{e.stopPropagation();setUploadedFile(null);if(fileRef.current)fileRef.current.value="";}} style={{fontSize:11,color:"#64748b",cursor:"pointer",textDecoration:"underline"}}>Changer de fichier</span></div>}
        <Btn onClick={()=>{if(uploadedFile)setStep(1);}} style={{width:"100%",opacity:uploadedFile?1:.4,pointerEvents:uploadedFile?"auto":"none"}}>{uploadedFile?"Scanner le document →":"Selectionnez un fichier PDF"}</Btn>
      </div>
    </div>
  );

  // ── Step 1: Parsing animation ──
  if(step===1) return(
    <div style={overlay}>
      <div style={{...card,padding:32,width:"100%",maxWidth:420,textAlign:"center"}}>
        <div style={{position:"relative",width:72,height:72,margin:"0 auto 20px"}}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{transform:"rotate(-90deg)"}}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
            <circle cx="36" cy="36" r="30" fill="none" stroke={ac} strokeWidth="4" strokeDasharray={`${188.5*prog/100} 188.5`} strokeLinecap="round" style={{transition:"stroke-dasharray .3s"}}/>
          </svg>
          <span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:16,fontWeight:800,color:"#0f172a"}}>{Math.round(prog)}%</span>
        </div>
        <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 6px",color:"#0f172a"}}>{prog<30?"Lecture du PDF...":prog<60?"Extraction des lignes...":prog<90?"Classification...":"Finalisation..."}</h3>
        <p style={{color:"#64748b",fontSize:11,margin:0}}>{NEW_PDF_DATA.length} nouvelles transactions détectées</p>
        <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:16,flexWrap:"wrap"}}>
          {["Ciment","Fer","Briques","Gravier","Sika"].map(c=><span key={c} style={{padding:"3px 10px",borderRadius:16,fontSize:10,fontWeight:600,background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0",opacity:prog>40?1:.3,transition:"opacity .4s"}}>{c}</span>)}
        </div>
      </div>
    </div>
  );

  // ── Step 2: Review table ──
  if(step===2){
    const byCat={};NEW_PDF_DATA.forEach(t=>{byCat[t.categorie]=(byCat[t.categorie]||0)+t.ttc;});
    const cats=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
    return(
    <div style={overlay} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{...card,width:"100%",maxWidth:720,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:"#0f172a"}}>Vérification des transactions</h3>
            <p style={{margin:"2px 0 0",fontSize:11,color:"#64748b"}}>{sel.size}/{NEW_PDF_DATA.length} sélectionnées · <span style={{color:ac,fontWeight:700}}>{fmtI(selTotal)} TND</span></p>
          </div>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",color:"#64748b",fontSize:15,cursor:"pointer",width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,padding:"12px 20px",flexShrink:0}}>
          {[{l:"Total PDF",v:"124 707 TND",c:"#0f172a"},{l:"Avances payées",v:"117 618 TND",c:"#10b981"},{l:"Solde restant",v:"6 435 TND",c:"#f59e0b"},{l:"Nouvelles lignes",v:fmtI(newTotal)+" TND",c:ac}].map((s,i)=>
            <div key={i} style={{background:"#ffffff",borderRadius:10,padding:"8px 10px",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{s.l}</div>
              <div style={{fontSize:13,fontWeight:800,color:s.c,fontFamily:"monospace"}}>{s.v}</div>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:5,padding:"0 20px 10px",flexWrap:"wrap",flexShrink:0}}>
          {cats.map(([cat,val])=><span key={cat} style={{padding:"3px 10px",borderRadius:16,fontSize:10,fontWeight:600,background:(SC[cat]||"#6b7280")+"12",color:SC[cat]||"#64748b",border:`1px solid ${(SC[cat]||"#6b7280")}30`}}>{cat} <span style={{color:ac}}>{fmt(val)}</span></span>)}
        </div>
        <div style={{padding:"0 20px 6px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div onClick={toggleAll} style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${sel.size===NEW_PDF_DATA.length?ac:"#cbd5e1"}`,background:sel.size===NEW_PDF_DATA.length?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10,color:"#fff",fontWeight:900}}>{sel.size===NEW_PDF_DATA.length&&"✓"}</div>
          <span onClick={toggleAll} style={{fontSize:11,color:"#64748b",cursor:"pointer"}}>{sel.size===NEW_PDF_DATA.length?"Tout désélectionner":"Tout sélectionner"}</span>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"0 20px"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{position:"sticky",top:0,background:"#f8fafc",zIndex:1}}>
              <th style={{padding:"7px 4px",width:28}}></th>
              {["Date","Désignation","Type","Qté","P.U.","TTC"].map(h=><th key={h} style={{padding:"7px 4px",textAlign:h==="Qté"||h==="P.U."||h==="TTC"?"right":"left",color:"#64748b",fontWeight:700,borderBottom:"1px solid #e2e8f0",fontSize:9,textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{NEW_PDF_DATA.map((tx,i)=>{
              const chk=sel.has(i);
              return(<tr key={i} onClick={()=>toggle(i)} style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:chk?`${ac}06`:"transparent",transition:"background .15s"}}>
                <td style={{padding:"5px 4px"}}><div style={{width:15,height:15,borderRadius:4,border:`1.5px solid ${chk?ac:"#cbd5e1"}`,background:chk?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:900}}>{chk&&"✓"}</div></td>
                <td style={{padding:"5px 4px",color:"#64748b",whiteSpace:"nowrap"}}>{tx.date}</td>
                <td style={{padding:"5px 4px",color:"#0f172a",fontWeight:600}}>{tx.designation}</td>
                <td style={{padding:"5px 4px"}}><span style={{background:(SC[tx.categorie]||"#6b7280")+"15",color:SC[tx.categorie]||"#64748b",padding:"2px 6px",borderRadius:5,fontSize:10,fontWeight:600}}>{tx.categorie}</span></td>
                <td style={{padding:"5px 4px",textAlign:"right",color:"#334155"}}>{tx.qte}</td>
                <td style={{padding:"5px 4px",textAlign:"right",color:"#334155"}}>{fmtD(tx.prix)}</td>
                <td style={{padding:"5px 4px",textAlign:"right",color:ac,fontWeight:700,fontFamily:"monospace"}}>{fmtI(tx.ttc)}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:12,color:"#64748b"}}>Sélection: <strong style={{color:ac}}>{fmtI(selTotal)} TND</strong></span>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" small onClick={onClose}>Annuler</Btn>
            <Btn onClick={()=>{const items=[...sel].map(i=>NEW_PDF_DATA[i]);onImport(items);}} style={{opacity:sel.size===0?.5:1,pointerEvents:sel.size===0?"none":"auto"}}>✓ Importer {sel.size} lignes</Btn>
          </div>
        </div>
      </div>
    </div>);
  }

  // ── Step 3: Done ──
  if(step===3){
    const importedByCat={};[...sel].forEach(i=>{const t=NEW_PDF_DATA[i];importedByCat[t.categorie]=(importedByCat[t.categorie]||0)+t.ttc;});
    return(
    <div style={overlay} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{...card,padding:28,width:"100%",maxWidth:440,textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(16,185,129,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",border:"2px solid #10b981",fontSize:22}}>✓</div>
        <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:800,color:"#0f172a"}}>Import terminé !</h3>
        <p style={{color:"#64748b",fontSize:12,margin:"0 0 20px"}}>{sel.size} transactions ajoutées au suivi El Chahid</p>
        {Object.entries(importedByCat).sort((a,b)=>b[1]-a[1]).map(([cat,val])=>
          <div key={cat} style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"#ffffff",borderRadius:7,marginBottom:4,border:"1px solid #e2e8f0"}}>
            <span style={{fontSize:12,color:"#334155"}}>{cat}</span>
            <span style={{fontSize:12,fontWeight:700,color:ac,fontFamily:"monospace"}}>{fmtI(val)}</span>
          </div>
        )}
        <div style={{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:14,margin:"16px 0"}}>
          <div style={{fontSize:9,color:"#f59e0b",fontWeight:700,marginBottom:2}}>SOLDE FOURNISSEUR</div>
          <div style={{fontSize:24,fontWeight:800,color:"#f59e0b",fontFamily:"monospace"}}>6 435,178 TND</div>
        </div>
        <Btn onClick={onClose} style={{width:"100%"}}>Fermer</Btn>
      </div>
    </div>);
  }
  return null;
}

function ExpForm({item, onSave}) {
  const [f, setF] = useState(item || {date:"",montant:"",categorie:"Gros \u0153uvre",etape:"",contre:"",detail:""});
  const up = (k,v) => setF(p => ({...p,[k]:v}));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Field label="Date"><input type="date" value={f.date} onChange={e => up("date",e.target.value)} style={inS}/></Field>
        <Field label="Montant (TND)"><input type="number" value={f.montant} onChange={e => up("montant",parseFloat(e.target.value)||0)} style={inS}/></Field>
      </div>
      <Field label="Categorie"><select value={f.categorie} onChange={e => up("categorie",e.target.value)} style={selS}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Field label="Etape"><select value={f.etape} onChange={e => up("etape",e.target.value)} style={selS}><option value="">--</option>{ETAPES.map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Intervenant"><select value={f.contre} onChange={e => up("contre",e.target.value)} style={selS}><option value="">--</option>{CONTRES.map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Detail"><input value={f.detail} onChange={e => up("detail",e.target.value)} style={inS}/></Field>
      <Btn onClick={() => onSave(f)} style={{width:"100%",marginTop:6}}>Enregistrer</Btn>
    </div>
  );
}

function ProjForm({item, onSave}) {
  const [f, setF] = useState(item || {label:"",reste:0,avance:0,devis:0});
  const up = (k,v) => setF(p => ({...p,[k]:v}));
  return (
    <div>
      <Field label="Libelle"><input value={f.label} onChange={e => up("label",e.target.value)} style={inS}/></Field>
      <Field label="Devis"><input type="number" value={f.devis} onChange={e => up("devis",parseFloat(e.target.value)||0)} style={inS}/></Field>
      <Field label="Avance"><input type="number" value={f.avance} onChange={e => up("avance",parseFloat(e.target.value)||0)} style={inS}/></Field>
      <Field label="Reste"><input type="number" value={f.reste} onChange={e => up("reste",parseFloat(e.target.value)||0)} style={inS}/></Field>
      <Btn onClick={() => onSave(f)} style={{width:"100%",marginTop:6}}>Enregistrer</Btn>
    </div>
  );
}

function SuppForm({item, onSave}) {
  const [f, setF] = useState(item || {date:"",designation:"",qte:0,prix:0,ttc:0,categorie:"Divers"});
  const up = (k,v) => setF(p => ({...p,[k]:v}));
  const classify = (des) => {
    const d = des.toUpperCase();
    if (d.includes("FER") || d.includes("FIL")) return "Fer";
    if (d.includes("CIMENT") || d.includes("HRS")) return "Ciment";
    if (d.includes("BRIQUE") || d.includes("HOURDI")) return "Briques";
    if (d.includes("GRAVIER") || d.includes("BERLET")) return "Gravier";
    if (d.includes("DWIRETTE")) return "Dwirette";
    if (d.includes("CLOU")) return "Clous";
    if (d.includes("SIKA")) return "Sika";
    return "Divers";
  };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Field label="Date (JJ/MM/AAAA)"><input value={f.date} onChange={e => up("date",e.target.value)} style={inS}/></Field>
        <Field label="Designation"><input value={f.designation} onChange={e => {up("designation",e.target.value); up("categorie",classify(e.target.value));}} style={inS} placeholder="CIMENT CPA KR"/></Field>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Field label="Qte"><input type="number" value={f.qte} onChange={e => {const q=parseFloat(e.target.value)||0; setF(p => ({...p,qte:q,ttc:q*p.prix}));}} style={inS}/></Field>
        <Field label="Prix unit."><input type="number" value={f.prix} onChange={e => {const px=parseFloat(e.target.value)||0; setF(p => ({...p,prix:px,ttc:p.qte*px}));}} style={inS}/></Field>
        <Field label="TTC"><input type="number" value={f.ttc} onChange={e => up("ttc",parseFloat(e.target.value)||0)} style={inS}/></Field>
      </div>
      <Btn onClick={() => onSave(f)} style={{width:"100%",marginTop:6}}>Enregistrer</Btn>
    </div>
  );
}