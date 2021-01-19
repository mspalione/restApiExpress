const express = require('express')
const router = express.Router()
const records = require('./records')

function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
  }

//send a get request to /quotes read a list of quotes
router.get('/quotes', asyncHandler(async (req, res) => {
    const quotes = await records.getQuotes()
    res.json(quotes)
}))

//send a get request to /quotes/:id read or view a quote
router.get('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id)
    if(quote){
        res.json(quote)
    } else {
        res.status(404).json({message: "Quote not found."})
    }
}))

//send a get request to /quotes/quote/random to read a random quote
router.get('/quotes/quote/random', asyncHandler(async (req, res) => {
    const random = await records.getRandomQuote()
    if(random){
        res.json(random)
    } else {
        res.status(500).json({message: "There seems to be an error with our server. Please try again."})
    }
}))

router.post('/quotes', asyncHandler(async (req, res) => {
    if(req.body.author && req.body.quote){
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        })
        res.status(201).json(quote)
    } else {
        res.status(400).json({message: "Quote and author are required."})
    }
}))

//send a put request to /quotes/:id update (edit) a quote
router.put('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id)
    if(quote) {
        quote.quote = req.body.quote
        quote.author = req.body.author
        await records.updateQuote(quote)
        res.status(204).end()
    } else
        res.status(404).json({message: "Quote Not Found"})
}))

//send a delete request to /quotes/:id delete a quote
router.delete("/quotes/:id", asyncHandler(async(req, res, next) => {
    const quote = await records.getQuote(req.params.id)
    await records.deleteQuote(quote)
    res.status(204).end()
}))

module.exports = router