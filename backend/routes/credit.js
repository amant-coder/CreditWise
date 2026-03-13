const express = require('express');
const { body, validationResult } = require('express-validator');
const CreditScore = require('../models/CreditScore');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Credit score calculation engine
const calculateCreditScore = (data) => {
  const {
    monthlyIncome,
    numberOfCreditCards,
    creditUtilization,
    loanHistory,
    missedPayments,
    creditHistoryLength
  } = data;

  let factors = {
    paymentHistory: 0,
    creditUtilization: 0,
    creditHistoryLength: 0,
    creditMix: 0,
    newCredit: 0
  };

  // 1. Payment History (35%) - Based on missed payments
  if (missedPayments === 0) factors.paymentHistory = 100;
  else if (missedPayments === 1) factors.paymentHistory = 75;
  else if (missedPayments === 2) factors.paymentHistory = 50;
  else if (missedPayments <= 4) factors.paymentHistory = 25;
  else factors.paymentHistory = 5;

  // Loan history bonus
  if (loanHistory === 'good') factors.paymentHistory = Math.min(100, factors.paymentHistory + 10);
  else if (loanHistory === 'poor') factors.paymentHistory = Math.max(0, factors.paymentHistory - 20);

  // 2. Credit Utilization (30%) - Lower is better
  if (creditUtilization <= 10) factors.creditUtilization = 100;
  else if (creditUtilization <= 20) factors.creditUtilization = 90;
  else if (creditUtilization <= 30) factors.creditUtilization = 75;
  else if (creditUtilization <= 50) factors.creditUtilization = 50;
  else if (creditUtilization <= 70) factors.creditUtilization = 25;
  else factors.creditUtilization = 5;

  // 3. Credit History Length (15%) - Months
  if (creditHistoryLength >= 84) factors.creditHistoryLength = 100;       // 7+ years
  else if (creditHistoryLength >= 60) factors.creditHistoryLength = 85;   // 5+ years
  else if (creditHistoryLength >= 36) factors.creditHistoryLength = 65;   // 3+ years
  else if (creditHistoryLength >= 24) factors.creditHistoryLength = 50;   // 2+ years
  else if (creditHistoryLength >= 12) factors.creditHistoryLength = 35;   // 1+ year
  else factors.creditHistoryLength = 15;

  // 4. Credit Mix (10%) - Based on number of credit cards + loan types
  let creditMixScore = 0;
  if (numberOfCreditCards >= 1) creditMixScore += 40;
  if (numberOfCreditCards >= 2) creditMixScore += 20;
  if (loanHistory !== 'none') creditMixScore += 40;
  factors.creditMix = Math.min(100, creditMixScore);

  // 5. New Credit (10%) - Penalize for too many recent credit inquiries
  if (numberOfCreditCards === 0) factors.newCredit = 70;
  else if (numberOfCreditCards === 1) factors.newCredit = 90;
  else if (numberOfCreditCards === 2) factors.newCredit = 80;
  else if (numberOfCreditCards <= 4) factors.newCredit = 60;
  else factors.newCredit = 30;

  // Income adjustment (small bonus for higher income, indicates stability)
  const incomeBonus = Math.min(10, Math.floor(monthlyIncome / 10000));

  // Weighted score calculation
  const weightedScore =
    (factors.paymentHistory * 0.35) +
    (factors.creditUtilization * 0.30) +
    (factors.creditHistoryLength * 0.15) +
    (factors.creditMix * 0.10) +
    (factors.newCredit * 0.10);

  // Map to 300-850 range
  const score = Math.round(300 + (weightedScore / 100) * 550 + incomeBonus);
  const finalScore = Math.min(850, Math.max(300, score));

  return { score: finalScore, factors };
};

