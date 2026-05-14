import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AuthUserEnvelope, BeginBrowserLoginParams, CreateMealInput, CreateWeightInput, CreateWorkoutInput, DashboardStats, ErrorEnvelope, HandleBrowserLoginCallbackParams, HealthStatus, ListMealsParams, LogoutSuccess, Meal, MobileTokenExchangeRequest, MobileTokenExchangeSuccess, Profile, Recommendation, UpdateProfileInput, WeeklyWorkoutPoint, WeightEntry, Workout, WorkoutTypeBreakdown } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get the currently authenticated user
 */
export declare const getGetCurrentAuthUserUrl: () => string;
export declare const getCurrentAuthUser: (options?: RequestInit) => Promise<AuthUserEnvelope>;
export declare const getGetCurrentAuthUserQueryKey: () => readonly ["/api/auth/user"];
export declare const getGetCurrentAuthUserQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentAuthUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentAuthUserQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentAuthUser>>>;
export type GetCurrentAuthUserQueryError = ErrorType<unknown>;
/**
 * @summary Get the currently authenticated user
 */
export declare function useGetCurrentAuthUser<TData = Awaited<ReturnType<typeof getCurrentAuthUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Start the browser OIDC login flow
 */
export declare const getBeginBrowserLoginUrl: (params?: BeginBrowserLoginParams) => string;
export declare const beginBrowserLogin: (params?: BeginBrowserLoginParams, options?: RequestInit) => Promise<unknown>;
export declare const getBeginBrowserLoginQueryKey: (params?: BeginBrowserLoginParams) => readonly ["/api/login", ...BeginBrowserLoginParams[]];
export declare const getBeginBrowserLoginQueryOptions: <TData = Awaited<ReturnType<typeof beginBrowserLogin>>, TError = ErrorType<void>>(params?: BeginBrowserLoginParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof beginBrowserLogin>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof beginBrowserLogin>>, TError, TData> & {
    queryKey: QueryKey;
};
export type BeginBrowserLoginQueryResult = NonNullable<Awaited<ReturnType<typeof beginBrowserLogin>>>;
export type BeginBrowserLoginQueryError = ErrorType<void>;
/**
 * @summary Start the browser OIDC login flow
 */
export declare function useBeginBrowserLogin<TData = Awaited<ReturnType<typeof beginBrowserLogin>>, TError = ErrorType<void>>(params?: BeginBrowserLoginParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof beginBrowserLogin>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Complete the browser OIDC login flow
 */
export declare const getHandleBrowserLoginCallbackUrl: (params?: HandleBrowserLoginCallbackParams) => string;
export declare const handleBrowserLoginCallback: (params?: HandleBrowserLoginCallbackParams, options?: RequestInit) => Promise<unknown>;
export declare const getHandleBrowserLoginCallbackQueryKey: (params?: HandleBrowserLoginCallbackParams) => readonly ["/api/callback", ...HandleBrowserLoginCallbackParams[]];
export declare const getHandleBrowserLoginCallbackQueryOptions: <TData = Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError = ErrorType<void>>(params?: HandleBrowserLoginCallbackParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HandleBrowserLoginCallbackQueryResult = NonNullable<Awaited<ReturnType<typeof handleBrowserLoginCallback>>>;
export type HandleBrowserLoginCallbackQueryError = ErrorType<void>;
/**
 * @summary Complete the browser OIDC login flow
 */
export declare function useHandleBrowserLoginCallback<TData = Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError = ErrorType<void>>(params?: HandleBrowserLoginCallbackParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Clear the session and begin OIDC logout
 */
export declare const getLogoutBrowserSessionUrl: () => string;
export declare const logoutBrowserSession: (options?: RequestInit) => Promise<unknown>;
export declare const getLogoutBrowserSessionQueryKey: () => readonly ["/api/logout"];
export declare const getLogoutBrowserSessionQueryOptions: <TData = Awaited<ReturnType<typeof logoutBrowserSession>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof logoutBrowserSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof logoutBrowserSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type LogoutBrowserSessionQueryResult = NonNullable<Awaited<ReturnType<typeof logoutBrowserSession>>>;
export type LogoutBrowserSessionQueryError = ErrorType<void>;
/**
 * @summary Clear the session and begin OIDC logout
 */
export declare function useLogoutBrowserSession<TData = Awaited<ReturnType<typeof logoutBrowserSession>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof logoutBrowserSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Exchange a mobile OIDC code for a session token
 */
export declare const getExchangeMobileAuthorizationCodeUrl: () => string;
export declare const exchangeMobileAuthorizationCode: (mobileTokenExchangeRequest: MobileTokenExchangeRequest, options?: RequestInit) => Promise<MobileTokenExchangeSuccess>;
export declare const getExchangeMobileAuthorizationCodeMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, {
        data: BodyType<MobileTokenExchangeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, {
    data: BodyType<MobileTokenExchangeRequest>;
}, TContext>;
export type ExchangeMobileAuthorizationCodeMutationResult = NonNullable<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>>;
export type ExchangeMobileAuthorizationCodeMutationBody = BodyType<MobileTokenExchangeRequest>;
export type ExchangeMobileAuthorizationCodeMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Exchange a mobile OIDC code for a session token
 */
export declare const useExchangeMobileAuthorizationCode: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, {
        data: BodyType<MobileTokenExchangeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, {
    data: BodyType<MobileTokenExchangeRequest>;
}, TContext>;
/**
 * @summary Delete a mobile session token
 */
export declare const getLogoutMobileSessionUrl: () => string;
export declare const logoutMobileSession: (options?: RequestInit) => Promise<LogoutSuccess>;
export declare const getLogoutMobileSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
export type LogoutMobileSessionMutationResult = NonNullable<Awaited<ReturnType<typeof logoutMobileSession>>>;
export type LogoutMobileSessionMutationError = ErrorType<unknown>;
/**
 * @summary Delete a mobile session token
 */
export declare const useLogoutMobileSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
/**
 * @summary Get the current user's fighter profile
 */
export declare const getGetProfileUrl: () => string;
export declare const getProfile: (options?: RequestInit) => Promise<Profile>;
export declare const getGetProfileQueryKey: () => readonly ["/api/profile"];
export declare const getGetProfileQueryOptions: <TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
export type GetProfileQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get the current user's fighter profile
 */
export declare function useGetProfile<TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update the current user's fighter profile
 */
export declare const getUpdateProfileUrl: () => string;
export declare const updateProfile: (updateProfileInput: UpdateProfileInput, options?: RequestInit) => Promise<Profile>;
export declare const getUpdateProfileMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<UpdateProfileInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<UpdateProfileInput>;
}, TContext>;
export type UpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateProfile>>>;
export type UpdateProfileMutationBody = BodyType<UpdateProfileInput>;
export type UpdateProfileMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Update the current user's fighter profile
 */
export declare const useUpdateProfile: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<UpdateProfileInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<UpdateProfileInput>;
}, TContext>;
/**
 * @summary List the current user's workouts
 */
export declare const getListWorkoutsUrl: () => string;
export declare const listWorkouts: (options?: RequestInit) => Promise<Workout[]>;
export declare const getListWorkoutsQueryKey: () => readonly ["/api/workouts"];
export declare const getListWorkoutsQueryOptions: <TData = Awaited<ReturnType<typeof listWorkouts>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWorkouts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listWorkouts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListWorkoutsQueryResult = NonNullable<Awaited<ReturnType<typeof listWorkouts>>>;
export type ListWorkoutsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary List the current user's workouts
 */
export declare function useListWorkouts<TData = Awaited<ReturnType<typeof listWorkouts>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWorkouts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new workout
 */
export declare const getCreateWorkoutUrl: () => string;
export declare const createWorkout: (createWorkoutInput: CreateWorkoutInput, options?: RequestInit) => Promise<Workout>;
export declare const getCreateWorkoutMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWorkout>>, TError, {
        data: BodyType<CreateWorkoutInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createWorkout>>, TError, {
    data: BodyType<CreateWorkoutInput>;
}, TContext>;
export type CreateWorkoutMutationResult = NonNullable<Awaited<ReturnType<typeof createWorkout>>>;
export type CreateWorkoutMutationBody = BodyType<CreateWorkoutInput>;
export type CreateWorkoutMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Create a new workout
 */
export declare const useCreateWorkout: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWorkout>>, TError, {
        data: BodyType<CreateWorkoutInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createWorkout>>, TError, {
    data: BodyType<CreateWorkoutInput>;
}, TContext>;
/**
 * @summary Update a workout
 */
export declare const getUpdateWorkoutUrl: (id: string) => string;
export declare const updateWorkout: (id: string, createWorkoutInput: CreateWorkoutInput, options?: RequestInit) => Promise<Workout>;
export declare const getUpdateWorkoutMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateWorkout>>, TError, {
        id: string;
        data: BodyType<CreateWorkoutInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateWorkout>>, TError, {
    id: string;
    data: BodyType<CreateWorkoutInput>;
}, TContext>;
export type UpdateWorkoutMutationResult = NonNullable<Awaited<ReturnType<typeof updateWorkout>>>;
export type UpdateWorkoutMutationBody = BodyType<CreateWorkoutInput>;
export type UpdateWorkoutMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Update a workout
 */
export declare const useUpdateWorkout: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateWorkout>>, TError, {
        id: string;
        data: BodyType<CreateWorkoutInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateWorkout>>, TError, {
    id: string;
    data: BodyType<CreateWorkoutInput>;
}, TContext>;
/**
 * @summary Delete a workout
 */
export declare const getDeleteWorkoutUrl: (id: string) => string;
export declare const deleteWorkout: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteWorkoutMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteWorkout>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteWorkout>>, TError, {
    id: string;
}, TContext>;
export type DeleteWorkoutMutationResult = NonNullable<Awaited<ReturnType<typeof deleteWorkout>>>;
export type DeleteWorkoutMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Delete a workout
 */
export declare const useDeleteWorkout: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteWorkout>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteWorkout>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary List the current user's weight entries
 */
export declare const getListWeightsUrl: () => string;
export declare const listWeights: (options?: RequestInit) => Promise<WeightEntry[]>;
export declare const getListWeightsQueryKey: () => readonly ["/api/weights"];
export declare const getListWeightsQueryOptions: <TData = Awaited<ReturnType<typeof listWeights>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWeights>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listWeights>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListWeightsQueryResult = NonNullable<Awaited<ReturnType<typeof listWeights>>>;
export type ListWeightsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary List the current user's weight entries
 */
export declare function useListWeights<TData = Awaited<ReturnType<typeof listWeights>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWeights>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Log a new weight measurement
 */
export declare const getCreateWeightUrl: () => string;
export declare const createWeight: (createWeightInput: CreateWeightInput, options?: RequestInit) => Promise<WeightEntry>;
export declare const getCreateWeightMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWeight>>, TError, {
        data: BodyType<CreateWeightInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createWeight>>, TError, {
    data: BodyType<CreateWeightInput>;
}, TContext>;
export type CreateWeightMutationResult = NonNullable<Awaited<ReturnType<typeof createWeight>>>;
export type CreateWeightMutationBody = BodyType<CreateWeightInput>;
export type CreateWeightMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Log a new weight measurement
 */
export declare const useCreateWeight: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWeight>>, TError, {
        data: BodyType<CreateWeightInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createWeight>>, TError, {
    data: BodyType<CreateWeightInput>;
}, TContext>;
/**
 * @summary List meals (optionally filtered by date)
 */
export declare const getListMealsUrl: (params?: ListMealsParams) => string;
export declare const listMeals: (params?: ListMealsParams, options?: RequestInit) => Promise<Meal[]>;
export declare const getListMealsQueryKey: (params?: ListMealsParams) => readonly ["/api/meals", ...ListMealsParams[]];
export declare const getListMealsQueryOptions: <TData = Awaited<ReturnType<typeof listMeals>>, TError = ErrorType<ErrorEnvelope>>(params?: ListMealsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMeals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMeals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMealsQueryResult = NonNullable<Awaited<ReturnType<typeof listMeals>>>;
export type ListMealsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary List meals (optionally filtered by date)
 */
export declare function useListMeals<TData = Awaited<ReturnType<typeof listMeals>>, TError = ErrorType<ErrorEnvelope>>(params?: ListMealsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMeals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Log a new meal
 */
export declare const getCreateMealUrl: () => string;
export declare const createMeal: (createMealInput: CreateMealInput, options?: RequestInit) => Promise<Meal>;
export declare const getCreateMealMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMeal>>, TError, {
        data: BodyType<CreateMealInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMeal>>, TError, {
    data: BodyType<CreateMealInput>;
}, TContext>;
export type CreateMealMutationResult = NonNullable<Awaited<ReturnType<typeof createMeal>>>;
export type CreateMealMutationBody = BodyType<CreateMealInput>;
export type CreateMealMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Log a new meal
 */
export declare const useCreateMeal: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMeal>>, TError, {
        data: BodyType<CreateMealInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMeal>>, TError, {
    data: BodyType<CreateMealInput>;
}, TContext>;
/**
 * @summary Delete a meal
 */
export declare const getDeleteMealUrl: (id: string) => string;
export declare const deleteMeal: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteMealMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMeal>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMeal>>, TError, {
    id: string;
}, TContext>;
export type DeleteMealMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMeal>>>;
export type DeleteMealMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Delete a meal
 */
export declare const useDeleteMeal: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMeal>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMeal>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Get smart workout and nutrition recommendations
 */
export declare const getGetRecommendationsUrl: () => string;
export declare const getRecommendations: (options?: RequestInit) => Promise<Recommendation>;
export declare const getGetRecommendationsQueryKey: () => readonly ["/api/recommendations"];
export declare const getGetRecommendationsQueryOptions: <TData = Awaited<ReturnType<typeof getRecommendations>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecommendations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecommendationsQueryResult = NonNullable<Awaited<ReturnType<typeof getRecommendations>>>;
export type GetRecommendationsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get smart workout and nutrition recommendations
 */
export declare function useGetRecommendations<TData = Awaited<ReturnType<typeof getRecommendations>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get aggregate stats for the dashboard
 */
export declare const getGetDashboardStatsUrl: () => string;
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/progress/dashboard"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get aggregate stats for the dashboard
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get workouts grouped by week for the past 12 weeks
 */
export declare const getGetWeeklyWorkoutsUrl: () => string;
export declare const getWeeklyWorkouts: (options?: RequestInit) => Promise<WeeklyWorkoutPoint[]>;
export declare const getGetWeeklyWorkoutsQueryKey: () => readonly ["/api/progress/weekly"];
export declare const getGetWeeklyWorkoutsQueryOptions: <TData = Awaited<ReturnType<typeof getWeeklyWorkouts>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeeklyWorkouts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWeeklyWorkouts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWeeklyWorkoutsQueryResult = NonNullable<Awaited<ReturnType<typeof getWeeklyWorkouts>>>;
export type GetWeeklyWorkoutsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get workouts grouped by week for the past 12 weeks
 */
export declare function useGetWeeklyWorkouts<TData = Awaited<ReturnType<typeof getWeeklyWorkouts>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeeklyWorkouts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get total minutes per workout type
 */
export declare const getGetWorkoutTypeBreakdownUrl: () => string;
export declare const getWorkoutTypeBreakdown: (options?: RequestInit) => Promise<WorkoutTypeBreakdown[]>;
export declare const getGetWorkoutTypeBreakdownQueryKey: () => readonly ["/api/progress/type-breakdown"];
export declare const getGetWorkoutTypeBreakdownQueryOptions: <TData = Awaited<ReturnType<typeof getWorkoutTypeBreakdown>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWorkoutTypeBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWorkoutTypeBreakdown>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWorkoutTypeBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof getWorkoutTypeBreakdown>>>;
export type GetWorkoutTypeBreakdownQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get total minutes per workout type
 */
export declare function useGetWorkoutTypeBreakdown<TData = Awaited<ReturnType<typeof getWorkoutTypeBreakdown>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWorkoutTypeBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map