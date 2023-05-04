import express from 'express'
import {signin , signup , getUsers, getUser , followingUser , followedUser , message_to , message_from} from'../controllers/users.js'
const router = express.Router();
import auth from'../middleware/auth.js'

router.post('/signin',signin);
router.post('/signup',signup);
router.get('/search-user' , getUsers)
router.get('/:id' , getUser);
router.patch('/:id/followingUser',auth, followingUser);
router.patch('/:id/followedUser',auth, followedUser);
router.patch('/:id/message_to',auth,message_to );
router.patch('/:id/message_from',auth,message_from );

export default router;


