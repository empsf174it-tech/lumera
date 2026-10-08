// data.js - Fictional Demo Data for Lumera

const LumeraData = {
  creators: [
    { id: 'c1', name: 'Amara Lin', handle: '@amaralin', specialty: 'Skin Barrier Health', followers: '124K', bio: 'Focusing on hydration and repairing sensitive skin.', initials: 'AL', avatar: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?auto=format&fit=crop&crop=faces&w=200&h=200&q=80' },
    { id: 'c2', name: 'Elias Thorne', handle: '@eliaslooks', specialty: 'Minimalist Makeup', followers: '89K', bio: 'Five-minute routines for a fresh, everyday glow.', initials: 'ET', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=200&h=200&q=80' },
    { id: 'c3', name: 'Sarah Jenkins', handle: '@sarahcurls', specialty: 'Textured Hair Care', followers: '210K', bio: 'Embracing natural curls with science-backed moisture.', initials: 'SJ', avatar: 'https://images.unsplash.com/photo-1614204424926-196a80bf0be8?auto=format&fit=crop&crop=faces&w=200&h=200&q=80' },
    { id: 'c4', name: 'Dr. Maya Patel', handle: '@wellnessmaya', specialty: 'Holistic Wellness', followers: '150K', bio: 'Integrating sleep, nutrition, and skin health.', initials: 'MP', avatar: 'https://images.unsplash.com/photo-1631606931376-f2845ed31d9d?auto=format&fit=crop&crop=faces&w=200&h=200&q=80' }
  ],
  
  content: [
    {
      id: 'item1', title: 'The Ultimate Guide to Glass Skin', creatorId: 'c1', category: 'makeup', type: 'video', 
      duration: '12:45', tags: ['hydration', 'glow', 'quick looks'], sponsored: false,
      thumb: 'https://images.unsplash.com/photo-1630084775816-7abb7383ded5?auto=format&fit=crop&q=80&w=400',
      desc: 'Achieve that coveted dewy, translucent skin look with this step-by-step tutorial. We cover prep, base, and finishing touches.',
      products: ['Hydrating Essence', 'Dewy Foundation Demo', 'Liquid Highlighter'], date: '2026-10-01', saves: 1240
    },
    {
      id: 'item2', title: 'Restoring Your Skin Barrier', creatorId: 'c1', category: 'wellness', type: 'routine',
      duration: 'Read: 5m', tags: ['sensitive skin', 'repair'], sponsored: true,
      thumb: 'https://images.unsplash.com/photo-1741896135490-4062a3b21abf?auto=format&fit=crop&q=80&w=400',
      desc: 'If your skin feels tight or red, your barrier might be compromised. Here is a simple, gentle routine to help it recover.',
      products: ['Ceramide Cleanser', 'Centella Soothing Serum', 'Barrier Cream'], date: '2026-10-02', saves: 3400
    },
    {
      id: 'item3', title: 'Wash Day Routine for 3c/4a Curls', creatorId: 'c3', category: 'hair', type: 'tutorial',
      duration: '18:20', tags: ['curls', 'moisture'], sponsored: false,
      thumb: 'https://images.unsplash.com/photo-1667514045961-b339742e1045?auto=format&fit=crop&q=80&w=400',
      desc: 'My full wash day routine from detangling to deep conditioning. Essential tips for maintaining moisture and definition.',
      products: ['Sulfate-free Shampoo', 'Deep Conditioner Mask', 'Leave-in Styler'], date: '2026-09-28', saves: 2100
    },
    {
      id: 'item4', title: '5-Minute Zoom Meeting Makeup', creatorId: 'c2', category: 'makeup', type: 'video',
      duration: '06:15', tags: ['quick looks', 'minimalist'], sponsored: true,
      thumb: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=400',
      desc: 'Look polished on camera with minimal effort. This routine uses multi-purpose products to save time.',
      products: ['Tinted SPF', 'Cream Blush/Lip Duo', 'Brow Gel'], date: '2026-10-04', saves: 890
    },
    {
      id: 'item5', title: 'Wind-Down Evening Ritual', creatorId: 'c4', category: 'body', type: 'routine',
      duration: 'Read: 8m', tags: ['sleep', 'relaxation'], sponsored: false,
      thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
      desc: 'Prepare your mind and body for restful sleep with this relaxing evening ritual, incorporating gentle stretching and body care.',
      products: ['Magnesium Body Lotion', 'Lavender Pillow Mist'], date: '2026-09-25', saves: 4500
    },
    {
      id: 'item6', title: 'Testing the Viral Heatless Curlers', creatorId: 'c3', category: 'hair', type: 'review',
      duration: '10:05', tags: ['curls', 'styling'], sponsored: false,
      thumb: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400',
      desc: 'Do they actually work on textured hair? I test the latest heatless curling method overnight.',
      products: ['Silk Curling Ribbon', 'Lightweight Hair Oil'], date: '2026-10-05', saves: 1100
    }
  ],
  
  venues: [
    { id: 'v1', name: 'Aura Skin Studio', type: 'salon', lat: 40.71, lng: -74.01, address: '123 Demo St, Metro City', time: 'Mon-Sat 10am-7pm', desc: 'Holistic facials and skin consultations.', tags: ['Facials', 'Consults'] },
    { id: 'v2', name: 'Glow Up Pop-up', type: 'event', lat: 40.73, lng: -73.99, address: 'Central Park Pavilion', time: 'Oct 15, 12pm-5pm', desc: 'Try new releases and meet creators.', tags: ['Pop-up', 'Meet & Greet'] },
    { id: 'v3', name: 'Botanica Beauty Store', type: 'store', lat: 40.75, lng: -73.98, address: '456 Retail Ave', time: 'Daily 9am-9pm', desc: 'Curated selection of clean beauty products.', tags: ['Retail', 'Clean Beauty'] },
    { id: 'v4', name: 'The Curl Clinic', type: 'salon', lat: 40.72, lng: -74.00, address: '789 Texture Blvd', time: 'Tue-Sun 9am-6pm', desc: 'Specialized cuts and treatments for all curl patterns.', tags: ['Hair', 'Treatments'] }
  ],
  
  collections: [
    { id: 'col1', title: 'Glass-Skin Basics', desc: 'Everything you need to achieve a luminous, hydrated complexion.', items: ['item1', 'item2'], image: 'https://images.unsplash.com/photo-1630084775816-7abb7383ded5?auto=format&fit=crop&q=80&w=600' },
    { id: 'col2', title: 'Curl Care Essentials', desc: 'Mastering moisture and definition for textured hair.', items: ['item3', 'item6'], image: 'https://images.unsplash.com/photo-1667514045961-b339742e1045?auto=format&fit=crop&q=80&w=600' },
    { id: 'col3', title: 'Wind-Down Wellness', desc: 'Rituals and routines for better rest and relaxation.', items: ['item5', 'item2'], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600' }
  ],
  
  routines: [
    {
      id: 'r1', title: 'AM Skincare Focus', author: 'Amara Lin', date: 'October 1, 2026', typeTarget: ['all', 'dry', 'oily', 'sensitive'],
      steps: [
        { num: 1, title: 'Gentle Cleanse', type: 'Cleanser', time: '60s', note: 'Removes overnight impurities without stripping.' },
        { num: 2, title: 'Hydrating Toner', type: 'Essence', time: '30s', note: 'Preps skin to absorb following serums better.' },
        { num: 3, title: 'Antioxidant Serum', type: 'Treatment', time: '60s', note: 'Protects against environmental stressors.' },
        { num: 4, title: 'Moisturize & Protect', type: 'SPF/Cream', time: '2m', note: 'Locks in hydration and shields from UV rays (crucial!).' }
      ]
    },
    {
      id: 'r2', title: 'Wash Day (Curls)', author: 'Sarah Jenkins', date: 'September 28, 2026', typeTarget: ['all', 'curly', 'dry'],
      steps: [
        { num: 1, title: 'Pre-poo Detangle', type: 'Oil/Conditioner', time: '10m', note: 'Melts tangles and reduces breakage before washing.' },
        { num: 2, title: 'Scalp Cleanse', type: 'Shampoo', time: '5m', note: 'Focus on the scalp to remove buildup.' },
        { num: 3, title: 'Deep Condition', type: 'Mask', time: '20m', note: 'Restores moisture elasticity (use heat if low porosity).' },
        { num: 4, title: 'Style & Set', type: 'Cream + Gel', time: '15m', note: 'Rake in cream for moisture, glaze with gel for hold.' }
      ]
    }
  ]
};

// Expose globally
window.LumeraData = LumeraData;