// Generate personalized tips
const generateTips = (data, score, factors) => {
  const tips = [];

  if (data.missedPayments > 0) {
    tips.push('Set up automatic payments to avoid missed payments — payment history is the most important factor (35%).');
  }
  if (data.creditUtilization > 30) {
    tips.push(`Your credit utilization is ${data.creditUtilization}%. Try to keep it below 30% — ideally under 10% for the best scores.`);
  }
  if (data.creditHistoryLength < 24) {
    tips.push("Build your credit history over time. Consider keeping your oldest credit accounts open even if you don't use them often.");
  }
  if (data.numberOfCreditCards === 0) {
    tips.push('Consider getting a secured credit card to build your credit mix and start establishing credit history.');
  }
  if (data.numberOfCreditCards > 4) {
    tips.push('Having too many credit cards can hurt your score. Avoid opening new accounts unnecessarily.');
  }
  if (data.loanHistory === 'poor') {
    tips.push('Work on resolving any outstanding loan issues. Consider a debt consolidation plan if you have multiple loans.');
  }
  if (score >= 740) {
    tips.push('Excellent credit! You qualify for the best interest rates. Keep maintaining your good financial habits.');
  }
  if (score < 580) {
    tips.push('Consider a secured credit card or credit-builder loan to start improving your score systematically.');
  }
  if (data.monthlyIncome > 0 && data.creditUtilization > 50) {
    tips.push('With your income level, try paying down credit card balances to significantly boost your score.');
  }

  return tips.length > 0 ? tips : ['Keep monitoring your credit regularly to stay on top of your financial health!'];
};

// @route   POST /api/credit/calculate
// @desc    Calculate and save credit score
// @access  Private
router.post('/calculate', protect, [
  body('monthlyIncome').isNumeric().isFloat({ min: 0 }).withMessage('Monthly income must be a positive number'),
  body('numberOfCreditCards').isInt({ min: 0 }).withMessage('Number of credit cards must be 0 or more'),
  body('creditUtilization').isFloat({ min: 0, max: 100 }).withMessage('Credit utilization must be between 0 and 100'),
  body('loanHistory').isIn(['none', 'good', 'average', 'poor']).withMessage('Invalid loan history'),
  body('missedPayments').isInt({ min: 0 }).withMessage('Missed payments must be 0 or more'),
  body('creditHistoryLength').isInt({ min: 0 }).withMessage('Credit history length must be 0 or more months')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      monthlyIncome, numberOfCreditCards, creditUtilization,
      loanHistory, missedPayments, creditHistoryLength
    } = req.body;

    const { score, factors } = calculateCreditScore(req.body);
    const category = CreditScore.schema.statics?.getCategory
      ? CreditScore.getCategory(score)
      : (() => {
        if (score < 580) return 'Poor';
        if (score < 670) return 'Fair';
        if (score < 740) return 'Good';
        if (score < 800) return 'Very Good';
        return 'Excellent';
      })();

    const tips = generateTips(req.body, score, factors);

    const creditRecord = await CreditScore.create({
      user: req.user._id,
      score,
      category,
      monthlyIncome,
      numberOfCreditCards,
      creditUtilization,
      loanHistory,
      missedPayments,
      creditHistoryLength,
      factors,
      tips
    });

    // Update user's current score
    await User.findByIdAndUpdate(req.user._id, { currentScore: score });

    res.status(201).json({
      success: true,
      data: {
        score,
        category,
        factors,
        tips,
        recordId: creditRecord._id,
        createdAt: creditRecord.createdAt
      }
    });
  } catch (error) {
    console.error('Calculate error:', error);
    res.status(500).json({ success: false, message: 'Error calculating credit score' });
  }
});

// @route   GET /api/credit/history
// @desc    Get user's credit score history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const history = await CreditScore.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('score category factors tips createdAt');

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
});

// @route   GET /api/credit/latest
// @desc    Get user's latest credit score
// @access  Private
router.get('/latest', protect, async (req, res) => {
  try {
    const latest = await CreditScore.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.json({ success: true, data: null, message: 'No credit score found' });
    }

    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching latest score' });
  }
});

// @route   GET /api/credit/stats
// @desc    Get user credit stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const records = await CreditScore.find({ user: req.user._id }).sort({ createdAt: 1 });

    if (!records.length) {
      return res.json({ success: true, data: { totalChecks: 0 } });
    }

    const scores = records.map(r => r.score);
    const stats = {
      totalChecks: records.length,
      currentScore: scores[scores.length - 1],
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      improvement: scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

module.exports = router;
