const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    //   enum: ['real_estate', 'vehicles', 'jobs', 'services', 'electronics', 'others'],
    //   default: 'others',
    },
    price: {
      type: Number,
    //   required: true,
      min: 0,
    },
    // location: {
    //   city: String,
    //   state: String,
    //   country: String,
    //   coordinates: {
    //     type: {
    //       type: String,
    //       enum: ['Point'],
    //       default: 'Point',
    //     },
    //     coordinates: {
    //       type: [Number], // [longitude, latitude]
    //       index: '2dsphere',
    //     },
    //   },
    // },
    image: {
        type: String,
      },
      link: {
        type: String,
      },
    contact: {
      name: String,
      phone: String,
      email: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    //   required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'sold', 'expired'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ad', adSchema);
