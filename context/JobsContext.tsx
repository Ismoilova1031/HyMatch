import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import { JobData, JobFilter, JobSort } from '@/types/job';
import { sampleJobs } from '@/data/sampleJobs';
import { applyFilterAndSort } from '@/utils/jobFiltering';

interface JobsContextValue {
  allJobs: JobData[];
  filteredJobs: JobData[];
  filteredChosenJobs: JobData[];
  filter: JobFilter;
  sort: JobSort;
  setFilter: (f: JobFilter) => void;
  setSort: (s: JobSort) => void;
  chosenJobs: JobData[];
  markChosen: (id: string) => void;
  markRefused: (id: string) => void;
}

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [allJobs] = useState<JobData[]>(sampleJobs);
  // Use array instead of Set to avoid subtle state identity issues with Sets
  const [chosenIds, setChosenIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<JobFilter>({
    jobTypes: [],
    japaneseLevel: [],
    salaryRange: { min: 0, max: Number.MAX_SAFE_INTEGER },
    commuteConvenience: [],
    workImportance: [],
  });
  const [sort, setSort] = useState<JobSort>({ type: 'postedDate', direction: 'desc' });
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>(allJobs);

  const markChosen = (id: string) => {
    setChosenIds(prev => {
      const next = prev.includes(id) ? prev : [...prev, id];
      return next;
    });
  };

  const markRefused = (id: string) => {
    setChosenIds(prev => prev.filter(x => x !== id));
  };

  const chosenJobs = useMemo(() => allJobs.filter(j => chosenIds.includes(j.id)), [allJobs, chosenIds]);
  const filteredChosenJobs = useMemo(
    () => applyFilterAndSort(chosenJobs, filter, sort),
    [chosenJobs, filter, sort]
  );

  useEffect(() => {
    console.log('[JobsContext] chosenIds changed', chosenIds);
  }, [chosenIds]);

  useEffect(() => {
    console.log('[JobsContext] chosenJobs changed', chosenJobs.map(j => j.id));
  }, [chosenJobs]);

  useEffect(() => {
    setFilteredJobs(applyFilterAndSort(allJobs, filter, sort));
  }, [allJobs, filter, sort]);

  const value: JobsContextValue = useMemo(
    () => ({ allJobs, filteredJobs, filteredChosenJobs, filter, sort, setFilter, setSort, chosenJobs, markChosen, markRefused }),
    [allJobs, filteredJobs, filteredChosenJobs, filter, sort, chosenJobs]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used within JobsProvider');
  return ctx;
}
