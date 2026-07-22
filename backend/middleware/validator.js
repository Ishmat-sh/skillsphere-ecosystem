const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Client', 'Freelancer').required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createGig: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(20).max(2000).required(),
    budget: Joi.number().min(1).required(),
    category: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).default([]),
    deadline: Joi.date().iso().optional()
  }),

  updateGig: Joi.object({
    title: Joi.string().min(5).max(100).optional(),
    description: Joi.string().min(20).max(2000).optional(),
    budget: Joi.number().min(1).optional(),
    category: Joi.string().optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    deadline: Joi.date().iso().optional()
  }),

  submitProposal: Joi.object({
    quote: Joi.number().min(1).required(),
    deliveryTimeline: Joi.string().min(5).max(100).required(),
    coverLetter: Joi.string().min(20).max(2000).required()
  }),

  updateProposalStatus: Joi.object({
    status: Joi.string().valid('Accepted', 'Rejected').required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    avatar: Joi.string().uri().optional()
  }),

  createReview: Joi.object({
    escrowId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(500).required()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};
