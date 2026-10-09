import { MediaItem } from '../types/media';

// High quality sample MP4 streams that play reliably cross-platform in browsers
export const SAMPLE_STREAMS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

export const CURATED_MEDIA: MediaItem[] = [
  {
    id: 'dune-2',
    tmdbId: 693134,
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    type: 'movie',
    year: 2024,
    releaseDate: 'March 1, 2024',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    rating: 8.6,
    votes: 482000,
    runtime: 166,
    genres: ['Science Fiction', 'Adventure', 'Action'],
    ageRating: 'PG-13',
    status: 'Released',
    tagline: 'Long live the fighters.',
    trailerKey: 'Way9Dexny3w',
    streamUrl: SAMPLE_STREAMS[0],
    cast: [
      { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop' },
      { id: 2, name: 'Zendaya', character: 'Chani', profilePath: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop' },
      { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica', profilePath: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&fit=crop' },
      { id: 4, name: 'Javier Bardem', character: 'Stilgar', profilePath: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&fit=crop' },
      { id: 5, name: 'Austin Butler', character: 'Feyd-Rautha', profilePath: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&fit=crop' }
    ]
  },
  {
    id: 'arcane',
    tmdbId: 94605,
    title: 'Arcane',
    originalTitle: 'Arcane: League of Legends',
    type: 'show',
    year: 2024,
    releaseDate: 'November 6, 2021',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    overview: 'Amid the burgeoning conflict between the twin cities of Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.',
    rating: 9.0,
    votes: 275000,
    runtime: 42,
    genres: ['Animation', 'Action', 'Sci-Fi', 'Fantasy'],
    ageRating: 'TV-14',
    status: 'Ended',
    tagline: 'Every legend has a beginning.',
    trailerKey: 'fXmAurh012s',
    streamUrl: SAMPLE_STREAMS[3],
    cast: [
      { id: 10, name: 'Hailee Steinfeld', character: 'Vi', profilePath: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop' },
      { id: 11, name: 'Ella Purnell', character: 'Jinx', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop' },
      { id: 12, name: 'Kevin Alejandro', character: 'Jayce', profilePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop' }
    ],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'arcane-s1e1', number: 1, seasonNumber: 1, title: 'Welcome to the Playground', overview: 'Orphaned sisters Vi and Powder bring trouble to Zaun\'s underground streets following a heist in posh Piltover.', duration: 43, stillPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[3] },
          { id: 'arcane-s1e2', number: 2, seasonNumber: 1, title: 'Some Mysteries Are Better Left Unsolved', overview: 'Idealistic inventor Jayce attempts to harness magic through science despite mentor Heimerdinger\'s warnings.', duration: 41, stillPath: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[0] },
          { id: 'arcane-s1e3', number: 3, seasonNumber: 1, title: 'The Base Violence Necessary for Change', overview: 'An epic clash between old rivals results in a fateful moment for Zaun. Jayce and Viktor risk everything.', duration: 44, stillPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[5] }
        ]
      },
      {
        id: 2,
        number: 2,
        title: 'Season 2',
        episodes: [
          { id: 'arcane-s2e1', number: 1, seasonNumber: 2, title: 'Heavy Is the Crown', overview: 'In the aftermath of the council chamber catastrophe, Piltover and Zaun teeter on the brink of total warfare.', duration: 48, stillPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[1] },
          { id: 'arcane-s2e2', number: 2, seasonNumber: 2, title: 'Watch It All Burn', overview: 'Caitlyn leads an enforcer division into the fissures while Jinx finds unexpected allies in the darkness.', duration: 46, stillPath: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[2] }
        ]
      }
    ]
  },
  {
    id: 'frieren',
    anilistId: 154587,
    title: 'Frieren: Beyond Journey\'s End',
    originalTitle: 'Sousou no Frieren',
    type: 'show',
    anime: true,
    year: 2023,
    releaseDate: 'September 29, 2023',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    overview: 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party.',
    rating: 9.3,
    votes: 198000,
    runtime: 24,
    genres: ['Animation', 'Adventure', 'Drama', 'Fantasy'],
    ageRating: 'PG-13',
    status: 'Completed',
    tagline: 'Her journey begins after the end.',
    trailerKey: 'qgQunxD0qLk',
    streamUrl: SAMPLE_STREAMS[5],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'frieren-s1e1', number: 1, seasonNumber: 1, title: 'The Journey\'s End', overview: 'The hero party returns victorious after a ten-year quest. Frieren departs to collect grimoires.', duration: 25, stillPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[5] },
          { id: 'frieren-s1e2', number: 2, seasonNumber: 1, title: 'It Didn\'t Have to Be Magic', overview: 'Frieren visits Heiter and is tasked with tutoring an orphaned young apprentice named Fern.', duration: 24, stillPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[1] }
        ]
      }
    ]
  },
  {
    id: 'oppenheimer',
    tmdbId: 872585,
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    type: 'movie',
    year: 2023,
    releaseDate: 'July 21, 2023',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, and his subsequent fall from grace during the 1954 security hearing.',
    rating: 8.9,
    votes: 720000,
    runtime: 181,
    genres: ['Drama', 'History', 'Biography'],
    ageRating: 'R',
    status: 'Released',
    tagline: 'The world forever changes.',
    trailerKey: 'uYPbbksJxIg',
    streamUrl: SAMPLE_STREAMS[1],
  },
  {
    id: 'severance',
    tmdbId: 95396,
    title: 'Severance',
    originalTitle: 'Severance',
    type: 'show',
    year: 2024,
    releaseDate: 'February 18, 2022',
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop',
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    rating: 8.7,
    votes: 215000,
    runtime: 55,
    genres: ['Drama', 'Mystery', 'Sci-Fi'],
    ageRating: 'TV-MA',
    status: 'Returning Series',
    tagline: 'Please do not attempt to adjust your memory.',
    trailerKey: 'xEQP4VVuyrY',
    streamUrl: SAMPLE_STREAMS[2],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'sev-s1e1', number: 1, seasonNumber: 1, title: 'Good News About Hell', overview: 'Mark Scout leads a team at Lumon Industries, whose employees have undergone a severance procedure.', duration: 57, stillPath: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[2] },
          { id: 'sev-s1e2', number: 2, seasonNumber: 1, title: 'Half Loop', overview: 'The macrodata refinement team trains Helly on macrodata refinement and numbers sorting.', duration: 53, stillPath: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[4] }
        ]
      }
    ]
  },
  {
    id: 'spider-man-spiderverse',
    tmdbId: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    year: 2023,
    releaseDate: 'June 2, 2023',
    poster: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    rating: 8.8,
    votes: 410000,
    runtime: 140,
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    ageRating: 'PG',
    status: 'Released',
    tagline: 'It\'s how you wear the mask that matters.',
    trailerKey: 'cqGjhVJWtEg',
    streamUrl: SAMPLE_STREAMS[0],
  },
  {
    id: 'attack-on-titan',
    anilistId: 16498,
    title: 'Attack on Titan',
    originalTitle: 'Shingeki no Kyojin',
    type: 'show',
    anime: true,
    year: 2013,
    releaseDate: 'April 7, 2013',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    overview: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    rating: 9.1,
    votes: 560000,
    runtime: 24,
    genres: ['Animation', 'Action', 'Drama', 'Fantasy'],
    ageRating: 'TV-MA',
    status: 'Completed',
    tagline: 'To win, you must fight.',
    trailerKey: 'MGRm4IzK1SQ',
    streamUrl: SAMPLE_STREAMS[4],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'aot-s1e1', number: 1, seasonNumber: 1, title: 'To You, in 2000 Years', overview: 'After 100 years of peace, the Colossal Titan suddenly appears and breaches the outermost wall.', duration: 24, stillPath: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[4] },
          { id: 'aot-s1e2', number: 2, seasonNumber: 1, title: 'That Day', overview: 'The armored titan breaches Wall Maria. Refugees flee to Wall Rose.', duration: 24, stillPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[1] }
        ]
      }
    ]
  },
  {
    id: 'the-last-of-us',
    tmdbId: 100088,
    title: 'The Last of Us',
    originalTitle: 'The Last of Us',
    type: 'show',
    year: 2023,
    releaseDate: 'January 15, 2023',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.',
    rating: 8.8,
    votes: 490000,
    runtime: 58,
    genres: ['Drama', 'Action', 'Adventure', 'Sci-Fi'],
    ageRating: 'TV-MA',
    status: 'Returning Series',
    tagline: 'When you\'re lost in the darkness, look for the light.',
    trailerKey: 'uLtkt8BonwM',
    streamUrl: SAMPLE_STREAMS[6],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'tlou-s1e1', number: 1, seasonNumber: 1, title: 'When You\'re Lost in the Darkness', overview: 'Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with a mission.', duration: 81, stillPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[6] }
        ]
      }
    ]
  },
  {
    id: 'solo-leveling',
    anilistId: 151807,
    title: 'Solo Leveling',
    originalTitle: 'Ore dake Level Up na Ken',
    type: 'show',
    anime: true,
    year: 2024,
    releaseDate: 'January 7, 2024',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    overview: 'Known as the Weakest Hunter of All Mankind, E-rank hunter Sung Jinwoo attempts to survive in low-level dungeons until he is faced with a terrifying double dungeon trial that awards him a unique system.',
    rating: 8.5,
    votes: 112000,
    runtime: 24,
    genres: ['Action', 'Fantasy', 'Adventure'],
    ageRating: 'TV-14',
    status: 'Releasing',
    trailerKey: '915i_8kOa44',
    streamUrl: SAMPLE_STREAMS[0],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'sl-s1e1', number: 1, seasonNumber: 1, title: 'I\'m Used to It', overview: 'Sung Jinwoo enters a D-rank dungeon with his party, discovering a hidden sanctum.', duration: 24, stillPath: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[0] }
        ]
      }
    ]
  },
  {
    id: 'interstellar',
    tmdbId: 157336,
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    type: 'movie',
    year: 2014,
    releaseDate: 'November 7, 2014',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    rating: 8.7,
    votes: 1950000,
    runtime: 169,
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    ageRating: 'PG-13',
    status: 'Released',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    trailerKey: 'zSWdZVtXT7E',
    streamUrl: SAMPLE_STREAMS[5],
  },
  {
    id: 'the-batman',
    tmdbId: 414906,
    title: 'The Batman',
    originalTitle: 'The Batman',
    type: 'movie',
    year: 2022,
    releaseDate: 'March 4, 2022',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1920&auto=format&fit=crop',
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    rating: 8.1,
    votes: 750000,
    runtime: 176,
    genres: ['Crime', 'Mystery', 'Thriller', 'Action'],
    ageRating: 'PG-13',
    status: 'Released',
    tagline: 'Unmask the truth.',
    trailerKey: 'mqqft2x_Aa4',
    streamUrl: SAMPLE_STREAMS[2],
  },
  {
    id: 'shogun',
    tmdbId: 126308,
    title: 'Shōgun',
    originalTitle: 'Shōgun',
    type: 'show',
    year: 2024,
    releaseDate: 'February 27, 2024',
    poster: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop',
    overview: 'In 1600s Japan, Lord Yoshii Toranaga fights for his life as his enemies unite against him. When an English ship is found marooned in a fishing village, its English pilot brings secrets that could tip the scales.',
    rating: 8.8,
    votes: 185000,
    runtime: 60,
    genres: ['Drama', 'War', 'History'],
    ageRating: 'TV-MA',
    status: 'Returning Series',
    tagline: 'Destiny is a matter of choice.',
    trailerKey: 'y43zX9gI4uY',
    streamUrl: SAMPLE_STREAMS[1],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'shogun-s1e1', number: 1, seasonNumber: 1, title: 'Chapter One: Anjin', overview: 'Destinies converge in Japan when an English ship washes ashore and an embattled warlord sees an opportunity.', duration: 70, stillPath: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[1] }
        ]
      }
    ]
  },
  {
    id: 'cyberpunk-edgerunners',
    anilistId: 120377,
    title: 'Cyberpunk: Edgerunners',
    originalTitle: 'Cyberpunk: Edgerunners',
    type: 'show',
    anime: true,
    year: 2022,
    releaseDate: 'September 13, 2022',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    overview: 'A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner: a mercenary outlaw.',
    rating: 8.7,
    votes: 210000,
    runtime: 24,
    genres: ['Animation', 'Action', 'Sci-Fi'],
    ageRating: 'TV-MA',
    status: 'Completed',
    tagline: 'Night City always wins.',
    trailerKey: 'JtqIas3bYhg',
    streamUrl: SAMPLE_STREAMS[3],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'cpe-s1e1', number: 1, seasonNumber: 1, title: 'Let You Down', overview: 'David Martinez struggles to fit in at Arasaka Academy. A tragic drive-by turns his world upside down.', duration: 25, stillPath: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[3] }
        ]
      }
    ]
  },
  {
    id: 'the-bear',
    tmdbId: 119051,
    title: 'The Bear',
    originalTitle: 'The Bear',
    type: 'show',
    year: 2022,
    releaseDate: 'June 23, 2022',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop',
    overview: 'A young chef from the fine dining world comes home to Chicago to run his family Italian beef sandwich shop after a heartbreaking death in his family.',
    rating: 8.6,
    votes: 240000,
    runtime: 32,
    genres: ['Comedy', 'Drama'],
    ageRating: 'TV-MA',
    status: 'Returning Series',
    tagline: 'Every second counts.',
    trailerKey: 'y-cqu2Z_V34',
    streamUrl: SAMPLE_STREAMS[4],
    seasons: [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: [
          { id: 'bear-s1e1', number: 1, seasonNumber: 1, title: 'System', overview: 'Carmy attempts to modernize The Original Beef of Chicagoland, facing resistance from stubborn kitchen staff.', duration: 30, stillPath: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop', streamUrl: SAMPLE_STREAMS[4] }
        ]
      }
    ]
  },
  {
    id: 'spirited-away',
    tmdbId: 129,
    title: 'Spirited Away',
    originalTitle: 'Sen to Chihiro no Kamikakushi',
    type: 'movie',
    anime: true,
    year: 2001,
    releaseDate: 'July 20, 2001',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    overview: 'A young girl, Chihiro, becomes trapped in a strange world of spirits. After her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free herself and her family.',
    rating: 8.6,
    votes: 790000,
    runtime: 125,
    genres: ['Animation', 'Family', 'Fantasy'],
    ageRating: 'PG',
    status: 'Released',
    tagline: 'The tunnel led to a world that never should have existed.',
    trailerKey: 'ByXuk9QqQkk',
    streamUrl: SAMPLE_STREAMS[6],
  }
];

export const STREAMING_PROVIDERS = [
  { id: 'netflix', name: 'Netflix', icon: 'netflix' },
  { id: 'apple', name: 'Apple TV+', icon: 'apple' },
  { id: 'prime', name: 'Prime Video', icon: 'prime' },
  { id: 'disney', name: 'Disney Plus', icon: 'disney' },
  { id: 'max', name: 'Max', icon: 'max' },
  { id: 'paramount', name: 'Paramount Plus', icon: 'paramount' },
  { id: 'crunchyroll', name: 'Crunchyroll', icon: 'crunchyroll' },
  { id: 'hulu', name: 'Hulu', icon: 'hulu' }
];

export const GENRE_LIST = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Drama', 'Fantasy', 'History', 'Horror', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller'
];
