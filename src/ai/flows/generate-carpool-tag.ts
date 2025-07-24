'use server';

/**
 * @fileOverview A carpool tag generation AI agent.
 *
 * - generateCarpoolTag - A function that generates relevant tags for carpool routes.
 * - GenerateCarpoolTagInput - The input type for the generateCarpoolTag function.
 * - GenerateCarpoolTagOutput - The return type for the generateCarpoolTag function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCarpoolTagInputSchema = z.object({
  startLocation: z.string().describe('The starting location of the carpool route.'),
  endLocation: z.string().describe('The ending location of the carpool route.'),
  arrivalTime: z.string().describe('The arrival time of the carpool route.'),
  daysOfWeek: z.string().describe('The days of the week for the carpool route.'),
});
export type GenerateCarpoolTagInput = z.infer<typeof GenerateCarpoolTagInputSchema>;

const GenerateCarpoolTagOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of relevant tags for the carpool route.'),
});
export type GenerateCarpoolTagOutput = z.infer<typeof GenerateCarpoolTagOutputSchema>;

export async function generateCarpoolTag(input: GenerateCarpoolTagInput): Promise<GenerateCarpoolTagOutput> {
  return generateCarpoolTagFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCarpoolTagPrompt',
  input: {schema: GenerateCarpoolTagInputSchema},
  output: {schema: GenerateCarpoolTagOutputSchema},
  prompt: `You are a helpful assistant that suggests tags for carpool routes based on the provided information.

  Consider the start location, end location, arrival time, and days of the week to generate relevant tags.

  Provide at most 3 tags.

  Start Location: {{{startLocation}}}
  End Location: {{{endLocation}}}
  Arrival Time: {{{arrivalTime}}}
  Days of Week: {{{daysOfWeek}}}

  Tags:`, // Ensure the model generates an array of strings.
});

const generateCarpoolTagFlow = ai.defineFlow(
  {
    name: 'generateCarpoolTagFlow',
    inputSchema: GenerateCarpoolTagInputSchema,
    outputSchema: GenerateCarpoolTagOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
