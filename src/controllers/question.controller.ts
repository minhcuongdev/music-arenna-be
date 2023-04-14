import { HttpStatusCode } from "../utils/constants";
import { Request, Response } from "express";
import QuestionService from "../services/question.service";

export const getQuestions = async (
  req: Request<{}, {}, {}, { type?: string }>,
  res: Response
) => {
  try {
    const questions = await QuestionService.getQuestions(req.query.type);
    res.status(HttpStatusCode.OK).json(questions);
  } catch (error: any) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};
