import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

type Content = {
  contentId: string;
  contentName: string;
  contentDescription: string;
  contentServiceUrl: string;
  contentStatus: "ACTIVE" | "INACTIVE";
};

export default function ContentsListPage() {
  const columns = useMemo<ColumnDef<Content>[]>(
    () => [
      {
        id: "contentName",
        accessorKey: "contentName",
        header: ({ column }) => <DataTableSorter column={column} title="Name" />,
        cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      },
      {
        id: "contentDescription",
        accessorKey: "contentDescription",
        header: "Description",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground line-clamp-2 max-w-xs">{getValue<string>()}</span>
        ),
      },
      {
        id: "contentServiceUrl",
        accessorKey: "contentServiceUrl",
        header: "Service URL",
        cell: ({ getValue }) => (
          <a
            href={getValue<string>()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate max-w-xs block">
            {getValue<string>()}
          </a>
        ),
      },
      {
        id: "contentStatus",
        accessorKey: "contentStatus",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return status === "ACTIVE" ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">ACTIVE</Badge>
          ) : (
            <Badge variant="secondary" className="text-gray-500">
              INACTIVE
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: ({ row }) => {
          const recordItemId = row.original.contentId;
          return (
            <div className="flex gap-1">
              <EditButton recordItemId={recordItemId} size="icon-sm" variant="secondary">
                <Edit className="h-4 w-4" />
              </EditButton>
              <DeleteButton recordItemId={recordItemId} size="icon-sm" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </DeleteButton>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useTable({
    columns,
    refineCoreProps: {
      resource: "contents",
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="Contents" canCreate />
      <DataTable table={table} />
    </ListView>
  );
}
