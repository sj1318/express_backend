//with the use of async handler we doesn't have to write the try catch block with this when an error is occures it is 
//passed to the error handler

const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")
//@description  Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req,res) =>{
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@description  create new contacts
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req,res) =>{
    console.log("The request body is: ",req.body);
    const{name,email,phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory !");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    res.status(201).json(contact);
});

//@description GET contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req,res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Eroor("Contact not found");
    }
    res.status(200).json(contact);
});

//@description  UPDATE contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req,res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    ); 
    res.status(200).json(updatedContact);
});

//@description  Delete contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req,res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }

    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});

module.exports = { 
    getContacts , 
    createContact , 
    getContact, 
    updateContact , 
    deleteContact 
};


