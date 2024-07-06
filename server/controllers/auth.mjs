export const authenticate = async (request, response) => {
  try {
    const credentials = {
      username: request.body.username,
      password: request.body.password,
    };

    if (!credentials.username || !credentials.password) {
      response.status(400).send({ error: "Invalid credentials" });
    }

    if (
      credentials.username !== process.env.ADMIN_USERNAME ||
      credentials.password !== process.env.ADMIN_PASSWORD
    ) {
      response.status(401).send({ error: "Invalid credentials" });
    }

    response.status(200).send();
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
};
