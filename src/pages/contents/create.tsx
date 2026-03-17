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
  contentName: z.string().min(1, "Name is required"),
  contentDescription: z.string().optional(),
  contentServiceUrl: z.string().min(1, "Service URL is required").url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

type Content = {
  contentId: string;
  contentName: string;
  contentDescription: string;
  contentServiceUrl: string;
  contentStatus: "ACTIVE" | "INACTIVE";
};

export default function ContentsCreatePage() {
  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<Content, HttpError, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentName: "",
      contentDescription: "",
      contentServiceUrl: "",
    },
    refineCoreProps: {
      resource: "contents",
      action: "create",
      redirect: "list",
    },
  });

  function onSubmit(values: FormValues) {
    onFinish(values);
  }

  return (
    <CreateView>
      <CreateViewHeader title="Create Content" />
      <LoadingOverlay loading={formLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <FormField
              control={form.control}
              name="contentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter content name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter content description" className="resize-none" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentServiceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Service URL <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/service" type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Creating..." : "Create Content"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </CreateView>
  );
}
