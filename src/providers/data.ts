import { createDataProvider } from "@refinedev/rest";
import type {
  DataProvider,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteOneParams,
  CustomParams,
} from "@refinedev/core";
import type { KyInstance, KyResponse } from "ky";
import { API_URL } from "./constants";

type AnyObject = Record<string, any>;

function getBearerHeader() {
  let bearerToken = ((globalThis as any).process?.env?.HARDCODED_BEARER as string) || "";

  if (!bearerToken && typeof window !== "undefined") {
    bearerToken = window.localStorage.getItem("HARDCODED_BEARER") || "";
  }

  const result = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};
  console.debug("[dataProvider] getBearerHeader", { bearerToken, header: result });
  return result;
}

const provider = createDataProvider(API_URL, {
  getList: {
    getEndpoint(params: GetListParams): string {
      return `${params.resource}`;
    },
    async buildHeaders() {
      return getBearerHeader();
    },
    async buildQueryParams(params: GetListParams) {
      const { pagination } = params;
      const query: Record<string, any> = {};

      if (pagination?.currentPage) {
        query.page = pagination.currentPage;
        query.limit = pagination.pageSize ?? 10;
      }

      if (params.meta?.query) {
        Object.assign(query, params.meta.query);
      }

      return query;
    },
    async mapResponse(
      response: KyResponse<AnyObject>,
      _params: GetListParams
    ): Promise<any[]> {
      const body = await response.json();
      const payload = body?.data ?? body;
      if (payload?.items && Array.isArray(payload.items)) {
        return payload.items;
      }
      if (Array.isArray(payload)) {
        return payload;
      }
      return [];
    },
    async getTotalCount(
      response: KyResponse<AnyObject>,
      _params: GetListParams
    ): Promise<number> {
      const body = await response.json();
      const payload = body?.data ?? body;
      if (payload && typeof payload.total === "number") {
        return payload.total;
      }
      if (payload?.items && Array.isArray(payload.items)) {
        return payload.items.length;
      }
      if (Array.isArray(payload)) {
        return payload.length;
      }
      return 0;
    },
  },

  getOne: {
    getEndpoint(params: GetOneParams): string {
      return `${params.resource}/${params.id}`;
    },
    async buildHeaders() {
      return getBearerHeader();
    },
    async mapResponse(
      response: KyResponse<AnyObject>,
      _params: GetOneParams
    ): Promise<Record<string, any>> {
      const body = await response.json();
      const data = body?.data ?? body;

      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error("Resource not found");
        }
        return data[0];
      }

      if (!data) {
        throw new Error("Resource not found");
      }

      return data;
    },
  },

  create: {
    getEndpoint(params: CreateParams<any>): string {
      return params.resource;
    },
    async buildHeaders() {
      return getBearerHeader();
    },
    async buildBodyParams(params: CreateParams<any>) {
      return params.variables;
    },
    async mapResponse(
      response: KyResponse<AnyObject>,
      _params: CreateParams<any>
    ): Promise<Record<string, any>> {
      const body = await response.json();
      return body;
    },
  },

  update: {
    getEndpoint(params: UpdateParams<any>): string {
      return params.resource;
    },
    async buildHeaders() {
      return getBearerHeader();
    },
    async buildBodyParams(params: UpdateParams<any>) {
      return params.variables;
    },
    async mapResponse(
      response: KyResponse<AnyObject>,
      _params: UpdateParams<any>
    ): Promise<Record<string, any>> {
      const body = await response.json();
      return body?.data ?? body;
    },
  },

  deleteOne: {
    getEndpoint(params: DeleteOneParams<any>): string {
      return `${params.resource}/${params.id}`;
    },
    async buildHeaders() {
      return getBearerHeader();
    },
    async mapResponse(
      response: KyResponse<AnyObject>,
      _params: DeleteOneParams<any>
    ): Promise<Record<string, any>> {
      const body = await response.json();
      return body;
    },
  },

  custom: {
    async buildQueryParams(params: CustomParams<any>) {
      return params.query ?? {};
    },
    async buildHeaders(params: CustomParams<any>) {
      return {
        ...getBearerHeader(),
        ...params.headers,
      };
    },
    async buildBodyParams(params: CustomParams<any>): Promise<any> {
      if (params.url.includes("disable-entitlement") || params.url.includes("enable-entitlement")) {
        return params.payload ?? {};
      }
      return params.payload ?? {};
    },
    async mapResponse(
      response: KyResponse<AnyObject | AnyObject[]>,
      params: CustomParams<any>
    ): Promise<any> {
      const body = await response.json();
      if (params.url.includes("contracts") && params.url.split("/").length === 4) {
        return Array.isArray(body) ? body : [body];
      }
      return body;
    },
  },
});

export const dataProvider: DataProvider = provider.dataProvider;
export const kyInstance: KyInstance = provider.kyInstance;