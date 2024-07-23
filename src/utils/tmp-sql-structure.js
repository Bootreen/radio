const track = {
  id: "2cbrFLBZYNd3nJpWSEuw6j", //        VARCHAR(22) PRIMARY KEY NOT NULL
  name: "60 Feet Tall", //                TEXT NOT NULL
  album: "Horehound", //                  TEXT NOT NULL
  album_id: "1nxECUyuIZF5JCrO9Xo2jO", //  VARCHAR(22) FOREIGN KEY NOT NULL
  artists: "The Dead Weather", //         TEXT NOT NULL
  artistsIds: [
    //  ---> VARCHAR(22) [] NOT NULL ---> (place in junction table)
    "4AZab8zo2nTYd7ORDmQu0V",
  ],
  genres: ["Prog rock", "Grunge"], //     VARCHAR(100) []
  duration_ms: 1000, //                   DEC(7)
  popularity: 5, //                       DEC(3)
  danceability: 0.495, //                 DEC(1,8)
  energy: 0.655, //                       DEC(1,8)
  mode: 1, //                             BOOL
  key: 0, //                              DEC(2)
  valence: 0.282, //                      DEC(1,8)
};

// CREATE TABLE Tracks (
//   id VARCHAR(22) PRIMARY KEY NOT NULL,
//   name TEXT NOT NULL,
//   album TEXT NOT NULL,
//   album_id VARCHAR(22) NOT NULL,
//   genres VARCHAR(100) [],
//   duration_ms DEC(7) NOT NULL,
//   popularity DEC(3),
//   danceability DEC(1,8),
//   energy DEC(1,8),
//   mode BOOL,
//   key DEC(2),
//   valence DEC(1,8),
//   created_at TIMESTAMP NOT NULL,
//   FOREIGN KEY (album_id)
//   REFERENCES Albums(id)
// )

const artist = {
  id: "string", //                        VARCHAR(22) PRIMARY KEY NOT NULL
  name: "string", //                      TEXT NOT NULL
  popularity: 5, //                       DEC(3)
  genres: ["Prog rock", "Grunge"], //     VARCHAR(100) []
  image_url: "", //                       TEXT NOT NULL
};

// CREATE TABLE Artists (
//   id VARCHAR(22) PRIMARY KEY NOT NULL,
//   name TEXT NOT NULL,
//   popularity DEC(3),
//   genres VARCHAR(100) [],
//   image_url TEXT NOT NULL,
//   created_at TIMESTAMP NOT NULL
// )

const artists_tracks = {
  id: 0, //                               SERIAL PRIMARY KEY NOT NULL
  artist_id: "4AZab8zo2nTYd7ORDmQu0V", // VARCHAR(22) FOREIGN KEY NOT NULL
  track_id: "4AZab8zo2nTYd7ORDmQu0V", //  VARCHAR(22) FOREIGN KEY NOT NULL
};

// CREATE TABLE Artists_tracks (
//   id SERIAL PRIMARY KEY NOT NULL,
//   artist_id VARCHAR(22) NOT NULL,
//   track_id VARCHAR(22) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   FOREIGN KEY (artist_id)
//   REFERENCES Artists(id),
//   FOREIGN KEY (track_id)
//   REFERENCES Tracks(id)
// )

const album = {
  id: "string", //                        VARCHAR(22) PRIMARY KEY NOT NULL
  name: "string", //                      TEXT NOT NULL
  release_date: "1981-12", //             VARCHAR(16)
  popularity: 5, //                       DEC(3)
  genres: ["Prog rock", "Grunge"], //     VARCHAR(100) []
  image_url: "", //                       TEXT NOT NULL
};

// CREATE TABLE Albums (
//   id VARCHAR(22) PRIMARY KEY NOT NULL,
//   name TEXT NOT NULL,
//   release_date VARCHAR(16),
//   popularity DEC(3),
//   genres VARCHAR(100) [],
//   image_url TEXT NOT NULL,
//   created_at TIMESTAMP NOT NULL
// )

const genres = {
  id: 0, //                               SERIAL PRIMARY KEY NOT NULL
  name: "string", //                      TEXT NOT NULL
  description: "string", //               TEXT
};

// CREATE TABLE Genres (
//   id SERIAL PRIMARY KEY NOT NULL,
//   name TEXT NOT NULL,
//   description TEXT,
//   created_at TIMESTAMP NOT NULL
// )

const genres_artists = {
  id: 0, //                               SERIAL PRIMARY KEY NOT NULL
  genre_id: 0, //                         DEC(10) FOREIGN KEY NOT NULL
  artist_id: "4AZab8zo2nTYd7ORDmQu0V", // VARCHAR(22) FOREIGN KEY NOT NULL
};

// CREATE TABLE Genres_artists (
//   id SERIAL PRIMARY KEY NOT NULL,
//   genre_id BIGINT UNSIGNED NOT NULL,
//   artist_id VARCHAR(22) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   FOREIGN KEY (genre_id)
//   REFERENCES Genres(id),
//   FOREIGN KEY (artist_id)
//   REFERENCES Artists(id)
// )

const genres_albums = {
  id: 0, //                               SERIAL PRIMARY KEY NOT NULL
  genre_id: 0, //                         DEC(10) FOREIGN KEY NOT NULL
  album_id: "4AZab8zo2nTYd7ORDmQu0V", //  VARCHAR(22) FOREIGN KEY NOT NULL
};

// CREATE TABLE Genres_albums (
//   id SERIAL PRIMARY KEY NOT NULL,
//   genre_id BIGINT UNSIGNED NOT NULL,
//   album_id VARCHAR(22) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   FOREIGN KEY (genre_id)
//   REFERENCES Genres(id),
//   FOREIGN KEY (album_id)
//   REFERENCES Albums(id)
// )

const genres_tracks = {
  id: 0, //                               SERIAL PRIMARY KEY NOT NULL
  genre_id: 0, //                         DEC(10) FOREIGN KEY NOT NULL
  track_id: "4AZab8zo2nTYd7ORDmQu0V", //  VARCHAR(22) FOREIGN KEY NOT NULL
};

// CREATE TABLE Genres_tracks (
//   id SERIAL PRIMARY KEY NOT NULL,
//   genre_id INTEGER NOT NULL,
//   track_id VARCHAR(22) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   FOREIGN KEY (genre_id)
//   REFERENCES Genres(id),
//   FOREIGN KEY (track_id)
//   REFERENCES Tracks(id)
// )
