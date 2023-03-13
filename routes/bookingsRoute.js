const express = require('express');
const router = express.Router();
const Booking = require("../models/bookingModel")
const Car = require('../models/carModel')
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51MjhTHSFuxA8RTZr3jOIPGe7M0QdWSEpWBJHCq74UQw1TigGPZ2TfEYmufw1YCrMwLfkk8RTjsoPhqw4b6rEpjQV00F9MyYufk')
router.post("/bookcar", async (req, res) => {

    
    const { token } = req.body
    try {

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.charges.create({
            amount: req.body.totalAmount * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()       //unique id for each transaction
        })

        if (payment) {
            req.body.transactionId=payment.source.id;
            const newbooking = new Booking(req.body);
            await newbooking.save();
            const car = await Car.findOne({ _id: req.body.car });
            console.log(req.body.car);
            car.bookedTimeSlots.push(req.body.bookedTimeSlots)

            await car.save()
            res.send("Your booking is successful")
        }
        else{
            return res.status(400).json(error);
        }


    } catch (error) {
        return res.status(400).json(error);
    }

})

module.exports = router