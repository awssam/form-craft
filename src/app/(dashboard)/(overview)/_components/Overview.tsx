import React, { Suspense } from 'react';

import { InfoCardSkeleton } from './InfoCard';
import FormCompletionRate from './FormCompletionRate';
import SubmissionsOvertime from './SubmissionsOvertime';
import MostActiveForm from './MostActiveForm';
import TotalSubmissions from './TotalSubmissions';
import AverageCompletionRate from './AverageCompletionRate';
import RecentActivity from './RecentActivity';

const Overview = async () => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-4 ">
      <Suspense fallback={<InfoCardSkeleton className="col-span-full sm:col-span-3 md:col-span-3 max-h-[230px] " />}>
        <TotalSubmissions />
      </Suspense>

      <Suspense fallback={<InfoCardSkeleton className="col-span-full sm:col-span-3 md:col-span-3  max-h-[230px]" />}>
        <AverageCompletionRate />
      </Suspense>

      <Suspense
        fallback={<InfoCardSkeleton className="col-span-full md:col-span-6 [grid-row:2/span-1]  max-h-[230px]" />}
      >
        <MostActiveForm />
      </Suspense>

      <Suspense
        fallback={
          <InfoCardSkeleton className="col-span-full md:col-span-6 flex flex-col  gap-2 md:[grid-row:3] max-h-[400px]" />
        }
      >
        <FormCompletionRate />
      </Suspense>

      <Suspense
        fallback={
          <InfoCardSkeleton className="col-span-full flex flex-col gap-2 row-span-2 md:[grid-column:7/14] max-h-[400px]" />
        }
      >
        <SubmissionsOvertime />
      </Suspense>

      <Suspense
        fallback={
          <InfoCardSkeleton className="col-span-full flex flex-col gap-2 row-span-2 md:[grid-column:7/14] max-h-[400px]" />
        }
      >
        <RecentActivity />
      </Suspense>
    </div>
  );
};

export default Overview;
