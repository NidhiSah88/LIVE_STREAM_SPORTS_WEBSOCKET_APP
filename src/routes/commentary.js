import {Router } from 'express';
import {matchIdParamSchema} from "../validation/matches.js";
import { createCommentarySchema } from "../validation/commentary.js";

import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";


export const commentaryRouter = Router();

commentaryRouter.get('/', (req, res) => {
    res.status(200).json({
        message: 'Commentary List'
    });

});


// Act as a Senior Node.js Developer and Generate a POST route for `commentary.js` using Drizzle ORM.
// 1. Validate `req.params` using `matchIdParamSchema` and `req.body` using `createCommentarySchema`. Insert the data into the `commentary` table and return the result.
// 2. Use ES Modules and handle errors with try/catch.



/**
 * POST /matches/:id/commentary
 */
commentaryRouter.post("/matches/:id/commentary",
  async (req, res) => {
    const parsedParams = matchIdParamSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        error: "Invalid match id.",
        details: parsedParams.error.flatten(),
      });
    }

    const parsedBody = createCommentarySchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid payload.",
        details: parsedBody.error.flatten(),
      });
    }

    try {
      const { id } = parsedParams.data;

      const [result] = await db.insert(commentary).values({
          matchId: id,
          ...parsedBody.data,
        })
        .returning();

        console.log("REQ PARAMS", req.params);
console.log("Broadcast exists",
!!res.app.locals.broadcastCommentary);


      // trigger braodcast immediately after trigger post route
      if(res.app.locals.broadcastCommentary){
        res.app.locals.broadcastCommentary(result.matchId, result);

      }

      return res.status(201).json({  data: result, });

    } catch (e) {
      console.error(
        "Create commentary error:",
        e
      );

      return res.status(500).json({
        error:
          "Failed to create commentary.",
        details: e.message,
      });
    }
  }
);


























