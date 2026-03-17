import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

type Bundle = {
  bundleId: string;
  bundleName: string;
  bundleDescription: string;
  bundleStatus: "ACTIVE" | "INACTIVE";
  bundleContentsId?: string[] | string;
};

export default function BundlesListPage() {
  const columns = useMemo<ColumnDef<Bundle>[]>(
    () => [
      {
        id: "bundleName",
        accessorKey: "bundleName",
        header: ({ column }) => <DataTableSorter column={column} title="Name" />,
        cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      },
      {
        id: "bundleDescription",
        accessorKey: "bundleDescription",
        header: "Description",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground line-clamp-2 max-w-xs">{getValue<string>()}</span>
        ),
      },
      {
        id: "bundleStatus",
        accessorKey: "bundleStatus",
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
        id: "bundleContentsId",
        accessorKey: "bundleContentsId",
        header: "Contents",
        cell: ({ getValue }) => {
          const value = getValue<string[] | string | undefined>();
          let count = 0;
          if (Array.isArray(value)) {
            count = value.length;
          } else if (typeof value === "string" && value.trim() !== "") {
            try {
              const parsed = JSON.parse(value);
              count = Array.isArray(parsed) ? parsed.length : 1;
            } catch {
              count = 1;
            }
          }
          return (
            <Badge variant="outline" className="font-mono">
              {count}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        cell: ({ row }) => {
          const recordItemId = row.original.bundleId;
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
      resource: "bundles",
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="Bundles" canCreate />
      <DataTable table={table} />
    </ListView>
  );
}
