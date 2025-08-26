import { JobData, JobFilter, JobSort, JobType } from '@/types/job';

// Map FilterModal's displayed labels to JobType enums
const FILTER_MODAL_LABEL_TO_JOB_TYPE: Record<string, JobType> = {
  'レストラン': 'service',
  'コンビニ': 'retail',
  'オフィス': 'office',
  'デリバリー': 'delivery',
  '清掃': 'cleaning',
};

export function mapFilterModalToJobFilter(
  wageMin: number,
  filters: Record<string, string[]>
): JobFilter {
  const jobTypesLabels = filters['jobType'] || [];
  const jobTypes = jobTypesLabels
    .map(l => FILTER_MODAL_LABEL_TO_JOB_TYPE[l])
    .filter(Boolean) as JobFilter['jobTypes'];

  const japaneseLevel = (filters['japaneseLevel'] || []) as JobFilter['japaneseLevel'];

  // Combine commute and important into a single list to match sample data appealPoints
  const commuteConvenience = filters['convenient'] || [];
  const workImportance = filters['important'] || [];

  return {
    jobTypes,
    japaneseLevel,
    salaryRange: { min: wageMin || 0, max: Number.MAX_SAFE_INTEGER },
    commuteConvenience,
    workImportance,
  };
}

export function mapFilterModalToJobSort(
  sortKey: string | null,
  sortDirection: 'asc' | 'desc' | null
): JobSort {
  let type: JobSort['type'] = 'postedDate';
  if (sortKey === 'salary') type = 'salary';
  else if (sortKey === 'home_step') type = 'commuteHome';
  else if (sortKey === 'school_step') type = 'commuteSchool';
  else if (sortKey === 'date') type = 'postedDate';

  return {
    type,
    direction: sortDirection || 'desc',
  };
}

export function filterJobs(jobs: JobData[], filter: JobFilter): JobData[] {
  return jobs.filter(job => {
    // Job type
    if (filter.jobTypes.length > 0 && !filter.jobTypes.includes(job.jobType)) return false;

    // Japanese level
    if (filter.japaneseLevel.length > 0 && !filter.japaneseLevel.includes(job.japaneseLevel)) return false;

    // Salary range (ensure job falls within selected range)
    if (job.salary.min < filter.salaryRange.min) return false;
    if (job.salary.max > filter.salaryRange.max) return false;

    // Commute convenience and work importance map to appealPoints in sample data
    const mustIncludes = [...(filter.commuteConvenience || []), ...(filter.workImportance || [])];
    if (mustIncludes.length > 0) {
      const hasAll = mustIncludes.every(sel =>
        job.appealPoints.some(p => p === sel || p.includes(sel) || sel.includes(p))
      );
      if (!hasAll) return false;
    }

    return true;
  });
}

export function sortJobs(jobs: JobData[], sort: JobSort): JobData[] {
  const arr = [...jobs];
  arr.sort((a, b) => {
    let aValue = 0;
    let bValue = 0;
    switch (sort.type) {
      case 'salary':
        aValue = a.salary.min;
        bValue = b.salary.min;
        break;
      case 'commuteHome':
        aValue = a.commuteTime.home;
        bValue = b.commuteTime.home;
        break;
      case 'commuteSchool':
        aValue = a.commuteTime.school;
        bValue = b.commuteTime.school;
        break;
      case 'postedDate':
      default:
        aValue = a.postedDate.getTime();
        bValue = b.postedDate.getTime();
        break;
    }
    return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });
  return arr;
}

export function applyFilterAndSort(jobs: JobData[], filter: JobFilter, sort: JobSort): JobData[] {
  return sortJobs(filterJobs(jobs, filter), sort);
}
