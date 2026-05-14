import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import workoutsRouter from "./workouts";
import weightsRouter from "./weights";
import mealsRouter from "./meals";
import progressRouter from "./progress";
import recommendationsRouter from "./recommendations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(workoutsRouter);
router.use(weightsRouter);
router.use(mealsRouter);
router.use(progressRouter);
router.use(recommendationsRouter);

export default router;
