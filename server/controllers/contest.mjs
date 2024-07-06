import db from "../db.mjs";
import Contest, { ContestFromMongo } from "../models/contest.mjs";
import { SongFromMongo } from "../models/song.mjs";

const COLLECTION_NAME = "contests";

export const getOne = async (request, response) => {
  try {
    const contestId = request.params.id.trim();

    if (!contestId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const contest = await collection.findOne({ id: contestId });

    if (!contest) {
      response.status(404).send();
    } else {
      response.status(200).send(ContestFromMongo(contest));
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
    const contests = await collection.find().toArray();

    if (contests.length === 0) {
      response.status(404).send();
    } else {
      response.status(200).send(contests.map((c) => ContestFromMongo(c)));
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const addOne = async (request, response) => {
  try {
    const contest = new Contest(
      request.body.name,
      request.body.description,
      request.body.start_date,
      request.body.end_date
    );

    if (!contest.isValid()) {
      response.status(400).send("Missing required fields");
    } else {
      const collection = await db.collection(COLLECTION_NAME);

      const result = await collection.insertOne(contest.toMongo());

      contest.mongoId = result.insertedId;

      response.status(200).send(contest);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const updateOne = async (request, response) => {
  try {
    const contestId = request.params.id.trim();

    if (!contestId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const contest = await collection.findOne({ id: contestId });

    if (!contest) {
      response.status(404).send();
    } else {
      const newContest = new Contest(
        request.body.name,
        request.body.description,
        request.body.start_date,
        request.body.end_date
      );

      if (!newContest.isValid()) {
        response.status(400).send("Missing required fields");
      } else {
        const result = await collection.updateOne(
          { id: contestId },
          {
            $set: {
              id: newContest.id,
              name: newContest.name,
              description: newContest.description,
              start_date: newContest.startDate,
              end_date: newContest.endDate,
            },
          }
        );

        if (!result.acknowledged && result.modifiedCount !== 1) {
          throw "Unexpected error while updating document";
        }

        newContest._id = contest._id;

        response.status(200).send(newContest);
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};

export const deleteOne = async (request, response) => {
  try {
    const contestId = request.params.id.trim();

    if (!contestId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const contest = await collection.findOne({ id: contestId });

    if (!contest) {
      response.status(404).send();
    } else {
      const result = await collection.deleteOne({ id: contestId });

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

export const getSongs = async (request, response) => {
  try {
    const contestId = request.params.id.trim();

    if (!contestId) {
      response.status(400).send('Missing ":id" parameter');
    }

    const collection = await db.collection(COLLECTION_NAME);
    const contest = await collection.findOne({ id: contestId });

    if (!contest) {
      response.status(404).send();
    } else {
      const songsCollection = await db.collection("songs");
      const songs = await songsCollection
        .find({ contest_id: contestId })
        .toArray();

      if (songs.length === 0) {
        response.status(404).send();
      } else {
        response.status(200).send(songs.map((s) => SongFromMongo(s)));
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};
