const { contactSchema } = require("./schema");
const ExpressError = require("./utilis/ExpressError");
const User = require("./models/user");
const Contact = require('./models/contacts');

module.exports.validateContact = (req, res, next) => {
    const { error } = contactSchema.validate(req.body.contact);
    if (error) {
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, message);
    } else {
        next();
    }
};

module.exports.isLoggedIn =  (req,res,next)=>{
    if(!req.isAuthenticated()){
        //to redirect from where the login has been come
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login first");
        return res.redirect("/login");
    }
    next();
    }
    
    module.exports.saveRedirectUrl = (req, res, next)=>{
        if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    }

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      req.flash('error', 'Contact not found');
      return res.redirect('/api/contacts/allcontacts');
    }
    if (!contact.createdBy.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do this');
      return res.redirect('/api/contacts/allcontacts');
    }
    next();
  } catch (err) {
    next(err);
  }
};
