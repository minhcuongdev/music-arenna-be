import express from "express";
import { getQuestions } from "../controllers/question.controller";

const router = express.Router()

router.get("/",getQuestions)

export default router