import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { HttpError } from "@refinedev/core";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  clientDistributorName: z.string().min(3, "Distributor name is required"),
  clientEmail: z.string().email("Email must be valid"),
  clientIsActive: z.boolean().optional(),
  roles: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Client = {
  clientId: string;
  clientDistributorName: string;
  clientEmail: string;
  clientIsActive: boolean;
  roles: string[];
};

export default function ClientsEditPage() {
  const {
    refineCore: { onFinish, formLoading, query },
    ...form
  } = useForm<Client, HttpError, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientDistributorName: "",
      clientEmail: "",
      clientIsActive: true,
      roles: "CLIENT",
    },
    refineCoreProps: {
      resource: "clients",
      action: "edit",
      redirect: "list",
    },
  });

  const isLoading = formLoading || query?.isLoading;

  function onSubmit(values: FormValues) {
    const roles = values.roles
      ? values.roles
          .split(",")
          .map((role) => role.trim())
          .filter((role) => role.length > 0)
      : ["CLIENT"];

    onFinish({
      ...values,
      clientIsActive: values.clientIsActive ?? true,
      roles,
    } as any);
  }

  return (
    <EditView>
      <EditViewHeader title="Edit Client" />
      <LoadingOverlay loading={!!isLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <FormField
              control={form.control}
              name="clientDistributorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Distributor Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Distributor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@domain.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientIsActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch checked={field.value ?? true} onCheckedChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <span>Active account</span>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="CLIENT,ADMIN"
                      {...field}
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">Comma-separated list (e.g. CLIENT,ADMIN)</p>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={!!isLoading}>
                {formLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
