import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { JobData } from '@/types/job';
import { sampleJobs } from '@/data/sampleJobs';

interface JobsContextValue {
  allJobs: JobData[];
  chosenJobs: JobData[];
  refusedJobs: JobData[];
  markChosen: (id: string) => void;
  markRefused: (id: string) => void;
}

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [allJobs] = useState<JobData[]>(sampleJobs);
  const [chosenIds, setChosenIds] = useState<Set<string>>(new Set());
  const [refusedIds, setRefusedIds] = useState<Set<string>>(new Set());

  const markChosen = (id: string) => {
    setChosenIds(prev => new Set(prev).add(id));
    setRefusedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const markRefused = (id: string) => {
    setRefusedIds(prev => new Set(prev).add(id));
    // NOTE: Do NOT remove from chosenIds.
    // Requirement: refusal should not change the chosen (job list) state.
  };

  const chosenJobs = useMemo(() => allJobs.filter(j => chosenIds.has(j.id)), [allJobs, chosenIds]);
  const refusedJobs = useMemo(() => allJobs.filter(j => refusedIds.has(j.id)), [allJobs, refusedIds]);

  const value: JobsContextValue = useMemo(
    () => ({ allJobs, chosenJobs, refusedJobs, markChosen, markRefused }),
    [allJobs, chosenJobs, refusedJobs]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used within JobsProvider');
  return ctx;
}
