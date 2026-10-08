# Lumera

Beauty Personal Care Discovery & Exploration Platform (Demo)

This is a single-page website demonstrating a premium, soft-pastel, and editorial-clean discovery platform for beauty content.

## Features
- **12 Semantic Sections**: Hero, About, Services, Discover (Filters & Grid), Creators, Map, Collections, Routines, Bookmarks, Testimonials, FAQ, Contact.
- **Client-Side Functionality**: All filters, sorting, tab switching, and modal interactions are handled smoothly via vanilla JavaScript.
- **Bookmarking System**: Device-local bookmarking using `localStorage`. Items can be saved and viewed in the "#bookmarks" section. Note: these do not sync across devices as this is an account-less platform.
- **Ritual Finder** (`assets/js/ritual-finder.js`): An interactive 3-step quiz (focus → time → mood) that scores the demo content and recommends a guide, a matching routine and two alternates. The background orb shifts colour with the chosen mood.
- **Interactive Map**: A schematic SVG/CSS map with focusable pins that stay synchronized with a list view. 
- **Accessibility**: ARIA labels, semantic markup, focus traps for modals, skip-to-content link, and keyboard navigation.

## Setup Instructions
Open `index.html` in any modern web browser. No build tools or servers are required.

## Integrations & Placeholders
- **Google Maps**: The interactive map section uses a schematic CSS map for demo purposes. To replace it with a real Google Maps embed, look for the `<!-- GOOGLE_MAPS_IFRAME -->` comment inside `index.html` within the `#map` section and insert your iframe.
- **Video Player**: Content cards open a modal that currently uses a placeholder image and play button. To embed a real YouTube/Vimeo player, replace the contents inside the `<!-- VIDEO_EMBED -->` comment block in the modal markup.
- **Forms**: The Contact form and Newsletter signup have validation built-in. Connect them to a service like Formspree or Netlify Forms via the `action` attribute.
- **Analytics**: A Google Analytics tag placeholder is located at the bottom of `index.html`.

## Demo Data Note
All creators, content, venues, dates, follower counts, and brands are purely fictional and for demonstration purposes only. Medical/dermatological disclaimers are included where relevant.
