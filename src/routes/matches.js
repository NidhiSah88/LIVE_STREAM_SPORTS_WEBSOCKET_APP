import express from 'express';
import { Router } from "express";


export const matchRouter = Router();

matchRouter.get('/', (req,res)=>{
    res.status(200).json({message: "Matches List"});

})

matchRouter.post('/', async (req,res)=>{
    const parsed = createMatchSchema.safeParse(req.body);
    const { data: { startTime, endTime, homeScore, awayScore }} = parsed ;
    
    if(!parsed.success){
        return res.status(404).json({error: "Invalid payload.", details: JSON.stringify(parsed.error ) });
    }

    try{
        const [event] = await DbNull.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        res.status(201).json({data:event });

    } catch(e){
        res.status(500).json({ error: 'Failed to create match. ', details: JSON.stringify(parsed) });

    }







})



















