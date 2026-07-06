import express, { Application, Request, Response } from "express";


const app:Application= express()

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello Fixitnow User")
})


export default app