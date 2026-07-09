const { HfInference } = require('@huggingface/inference');

class HuggingFaceService {
  constructor() {
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.warn('HUGGINGFACE_API_KEY not found. AI features will be disabled.');
      this.client = null;
    } else {
      this.client = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }
  }

  async generateGigDescription(title, skills) {
    if (!this.client) {
      throw new Error('HuggingFace client not initialized. Check API key.');
    }

    try {
      const prompt = `Generate a professional gig description for a freelancer service.
Title: ${title}
Skills: ${skills.join(', ')}
Requirements: Keep it professional, highlight expertise, and attract clients.`;

      const response = await this.client.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
        }
      });

      return response.generated_text;
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw new Error('Failed to generate gig description');
    }
  }

  async generateProposalText(gigTitle, gigDescription, userSkills) {
    if (!this.client) {
      throw new Error('HuggingFace client not initialized. Check API key.');
    }

    try {
      const prompt = `Write a compelling proposal for a freelance gig.
Gig Title: ${gigTitle}
Gig Description: ${gigDescription}
My Skills: ${userSkills.join(', ')}
Requirements: Be professional, show understanding of the project, and highlight relevant experience.`;

      const response = await this.client.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
        }
      });

      return response.generated_text;
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw new Error('Failed to generate proposal text');
    }
  }

  async analyzeSentiment(text) {
    if (!this.client) {
      throw new Error('HuggingFace client not initialized. Check API key.');
    }

    try {
      const response = await this.client.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: text
      });

      return response;
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  async summarizeText(text) {
    if (!this.client) {
      throw new Error('HuggingFace client not initialized. Check API key.');
    }

    try {
      const response = await this.client.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 30
        }
      });

      return response.summary_text;
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw new Error('Failed to summarize text');
    }
  }
}

module.exports = new HuggingFaceService();
