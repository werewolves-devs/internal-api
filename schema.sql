CREATE TABLE players (
  id char(21) not null unique,
  emoji varchar(10) not null unique,
  alive boolean not null default 1,
  role varchar(18) not null
)
