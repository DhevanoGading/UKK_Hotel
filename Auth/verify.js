"use strict";

//import
const { verify } = require("jsonwebtoken");
const KEY_ADMIN = "UKKHOTELADMIN";
const KEY_RESEPSIONIS = "UKKHOTELRESEPSIONIS";

module.exports = {
    verifyAdmin: (req, res, next) => {
        let token = req.get("authorization");

        if (token) {
            let wow = token.slice(7);

            verify(wow, KEY_ADMIN, (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token",
                        err
                    })

                } else {
                    let user = decoded.result
                    next();
                }
            })

        } else {
            res.json({
                success: 0,
                message: "Access denied : unauthorized user"
            })
        }
    },

    verifyResepsionis : (req, res, next) => {
        let token = req.get("authorization");

        if (token) {
            let wow = token.slice(7);

            verify(wow, KEY_RESEPSIONIS, (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token",
                        err
                    })

                } else {
                    let user = decoded.result
                    next()
                }
            })

        } else {
            res.json({
                success: 0,
                message: "Access denied : unauthorized user"
            })
        }
    },

    verifyBoth : (req, res, next) => {
        let token = req.get("authorization");
        
        if (token) {
            const wow = token.slice(7);

            try {
                const decoded = verify(wow, KEY_ADMIN);
                if (decoded.user.role === "admin") {
                    return next();
                }
            } catch (error) {
                // Ignore the error and move on to the next try-catch block.
            }

            try {
                const decoded = verify(wow, KEY_RESEPSIONIS);
                if (decoded.user.role === "resepsionis") {
                    return next();
                }
            } catch (error) {
                // Ignore the error and move on to the error handling below.
            }

            // If the token couldn't be verified with either key, return an error message.
            res.status(400).json({
                success: 0,
                message: "Invalid token",
            });

        } else {
            res.json({
                success: 0,
                message: "Access denied: unauthorized user",
            });
        }
    }
}