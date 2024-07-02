import db from "../db.mjs";
import Contest, { ContestFromMongo } from "../models/contest.mjs";

const COLLECTION_NAME = "contests";

export const getOne = async (request, response) => {
  try {
    const contestId = request.params.id;

    if (!contestId) {
      response.send('Missing ":id" parameter').status(400);
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
