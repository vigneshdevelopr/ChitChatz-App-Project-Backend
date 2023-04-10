import express from 'express'; 

import mongoose from 'mongoose';

const MsgSchema = new mongoose.Schema(
    {
        message: {
          text: { type: String, required: true },
        },
        users: Array,
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        timestamps: true,
      }

)

export const AllMessages = mongoose.model("Messages", MsgSchema );