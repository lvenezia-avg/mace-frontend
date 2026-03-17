export type Bundle = {
  bundleId: string;
  bundleName: string;
  bundleDescription: string;
  bundleStatus?: "ACTIVE" | "INACTIVE";
  bundleContentsId?: string;
  creationDate?: number;
  lastUpdate?: number;
};

export type CreateBundleDto = {
  bundleName: string;
  bundleDescription: string;
  bundleContentsId?: string;
};

export type UpdateBundleDto = {
  bundleId: string;
  bundleName?: string;
  bundleDescription?: string;
  bundleContentsId?: string;
};

export type GetBundlesResponse = {
  items?: Bundle[];
  page?: number;
  limit?: number;
  total?: number;
};

export type Content = {
  contentId: string;
  contentName: string;
  contentDescription: string;
  contentStatus?: "ACTIVE" | "INACTIVE";
  contentServiceUrl: string;
  contentMetadata?: string;
  creationDate?: number;
  lastUpdate?: number;
};

export type CreateContentDto = {
  contentName: string;
  contentDescription: string;
  contentServiceUrl: string;
  contentMetadata?: any;
};

export type UpdateContentDto = {
  contentId: string;
  contentName?: string;
  contentDescription?: string;
  contentServiceUrl?: string;
};

export type GetContentsResponse = {
  items?: Content[];
  page?: number;
  limit?: number;
  total?: number;
};

export type Contract = {
  contractId: string;
  contractVendorId: string;
  contractExternalSubscriberId: string;
  contractEntitlement: boolean;
  contractDescription?: string;
  contractCustomFields?: string;
  contractName: string;
  contractStatus?: "ACTIVE" | "INACTIVE";
  contractBundleId: string;
  contractSubscriptionBundleKey: string;
  creationDate?: number;
  lastUpdate?: number;
};

export type CreateContractDto = {
  contractVendorId: string;
  contractExternalSubscriberId: string;
  contractEntitlement: boolean;
  contractName: string;
  contractBundleId: string;
  contractSubscriptionBundleKey: string;
  contractDescription?: string;
  contractCustomFields?: any;
};

export type DisableEntitlementDto = {
  contractVendorId: string;
  contractExternalSubscriberId: string;
};

export type EnableEntitlementDto = {
  contractVendorId: string;
  contractExternalSubscriberId: string;
};

export type GetContractsResponse = {
  items?: Contract[];
  page?: number;
  limit?: number;
  total?: number;
};
