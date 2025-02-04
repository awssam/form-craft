import React, { Suspense } from 'react';

import { CirclePercent, List } from 'lucide-react';
import InfoCard, { InfoCardSkeleton } from './InfoCard';
import FormCompletionRateBarChart from './FormCompletionRateBarChart';
import SubmissionsOvertimeLineChart from './SubmissionsOvertimeLineChart';
import MostActiveForm from './MostActiveForm';
import TotalSubmissions from './TotalSubmissions';
import AverageCompletionRate from './AverageCompletionRate';

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

      <FormCompletionRateBarChart />

      <SubmissionsOvertimeLineChart />

      <InfoCard
        className="col-span-full  md:col-span-6 md:max-h-[400px] overflow-hidden "
        title="Recent Activity"
        icon={List}
        contentClassName="overflow-y-scroll max-h-[80%]"
        description={'A list of recent submissions.'}
        renderData={() => (
          <div className="flex flex-col gap-4">
            {/* Event 2 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">📝</span>
              <p className="text-xs font-medium">
                New submission on <span className="font-bold">Event Registration Form</span>.
              </p>
            </div>

            {/* Event 3 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">✅</span>
              <p className="text-xs font-medium">
                Form <span className="font-bold">Contact Us</span> is now live.
              </p>
            </div>

            {/* Event 4 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">📝</span>
              <p className="text-xs font-medium">
                New submission on <span className="font-bold">Inquiry Form</span>.
              </p>
            </div>

            {/* Event 5 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">📝</span>
              <p className="text-xs font-medium">
                New submission on <span className="font-bold">Survey Form</span>.
              </p>
            </div>

            {/* Event 6 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">📝</span>
              <p className="text-xs font-medium">
                New submission on <span className="font-bold">Newsletter Signup</span>.
              </p>
            </div>

            {/* Event 7 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">✅</span>
              <p className="text-xs font-medium">
                Form <span className="font-bold">Feedback Survey</span> is now live.
              </p>
            </div>

            {/* Event 8 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">📝</span>
              <p className="text-xs font-medium">
                New submission on <span className="font-bold">Product Inquiry Form</span>.
              </p>
            </div>

            {/* Event 9 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">✅</span>
              <p className="text-xs font-medium">
                Form <span className="font-bold">Event Feedback</span> is now live.
              </p>
            </div>

            {/* Event 10 */}
            <div className="flex items-center gap-2 p-2 bg-card border border-input rounded-md shadow-md">
              <span className="text-xs text-green-500">📝</span>
              <p className="text-xs font-medium">
                New submission on <span className="font-bold">Service Request Form</span>.
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Overview;
