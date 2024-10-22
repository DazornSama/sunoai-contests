import db from "../db.mjs";
import Song, { SongFromMongo } from "../models/song.mjs";

const COLLECTION_NAME = "songs";

const utf8Decode = (utf8String) => {
  if (typeof utf8String != "string")
    throw new TypeError("parameter ‘utf8String’ is not a string");
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  const unicodeString = utf8String
    .replace(
      /[\\u00e0-\\u00ef][\\u0080-\\u00bf][\\u0080-\\u00bf]/g, // 3-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc =
          ((c.charCodeAt(0) & 0x0f) << 12) |
          ((c.charCodeAt(1) & 0x3f) << 6) |
          (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      }
    )
    .replace(
      /[\\u00c0-\\u00df][\\u0080-\\u00bf]/g, // 2-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc = ((c.charCodeAt(0) & 0x1f) << 6) | (c.charCodeAt(1) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
  return unicodeString;
};

export const getOne = async (request, response) => {
  try {
    const songId = request.params.id.trim();

    if (!songId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const song = await collection.findOne({ id: songId });

    if (!song) {
      response.status(404).send();
    } else {
      response.status(200).send(SongFromMongo(song));
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const getMore = async (request, response) => {
  try {
    // TODO: Add some parameters to be used as filters

    const collection = await db.collection(COLLECTION_NAME);
    const songs = await collection.find().toArray();

    if (songs.length === 0) {
      response.status(404).send();
    } else {
      response.status(200).send(songs.map((c) => SongFromMongo(c)));
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const addOne = async (request, response) => {
  try {
    const song = new Song(
      request.body.id,
      request.body.contest_id,
      request.body.title,
      request.body.prompt,
      request.body.author,
      request.body.cover,
      request.body.country
    );

    if (!song.isValid()) {
      response.status(400).send("Missing required fields");
    } else {
      const collection = await db.collection(COLLECTION_NAME);

      const existing = await collection.findOne({
        id: song.id,
        contest_id: song.contest_id,
      });

      if (existing) {
        response.status(409).send("Song already exists");
      } else {
        const result = await collection.insertOne(song.toMongo());

        song.mongoId = result.insertedId;

        response.status(200).send(song);
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const updateOne = async (request, response) => {
  try {
    const songId = request.params.id.trim();

    if (!songId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const song = await collection.findOne({ id: songId });

    if (!song) {
      response.status(404).send();
    } else {
      const newSong = new Song(
        song.id,
        song.contest_id,
        request.body.title,
        request.body.prompt,
        request.body.author,
        request.body.cover,
        request.body.country
      );

      if (!newSong.isValid()) {
        response.status(400).send("Missing required fields");
      } else {
        const result = await collection.updateOne(
          { id: songId },
          {
            $set: {
              title: newSong.title,
              prompt: newSong.prompt,
              author: newSong.author,
              cover: newSong.cover,
              country: newSong.country,
            },
          }
        );

        if (!result.acknowledged && result.modifiedCount !== 1) {
          throw "Unexpected error while updating document";
        }

        newSong._id = song._id;

        response.status(200).send(newSong);
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const deleteOne = async (request, response) => {
  try {
    const songId = request.params.id.trim();

    if (!songId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const song = await collection.findOne({ id: songId });

    if (!song) {
      response.status(404).send();
    } else {
      const result = await collection.deleteOne({ id: songId });

      if (!result.acknowledged && result.deletedCount !== 1) {
        throw "Unexpected error while updating document";
      }

      response.status(200).send();
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const getInfo = async (request, response) => {
  try {
    const songId = request.params.id.trim();

    if (!songId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const result = await fetch(`https://suno.com/song/${songId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Host: "https://suno.com",
        Origin: "https://suno.com",
        Referer: "https://suno.com",
      },
    });

    if (!result.ok) {
      throw new Error("Error while reading suno.com body");
    }

    const body = await result.text();

    let regex = /\\"title\\":\\"(.[^\\]*)\\"/g;
    const title = regex.exec(body)[1];

    regex = /(?<=\\"tags\\":\\")[^\"]*/g;
    let prompt = utf8Decode(regex.exec(body)[0]);
    prompt = prompt.substring(0, prompt.length - 1);

    regex = /\\"display_name\\":\\"(.[^\\]*)\\",/g;
    const author = regex.exec(body)[1];

    regex = /\\"image_url\\":\\"(.[^\\]*)\\",/g;
    const cover = regex.exec(body)[1];

    response.status(200).send({
      title,
      prompt,
      author,
      cover,
    });
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};
