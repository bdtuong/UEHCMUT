export const collections = [
  {
    id: "craft",
    number: "01",
    title: "The hands that shape culture",
    category: "Craft & everyday life",
    image: "/culture/photos/pottery.webp",
    description:
      "Clay, bamboo and woven threads. Explore the materials, skills and everyday objects that carry stories between generations.",
  },
  {
    id: "art",
    number: "02",
    title: "Stories in colour and pattern",
    category: "Art & expression",
    image: "/culture/photos/folk-art.webp",
    description:
      "Discover how illustration, clothing and architecture create a language of identity, memory and place.",
  },
  {
    id: "festival",
    number: "03",
    title: "A season of togetherness",
    category: "Festivals & community",
    image: "/culture/photos/lanterns.webp",
    description:
      "Explore shared celebrations, gathering places and the lantern craft of Mid-Autumn in a dedicated cultural collection.",
  },
] as const;
export type CollectionId = (typeof collections)[number]["id"];
export const culturalExhibits = [
  {
    id: "ceramics",
    introduction:
      "Welcome to Bát Tràng, seen here through the work of a potter shaping a vessel. Notice how one hand steadies the form while a tool refines its surface. The finished object begins with these small, controlled movements. This photograph invites us to look beyond a ceramic vessel as decoration and consider the attention behind its making. Follow the curve of the clay, the working posture and the tools nearby. Together, they tell a story about material, practice and the knowledge carried through repeated work.",
    title: "Making pottery in Bát Tràng",
    artist: "Craft and material",
    description:
      "A potter works on a vessel in Bát Tràng, Vietnam. Look at the relationship between the rotating form, the tool and the maker’s hands. Photograph by Steven C. Price; the image documents a workshop, not an artefact owned by this digital museum.",
    imageUrl: "/culture/photos/pottery.webp",
  },
  {
    id: "bamboo",
    introduction:
      "An everyday basket can hold a remarkable amount of knowledge. In this photograph from the Mekong Delta, a maker presses a woven form against a stone mould, using the body as well as the hands. Look at the flexible strips, the rounded shape and the baskets stacked nearby. The image connects a useful household object with the effort involved in producing it. Rather than treating craft as a finished souvenir alone, take a moment to consider the shaping, adjustment and repetition that make an object ready for use.",
    title: "Shaping a woven basket",
    artist: "Everyday craft",
    description:
      "A basket maker in the Mekong Delta shapes a woven basket against a stone mould. The photograph offers a close look at the physical work behind an everyday container. See Image credits for the original description and photographer.",
    imageUrl: "/culture/photos/baskets.webp",
  },
  {
    id: "textiles",
    introduction:
      "Pause beside this loom in the Châu Đốc area and follow the threads across its frame. A textile takes shape through the relationship between the person weaving, the tension of the threads and the structure of the loom. Look closely at the cloth emerging from the working area. Pattern is something made through a sequence of actions, not simply an image on a surface. This photograph records one particular workshop setting. It offers a close encounter with the process while reminding us that Vietnamese textile traditions include many different communities and practices.",
    title: "At the loom in Châu Đốc",
    artist: "Textiles and making",
    description:
      "A weaver sits at a loom in the Châu Đốc area of Vietnam. Threads, tools and the movement of the loom connect the textile to the process of making it. This photograph records a particular setting rather than representing all textile traditions in Vietnam.",
    imageUrl: "/culture/photos/weaving.webp",
  },
  {
    id: "folk-art",
    introduction:
      "This Đông Hồ artwork is titled Lý ngư vọng nguyệt, often rendered in English as Carp Gazing at the Moon. Begin with what you can see: the large fish, the movement of the water and the circle above it. Strong outlines and carefully arranged colours make the composition readable from a distance, while smaller marks reward a closer look. Let your eye travel between the carp and the moon. The image is presented here as a reproduction of an artwork, inviting a conversation about visual storytelling rather than a claim to ownership of an original print.",
    title: "Lý ngư vọng nguyệt",
    artist: "Đông Hồ painting",
    description:
      "A reproduction of the Đông Hồ painting Lý ngư vọng nguyệt, showing a carp and the moon. Follow the strong outlines and the arrangement of the fish, water and circular moon. This public-domain reproduction is presented as an artwork image, not as a photograph of a museum-owned print.",
    imageUrl: "/culture/photos/folk-art.webp",
  },
  {
    id: "architecture",
    introduction:
      "Welcome to a courtyard at Văn Miếu, the Temple of Literature in Hanoi. Before focusing on an individual architectural detail, look at how the space is organized. The open ground gives way to columns, rooflines and a sheltered interior. These transitions influence how a visitor approaches and experiences the building. Notice the relationship between people and the scale of the courtyard. Architecture is more than a facade: it also creates routes, pauses and shared spaces. This photograph introduces one specific place within Vietnam's varied built heritage.",
    title: "A courtyard at Văn Miếu",
    artist: "Architecture and shared space",
    description:
      "A view of a courtyard at the Temple of Literature in Hanoi. Observe the roofline, open courtyard and sequence of spaces. This photograph introduces a specific place rather than an imagined or generic historic building.",
    imageUrl: "/culture/photos/architecture.webp",
  },
  {
    id: "festivals",
    introduction:
      "This photograph takes us to a lantern shop in Hội An. Look at the range of shapes and colours suspended above the working space, and at the people within the display. The lanterns create a dense, layered scene in which craft is part of the streetscape. Although the image is not a record of a particular festival ceremony, it connects the idea of celebration with the places where objects are made, displayed and sold. Consider how an object changes meaning as it moves from a maker's workspace into a home, a street or a shared gathering.",
    title: "Lanterns in Hội An",
    artist: "Craft and the streetscape",
    description:
      "Colourful lanterns on display in Hội An, photographed by katiebordner. The photograph shows a lantern shop, not a confirmed festival event. It connects the theme of celebration with the people and places where lanterns are made and sold.",
    imageUrl: "/culture/photos/lanterns.webp",
  },
];
export const products = [
  {
    id: "1",
    name: "Mid-Autumn star lantern",
    price: 15000,
    image: "/starlantern.jpg",
    category: "Festival craft",
    description:
      "A familiar bamboo-and-paper form from the Mid-Autumn collection.",
    material: "Bamboo and coloured paper",
  },
  {
    id: "2",
    name: "Bát Tràng photography print",
    price: 85000,
    image: "/culture/photos/pottery.webp",
    category: "Art prints",
    description:
      "A concept photo print featuring pottery making in Bát Tràng. The source photograph is shown; a finished product is not pictured.",
    material: "Printed paper",
  },
  {
    id: "3",
    name: "Châu Đốc weaving postcards",
    price: 45000,
    image: "/culture/photos/weaving.webp",
    category: "Paper & keepsakes",
    description:
      "A concept postcard set inspired by weaving in Châu Đốc. The source photograph is shown, not a finished postcard set.",
    material: "Printed card",
  },
  {
    id: "4",
    name: "Đông Hồ carp art print",
    price: 85000,
    image: "/culture/photos/folk-art.webp",
    category: "Art prints",
    description:
      "A concept reproduction print of Lý ngư vọng nguyệt. The public-domain artwork is shown, not a finished framed product.",
    material: "Printed paper",
  },
  {
    id: "5",
    name: "Community spaces notebook",
    price: 65000,
    image: "/culture/photos/architecture.webp",
    category: "Paper & keepsakes",
    description:
      "A concept notebook with a Văn Miếu photograph as its cover inspiration. The source photograph is shown, not a finished notebook.",
    material: "Paper notebook",
  },
  {
    id: "6",
    name: "Mid-Autumn carp lantern",
    price: 25000,
    image: "/Carplantern.jpg",
    category: "Festival craft",
    description:
      "A colourful carp-shaped lantern from the festival craft collection.",
    material: "Bamboo and coloured paper",
  },
];
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export const lanternExhibits = [
  {
    id: "lantern-1",
    introduction:
      "Begin this collection by looking at the relationship between shape and surface. The lantern forms in this image use lightweight frames and bright coverings to turn familiar materials into playful objects. Trace an outer edge and imagine how the frame supports it. Then look at the way colour divides the surface. Within this Vietnamese Mid-Autumn collection, craft becomes a meeting point between making and celebration. The image invites you to notice the construction before moving on to the animals and other forms displayed throughout the gallery.",
    title: "A world of paper forms",
    artist: "Mid-Autumn collection",
    description:
      "Look closely at how a lightweight frame supports a colourful paper surface. This collection introduces lantern making as one expression of Vietnamese festival craft.",
    imageUrl: "/room-1/r1-1.jpg",
  },
  {
    id: "lantern-2",
    introduction:
      "A dragon-shaped lantern begins with a problem of imagination: how can a lively creature be suggested by a lightweight frame? Look for the details that help you recognize the form, from its silhouette to the shapes around the head and body. Colour adds another layer of movement. This display invites you to compare the dragon with other animal-inspired lanterns nearby. Rather than assigning one fixed meaning to every detail, consider the decisions a maker makes when translating a familiar creature into a festival object.",
    title: "Imagining a dragon",
    artist: "Mid-Autumn collection",
    description:
      "Animal forms give lantern makers room to play with silhouettes, colours and details. Compare the outline of this dragon-shaped lantern with the other forms in the room.",
    imageUrl: "/room-1/r1-5.jpg",
  },
  {
    id: "lantern-3",
    introduction:
      "The butterfly form brings a different kind of movement into the lantern collection. Its wings create a broad surface for colour, while the frame holds a light and delicate outline. Compare the two sides and look at how the design balances repetition with small variations. The image offers a way to think about craft through observation: what has been simplified, what has been emphasized and what makes the creature recognizable? A familiar animal becomes a new object through choices of material, structure and decoration.",
    title: "Wings in colour",
    artist: "Mid-Autumn collection",
    description:
      "A butterfly form turns a familiar creature into a festival object. Notice the arrangement of colour and the frame that gives each wing its shape.",
    imageUrl: "/room-1/r1-6.jpg",
  },
  {
    id: "lantern-4",
    introduction:
      "Look closely at this carp-shaped lantern. Its fins, body and surface details suggest a fish, yet the materials belong to the workshop rather than the river. Follow the outline from the head toward the tail, then notice how repeated details create a sense of texture. This object shows one way that makers bring the natural world into a shared celebration. As you compare it with the dragon and butterfly forms, consider how each design solves the same challenge: making a recognizable, expressive shape from a lightweight structure.",
    title: "The shape of a carp",
    artist: "Mid-Autumn collection",
    description:
      "Craft can bring the natural world into celebration. This carp-shaped lantern invites a closer look at how makers suggest scales, fins and movement with simple materials.",
    imageUrl: "/room-1/r1-4.jpg",
  },
  {
    id: "lantern-5",
    introduction:
      "Mid-Autumn lanterns can bring personal memories into a public exhibition. A particular colour or shape may remind one visitor of making something at home and another of a street display or a childhood celebration. Begin with the forms visible in this image, then consider the experiences you bring to them. The museum does not assume that every family or community celebrates in the same way. Instead, this display leaves room for different recollections, showing how a crafted object can become a starting point for conversation between generations.",
    title: "Childhood and celebration",
    artist: "Mid-Autumn collection",
    description:
      "Lanterns are part of many people’s memories of Mid-Autumn. Personal experiences and local practices vary; this collection offers a starting point for sharing those stories.",
    imageUrl: "/room-1/r1-12.jpg",
  },
  {
    id: "lantern-6",
    introduction:
      "The star is a familiar form in this lantern collection, built from straight edges that meet in a clear, repeated pattern. Look at the points, the supporting frame and the coloured surface stretched between them. A small set of materials creates a shape that can be recognized at a glance. This display closes the collection by returning to the act of making. Imagine planning the frame, joining its parts and choosing its colours. Those practical decisions connect the finished object to time, attention and the pleasure of creating something for a celebration.",
    title: "A star made by hand",
    artist: "Mid-Autumn collection",
    description:
      "The star is a familiar lantern shape. Its frame and coloured surface show how a small set of materials can become an object for play, making and celebration.",
    imageUrl: "/room-1/r1-8.jpg",
  },
];
