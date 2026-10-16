import { AssessmentRecord } from '../types';

const STORAGE_KEY = 'digitalfootprint_ai_history_v1';
const SETTINGS_KEY = 'digitalfootprint_ai_settings_v1';

export interface AppSettings {
  allowAiAnalysis: boolean;
  storeReportsLocally: boolean;
  theme: 'dark';
}

const DEFAULT_SETTINGS: AppSettings = {
  allowAiAnalysis: true,
  storeReportsLocally: true,
  theme: 'dark',
};

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): void {
  try {
    const current = getStoredSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function getAssessmentHistory(): AssessmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: AssessmentRecord[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveAssessmentRecord(record: AssessmentRecord): void {
  try {
    const history = getAssessmentHistory();
    // Prepend new record, ensure unique ID
    const updated = [record, ...history.filter(item => item.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save assessment to history:', err);
  }
}

export function updateActionItemStatus(recordId: string, actionId: string, completed: boolean): void {
  try {
    const history = getAssessmentHistory();
    const updated = history.map(item => {
      if (item.id === recordId) {
        return {
          ...item,
          actionPlan: item.actionPlan.map(act => act.id === actionId ? { ...act, completed } : act),
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update action plan status:', err);
  }
}

export function deleteAssessmentRecord(id: string): void {
  try {
    const history = getAssessmentHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete assessment record:', err);
  }
}

export function clearAssessmentHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear assessment history:', err);
  }
}

export function exportRecordAsJson(record: AssessmentRecord): void {
  const cleanData = {
    exportDate: new Date().toISOString(),
    tool: 'Be Cautious',
    disclaimer: 'Educational privacy risk analysis for UNPHISHABLE challenge.',
    assessment: {
      id: record.id,
      timestamp: record.timestamp,
      profileName: record.profileName,
      isSample: record.isSample,
      overallScore: record.overallScore,
      riskLevel: record.riskLevel,
      totalIndicators: record.totalIndicators,
      categoryScores: record.categoryScores,
      highPriorityRisks: record.highPriorityRisks,
      actionPlan: record.actionPlan,
      aiAnalysis: record.aiAnalysis,
    },
  };

  const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `be-cautious-report-${record.profileName.replace(/[^a-zA-Z0-9]/g, '_')}-${record.id.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRecordAsCsv(record: AssessmentRecord): void {
  const rows: string[][] = [
    ['Be Cautious - Privacy Risk Assessment Report'],
    ['Assessment ID', record.id],
    ['Date', new Date(record.timestamp).toLocaleString()],
    ['Profile Name', `"${record.profileName.replace(/"/g, '""')}"`],
    ['Overall Privacy Risk Score (0-100)', String(record.overallScore)],
    ['Overall Risk Level', record.riskLevel],
    ['Total Exposure Indicators', String(record.totalIndicators)],
    [],
    ['Category Breakdown', 'Score (0-100)', 'Risk Level', 'Weight', 'Findings Count'],
    ...Object.values(record.categoryScores).map(cat => [
      `"${cat.label}"`,
      String(cat.score),
      cat.level,
      `${Math.round(cat.weight * 100)}%`,
      String(cat.findingsCount),
    ]),
    [],
    ['High-Priority Risks Detected'],
    ['Title', 'Severity', 'Category', 'Explanation'],
    ...record.highPriorityRisks.map(r => [
      `"${r.title.replace(/"/g, '""')}"`,
      r.severity,
      `"${r.category}"`,
      `"${r.detail.replace(/"/g, '""')}"`,
    ]),
    [],
    ['Personalized Action Plan'],
    ['Status', 'Priority', 'Category', 'Action Item', 'Impact'],
    ...record.actionPlan.map(act => [
      act.completed ? 'COMPLETED' : 'PENDING',
      act.priority.toUpperCase(),
      act.category,
      `"${act.title.replace(/"/g, '""')}: ${act.action.replace(/"/g, '""')}"`,
      `"${act.impact.replace(/"/g, '""')}"`,
    ]),
  ];

  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `be-cautious-report-${record.profileName.replace(/[^a-zA-Z0-9]/g, '_')}-${record.id.slice(0, 8)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
