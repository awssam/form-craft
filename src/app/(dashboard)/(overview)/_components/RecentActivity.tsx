import React from 'react';
import { List, FileText, CheckCircle, FolderX, AlertCircle } from 'lucide-react';
import { getAllActivitiesFromLastWeekAction } from '@/backend/actions/activity';
import InfoCard from './InfoCard';
import { ActivityModelType } from '@/backend/models/activity';
import { formatDistanceToNow } from '@/lib/datetime';

const activityTypeMap = {
  submission: {
    icon: FileText,
    color: 'text-green-500',
    message: (activity: ActivityModelType) => (
      <>
        New submission on <b>{activity.formName}</b>
      </>
    ),
  },
  published: {
    icon: CheckCircle,
    color: 'text-green-500',
    message: (activity: ActivityModelType) => (
      <>
        Form <b>{activity.formName}</b> is marked as <b>Published</b>
      </>
    ),
  },
  integration_error: {
    icon: AlertCircle,
    color: 'text-red-500',
    message: (activity: ActivityModelType) => (
      <>
        <div className="flex items-center flex-wrap">
          <span className="font-bold capitalize mr-1">{activity?.details?.provider} </span> integration failed for{' '}
          <b className="ml-1">{activity?.formName}</b>
        </div>
      </>
    ),
  },
};

const RecentActivity = async () => {
  const res = await getAllActivitiesFromLastWeekAction();
  const activities = res?.data ?? [];

  const renderActivity = (activity: ActivityModelType) => {
    const formattedTime = formatDistanceToNow(new Date(activity.createdAt), {
      addSuffix: true,
    });
    const { icon: Icon, color, message } = activityTypeMap[activity?.type as keyof typeof activityTypeMap] || {};

    if (!Icon) return null;

    return (
      <div
        key={activity.createdAt.toString()}
        className="flex items-center gap-3 p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-zinc-700/70"
      >
        <div className={`p-2 bg-zinc-800/80 rounded-full ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-zinc-100">{message(activity)}</p>
          <p className="text-xs text-zinc-400">{formattedTime}</p>
          <small className="text-xs text-red-400 mt-1">{activity?.details?.message ?? ''}</small>
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
      description="A quick overview of recent submissions, form updates, and integration statuses."
      renderData={() =>
        activities.length > 0 ? (
          <div className="flex flex-col gap-5">{activities.map(renderActivity)}</div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-400">
            <FolderX className="w-10 h-10 text-zinc-500" />
            <p className="text-sm font-medium mt-2">No activities in the past week</p>
          </div>
        )
      }
    />
  );
};

export default RecentActivity;
