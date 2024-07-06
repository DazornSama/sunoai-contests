import db from "../db.mjs";
import Song, { SongFromMongo } from "../models/song.mjs";

const COLLECTION_NAME = "songs";

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

      const result = await collection.insertOne(song.toMongo());

      song.mongoId = result.insertedId;

      response.status(200).send(song);
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
