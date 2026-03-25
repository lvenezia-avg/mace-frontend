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

type Client = {
  clientId: string;
  clientDistributorName: string;
  clientEmail: string;
  clientIsActive: boolean;
  roles: string[];
  creationDate?: number;
  lastUpdate?: number;
};

export default function ClientsListPage() {
  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        id: "clientDistributorName",
        accessorKey: "clientDistributorName",
        header: ({ column }) => <DataTableSorter column={column} title="Distributor" />,
        cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      },
      {
        id: "clientEmail",
        accessorKey: "clientEmail",
        header: ({ column }) => <DataTableSorter column={column} title="Email" />,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
      },
      {
        id: "clientIsActive",
        accessorKey: "clientIsActive",
        header: "Active",
        cell: ({ getValue }) =>
          getValue<boolean>() ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">ACTIVE</Badge>
          ) : (
            <Badge variant="secondary" className="text-gray-500">
              INACTIVE
            </Badge>
          ),
      },
      {
        id: "roles",
        accessorKey: "roles",
        header: "Roles",
        cell: ({ getValue }) => {
          const roles = getValue<string[]>() || [];
          return <span>{roles.join(", ")}</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        cell: ({ row }) => {
          const recordItemId = row.original.clientId;
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
      resource: "clients",
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="Clients" canCreate />
      <DataTable table={table} />
    </ListView>
  );
}
