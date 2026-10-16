import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { EducationalSection } from './components/EducationalSection';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { ResultsView } from './components/ResultsView';
import { SocialEngineeringSimulator } from './components/SocialEngineeringSimulator';
import { ActionPlanView } from './components/ActionPlanView';
import { HistoryView } from './components/HistoryView';
import { AssessmentRecord } from './types';
import { 
  getAssessmentHistory, 
  saveAssessmentRecord, 
  deleteAssessmentRecord, 
  clearAssessmentHistory, 
  updateActionItemStatus 
} from './lib/storage';
import { SAMPLE_PROFILES } from './lib/sampleProfiles';
import { evaluateDeterministicRisk, buildDeterministicAiFallback } from './lib/riskEngine';
import { checkServerHealth } from './lib/api';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [geminiActive, setGeminiActive] = useState<boolean>(false);

  // Initialize and check server health
  useEffect(() => {
    async function init() {
      // 1. Check server health
      const health = await checkServerHealth();
      setGeminiActive(health.geminiConfigured);

      // 2. Load stored assessments
      let loaded = getAssessmentHistory();
      if (loaded.length === 0) {
        // Seed initial simulated assessment (Maya Patel) so the dashboard has rich data out of the box
        const defaultSample = SAMPLE_PROFILES[0];
        const deterministic = evaluateDeterministicRisk(defaultSample.data, {
          isSample: true,
          sampleType: 'student',
        });
        const aiFallback = buildDeterministicAiFallback(
          defaultSample.data,
          deterministic.categoryScores
        );
        const seedRecord: AssessmentRecord = {
          id: `sample_maya_${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...deterministic,
          aiAnalysis: aiFallback,
        };
        saveAssessmentRecord(seedRecord);
        loaded = [seedRecord];
      }
      setAssessments(loaded);
      if (loaded.length > 0) {
        setSelectedRecord(loaded[0]);
      }
    }
    init();
  }, []);

  const handleAssessmentComplete = (record: AssessmentRecord) => {
    saveAssessmentRecord(record);
    const updated = getAssessmentHistory();
    setAssessments(updated);
    setSelectedRecord(record);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAssessment = (record: AssessmentRecord) => {
    setSelectedRecord(record);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAssessment = (id: string) => {
    deleteAssessmentRecord(id);
    const updated = getAssessmentHistory();
    setAssessments(updated);
    if (selectedRecord?.id === id) {
      setSelectedRecord(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearHistory = () => {
    clearAssessmentHistory();
    setAssessments([]);
    setSelectedRecord(null);
  };

  const handleToggleAction = (recordId: string, actionId: string, completed: boolean) => {
    updateActionItemStatus(recordId, actionId, completed);
    const updated = getAssessmentHistory();
    setAssessments(updated);
    if (selectedRecord?.id === recordId) {
      setSelectedRecord(updated.find((r) => r.id === recordId) || null);
    }
  };

  const handleStartScan = () => {
    setCurrentView('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDemo = () => {
    // If Maya's sample exists, open it, else go to scanner with sample loaded
    const sample = assessments.find((a) => a.isSample);
    if (sample) {
      setSelectedRecord(sample);
      setCurrentView('results');
    } else {
      setCurrentView('scanner');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        geminiActive={geminiActive}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <div>
            <LandingHero
              onStartScan={handleStartScan}
              onExploreDemo={handleExploreDemo}
            />
            <EducationalSection
              onStartScan={handleStartScan}
              onExploreDemo={handleExploreDemo}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            assessments={assessments}
            onStartScan={handleStartScan}
            onSelectAssessment={handleSelectAssessment}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'scanner' && (
          <Scanner
            onAssessmentComplete={handleAssessmentComplete}
            geminiActive={geminiActive}
          />
        )}

        {currentView === 'results' && selectedRecord && (
          <ResultsView
            record={selectedRecord}
            onNavigateToActionPlan={() => handleNavigate('action-plan')}
            onNavigateToSimulator={() => handleNavigate('simulator')}
            onNewScan={handleStartScan}
          />
        )}

        {currentView === 'simulator' && (
          <SocialEngineeringSimulator />
        )}

        {currentView === 'action-plan' && (
          <ActionPlanView
            currentRecord={selectedRecord}
            onToggleAction={handleToggleAction}
            onStartScan={handleStartScan}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            assessments={assessments}
            onSelectAssessment={handleSelectAssessment}
            onDeleteAssessment={handleDeleteAssessment}
            onClearHistory={handleClearHistory}
            onStartScan={handleStartScan}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
