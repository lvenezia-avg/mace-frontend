import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { HttpError } from "@refinedev/core";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  bundleName: z.string().min(1, "Name is required"),
  bundleDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Bundle = {
  bundleId: string;
  bundleName: string;
  bundleDescription: string;
  bundleStatus: "ACTIVE" | "INACTIVE";
};

export default function BundlesCreatePage() {
  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<Bundle, HttpError, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bundleName: "",
      bundleDescription: "",
    },
    refineCoreProps: {
      resource: "bundles",
      action: "create",
      redirect: "list",
    },
  });

  function onSubmit(values: FormValues) {
    onFinish(values);
  }

  return (
    <CreateView>
      <CreateViewHeader title="Create Bundle" />
      <LoadingOverlay loading={formLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <FormField
              control={form.control}
              name="bundleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bundle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bundleDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter bundle description" className="resize-none" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Creating..." : "Create Bundle"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </CreateView>
  );
}
