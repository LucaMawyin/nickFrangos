CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image BLOB,
    image_type TEXT,
    is_published BOOLEAN DEFAULT 1,
    is_draft BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO articles (title, slug, content, is_published, published_at)
VALUES (
        'NHL Teams Relying More on Speed Than Size',
        'nhl-teams-relying-on-speed-than-size',
        'Modern NHL hockey has shifted toward speed and skill over physical size, changing how teams build their rosters.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'How the NFL Passing Game Has Evolved',
        'nfl-passing-game-evolution',
        'The NFL has become increasingly pass-heavy, with quarterbacks and wide receivers driving offensive strategy.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'NBA Three-Point Revolution Explained',
        'nba-three-point-revolution-explained',
        'NBA teams are taking more three-point shots than ever before, reshaping spacing, defense, and scoring efficiency.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'MLB Pitching Dominance in the Modern Era',
        'mlb-pitching-dominance-modern-era',
        'Pitchers in MLB are throwing harder and using more advanced analytics to dominate hitters.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'Why NHL Goaltending is More Technical Than Ever',
        'nhl-goaltending-more-technical-than-ever',
        'Goaltenders in the NHL now rely heavily on positioning, film study, and structured movement techniques.',
        0,
        NULL
    ),
    (
        'NFL Defenses Struggle Against Mobile Quarterbacks',
        'nfl-defenses-struggle-mobile-quarterbacks',
        'Quarterbacks who can run and extend plays are forcing NFL defenses to adapt their schemes.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'NBA Load Management and Player Health Debate',
        'nba-load-management-player-health-debate',
        'Teams in the NBA are resting star players more often to prevent injuries, sparking debate among fans and analysts.',
        0,
        NULL
    ),
    (
        'MLB Analytics Changing Batting Approaches',
        'mlb-analytics-changing-batting-approaches',
        'Hitters in MLB are adjusting swings and launch angles based on advanced analytics and data tracking.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'NHL Playoff Intensity and Physicality Breakdown',
        'nhl-playoff-intensity-physicality-breakdown',
        'The NHL playoffs are known for increased physicality, tighter defense, and higher stakes competition.',
        0,
        NULL
    ),
    (
        'NFL Draft Strategy: Building for the Future',
        'nfl-draft-strategy-building-for-future',
        'NFL teams use the draft to rebuild rosters, focusing on long-term development rather than instant impact.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'How NHL Special Teams Decide Games',
        'nhl-special-teams-decide-games',
        'Power plays and penalty kills are often the difference-makers in NHL games, especially during tight matchups and playoffs.',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'The Importance of Defense in the Modern NBA',
        'importance-of-defense-modern-nba',
        'While offense gets most of the attention, elite NBA teams still rely on strong defensive systems to win championships.',
        0,
        NULL
    );
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    ip_address TEXT,
    geo TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE login_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    geo TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);