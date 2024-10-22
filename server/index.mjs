import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import bindRoutes from "./routes/index.mjs";

const app = express();

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

bindRoutes(app);

if (process.env.ENV === "DEVELOPMENT") {
  const swagger = swaggerJsDoc({
    definition: {
      openapi: "3.1.0",
      info: {
        title: "SunoAI Contests API Docs",
        version: "1.0.0",
        description: "A simple CRUD API for SunoAI's contests management",
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
    apis: ["./docs/*.js"],
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swagger, { explorer: true })
  );
}

app.listen(port, () => {
  console.info(`Server started and listening on http://localhost:${port}`);
});
