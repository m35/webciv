// [WebCiv]
// A Strategy Game Engine in JavaScript.
//
// [License]
// MIT - See LICENSE.md file in the package.
(function($core, $export, $as) {
"use strict";

const core = $core;
const defs = Object.create(null);

const TerrainType = core.TerrainType;
const TerrainModifier = core.TerrainModifier;

// Links Rules:
//   - Remove all dots
//   - Replace spaces with underscores
//   - Add prefix and suffix that describes the kind of the link.
//
// Link formats:
//   "_[Asset]"        - Link to an asset          - "_[Texture1]"
//   "#[Terrain]"      - Link to a terrain         - "#[Grassland]"
//   "$[Resource]"     - Link to a resource        - "$[Coal]"
//   "+[Modifier]"     - Link to a modifier        - "+[Railroad]"
//   "*[Unit]"         - Link to a unit type       - "*[Mech. Inf]"
//   "%[Building]"     - Link to a building/wonder - "%[Library]"
//   "@[Technology]"   - Link to a technology      - "@[The Wheel]"
//   "~[Civilization]" - Link to a civilization    - "~[Aztecs]"

defs.colors = [
  { primary: "#F0F0F0", secondary: "#8A8A8E" },
  { primary: "#61E365", secondary: "#2C7900" },
  { primary: "#7B91FF", secondary: "#354AB7" },
  { primary: "#FFFF96", secondary: "#61E365" },
  { primary: "#FF55FF", secondary: "#822014" },
  { primary: "#0CE3EB", secondary: "#00AAAA" },
  { primary: "#8A8A8E", secondary: "#4D4D4D" },
  { primary: "#E3AC61", secondary: "#791400" },
  { primary: "#AC61E3", secondary: "#000479" },
  { primary: "#863D38", secondary: "#3A0E1C" }
];

defs.assets = [
  { name: "Texture.Ocean"      , file: "terrain-ocean.png"     , type: "Terrain" , dominance: 1 },
  { name: "Texture.Grassland"  , file: "terrain-grassland.png" , type: "Terrain" , dominance: 2, blendmap: "_[BlendMap.Terrain.2]"   },
  { name: "Texture.Plains"     , file: "terrain-plains.png"    , type: "Terrain" , dominance: 3, blendmap: "_[BlendMap.Terrain.2]" },
  { name: "Texture.Desert"     , file: "terrain-desert.png"    , type: "Terrain" , dominance: 1, blendmap: "_[BlendMap.Terrain.2]" },
  { name: "Texture.Tundra"     , file: "terrain-tundra.png"    , type: "Terrain" , dominance: 4, blendmap: "_[BlendMap.Terrain.2]"   },
  { name: "Texture.Arctic"     , file: "terrain-arctic.png"    , type: "Terrain" , dominance: 5, blendmap: "_[BlendMap.Terrain.2]" },
  { name: "Texture.Coast"      , file: "terrain-arctic.png"    , type: "Terrain"  },
  { name: "Texture.RiverCoast" , file: "river-coast.png"       , type: "Terrain"  },
  { name: "BlendMap.Terrain"   , file: "blendmap-terrain.png"  , type: "BlendMap" },
  { name: "BlendMap.Terrain.2" , file: "blendmap-terrain-2.png", type: "BlendMap" },
  { name: "BlendMap.Coast"     , file: "blendmap-coast.png"    , type: "BlendMap" },
  { name: "BlendMap.CoastLine" , file: "blendmap-coast.png"    , type: "BlendMap" },
  { name: "BlendMap.Territory" , file: ""                      , type: "BlendMap" },
  { name: "BlendMap.RiverCoast", file: ""                      , type: "BlendMap" },
  { name: "Misc"               , file: "assets.png"            , type: "Other"    },
  { name: "Units"              , file: "units.png"             , type: "Other"    }
];

defs.terrains = [
  { name: "Desert"             , id: TerrainType.Desert   , move: 1, defense:   0, food: 0, shields: 1, commerce: 0, asset: "_[Texture.Desert]"    },
  { name: "Plains"             , id: TerrainType.Plains   , move: 1, defense:   0, food: 1, shields: 1, commerce: 0, asset: "_[Texture.Plains]"    },
  { name: "Grassland"          , id: TerrainType.Grassland, move: 1, defense:   0, food: 2, shields: 1, commerce: 0, asset: "_[Texture.Grassland]" },
  { name: "Forest"             , id: TerrainType.Forest   , move: 1, defense:  50, food: 1, shields: 2, commerce: 0, asset: "_[Texture.Grassland]" },
  { name: "Hills"              , id: TerrainType.Hills    , move: 2, defense: 100, food: 1, shields: 0, commerce: 0, asset: "_[Texture.Grassland]" },
  { name: "Mountains"          , id: TerrainType.Mountains, move: 3, defense: 200, food: 0, shields: 2, commerce: 2, asset: "_[Texture.Grassland]" },
  { name: "Tundra"             , id: TerrainType.Tundra   , move: 1, defense:   0, food: 1, shields: 1, commerce: 0, asset: "_[Texture.Tundra]"    },
  { name: "Arctic"             , id: TerrainType.Arctic   , move: 2, defense:   0, food: 0, shields: 0, commerce: 0, asset: "_[Texture.Arctic]"    },
  { name: "Swamp"              , id: TerrainType.Swamp    , move: 2, defense:  50, food: 1, shields: 0, commerce: 0, asset: "_[Texture.Grassland]" },
  { name: "Jungle"             , id: TerrainType.Jungle   , move: 2, defense:  50, food: 1, shields: 0, commerce: 0, asset: "_[Texture.Grassland]" },
  { name: "Ocean"              , id: TerrainType.Ocean    , move: 1, defense:   0, food: 1, shields: 0, commerce: 3, asset: "_[Texture.Ocean]"     }
];

defs.resources = [
  { name: "Fish1"              , food: 0, shields: 0, commerce: 0, terrain: ["#[Ocean]"]                 , assetX: 0, assetY: 5 },
  { name: "Fish2"              , food: 0, shields: 0, commerce: 0, terrain: ["#[Ocean]"]                 , assetX: 1, assetY: 5 },
  { name: "Gold"               , food: 0, shields: 0, commerce: 0, terrain: ["#[Grassland]"]             , assetX: 2, assetY: 5 },
  { name: "Coal"               , food: 0, shields: 0, commerce: 0, terrain: ["#[Grassland]"]             , assetX: 3, assetY: 5 },
  { name: "Oil"                , food: 0, shields: 0, commerce: 0, terrain: ["#[Desert]", "#[Arctic]"]   , assetX: 4, assetY: 5 },
  { name: "Corn"               , food: 0, shields: 0, commerce: 0, terrain: ["#[Plains]", "#[Grassland]"], assetX: 5, assetY: 5 },
  { name: "Iron"               , food: 0, shields: 0, commerce: 0, terrain: ["#[Grassland]"]             , assetX: 6, assetY: 5 },
  { name: "Rubber"             , food: 0, shields: 0, commerce: 0, terrain: ["#[Grassland]"]             , assetX: 7, assetY: 5 }
];

defs.modifiers = [
  { name: "Road"               },
  { name: "Railroad"           },
  { name: "Irrigation"         },
  { name: "Mine"               },
  { name: "River"              }
];

defs.buildings = [
  { name: "Palace"             , prereq: ["@[Masonry]"]                  , cost:200, upkeep: 1, flags: ["Capital"] },
  { name: "Barracks"           , prereq: []                              , cost: 40, upkeep: 1, flags: [] },
  { name: "Granary"            , prereq: ["@[Pottery]"]                  , cost: 60, upkeep: 1, flags: [] },
  { name: "Marketplace"        , prereq: ["@[Currency]"]                 , cost: 80, upkeep: 1, flags: [] },
  { name: "Library"            , prereq: ["@[Writing]"]                  , cost: 80, upkeep: 1, flags: [] },
  { name: "Courthouse"         , prereq: ["@[Code of Laws]"]             , cost: 80, upkeep: 1, flags: [] },
  { name: "Bank"               , prereq: ["@[Banking]", "%[Marketplace]"], cost:120, upkeep: 2, flags: [] },
  { name: "University"         , prereq: ["@[University]", "%[Library]"] , cost:160, upkeep: 2, flags: [] },
  { name: "Aqueduct"           , prereq: ["@[Construction]"]             , cost:120, upkeep: 2, flags: [] },
  { name: "Temple"             , prereq: ["@[Ceremonial Burial]"]        , cost: 40, upkeep: 1, flags: [] },
  { name: "Colosseum"          , prereq: ["@[Construction]"]             , cost:100, upkeep: 2, flags: [] },
  { name: "Cathedral"          , prereq: ["@[Religion]"]                 , cost:160, upkeep: 3, flags: [] },
  { name: "Factory"            , prereq: ["@[Industrialization]"]        , cost:200, upkeep: 4, flags: [] },
  { name: "Manufacturing Plant", prereq: ["@[Robotics]", "%[Factory]"]   , cost:320, upkeep: 4, flags: [] },
  { name: "Power Plant"        , prereq: ["@[Refining]"]                 , cost:160, upkeep: 4, flags: ["Power Plant"] },
  { name: "Hydro Plant"        , prereq: ["@[Electronics]"]              , cost:240, upkeep: 4, flags: ["Power Plant"] },
  { name: "Nuclear Plant"      , prereq: ["@[Nuclear Power]"]            , cost:160, upkeep: 4, flags: ["Power Plant"] },
  { name: "Mass Transit"       , prereq: ["@[Mass Production]"]          , cost:160, upkeep: 3, flags: [] },
  { name: "Recycling Center"   , prereq: ["@[Recycling]"]                , cost:200, upkeep: 3, flags: [] },
  { name: "SDI Defense"        , prereq: ["@[Superconductors]"]          , cost:200, upkeep: 4, flags: [] }
];

defs.units = [
  { name: "Settlers"           , prereq: []                              , cost: 40, upkeep: 0, attack: 0, defense: 0, movement: 1, flags: [] },
  { name: "Militia"            , prereq: []                              , cost: 10, upkeep: 0, attack: 1, defense: 0, movement: 1, flags: [] },
  { name: "Phalanx"            , prereq: ["@[Bronze Working]"]           , cost: 20, upkeep: 0, attack: 1, defense: 0, movement: 1, flags: [] },
  { name: "Legion"             , prereq: ["@[Iron Working]"]             , cost: 20, upkeep: 0, attack: 3, defense: 1, movement: 1, flags: [] },
  { name: "Musketeer"          , prereq: ["@[Gunpowder]"]                , cost: 30, upkeep: 0, attack: 2, defense: 3, movement: 1, flags: [] },
  { name: "Riflemen"           , prereq: ["@[Conscription]"]             , cost: 40, upkeep: 0, attack: 0, defense: 0, movement: 1, flags: [] },
  { name: "Cavalry"            , prereq: ["@[Horseback Riding]"]         , cost: 20, upkeep: 0, attack: 2, defense: 1, movement: 2, flags: [] },
  { name: "Knights"            , prereq: ["@[Chivalry]"]                 , cost: 40, upkeep: 0, attack: 5, defense: 2, movement: 2, flags: [] },
  { name: "Catapult"           , prereq: ["@[Mathematics]"]              , cost: 40, upkeep: 0, attack: 6, defense: 1, movement: 1, flags: [] },
  { name: "Cannon"             , prereq: ["@[Metallurgy]"]               , cost: 40, upkeep: 0, attack: 8, defense: 1, movement: 1, flags: [] },
  { name: "Chariot"            , prereq: ["@[The Wheel]"]                , cost: 40, upkeep: 0, attack: 4, defense: 1, movement: 2, flags: [] },
  { name: "Armor"              , prereq: ["@[Automobile]"]               , cost: 80, upkeep: 0, attack:10, defense: 5, movement: 3, flags: [] },
  { name: "Mech. Inf"          , prereq: ["@[Labor Union]"]              , cost: 40, upkeep: 0, attack: 0, defense: 0, movement: 1, flags: [] },
  { name: "Artilery"           , prereq: ["@[Robotics]"]                 , cost: 60, upkeep: 0, attack:12, defense: 2, movement: 2, flags: [] },
  { name: "Fighter"            , prereq: ["@[Flight]"]                   , cost: 60, upkeep: 0, attack: 4, defense: 2, movement:10, flags: [] },
  { name: "Bomber"             , prereq: ["@[Advanced Flight]"]          , cost:120, upkeep: 0, attack:12, defense: 1, movement: 8, flags: [] },
  { name: "Trireme"            , prereq: ["@[Map Making]"]               , cost: 40, upkeep: 0, attack: 1, defense: 0, movement: 3, flags: [] },
  { name: "Sail"               , prereq: ["@[Navigation]"]               , cost: 40, upkeep: 0, attack: 2, defense: 1, movement: 3, flags: [] },
  { name: "Frigate"            , prereq: ["@[Magnetism]"]                , cost: 40, upkeep: 0, attack: 3, defense: 2, movement: 4, flags: [] },
  { name: "Ironclad"           , prereq: ["@[Steam Engine]"]             , cost: 60, upkeep: 0, attack: 4, defense: 4, movement: 5, flags: [] },
  { name: "Cruiser"            , prereq: ["@[Combustion]"]               , cost: 80, upkeep: 0, attack: 6, defense: 6, movement: 6, flags: [] },
  { name: "Battleship"         , prereq: ["@[Steel]"]                    , cost:160, upkeep: 0, attack:18, defense:12, movement: 5, flags: [] },
  { name: "Submarine"          , prereq: ["@[Mass Production]"]          , cost: 50, upkeep: 0, attack:10, defense: 2, movement: 4, flags: [] },
  { name: "Carrier"            , prereq: ["@[Advanced Flight]"]          , cost:160, upkeep: 0, attack: 6, defense:12, movement: 1, flags: [] },
  { name: "Transport"          , prereq: ["@[Industrialization]"]        , cost: 50, upkeep: 0, attack: 0, defense: 4, movement: 5, flags: [] },
  { name: "Nuclear"            , prereq: ["@[Rocketry]"]                 , cost:160, upkeep: 0, attack:99, defense: 0, movement:16, flags: [] },
  { name: "Diplomat"           , prereq: ["@[Writing]"]                  , cost: 40, upkeep: 0, attack: 0, defense: 0, movement: 1, flags: [] },
  { name: "Caravan"            , prereq: ["@[Trade]"]                    , cost: 50, upkeep: 0, attack: 0, defense: 1, movement: 1, flags: [] }
];

defs.technologies = [
  { name: "Advanced Flight"    , prereq: ["@[Electricity]", "@[Flight]"]            },
  { name: "Alphabet"           , prereq: []                                         },
  { name: "Astronomy"          , prereq: ["@[Mathematics]", "@[Mysticism]"]         },
  { name: "Atomic Theory"      , prereq: ["@[Physics]", "@[Theory of Gravity]"]     },
  { name: "Automobile"         , prereq: ["@[Combustion]", "@[Steel]"]              },
  { name: "Banking"            , prereq: ["@[The Republic]", "@[Trade]"]            },
  { name: "Bridge Building"    , prereq: ["@[Alphabet]", "@[Iron Working]"]         },
  { name: "Bronze Working"     , prereq: []                                         },
  { name: "Ceremonial Burial"  , prereq: []                                         },
  { name: "Chemistry"          , prereq: ["@[Medicine]", "@[University]"]           },
  { name: "Chivalry"           , prereq: ["@[Feudalism]", "@[Horseback Riding]"]    },
  { name: "Code of Laws"       , prereq: ["@[Alphabet]"]                            },
  { name: "Combustion"         , prereq: ["@[Explosives]", "@[Refining]"]           },
  { name: "Communism"          , prereq: ["@[Industrialization]", "@[Philosophy]"]  },
  { name: "Computers"          , prereq: ["@[Electronics]", "@[Mathematics]"]       },
  { name: "Conscription"       , prereq: ["@[Explosives]", "@[The Republic]"]       },
  { name: "Construction"       , prereq: ["@[Currency]", "@[Masonry]"]              },
  { name: "Currency"           , prereq: ["@[Bronze Working]"]                      },
  { name: "Democracy"          , prereq: ["@[Literacy]", "@[Philosophy]"]           },
  { name: "Electricity"        , prereq: ["@[Magnetism]", "@[Metallurgy]"]          },
  { name: "Electronics"        , prereq: ["@[Electricity]"]                         },
  { name: "Engineering"        , prereq: ["@[Construction]", "@[The Wheel]"]        },
  { name: "Explosives"         , prereq: ["@[Chemistry]", "@[Gunpowder]"]           },
  { name: "Feudalism"          , prereq: ["@[Masonry]", "@[Monarchy]"]              },
  { name: "Flight"             , prereq: ["@[Physics]", "@[Combustion]"]            },
  { name: "Fusion Power"       , prereq: ["@[Nuclear Power]", "@[Superconductor]"]  },
  { name: "Genetic Engineering", prereq: ["@[Medicine]", "@[The Corporation]"]      },
  { name: "Horseback Riding"   , prereq: []                                         },
  { name: "Industrialization"  , prereq: ["@[Banking]", "@[Railroad]"]              },
  { name: "Invention"          , prereq: ["@[Engineering]", "@[Literacy]"]          },
  { name: "Iron Working"       , prereq: ["@[Bronze Working]"]                      },
  { name: "Labor Union"        , prereq: ["@[Labor Union]", "@[Mass Production]"]   },
  { name: "Literacy"           , prereq: ["@[Code of Laws]", "@[Writing]"]          },
  { name: "Magnetism"          , prereq: ["@[Navigation]", "@[Physics]"]            },
  { name: "Map Making"         , prereq: ["@[Alphabet]"]                            },
  { name: "Masonry"            , prereq: []                                         },
  { name: "Mass Production"    , prereq: ["@[Automobile]", "@[The Corporation]"]    },
  { name: "Mathematics"        , prereq: ["@[Alphabet]", "@[Masonry]"]              },
  { name: "Medicine"           , prereq: ["@[Philosophy]", "@[Trade]"]              },
  { name: "Metallurgy"         , prereq: ["@[Gunpowder]", "@[University]"]          },
  { name: "Monarchy"           , prereq: ["@[Ceremonial Burial]", "@[Code of Laws]"]},
  { name: "Mysticism"          , prereq: ["@[Ceremonial Burial]"]                   },
  { name: "Navigation"         , prereq: ["@[Astronomy]", "@[Map Making]"]          },
  { name: "Nuclear Fission"    , prereq: ["@[Atomic Theory]", "@[Mass Production]"] },
  { name: "Nuclear Power"      , prereq: ["@[Electronics]", "@[Nuclear Fission]"]   },
  { name: "Philosophy"         , prereq: ["@[Literacy]", "@[Misticism]"]            },
  { name: "Physics"            , prereq: ["@[Mathematics]", "@[Navigation]"]        },
  { name: "Plastics"           , prereq: ["@[Refining]", "@[Space Flight]"]         },
  { name: "Pottery"            , prereq: []                                         },
  { name: "Railroad"           , prereq: ["@[Bridge Building]", "@[Steam Engine]"]  },
  { name: "Recycling"          , prereq: ["@[Democracy]", "@[Mass Production]"]     },
  { name: "Refining"           , prereq: ["@[Chemistry]", "@[The Corporation]"]     },
  { name: "Religion"           , prereq: ["@[Philosophy]", "@[Writing]"]            },
  { name: "Robotics"           , prereq: ["@[Computers]", "@[Plastics]"]            },
  { name: "Rocketry"           , prereq: ["@[Advanced Flight]", "@[Electronics]"]   },
  { name: "Space Flight"       , prereq: ["@[Computers]", "@[Rocketry]"]            },
  { name: "Steam Engine"       , prereq: ["@[Invention]", "@[Physics]"]             },
  { name: "Steel"              , prereq: ["@[Industrialization]", "@[Metallurgy]"]  },
  { name: "Super Conductor"    , prereq: ["@[Mass Production]", "@[Plastics]"]      },
  { name: "The Corporation"    , prereq: ["@[Banking]", "@[Industrialization]"]     },
  { name: "The Republic"       , prereq: ["@[Code of Laws]", "@[Literacy]"]         },
  { name: "The Wheel"          , prereq: []                                         },
  { name: "Theory of Gravity"  , prereq: ["@[Astronomy]", "@[University]"]          },
  { name: "Trade"              , prereq: ["@[Code of Laws]", "@[Currency]"]         },
  { name: "University"         , prereq: ["@[Mathematics]", "@[Philosophy]"]        },
  { name: "Writing"            , prereq: ["@[Alphabet]"]                            }
];

// TODO:
// Need characteristics like aggressivity, expansiveness, etc...
defs.civilizations = [
  {
    name: "Romans",
    adjective: "Roman",
    colorSlot: 0,
    cityNames: [
      "Rome", "Antium", "Cumae", "Neapolis", "Pisae", "Ravenna", "Arretium",
      "Mediolanum", "Arpinum", "Circei", "Setia", "Satricum", "Ardea", "Ostia",
      "Velitrae", "Viroconium", "Tarentum", "Brundisium", "Caesaraugusta",
      "Caesarea", "Palmyra", "Signia", "Aquileia", "Clusium", "Sutrium",
      "Cremona", "Placentia", "Hispalis", "Nicomedia", "Artaxata", "Aurelianorum",
      "Nicopolis", "Londinium", "Eburacum", "Gordion", "Agrippina", "Lugdunum",
      "Verona", "Corfinium", "Treveri", "Sirmium", "Augustadorum", "Bagacum",
      "Lauriacum", "Teurnia", "Curia", "Fregellae", "Albafucens", "Sora",
      "Interrama", "Suessa", "Saticula", "Luceria", "Arminium", "Senagallica",
      "Castrumnovum", "Hadria"
    ]
  },
  {
    name: "Russians",
    adjective: "Russian",
    colorSlot: 0,
    cityNames: [
      "Moscow", "St. Petersburg", "Novgorod", "Rostov", "Yaroslavi",
      "Yekaterinburg", "Yakutsk", "Vladivostok", "Smolensk", "Orenburg",
      "Krasnoyarsk", "Khabarovsk", "Bryansk", "Tver", "Novosibirsk", "Magadan",
      "Murmansk", "Irkustk", "Chita", "Samara", "Arkhangelsk", "Chelyabinsk",
      "Tobolsk", "Vologda", "Omsk", "Astrakhan", "Kursk", "Saratov", "Tula",
      "Vladimir", "Perm", "Voronezh", "Pskov", "Starayarussa", "Kostroma",
      "Nizhniynovgorod", "Suzdal", "Magnitogorsk"
    ]
  },
  {
    name: "Babylonians",
    adjective: "Babylonian",
    colorSlot: 1,
    cityNames: [
      "Babylon", "Ur", "Nineveh", "Ashur", "Ellipi", "Akkad", "Uruk", "Eridu",
      "Samarra", "Lagash", "Kish", "Nippur", "Shuruppak", "Zariqum", "Sippar",
      "Izibia", "Larsa", "Nimrud", "Zamua", "Khorsabad", "Hindana", "Tell Wilaya",
      "Umma", "Adab", "Telloh", "Nina", "Ebla"
    ]
  },
  {
    name: "Zulus",
    adjective: "Zulu",
    colorSlot: 1,
    cityNames: [
      "Ulundi", "Umgungundlovu", "Nobamba", "Bulawayo", "Kwadukuza", "Nongoma",
      "Ondini", "Nodwengu", "Ndondakusuka", "Babanango", "Khangela",
      "Kwahlomendlini", "Hlobane", "Ethekwini", "Mlambongwenya", "Eziqwaqweni",
      "Emangweni", "Isiphezi", "Masotsheni", "Mtunzini", "Nyakamubi", "Dumazulu",
      "Hlatikulu", "Mthonjaneni", "Empangeni", "Pongola", "Tungela", "Kwamashu",
      "Ingwavuma", "Hluhluwe", "Mtubatuba", "Mhlahlandlela", "Mthatha", "Maseru",
      "Lobamba", "Qunu"
    ]
  },
  {
    name: "Germans",
    adjective: "German",
    colorSlot: 2,
    cityNames: [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Essen", "Dortmund",
      "Stuttgart", "Dusseldorf", "Bremen", "Hannover", "Duisburg", "Leipzig",
      "Nuremberg", "Dresden", "Bonn", "Bochum", "Magdeburg", "Bielefeld",
      "Mannheim", "Karlsruhe", "Gelsenkirchen", "Wiesbaden", "Munster",
      "Rostock", "Augsburg", "Chemnitz", "Aachen", "Braunschweig", "Halle",
      "Monchengladbach", "Kiel", "Wuppertal", "Lubeck", "Freiburg", "Hagen",
      "Erfurt", "Heidelberg", "Kassel", "Mainz", "Oberhausen", "Hamm",
      "Saarbrucken", "Krefeld", "Potsdam", "Solingen", "Osnabruck", "Ludwigshafen",
      "Leverkusen", "Oldenburg", "Neuss", "Mulheim", "Darmstadt", "Herne",
      "Wurzburg", "Regensburg", "Recklinghausen", "Gottingen", "Wolfsburg",
      "Ulm", "Koblenz", "Hildesheim", "Erlangen", "Trier"
    ]
  },
  {
    name: "French",
    adjective: "French",
    colorSlot: 2,
    cityNames: [
      "Paris", "Orleans", "Lyons", "Rheims", "Tours", "Marseilles", "Chartres",
      "Avignon", "Besancon", "Rouen", "Grenoble", "Djion", "Amiens", "Cherbourg",
      "Poitiers", "Toulouse", "Bayonne", "Strasbourg", "Brest", "Bordeaux",
      "Rennes"
    ]
  },
  {
    name: "Aztecs",
    adjective: "Aztec",
    colorSlot: 3,
    cityNames: [
      "Tenochtitlan", "Teotihuacan", "Tlatelolco", "Texcoco", "Tlaxcala",
      "Calixtlahuaca", "Xochicalco", "Tlacopan", "Atzcapotzalco", "Tzintzuntzen",
      "Malinalco", "Tula", "Tamuin", "Teayo", "Cempoala", "Chalco", "Tlalmanalco",
      "Ixtapaluca", "Huexotla", "Tepexpan", "Tepetlaoxtoc", "Chiconautla",
      "Zitlaltepec", "Coyotepec", "Tequixquiac", "Jilotzingo", "Tlapanaloya",
      "Tultitan", "Ecatepec", "Coatepec", "Chalchiuites", "Chiauhita",
      "Chapultepec", "Itzapalapa", "Ayotzinco", "Iztapam"
    ]
  },
  {
    name: "Egyptians",
    adjective: "Egyptian",
    colorSlot: 3,
    cityNames: [
      "Thebes", "Memphis", "Heliopolis", "Elephantine", "Alexandria",
      "Pi-Ramesses", "Giza", "Byblos", "Akhetaten", "Hieraconpolis", "Abydos",
      "Asyut", "Avaris", "Lisht", "Buto",  "Edfu", "Pithom", "Busiris", "Kahun",
      "Athribis", "Mendes", "Elashmunein", "Tanis", "Bubastis", "This", "Oryx",
      "Sebennytus", "Akhmin", "Karnak", "Luxor", "Elkab", "Armant", "Balat",
      "Ellahun", "Ghurab", "Hawara", "Dashur", "Raqote", "Damanhur", "Merimde",
      "Abusir", "Herakleopolis", "Akoris", "Benihasan", "Tasa", "Badari",
      "Hermopolis", "Amrah", "Negade", "Koptos", "Hermonthis", "Ombos", "Aniba",
      "Soleb", "Semna", "Amara"
    ]
  },
  {
    name: "Greeks",
    adjective: "Greek",
    colorSlot: 4,
    cityNames: [
      "Athens", "Sparta", "Corinth", "Argos", "Knossos", "Mycenae", "Pharsalos",
      "Ephesus", "Halicarnassus", "Rhodes", "Eretria", "Pergamon", "Miletos",
      "Megara", "Phocaea", "Sicyon", "Tiryns", "Samos", "Mytilene", "Chios",
      "Paros", "Tegea", "Elis", "Syracuse", "Herakleia", "Gortyn", "Chalkis",
      "Pylos", "Pella", "Naxos", "Thessalonica", "Smyrna", "Larissa", "Patras",
      "Lamia", "Apollonia", "Nafplion"
    ]
  },
  {
    name: "English",
    adjective: "English",
    colorSlot: 4,
    cityNames: [
      "London", "York", "Notthingham", "Hastings", "Canterbury", "Coventry",
      "Warwick", "Newcastle", "Oxford", "Liverpool", "Dover", "Brighton",
      "Norwich", "Leeds", "Reading", "Birmingham", "Richmond", "Exeter",
      "Cambridge", "Gloucester", "Manchester", "Bristol", "Leicester",
      "Carlisle", "Ipswich", "Portsmouth", "Berwick"
    ]
  },
  {
    name: "Americans",
    adjective: "American",
    colorSlot: 5,
    cityNames: [
      "Washington", "New York", "Boston", "Philadelphia", "Atlanta", "Chicago",
      "Seattle", "San Francisco", "Los Angeles", "Houston", "Portland",
      "St Louis", "Miami", "Buffalo", "Detroit", "New Orleans", "Baltimore",
      "Denver", "Cincinnati", "Dallas", "Memphis", "Clevelan", "Kansas City",
      "San Diego", "Richmond", "Las Vegas", "Phoenix", "Albuquerque",
      "Minneapolis", "Pittsburgh", "Oakland", "Tampa Bay", "Orlando", "Tacoma",
      "Santa Fe", "Olympia", "Hunt Valley", "Springfield", "Palo Alto",
      "Centralia", "Spokane", "Jacksonville", "Savannah", "Charleston",
      "San Antonio", "Omaha", "Birmingham", "Honolulu", "Anchorage", "Sacramento",
      "Salt Lake City", "Reno", "Boise", "Milwaukee", "Santa Cruz", "Monterey",
      "Santa Monica", "Little Rock"
    ]
  },
  {
    name: "Chinese",
    adjective: "Chinese",
    colorSlot: 5,
    cityNames: [
      "Beijing", "Shanghai", "Guangzhou", "Nanjing", "Xian", "Chengdu",
      "Hangzhou", "Tianjin", "Macau", "Shandong", "Kaifeng", "Ningbo",
      "Baoding", "Yangzhou", "Haerbin", "Chongqing", "Loyang", "Kunming",
      "Taipei", "Shenyang", "Taiyuan", "Tainan", "Dalian", "Lijiang",
      "Wuxi", "Suzhou", "Maoming", "Shaoguan", "Yangjiang", "Heyuan",
      "Liaoning", "Hubei", "Gansu", "Huangshi", "Yichang", "Yingtan",
      "Xinyu", "Xinzheng", "Handan", "Dunhuang", "Gaoyu", "Nantong",
      "Weifang", "Xikang"
    ]
  },
  {
    name: "Indians",
    adjective: "Indian",
    colorSlot: 6,
    cityNames: [
      "Delhi", "Bombay", "Madras", "Bangalore", "Calcutta", "Lahore", "Karachi",
      "Kolhapur", "Jaipur", "Hyderabad", "Bengal", "Chittagong", "Punjab",
      "Dacca", "Indus", "Pune", "Lucknow", "Varanasi", "Bhopal", "Rajshahi",
      "Rangoon", "Mandalay", "Peshawar", "Darjeeling", "Cochin", "Cuttack",
      "Goa", "Calicut", "Rawalpindi", "Quetta", "Howrah", "Triverapatnam",
      "Dakpathar", "Thanjavur", "Jaunpur", "Kodaikanal", "Vrindavan", "Guwahati",
      "Bhalukpong", "Sonepur", "Vaishali", "Rewalsar", "Kurukshetra", "Subarnapur",
      "Wadhvan", "Narkanda", "Dhanaulti", "Chitradurga", "Srikakulam",
      "Vijayaweda", "Banswara"
    ]
  },
  {
    name: "Mongols",
    adjective: "Mongol",
    colorSlot: 6,
    cityNames: [
      "Karakorum", "Samarkand", "Bokhara", "Nishapur", "Kashgar", "Tabriz",
      "Aleppo", "Kabul", "Ormuz", "Basra", "Khanbalyk", "Khorasan", "Shangtu",
      "Kazan", "Quinsay", "Kerman"
    ]
  }
];

$export[$as] = defs;

}).apply(null, typeof this.webciv === "object"
  ? [this.webciv, this.webciv, "defs"]
  : [require("./webciv-core"), module, "exports"]);