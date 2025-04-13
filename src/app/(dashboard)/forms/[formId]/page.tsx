'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetFormSubmissionQuery } from '@/data-fetching/client/formSubmission';
import { cn } from '@/lib/utils';
import { FieldEntity } from '@/types/form-config';
import { ReloadIcon } from '@radix-ui/react-icons';
import { formatDate } from 'date-fns';
import { ExternalLinkIcon, SlashIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const FieldRenderer = ({ field, value }: { field: FieldEntity; value: unknown }) => {
  switch (field?.type) {
    case 'date':
      return <>{formatDate(value as string, 'dd MMM, yyyy')}</>;
    case 'checkbox':
    case 'dropdown':
      return <>{(value as unknown as string[])?.join(', ')}</>;

    case 'textarea':
      return <CustomTooltip tooltip={value as string}>{(value as string)?.slice(0, 50)}</CustomTooltip>;

    case 'file':
      return (
        <div className="flex flex-wrap gap-2">
          {(value as { name: string; url: string }[])?.map((f, i) => (
            <a
              className="flex items-center gap-1 text-underline text-blue-500 hover:text-blue-600"
              href={f?.url}
              target="_blank"
              rel="noopener noreferrer"
              key={f?.name}
            >
              {f?.name || 'File' + (i + 1)} {f?.url && <ExternalLinkIcon className="w-4 h-4" />}
            </a>
          ))}
        </div>
      );
      break;

    default:
      return <>{value}</>;
  }
};

export default function TableDemo() {
  const params = useParams();
  const formId = params.formId as string;

  const { data, isLoading, isFetching, refetch } = useGetFormSubmissionQuery(formId);

  const fieldEntites = data?.formConfig?.fieldEntities;
  const fieldIdsInOrder = useMemo(
    () => data?.formConfig?.pages?.flatMap((p) => data?.formConfig?.pageEntities[p]?.fields),
    [data],
  );

  const renderTableColumnHeaders = () => {
    return (
      <>
        <TableHead className="">#</TableHead>
        <TableHead className="min-w-[200px]">Date of Submission</TableHead>
        {fieldIdsInOrder?.map((fieldId) => {
          const field = fieldEntites?.[fieldId];

          return (
            <>
              <TableHead className="min-w-[250px]" key={field?.name}>
                {field?.label}
              </TableHead>
            </>
          );
        })}
      </>
    );
  };

  const submissions = data?.submissions;

  const renderTableRows = () => {
    return submissions?.map((submission) => {
      return (
        <TableRow key={submission?.createdAt?.toString()}>
          <TableCell>{submissions?.indexOf(submission) + 1}</TableCell>
          <TableCell>{formatDate(submission?.createdAt, 'dd MMM, yyyy')}</TableCell>
          {fieldIdsInOrder?.map((fieldId, index) => {
            const field = fieldEntites?.[fieldId];
            const rec = submission?.data as unknown as Record<string, unknown>;
            return (
              <TableCell key={`cell-${fieldId}-${index}`}>
                <FieldRenderer field={field!} value={rec?.[field?.name as string]} />
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList className="gap-1 sm:gap-1">
            <BreadcrumbItem>
              <Link href="/forms">Forms</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage> Submissions </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <header className="flex justify-between gap-4 flex-wrap items-center">
        {isLoading ? (
          <Skeleton className="h-10 w-[200px]" />
        ) : (
          <h3 className="font-bold text-lg sm:text-xl gradient-text-light tracking-tight border-b border-b-transparent min-w-12 min-h-6">
            Submissions for {data?.formConfig?.name}
          </h3>
        )}
        <Button className="flex items-center" disabled={isLoading || isFetching} onClick={() => refetch()}>
          <ReloadIcon className={cn('h-3 w-3', isLoading || (isFetching && 'animate-spin'))} />
          <span className="ml-2">Refresh</span>
        </Button>
      </header>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table>
          <TableCaption className="sr-only">A List of recent submissions</TableCaption>
          <TableHeader>
            <TableRow>{renderTableColumnHeaders()}</TableRow>
          </TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={Object.keys(fieldEntites || {}).length + 1} className="font-bold">
                Total Submissions
              </TableCell>
              <TableCell className="text-2xl font-bold">{submissions?.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}

const TableSkeleton = () => {
  // Number of columns and rows for the skeleton
  const columnCount = 8;
  const rowCount = 13;

  return (
    <Table>
      <TableCaption className="sr-only">A List of recent submissions</TableCaption>
      <TableHeader>
        <TableRow>
          {Array(columnCount)
            .fill(0)
            .map((_, index) => (
              <TableHead className="min-w-[150px]" key={`header-${index}`}>
                <Skeleton className="h-6 w-24" />
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(rowCount)
          .fill(0)
          .map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array(columnCount)
                .fill(0)
                .map((_, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={columnCount - 1} className="font-bold">
            <Skeleton className="h-6 w-40" />
          </TableCell>
          <TableCell className="text-2xl font-bold">
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
