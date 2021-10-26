const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authAdmin = require("../middleware/authAdmin");
require("dotenv").config();

const moment = require('moment');
const Order = require("../models/Order");
const countOccurrences = require("../utils/CountOccurances");


router.use(cookieParser());

router.get('/total', async (req, res) => {
    var date = new Date();
    date = moment(date).utcOffset(330).toDate()
    var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    try {
        const orders = await Order.find({ createdAt: { $gte: start, $lt: end }, status: 'PAID' }).sort({})
        let totalSales = 0
        let count = 0
        orders.forEach(element => {
            totalSales += element.amount
            count++

        });
        res.status(200).json({ totalSales, totalOrdersPaid: count, from: moment(start).format('DD-MM-YYYY : hh:mm:ss'), to: moment(end).format('DD-MM-YYYY : hh:mm:ss') });
    } catch (err) {
        res.status(400).json({ message: JSON.stringify(err) });
    }
})



router.get('/total1', async (req, res) => {
     var date = new Date();
    date = moment(date).utcOffset(330).toDate()
    var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    let itemsArr = []
    let salesObj = {}
    try {
        const orders = await Order.find({ createdAt: { $gte: start, $lt: end }, status: 'PAID' }).sort({})
        
        for ( order in orders){
            let currOrd = orders[order].cart
            for(i in currOrd){
               itemsArr.push(currOrd[i].itemId)
               var ids = currOrd[i].itemId
               if(salesObj[ids] == null){
                   salesObj[ids] = currOrd[i].qty
               }
               else{
                   salesObj[ids] =salesObj[ids]+currOrd[i].qty
               }
            }
        }
        let totalSales = 0
        let finalArr  = []
        for (const dish in salesObj) {
           
            let item = await Item.findById(dish)
            let totalCost  =  item.price * salesObj[dish] 
            let numberOfOrders =  salesObj[dish] 
            totalSales += totalCost
            finalArr.push({
            name: item.name,
            totalCost  ,
            price:item.price,
            orders : numberOfOrders
            })

          
          }
        
      
          console.log(finalArr)



      res.status(200).json({data:finalArr , totalSales});
    } catch (err) {
        res.status(400).json({ message: JSON.stringify(err) });
    }
})



module.exports = router;





