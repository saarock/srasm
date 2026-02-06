type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
export type GetOptions<TTag extends string = string> = {
  method?: "GET";
  skip?: boolean;
  providesTags?: TTag[];
  key: string; // cache key
};

export type MutationOptions<
  THookName extends string = string,
  TTag extends string = string,
> = {
  method: MutationMethod; // REQUIRED, so TS can discriminate
  skip?: boolean;
  invalidatesTags: TTag[];
  hookName: THookName;
};

export type UseSRASMAsyncOptions<THookName extends string = string> =
  | GetOptions
  | MutationOptions<THookName>;

export type RefetchFn<TBody = void> = (body?: TBody) => Promise<void>;

export type BaseReturn<T> = { data: T; loading: boolean; error: any };

export type GetReturn<T> = BaseReturn<T> & { refetch: RefetchFn<void> };

export type MutationReturn<
  T,
  TBody,
  THookName extends string,
> = BaseReturn<T> & {
  [K in THookName]: RefetchFn<TBody>;
};

export type GetRefetchFn = () => Promise<void>;
export type MutateFn<TBody> = (body?: TBody) => Promise<void>;

export type ReturnByOptions<
  TData,
  TBody,
  THookName extends string,
  TOpts,
> = TOpts extends { method: "GET" } | { method?: undefined }
  ? { data: TData; loading: boolean; error: any; refetch: GetRefetchFn }
  : { data: TData; loading: boolean; error: any } & Record<
      THookName,
      MutateFn<TBody>
    >;

export type QueryMeta = {
  subscribers: number;
  refetch?: () => void;
  stale: boolean;
};
