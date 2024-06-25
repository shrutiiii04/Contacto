const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync");
const ExpressError = require("../utilis/ExpressError");
const Contact = require("../models/contacts");
const { isLoggedIn, validateContact , isOwner } = require("../middleware.js"); 

router.get("/allcontacts",isLoggedIn, validateContact, wrapAsync(async (req, res) => {
    let contacts = await Contact.find({ createdBy: req.user._id });
    res.render("contacts/allcontacts", { contacts });
  }));
  
  router.get("/new",isLoggedIn, validateContact, (req, res) => {
    res.render("contacts/new");
  });
  
  router.post("/new", isLoggedIn, validateContact, wrapAsync(async (req, res) => {
    let { name, phone, email } = req.body;
    let newContact = new Contact({ name, phone, email, createdBy: req.user._id});
    await newContact.save();
    req.flash("success", "New contact is added!!!");
    res.redirect("/api/contacts/allcontacts");
  }));
  
  router.get("/:id/edit", isLoggedIn,isOwner, validateContact, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let contact = await Contact.findById(id);
    if (!contact) {
      throw new ExpressError(404, "Contact not found");
    }
    res.render("contacts/edit", { contact });
  }));
  
  router.get("/search",isLoggedIn, wrapAsync(async (req, res) => {
    let { name } = req.query;
    const regex = new RegExp(name, 'i');
    let contacts = await Contact.find({ 'name': regex , createdBy: req.user._id });
    if (contacts.length === 0) {
      req.flash("error", "No such contact exists!");
      return res.redirect("/api/contacts/allcontacts");
    }
    res.status(200).render('contacts/contactView', { contacts });
  }));
  
  router.put("/:id",isLoggedIn,isOwner, validateContact,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { name, phone, email } = req.body;
    let contact = await Contact.findByIdAndUpdate(id, { name, phone, email }, { runValidators: true, new: true });
    if (!contact) {
      req.flash("error", "Contact does not exit");
      res.redirect("/api/contacts/allcontacts");
    }
    req.flash("success", "contact edited successfully!!");
    res.redirect("/api/contacts/allcontacts");
  }));
  
  router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!id) {
      req.flash("error", "Contact does not exit");
      res.redirect("/api/contacts/allcontacts");
    }
    await Contact.findByIdAndDelete(id);
    req.flash("success", "Contact has been deleted!!!");
    res.redirect("/api/contacts/allcontacts");
  }));
  
  module.exports = router;