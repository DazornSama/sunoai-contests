import i18n from "i18n-nationality";

export default class Song {
  constructor(id, contest_id, title, prompt, author, cover, country) {
    this._id = null;
    this.id = id;
    this.contest_id = contest_id;
    this.title = title;
    this.prompt = prompt;
    this.author = author;
    this.cover = cover;
    this.country = country;
  }

  get mongoId() {
    return this._id;
  }

  set mongoId(newId) {
    this._id = newId;
  }

  isValid() {
    if (
      !this.id &&
      !this.contest_id &&
      !this.title &&
      !this.prompt &&
      !this.author &&
      !this.country &&
      !this.cover &&
      this.id.length <= 0 &&
      this.contest_id.length <= 0 &&
      this.title.length <= 0 &&
      this.prompt.length <= 0 &&
      this.author.length <= 0 &&
      this.country.length <= 0 &&
      this.cover.length <= 0
    ) {
      return false;
    }

    if (!i18n.isValid(this.country)) {
      return false;
    }

    return true;
  }

  toMongo() {
    return {
      id: this.id,
      contest_id: this.contest_id,
      title: this.title,
      prompt: this.prompt,
      author: this.author,
      cover: this.cover,
      country: this.country,
    };
  }
}

export const SongFromMongo = (document) => {
  const song = new Song(
    document.id,
    document.contest_id,
    document.title,
    document.prompt,
    document.author,
    document.cover,
    document.country
  );

  song.mongoId = document._id;

  return song;
};
