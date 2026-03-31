# Ceylon Trails

Ceylon Trails is a interactive multi-page tourism website designed to showcase the stunning destinations, diverse activities, and rich cultural heritage of Sri Lanka. 

## Key Features

### 1. Interactive SVG Map of Sri Lanka
The Destinations page features a highly detailed, interactive Map of Sri Lanka that is tightly integrated with the core application logic.
- Built using an SVG paths injected via a Node.js build script (`build-map.js`).
- Highlights Sri Lanka's **9 Official Provinces**.
- Features a custom **Cultural Triangle** overlay with distinct city markers (Anuradhapura, Polonnaruwa, Kandy).
- **Two-way filtering:** Clicking a province on the map automatically filters the destination grid, and clicking a navigation pill highlights the associated province on the map.

### 3. Dynamic Pages
* **Home Page:** Features an immersive hero carousel, curated "Featured" destinations, popular activities, dynamic counting statistics, and a testimonial carousel.
* **Destinations Page:** An interactive directory of Sri Lankan hotspots. It pairs the SVG map with an expansive grid of destination cards. Clicking a card opens a detailed modal with highlights, best times to visit, and traveler ratings.
* **Activities & Experiences Page:** A comprehensive catalog of curated experiences (e.g., Safaris, Scuba Diving, Cooking Classes). It features dynamic category filtering and advanced sorting (by price, rating, or recommendations).

## Tech Stack
- **Structure:** HTML5
- **Styling:** Vanilla CSS
- **Logic:** Vanilla Javascript 
- **Tooling:** Vite 
