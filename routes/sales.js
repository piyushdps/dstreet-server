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

const moment = require('moment')

const today = moment().utcOffset(330).startOf('day')
// console.log(today)
router.use(cookieParser());

// // console.log(new Date()  ,  moment().utcOffset(330).startOf('day').toDate() , moment().utcOffset(330).endOf('day').toDate())
// console.log(moment(Date.now()).utcOffset(330).valueOf() , Date.now())
router.get('/total' , async (req,res)=>{

    try {
        const orders = await Order.find({
            createdAt: {
                $gte: today.toDate(),
                $lte: moment().utcOffset(330).endOf('day').toDate()
              }
        }).sort({});

        res.status(200).json(orders);
      } catch (err) {
        res.status(400).json({ message: JSON.stringify(err) });
      }


})



module.exports = router;





