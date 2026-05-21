import api from "@/lib/axios";
import type {
  ApiMessageResponse,
  AuthResponse,
  ClaimTripsResponse,
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest,
} from "@/src/types";

const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};

const register = async (
  payload: RegisterRequest
): Promise<ApiMessageResponse> => {
  const { data } = await api.post<ApiMessageResponse>("/auth/register", payload);
  return data;
};

const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const { data } = await api.get<CurrentUserResponse>("/auth/me");
  return data;
};

const claimTrips = async (sessionId: string): Promise<ClaimTripsResponse> => {
  const { data } = await api.post<ClaimTripsResponse>(
    "/auth/claim-trips",
    {},
    {
      headers: {
        "X-Session-Id": sessionId,
      },
    }
  );
  return data;
};

export const authService = {
  login,
  register,
  getCurrentUser,
  claimTrips,
};
