import { getAllActivitiesFromLastWeekAction } from '@/backend/actions/activity';
import React from 'react';
import InfoCard from './InfoCard';
import { List, FileText, CheckCircle, Clock, FolderX } from 'lucide-react';
import { ActivityModelType } from '@/backend/models/activity';
import { formatDistanceToNow } from '@/lib/datetime';

const RecentActivity = async () => {
  const res = await getAllActivitiesFromLastWeekAction();
  const activities = res?.data ?? [];

  const renderActivity = (activity: ActivityModelType) => {
    const formattedTime = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });

    return (
      <div
        key={activity.createdAt.toString()}
        className="flex items-center gap-3 p-3 bg-card border border-input rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        {/* Icon Based on Activity Type */}
        <div className="p-2 bg-muted rounded-full">
          {activity.type === 'submission' ? (
            <FileText className="w-5 h-5 text-green-500" />
          ) : activity.type === 'published' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-500" />
          )}
        </div>

        {/* Activity Details */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground">
            {activity.type === 'submission' ? (
              `New submission on `
            ) : (
              <span>
                Form <b>{activity.formName}</b> is marked as{' '}
              </span>
            )}
            {activity.type === 'submission' ? (
              <span className="font-bold">{activity.formName}</span>
            ) : (
              <b>{activity.type === 'published' ? 'Published' : 'Draft'}</b>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{formattedTime}</p>
        </div>
      </div>
    );
  };

  return (
    <InfoCard
      className="col-span-full md:[grid-column:7/14] md:max-h-[400px] overflow-hidden"
      title="Recent Activities"
      icon={List}
      contentClassName="overflow-y-auto max-h-[80%]"
      description="A quick overview of recent submissions and form updates from last week."
      renderData={() =>
        activities.length > 0 ? (
          <div className="flex flex-col gap-5">{activities.map(renderActivity)}</div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <FolderX className="w-10 h-10 text-gray-500" />
            <p className="text-sm font-medium mt-2">No activities in the past week</p>
          </div>
        )
      }
    />
  );
};

export default RecentActivity;
