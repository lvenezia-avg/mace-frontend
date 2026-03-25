import { useEffect, useState } from "react";
import { useList, useMany } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Box, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "react-router";

type Content = {
    contentId: string;
    contentName: string;
    contentDescription: string;
    contentServiceUrl: string;
    contentImageUrl?: string;
};

type Bundle = {
    bundleId: string;
    bundleName: string;
    bundleDescription: string;
    bundleContentsId?: string[] | string;
};

export default function ViewBundlesPage() {
    const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

    const { id } = useParams();

    const { query, result } = useList<Bundle>({
        resource: "bundles",
        pagination: {
            pageSize: 100,
        },
    });

    const { isLoading, isError } = query;
    const bundles = result?.data ?? [];
    useEffect(() => {
        setSelectedBundle(bundles.find(b => b.bundleId === id) || null);

    }, [bundles, id]);

    // Aggregate all content IDs across all bundles
    const allContentIds = Array.from(new Set(
        bundles.flatMap(bundle => {
            let ids: string[] = [];
            if (Array.isArray(bundle.bundleContentsId)) {
                ids = bundle.bundleContentsId;
            } else if (typeof bundle.bundleContentsId === "string" && bundle.bundleContentsId.trim() !== "") {
                try {
                    const parsed = JSON.parse(bundle.bundleContentsId);
                    ids = Array.isArray(parsed) ? parsed : [bundle.bundleContentsId];
                } catch {
                    ids = [bundle.bundleContentsId];
                }
            }
            return ids;
        })
    ));

    const { query: contentsQuery, result: contentsResult } = useMany<Content>({
        resource: "contents",
        ids: allContentIds,
        queryOptions: {
            enabled: allContentIds.length > 0,
        },
    });

    const contentsMap = new Map((contentsResult?.data ?? []).map(c => [c.contentId, c]));
    const isContentsLoading = contentsQuery.isLoading;

    let selectedBundleContentIds: string[] = [];
    if (selectedBundle?.bundleContentsId) {
        if (Array.isArray(selectedBundle.bundleContentsId)) {
            selectedBundleContentIds = selectedBundle.bundleContentsId;
        } else if (typeof selectedBundle.bundleContentsId === "string" && selectedBundle.bundleContentsId.trim() !== "") {
            try {
                const parsed = JSON.parse(selectedBundle.bundleContentsId);
                selectedBundleContentIds = Array.isArray(parsed) ? parsed : [selectedBundle.bundleContentsId];
            } catch {
                selectedBundleContentIds = [selectedBundle.bundleContentsId];
            }
        }
    }


    const selectedBundleContents = selectedBundleContentIds
        .map(id => contentsMap.get(id))
        .filter((c): c is Content => c !== undefined);

    const sortedBundles = selectedBundle
        ? [
            selectedBundle,
            ...bundles.filter(b => b.bundleId !== selectedBundle.bundleId),
        ]
        : bundles;

    if (!selectedBundle) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div className="flex justify-between items-end shrink-0 pt-5">

            </div>
            <div className="flex flex-col bg-card rounded-2xl border border-border/60 shadow-lg overflow-hidden max-h-[76vh">
                <div className="p-6 bg-muted/10 border-b border-border/40 shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">{selectedBundle!.bundleName}</h1>
                            <h2 className="text-3xl font-bold mb-3"></h2>
                            <p className="text-base text-muted-foreground">
                                {selectedBundle!.bundleDescription || "No description provided."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {isContentsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : contentsQuery.isError ? (
                        <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
                            Failed to load contents.
                        </div>
                    ) : selectedBundleContents.length === 0 ? (
                        <div className="text-muted-foreground text-center p-12 border-2 border-dashed rounded-lg">
                            This bundle has no products.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {selectedBundleContents.map((content) => {
                                const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(content.contentName)}&background=random&size=100&bold=true`;
                                return (
                                    <div key={content.contentId} className="flex gap-4 p-4 border rounded-xl bg-background hover:bg-accent/30 transition-colors group shadow-sm">
                                        <div className="w-20 h-20 shrink-0 rounded-lg bg-muted overflow-hidden border border-border/50">
                                            <img
                                                src={content.contentImageUrl || fallbackImg}
                                                alt={content.contentName}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = fallbackImg;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h4 className="font-semibold text-base line-clamp-1" title={content.contentName}>
                                                    {content.contentName}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-4 mb-3 max-w-[95%] flex-1">
                                                {content.contentDescription || "No description"}
                                            </p>
                                            {content.contentServiceUrl && (
                                                <div className="mt-auto pt-2 border-t border-border/40">
                                                    <a
                                                        href={content.contentServiceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5 font-medium"
                                                    >
                                                        <span>Service URL</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
        // <div className="pt-5 flex flex-col space-y-6 w-full mx-auto ">
        //     <div className="flex justify-between items-end shrink-0 fixed w-200 translate-x-[-5px] top-14.5 pb-4 h-27 ps-[5px] bg-background">
        //         <h1 className="text-3xl font-extrabold tracking-tight">View Bundles</h1>
        //     </div>

        //     {isLoading ? (
        //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        //             {[...Array(6)].map((_, i) => (
        //                 <Card key={i} className="flex flex-col h-[300px] border-muted/60">
        //                     <CardHeader>
        //                         <Skeleton className="h-6 w-3/4 mb-3" />
        //                         <Skeleton className="h-4 w-full" />
        //                     </CardHeader>
        //                     <CardContent className="flex-1 flex items-center justify-center">
        //                         <div className="grid grid-cols-3 gap-4 w-full px-4">
        //                             {[...Array(6)].map((_, j) => (
        //                                 <div key={j} className="flex flex-col items-center gap-2">
        //                                     <Skeleton className="w-12 h-12 rounded-[14px]" />
        //                                     <Skeleton className="h-2 w-10" />
        //                                 </div>
        //                             ))}
        //                         </div>
        //                     </CardContent>
        //                 </Card>
        //             ))}
        //         </div>
        //     ) : isError ? (
        //         <div className="text-destructive font-medium p-4 border border-destructive/20 rounded-lg bg-destructive/10">
        //             Error loading bundles. Please try again.
        //         </div>
        //     ) : bundles.length === 0 ? (
        //         <div className="text-muted-foreground p-12 text-center border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
        //             <Box className="w-12 h-12 mb-4 text-muted-foreground/30" />
        //             <h3 className="text-xl font-medium text-foreground mb-1">No bundles found</h3>
        //             <p>There are no bundles available to view.</p>
        //         </div>
        //     ) : (
        //         <div className={cn(
        //             "transition-all duration-300 ease-in-out w-full mt-15",
        //             selectedBundle
        //                 ? "grid grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[450px_1fr] gap-6 items-start"
        //                 : "block"
        //         )}>
        //             {/* Left Pane: Bundles List */}
        //             <div className={cn(
        //                 "transition-all duration-300",
        //                 selectedBundle
        //                     ? "flex flex-col gap-4"
        //                     : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        //             )}>
        //                 {sortedBundles.map((bundle) => {
        //                     let bundleContentIds: string[] = [];
        //                     if (Array.isArray(bundle.bundleContentsId)) {
        //                         bundleContentIds = bundle.bundleContentsId;
        //                     } else if (typeof bundle.bundleContentsId === "string" && bundle.bundleContentsId.trim() !== "") {
        //                         try {
        //                             const parsed = JSON.parse(bundle.bundleContentsId);
        //                             bundleContentIds = Array.isArray(parsed) ? parsed : [bundle.bundleContentsId];
        //                         } catch {
        //                             bundleContentIds = [bundle.bundleContentsId];
        //                         }
        //                     }

        //                     const bundleContents = bundleContentIds
        //                         .map(id => contentsMap.get(id))
        //                         .filter((c): c is Content => c !== undefined);

        //                     const MAX_DISPLAY = 4;
        //                     const visibleContents = bundleContents.slice(0, MAX_DISPLAY);
        //                     const hiddenCount = bundleContents.length - MAX_DISPLAY;
        //                     const isSelected = selectedBundle?.bundleId === bundle.bundleId;

        //                     return (
        //                         <div key={bundle.bundleId} onClick={() => setSelectedBundle(selectedBundle == bundle ? null : bundle)} className="cursor-pointer group outline-none">
        //                             <Card className={cn(
        //                                 " pb-0 flex flex-col hover:shadow-xl transition-all duration-300 border-border/50 group-hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-primary overflow-hidden",
        //                                 isSelected && "ring-2 ring-primary border-primary shadow-md bg-primary/5"
        //                             )}>
        //                                 <CardHeader className="pb-4 border-b border-border/40">
        //                                     <div className="flex justify-between items-start gap-4 mb-2">
        //                                         <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
        //                                             {bundle.bundleName}
        //                                         </CardTitle>
        //                                     </div>
        //                                     <CardDescription className="line-clamp-1 text-sm leading-relaxed">
        //                                         {bundle.bundleDescription || "No description provided."}
        //                                     </CardDescription>
        //                                 </CardHeader>

        //                                 <CardContent className="flex-1">

        //                                     {isContentsLoading ? (
        //                                         <div className="flex items-center justify-center p-6 pb-2 text-sm text-muted-foreground">
        //                                             Loading contents...
        //                                         </div>
        //                                     ) : bundleContents.length === 0 ? (
        //                                         <div className="flex flex-col items-center justify-center p-6 pb-2 text-center text-muted-foreground/50">
        //                                             <Box className="w-8 h-8 mb-2 opacity-20" />
        //                                             <span className="text-xs">Empty Bundle</span>
        //                                         </div>
        //                                     ) : (
        //                                         <div className={cn(
        //                                             "grid gap-x-2 gap-y-4 pt-2",
        //                                             selectedBundle ? "grid-cols-5" : "grid-cols-3 sm:grid-cols-5"
        //                                         )}>
        //                                             {visibleContents.map((content) => {
        //                                                 const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(content.contentName)}&background=random&size=100&bold=true`;
        //                                                 return (
        //                                                     <div key={content.contentId} className="flex flex-col items-center gap-1.5 group/item">
        //                                                         <div className="w-11 h-11 shrink-0 rounded-[10px] sm:rounded-[12px] bg-background overflow-hidden shadow-sm border border-border/60 transition-transform group-hover/item:scale-110 duration-200">
        //                                                             <img
        //                                                                 src={content.contentImageUrl || fallbackImg}
        //                                                                 alt={content.contentName}
        //                                                                 className="w-full h-full object-cover"
        //                                                                 onError={(e) => {
        //                                                                     e.currentTarget.src = fallbackImg;
        //                                                                 }}
        //                                                             />
        //                                                         </div>
        //                                                         <span className="text-[11px] leading-tight text-center font-medium text-foreground/80 line-clamp-1 px-1 w-full" title={content.contentName}>
        //                                                             {content.contentName}
        //                                                         </span>
        //                                                     </div>
        //                                                 );
        //                                             })}
        //                                             {hiddenCount > 0 && (
        //                                                 <div className="flex flex-col items-center gap-1.5 justify-start">
        //                                                     <div className="w-11 h-11 shrink-0 rounded-[10px] sm:rounded-[12px] bg-muted/50 flex items-center justify-center border border-dashed border-border/80 text-xs font-semibold text-muted-foreground">
        //                                                         +{hiddenCount}
        //                                                     </div>
        //                                                 </div>
        //                                             )}
        //                                         </div>
        //                                     )}
        //                                 </CardContent>
        //                                 <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/20 transition-all duration-500"></div>
        //                             </Card>
        //                         </div>
        //                     );
        //                 })}
        //             </div>

        //             {selectedBundle && (
        //                 <div className="flex flex-col bg-card rounded-2xl border border-border/60 shadow-lg overflow-hidden animate-in slide-in-from-right-8 fade-in-50 duration-500 sticky top-42 max-h-[76vh]">
        //                     <div className="p-6 md:p-8 bg-muted/10 border-b border-border/40 shrink-0">
        //                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        //                             <div>
        //                                 <h2 className="text-3xl font-bold mb-3">{selectedBundle.bundleName}</h2>
        //                                 <p className="text-base text-muted-foreground">
        //                                     {selectedBundle.bundleDescription || "No description provided."}
        //                                 </p>
        //                             </div>
        //                             <div className="shrink-0 flex items-center gap-3">
        //                                 <Button variant="outline" onClick={() => setSelectedBundle(null)} className="shadow-sm rounded-xl">
        //                                     <X className="w-6 h-6" />
        //                                 </Button>
        //                             </div>
        //                         </div>
        //                     </div>

        //                     <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        //                         {isContentsLoading ? (
        //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        //                                 {[...Array(4)].map((_, i) => (
        //                                     <Skeleton key={i} className="h-32 w-full rounded-xl" />
        //                                 ))}
        //                             </div>
        //                         ) : contentsQuery.isError ? (
        //                             <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
        //                                 Failed to load contents.
        //                             </div>
        //                         ) : selectedBundleContents.length === 0 ? (
        //                             <div className="text-muted-foreground text-center p-12 border-2 border-dashed rounded-lg">
        //                                 This bundle has no products.
        //                             </div>
        //                         ) : (
        //                             <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        //                                 {selectedBundleContents.map((content) => {
        //                                     const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(content.contentName)}&background=random&size=100&bold=true`;
        //                                     return (
        //                                         <div key={content.contentId} className="flex gap-4 p-4 border rounded-xl bg-background hover:bg-accent/30 transition-colors group shadow-sm">
        //                                             <div className="w-20 h-20 shrink-0 rounded-lg bg-muted overflow-hidden border border-border/50">
        //                                                 <img
        //                                                     src={content.contentImageUrl || fallbackImg}
        //                                                     alt={content.contentName}
        //                                                     className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        //                                                     onError={(e) => {
        //                                                         e.currentTarget.src = fallbackImg;
        //                                                     }}
        //                                                 />
        //                                             </div>
        //                                             <div className="flex-1 flex flex-col min-w-0">
        //                                                 <div className="flex justify-between items-start mb-1 gap-2">
        //                                                     <h4 className="font-semibold text-base line-clamp-1" title={content.contentName}>
        //                                                         {content.contentName}
        //                                                     </h4>
        //                                                 </div>
        //                                                 <p className="text-sm text-muted-foreground line-clamp-4 mb-3 max-w-[95%] flex-1">
        //                                                     {content.contentDescription || "No description"}
        //                                                 </p>
        //                                                 {content.contentServiceUrl && (
        //                                                     <div className="mt-auto pt-2 border-t border-border/40">
        //                                                         <a
        //                                                             href={content.contentServiceUrl}
        //                                                             target="_blank"
        //                                                             rel="noopener noreferrer"
        //                                                             className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5 font-medium"
        //                                                         >
        //                                                             <span>Service URL</span>
        //                                                             <ExternalLink className="w-3.5 h-3.5" />
        //                                                         </a>
        //                                                     </div>
        //                                                 )}
        //                                             </div>
        //                                         </div>
        //                                     );
        //                                 })}
        //                             </div>
        //                         )}
        //                     </div>
        //                 </div>
        //             )}
        //         </div>
        //     )}
        // </div>
    );
}
