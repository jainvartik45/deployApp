import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const oldUser = await User.findOne({ email });
  
      if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
  
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

      
  
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'test', { expiresIn: "7d" });
  
      res.status(200).json({ result: oldUser, token });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
      const oldUser = await User.findOne({ email });
      
      if (oldUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
  
      const token = jwt.sign( { email: result.email, id: result._id }, 'test', { expiresIn: "7d" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }
  };

  export const getUsers = async(req,res) =>{
    
    const {search} = req.query;
    
    
    try {
        
       const userPattern =  new RegExp("^"+search)

       const users = await User.find({email:{$regex:userPattern}});
       
        
       res.json({ data: users });
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
    
  }

  export const getUser = async(req,res) =>{
    
    const {id} = req.params;
    
    
    try {
        
       

      const user = await User.findById(id);
       
        
      res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
    
  }

  export const followedUser = async(req,res) =>{
    const {id} = req.params;

    if(!req.userId) return res.json({message : 'Unauthenticated'})
    
   
    const user = await User.findById(id);
    // const user1 = await User.findById( String(req.userId))

    const index = user.followers.findIndex((id) => id ===  String(req.userId));
    // const index1 = user1.following.findIndex((id1) => id1 === id);
    
    if (index ===-1) {
         if(index===-1){
        user.followers.push(req.userId); 
         }
        // if(index1===-1){
        //   user1.following.push(id);
        // }
       
      } else {
        user.followers = user.followers.filter((id) => id !==  String(req.userId));
        // user1.following = user1.following.filter((id1) => id1 !== id);
      }

    const updatedFollowed = await User.findByIdAndUpdate(id, user, { new: true });
    // const updatedFollowing = await User.findByIdAndUpdate( String(req.userId), user1, { new: true }); 

    
    res.json(updatedFollowed);
    
  }

  export const followingUser = async(req,res) =>{
    const {id} = req.params;
   
    if(!req.userId) return res.json({message : 'Unauthenticated'})
    
   
    const user = await User.findById(req.userId);
   
    // const user1 = await User.findById( String(req.userId))

    const index = user.following.findIndex((id1) => id1 === String(id));
    // const index1 = user1.following.findIndex((id1) => id1 === id);
    
    if (index ===-1) {
         if(index===-1){
        user.following.push(id); 
         }
        // if(index1===-1){
        //   user1.following.push(id);
        // }
       
      } else {
        user.following = user.following.filter((id1) => id1 !== String(id));  
        // user1.following = user1.following.filter((id1) => id1 !== id);
      }

    const updatedFollowing = await User.findByIdAndUpdate(req.userId, user, { new: true });
    // const updatedFollowing = await User.findByIdAndUpdate( String(req.userId), user1, { new: true }); 
    console.log(updatedFollowing)

    
    res.json(updatedFollowing);
    
  }

  export const message_to = async(req,res) =>{
    
    const {value} = req.body;
    const {id} = req.params;
    
    const user = await User.findById(id);
   
    const obj = user.message.find(o => o.id === req.userId);
    
    if(!obj) user.message.push({id:req.userId , chat:[value]})
    else obj.chat.push(value)

    const message_to = await User.findByIdAndUpdate(id, user, { new: true });
    // console.log(message_to)
   
    res.json(message_to);
    
  }

  export const message_from = async(req,res) =>{
    
    const {value} = req.body;
    
    const {id} = req.params;
    
    const user = await User.findById(req.userId);
   
    const obj = user.message.find(o => o.id === id);
    if(!obj) user.message.push({id:id , chat:[value]})
    else obj.chat.push(value)
   
    
    const message_from = await User.findByIdAndUpdate(req.userId, user, { new: true });

    res.json(message_from);
    
  }


