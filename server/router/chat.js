const express = require('express');

const { 
    
    createChat, 
    deleteChat, 
    authanticate 

} = require('../controller/chat');
const router = express.Router();

router.post('/', createChat)

router.delete('/:id', deleteChat)

router.post('/authanticate', authanticate)

module.exports = router;