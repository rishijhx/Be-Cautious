import {
  ProfileAssessmentInput,
  CategoryKey,
  CategoryScoreDetail,
  AiPrivacyAnalysis,
} from '../types';
import { buildDeterministicAiFallback } from './riskEngine';

export async function checkServerHealth(): Promise<{ status: string; geminiConfigured: boolean; model: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check non-200');
    return await res.json();
  } catch {
    return { status: 'offline', geminiConfigured: false, model: 'fallback' };
  }
}

export async function analyzePrivacyFootprint(
  inputs: ProfileAssessmentInput,
  categoryScores: Record<CategoryKey, CategoryScoreDetail>
): Promise<AiPrivacyAnalysis> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs, categoryScores }),
    });

    if (!res.ok) {
      console.warn(`Server AI analysis returned ${res.status}. Falling back to deterministic rules.`);
      return buildDeterministicAiFallback(inputs, categoryScores);
    }

    const data = await res.json();
    if (data && data.summary && Array.isArray(data.exposureFindings)) {
      return {
        available: true,
        engineUsed: 'gemini-3.8-flash',
        summary: data.summary,
        exposureFindings: data.exposureFindings,
        socialEngineeringRisks: data.socialEngineeringRisks || [],
        priorityActions: data.priorityActions || [],
        limitations: data.limitations || [],
      };
    }

    return buildDeterministicAiFallback(inputs, categoryScores);
  } catch (err) {
    console.warn('Network error reaching server AI endpoint. Using deterministic privacy engine:', err);
    return buildDeterministicAiFallback(inputs, categoryScores);
  }
}
