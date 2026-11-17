/* =========================================================================
   TYNDALLA — dane albumu i utworów
   -------------------------------------------------------------------------
   To jedyny plik, który trzeba edytować, aby zaktualizować stronę.

   • Daty wpisuj w formacie "RRRR-MM-DD" (np. "2026-11-27").
     Premiera następuje o północy (00:00) czasu polskiego (Europe/Warsaw).
   • Linki wklejaj w całości, razem z "https://".
   • Pusty link ("") = ikona nie zostanie wyświetlona.
   • Kolejność utworów na stronie = kolejność w tablicy SONGS.
   ========================================================================= */

/* Profile artysty — sekcja „Słuchaj” i stopka */
const ARTIST_LINKS = {
  spotify: "",    // link do profilu artysty na Spotify
  youtube: "",    // link do kanału YouTube
  tiktok: "",     // link do profilu TikTok
  instagram: ""   // link do profilu Instagram
};

/* Album — sekcja „Cisza pęka” */
const ALBUM = {
  title: "Cisza pęka",
  releaseDate: "2026-12-25",
  spotify: "",    // link do albumu na Spotify
  youtube: ""     // link do playlisty albumu na YouTube
};

/* Utwory — w kolejności na płycie */
const SONGS = [
  { title: "Spirala",         releaseDate: "2026-11-27", spotify: "", youtube: "" },
  { title: "Lepsze jutro",    releaseDate: "2026-11-27", spotify: "", youtube: "" },
  { title: "Od Zet do Alfy",  releaseDate: "2026-12-04", spotify: "", youtube: "" },
  { title: "Wyprzedzić świt", releaseDate: "2026-12-11", spotify: "", youtube: "" },
  { title: "Zawsze obok",     releaseDate: "2026-12-18", spotify: "", youtube: "" },
  { title: "Klepsydra",       releaseDate: "2026-12-25", spotify: "", youtube: "" },
  { title: "42195",           releaseDate: "2026-12-25", spotify: "", youtube: "" },
  { title: "Cisza pęka",      releaseDate: "2026-12-25", spotify: "", youtube: "" }
];
