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
import { SlashIcon } from 'lucide-react';
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

    default:
      return <>{value}</>;
  }
};

export default function TableDemo() {
  const params = useParams();
  const formId = params.formId as string;

  const { data, isLoading, isFetching, refetch } = useGetFormSubmissionQuery(formId);

  const fieldEntites = data?.formConfig?.fieldEntities;
  const fieldEntitesWithNameKeys = useMemo(
    () =>
      Object.values(fieldEntites || {})?.reduce((acc, curr) => ({ ...acc, [curr?.name]: curr }), {}) as Record<
        string,
        FieldEntity | undefined
      >,
    [fieldEntites],
  );

  const submissions = data?.submissions;

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
            <TableRow>
              <TableHead className="">#</TableHead>
              <TableHead className="">Date of Submission</TableHead>
              {Object.values(fieldEntites || {})?.map((field) => (
                <TableHead className="min-w-[150px]" key={field?.name}>
                  {field?.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions?.map((submission, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{formatDate(submission?.createdAt, 'dd MMM, yyyy')}</TableCell>
                {Object.entries(submission.data || {})?.map(([key, field]) => (
                  <TableCell key={`${key}-${index}`}>
                    <FieldRenderer field={fieldEntitesWithNameKeys?.[key] as FieldEntity} value={field} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
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
