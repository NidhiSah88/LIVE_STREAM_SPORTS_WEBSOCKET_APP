import { Router } from "express";
import { desc } from "drizzle-orm";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";


export const matchRouter = Router();
const MAX_LIMIT = 100;

matchRouter.get('/', async (req,res)=>{
    // res.status(200).json({message: "Matches List"});
    const parsedData = listMatchesQuerySchema.safeParse(req.query);
    console.log("parsedData: ", parsedData);
    
    if(!parsedData.success){
        return res.status(404).json({error: "Invalid Query.", details: JSON.stringify(parsedData.error ) });
    }

    const limit = Math.min(parsedData.data.limit ?? 50, MAX_LIMIT );

    try{
        const data = await db.select()
                             .from(matches)
                             .orderBy(desc(matches.createdAt))
                             .limit(limit);

        res.json({data });

    } catch(e){
        res.status(500).json({ 
            error: "Failed to list matches.", 
            details: e.message,
        });
    }


})

matchRouter.post('/', async (req,res)=>{


    const parsed = createMatchSchema.safeParse(req.body);
    // const { data: { startTime, endTime, homeScore, awayScore }} = parsed ;
    
    if(!parsed.success){
        return res.status(404).json({error: "Invalid payload.", details: JSON.stringify(parsed.error ) });
    }

    
     // Only access data AFTER validation
    const {
        startTime,
        endTime,
        homeScore,
        awayScore,
    } = parsed.data;

    console.log("LOGGG:: ", {
                    status: getMatchStatus(startTime, endTime),
                        payload: parsed.data,
            });

    try{
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        // trigger the broadcast whenever match is created 
        if(res.app.locals.broadcastMatchCreated){
            console.log("before broadcast");
            // push all matched data to all the connected fans immediately 
            res.app.locals.broadcastMatchCreated(event)
            console.log("after broadcast");
        }

        res.status(201).json({data:event });

    } catch(e){
        res.status(500).json({ error: 'Failed to create match. ',
            //  details: JSON.stringify(parsed) 
            details: e.message,
              cause: e.cause,


            
        });

    }

});



















