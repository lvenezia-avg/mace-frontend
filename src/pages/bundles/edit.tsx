import { useDataProvider } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { HttpError } from "@refinedev/core";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { Copy, Check } from "lucide-react";


const formSchema = z.object({
  bundleName: z.string().min(1, "Name is required"),
  bundleDescription: z.string().optional(),
  bundleContentsId: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Bundle = {
  bundleId: string;
  bundleName: string;
  bundleDescription: string;
  bundleStatus: "ACTIVE" | "INACTIVE";
};

export default function BundlesEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dataProvider = useDataProvider();
  const [contentsOptions, setContentsOptions] = useState<{ contentId: string; contentName: string }[]>([]);
  const [copied, setCopied] = useState(false);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/view-bundle/${id}`);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  useEffect(() => {
    dataProvider()
      .getList({ resource: "contents", pagination: { pageSize: 100 } })
      .then(({ data }) => {
        const contents = data as { contentId: string; contentName: string; contentStatus?: string }[];
        setContentsOptions(contents.filter((content) => content.contentStatus === "ACTIVE"));
      })
      .catch(() => setContentsOptions([]));
  }, [dataProvider]);

  const goToViewBundle = (id: string) => {
    navigate(`/view-bundle/${id}`);
  };

  const {
    refineCore: { onFinish, formLoading, query },
    ...form
  } = useForm<Bundle, HttpError, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bundleName: "",
      bundleDescription: "",
      bundleContentsId: [],
    },
    refineCoreProps: {
      resource: "bundles",
      action: "edit",
      redirect: "list",
    },
  });

  const isLoading = formLoading || query?.isLoading;

  function onSubmit(values: FormValues) {
    onFinish(values);
  }

  return (
    <EditView>
      <EditViewHeader title="Edit Bundle" />
      <LoadingOverlay loading={!!isLoading}>
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

            <FormField
              control={form.control}
              name="bundleContentsId"
              render={({ field }) => {
                const selectedContents = field.value || [];
                return (
                  <FormItem>
                    <FormLabel>Contents</FormLabel>
                    <FormControl>
                      <div className="grid gap-2">
                        {contentsOptions.map((content) => {
                          const isChecked = selectedContents.includes(content.contentId);
                          return (
                            <label key={content.contentId} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                value={content.contentId}
                                checked={isChecked}
                                onChange={(event) => {
                                  const next = event.target.checked
                                    ? [...selectedContents, content.contentId]
                                    : selectedContents.filter((id: string) => id !== content.contentId);
                                  field.onChange(next);
                                }}
                                className="accent-primary"
                              />
                              <span>{content.contentName}</span>
                            </label>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={!!isLoading}>
                {formLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" className="bg-gray-100 text-black hover:bg-gray-200 relative pe-9" onClick={() => goToViewBundle(id!)}>
                {"View Bundle"}
                <div className="absolute right-2 z-50  h-6 w-6 flex items-center justify-center" onClick={(e) => {
                  e.stopPropagation();
                  handleCopy()
                }
                }>
                  {copied ? <Check className="text-green-500" size={18} /> : <Copy size={18} />}
                </div>
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
