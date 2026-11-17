# Tyndalla — strona projektu

Statyczna strona (HTML + CSS + vanilla JS) projektu muzycznego **Tyndalla** i albumu **„Cisza pęka”**.
Bez frameworków, bez npm, bez budowania — wystarczy wrzucić pliki na GitHub Pages.

```
CNAME          – własna domena dla GitHub Pages (tyndalla.pl)
index.html     – struktura strony
styles.css     – wygląd
script.js      – logika (statusy premier, ikony, animacja kurzu, e-mail)
songs.js       – DANE: album, utwory, linki  ← jedyny plik do edycji
assets/        – cover.jpg, og-image.jpg, favicon.svg
```

## 1. Edycja danych — `songs.js`

Otwórz `songs.js` w dowolnym edytorze (można też bezpośrednio na github.com → ikona ołówka).

**Utwory** (`SONGS`) — kolejność w tablicy = kolejność na stronie (numery 01, 02, … nadawane automatycznie):

```js
{ title: "Spirala", releaseDate: "2026-11-27", spotify: "https://open.spotify.com/track/...", youtube: "https://youtu.be/..." },
```

- `title` — tytuł utworu,
- `releaseDate` — data premiery w formacie `RRRR-MM-DD`; utwór „odblokowuje się” o **00:00 czasu polskiego** tego dnia,
- `spotify`, `youtube` — pełne linki (z `https://`). Pusty link `""` = ikona ukryta.

Przed premierą utwór jest przygaszony z etykietą „wkrótce”, a najbliższa premiera (wszystkie utwory z tą samą najbliższą datą) dostaje etykietę „następny · data”.

**Album** (`ALBUM`) — `title`, `releaseDate`, `spotify` (link do albumu), `youtube` (link do playlisty).
Do dnia premiery albumu pod okładką widać „premiera albumu · data”, potem ikony (tylko te z niepustym linkiem).

**Profile** (`ARTIST_LINKS`) — `spotify`, `youtube`, `tiktok`, `instagram`. Używane w sekcji „Słuchaj” i w stopce.
TikTok/Instagram z pustym linkiem są ukryte; Spotify/YouTube bez linku pokazują się z dopiskiem „wkrótce”.

> Uwaga na składnię: każdy tekst w cudzysłowie `"..."`, przecinki między polami i między utworami.

### Test dat lokalnie

```bash
python3 -m http.server 8000
```

Następnie otwórz np. `http://localhost:8000/?today=2026-12-05` — strona zachowa się tak, jakby był 5 grudnia 2026.
Parametr `?today=` działa **tylko lokalnie** (localhost), na opublikowanej stronie jest ignorowany.

## 2. Obrazy

- `assets/cover.jpg` — okładka albumu, **kwadrat** (np. 1200×1200 px), JPG, najlepiej < 300 KB.
- `assets/og-image.jpg` — obrazek do udostępnień (Facebook, Messenger, X itd.), **1200×630 px**.
- `assets/favicon.svg` — ikona karty przeglądarki.

Aby podmienić, wgraj nowy plik pod **tą samą nazwą** (na github.com: wejdź do `assets` → *Add file → Upload files*).
Obecne pliki to eleganckie placeholdery. Po zmianie og-image Facebook może trzymać starą wersję w pamięci — odśwież ją w [Sharing Debugger](https://developers.facebook.com/tools/debug/).

## 3. Publikacja na GitHub Pages

1. Utwórz nowe repozytorium na GitHubie (np. `tyndalla`), publiczne.
2. Wypchnij kod:
   ```bash
   git remote add origin https://github.com/TWOJ-LOGIN/tyndalla.git
   git push -u origin main
   ```
3. W repozytorium: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. Po 1–2 minutach strona będzie dostępna pod adresem podanym w Settings → Pages.

Każdy kolejny commit na `main` (np. edycja `songs.js`) automatycznie aktualizuje stronę.

## 4. Własna domena

1. Plik `CNAME` w katalogu głównym zawiera jedną linię: `tyndalla.pl` (bez `https://`).
2. U rejestratora domeny ustaw rekordy DNS:

   Domena główna (`tyndalla.pl`) — rekordy **A**:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   (opcjonalnie IPv6 — rekordy **AAAA**: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`)

   Subdomena `www` — rekord **CNAME**: `www` → `TWOJ-LOGIN.github.io`

3. W **Settings → Pages → Custom domain** wpisz `tyndalla.pl` i kliknij *Save* (GitHub sprawdzi DNS — propagacja może potrwać do 24 h).
4. Gdy weryfikacja przejdzie, zaznacz **Enforce HTTPS**.
5. Zalecane: zweryfikuj domenę w ustawieniach konta (*Settings → Pages → Add a domain*), aby nikt inny nie mógł jej podpiąć.

Adresy w `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`) wskazują na `https://tyndalla.pl/` — przy zmianie domeny podmień je również tam.

## Prywatność

Brak analityki, ciasteczek i zewnętrznych skryptów. Jedyny zewnętrzny zasób to Google Fonts (Jost, Inter).
