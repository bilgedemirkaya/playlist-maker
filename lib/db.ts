import Database from 'better-sqlite3'

export const db = new Database('./chinook.sqlite', {
  verbose: console.log,
})