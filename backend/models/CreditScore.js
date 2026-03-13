const mongoose = require('mongoose');

const creditScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 850
  },
  category: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    required: true
  },
  // Input factors
  monthlyIncome: {
    type: Number,
    required: true
  },
  numberOfCreditCards: {
    type: Number,
    required: true,
    min: 0
  },
  creditUtilization: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  loanHistory: {
    type: String,
    enum: ['none', 'good', 'average', 'poor'],
    required: true
  },
  missedPayments: {
    type: Number,
    required: true,
    min: 0
  },
  creditHistoryLength: {
    type: Number, // in months
    required: true,
    min: 0
  },
  // Factor breakdown scores (0-100)
  factors: {
    paymentHistory: { type: Number, default: 0 },       // 35%
    creditUtilization: { type: Number, default: 0 },    // 30%
    creditHistoryLength: { type: Number, default: 0 },  // 15%
    creditMix: { type: Number, default: 0 },            // 10%
    newCredit: { type: Number, default: 0 }             // 10%
  },
  // Tips generated
  tips: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for efficient user queries
creditScoreSchema.index({ user: 1, createdAt: -1 });

// Static method to get score category
creditScoreSchema.statics.getCategory = function(score) {
  if (score < 580) return 'Poor';
  if (score < 670) return 'Fair';
  if (score < 740) return 'Good';
  if (score < 800) return 'Very Good';
  return 'Excellent';
};

module.exports = mongoose.model('CreditScore', creditScoreSchema);
