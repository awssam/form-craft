import React from 'react';

import { CirclePercent, ClipboardList, List } from 'lucide-react';
import { StarFilledIcon } from '@radix-ui/react-icons';
import InfoCard from './InfoCard';
import FormCompletionRateBarChart from './FormCompletionRateBarChart';
import SubmissionsOvertimeLineChart from './SubmissionsOvertimeLineChart';

const Overview = () => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-4 ">
      <InfoCard
        className="col-span-full sm:col-span-3 md:col-span-3 max-h-[300px] "
        title="Total Submissions"
        icon={ClipboardList}
        description={'Total submissions received across all forms.'}
        data="120"
      />

      <InfoCard
        className="col-span-full sm:col-span-3 md:col-span-3  max-h-[300px]"
        title="Average Completion Rate"
        icon={CirclePercent}
        description={'Percentage of users who completed forms.'}
        data="50"
      />

      <InfoCard
        className="col-span-full md:col-span-6 [grid-row:2/span-1]  max-h-[300px]"
        title={'Most Active Form'}
        icon={StarFilledIcon}
        description={'Form with the highest number of submissions received.'}
        data={'Customer Feedback Form'}
      />

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
