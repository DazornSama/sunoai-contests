import authRoutes from "./auth.mjs";
import contestRoutes from "./contest.mjs";
import songRoutes from "./song.mjs";

export default (app) => {
  app.use("/auth", authRoutes);
  app.use("/contest", contestRoutes);
  app.use("/song", songRoutes);
};
