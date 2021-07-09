'use strict'

const express = require("express");
const AdminController = require('./../controllers/AdminController');

const adminRouter = express.Router();

let admin = new AdminController;

let isAdmin = function(request, response, next) {
    if(request.session?.user?.status !== 'admin') {
        response.redirect('/login');
    } else next();
}

adminRouter.use(isAdmin);

adminRouter.use("/cardinit", admin.cardinit.bind(admin));
adminRouter.use("/", admin.index.bind(admin));

module.exports = adminRouter;