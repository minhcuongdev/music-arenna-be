import { HttpStatusCode } from "../utils/constants";
import { Request, Response } from 'express';
import QuestionService from "../services/question.service";

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await QuestionService.getQuestions()
    res.status(HttpStatusCode.OK).json(questions)
  } catch (error: any) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}