export interface User {
    id: string
    email: string
    name: string
    emailVerified: boolean
    createdAt: string
    updatedAt: string
  }

  export interface Playlist {
    id: number
    name: string
    UserId: string
  }

  export interface Track {
    TrackId: number
    Name: string
    AlbumId: number | null
    MediaTypeId: number
    GenreId: number | null
    Composer: string | null
    Milliseconds: number
    Bytes: number | null
    UnitPrice: number
  }