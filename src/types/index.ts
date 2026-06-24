export type JavaLong = number;
export type JavaBigDecimal = number;
export type JavaLocalDate = string;
export type JavaLocalDateTime = string;
export type JavaLocalTime = string;

export interface Role {
  id: JavaLong;
  name: string;
}

export interface User {
  id: JavaLong;
  username?: string;
  email: string;
  passwordHash?: string;
  fullName?: string;
  avatarUrl?: string;
  provider?: string;
  isActive?: boolean;
  createdAt?: JavaLocalDateTime;
  updatedAt?: JavaLocalDateTime;
  roles?: Role[];
  trips?: Trip[];
  refreshTokens?: RefreshToken[];
}

export interface RefreshToken {
  id: JavaLong;
  user?: User;
  tokenHash: string;
  expiresAt: JavaLocalDateTime;
  isRevoked?: boolean;
  createdAt?: JavaLocalDateTime;
}

export interface Trip {
  id: JavaLong;
  user?: User;
  title: string;
  destinationName: string;
  destLat?: JavaBigDecimal;
  destLng?: JavaBigDecimal;
  startDate?: JavaLocalDate;
  endDate?: JavaLocalDate;
  numDays: number;
  budgetTotal?: JavaBigDecimal;
  currency?: string;
  notes?: string;
  shareToken?: string;
  isPublic?: boolean;
  createdAt?: JavaLocalDateTime;
  updatedAt?: JavaLocalDateTime;
  sessionId?: string;
  tripDays?: TripDay[];
  budgetEntries?: BudgetEntry[];
  weatherCaches?: WeatherCache[];
}

export interface TripDay {
  id: JavaLong;
  trip?: Trip;
  dayNumber: number;
  tripDate?: JavaLocalDate;
  dayNote?: string;
  activities?: Activity[];
}

export interface Activity {
  id: JavaLong;
  tripDay?: TripDay;
  sortOrder?: number;
  title: string;
  description?: string;
  startTime?: JavaLocalTime;
  endTime?: JavaLocalTime;
  locationName?: string;
  locationLat?: JavaBigDecimal;
  locationLng?: JavaBigDecimal;
  estimatedCost?: JavaBigDecimal;
  category?: string;
  travelDurationMin?: number;
  travelMode?: string;
  createdAt?: JavaLocalDateTime;
}

export interface BudgetEntry {
  id: JavaLong;
  trip?: Trip;
  activity?: Activity;
  label: string;
  amount: JavaBigDecimal;
  category?: string;
  isActual?: boolean;
  entryDate?: JavaLocalDate;
  createdAt?: JavaLocalDateTime;
}

export interface WeatherCache {
  id: JavaLong;
  trip?: Trip;
  forecastDate: JavaLocalDate;
  temperatureMax?: JavaBigDecimal;
  temperatureMin?: JavaBigDecimal;
  weatherCode?: number;
  precipitationMm?: JavaBigDecimal;
  isRainy?: boolean;
  fetchedAt?: JavaLocalDateTime;
}

export interface DestinationCost {
  id: JavaLong;
  destinationName: string;
  countryCode?: string;
  category: string;
  costUsd: JavaBigDecimal;
  costLocal?: JavaBigDecimal;
  localCurrency?: string;
  source?: string;
  contributionCount?: number;
  lastUpdated?: JavaLocalDateTime;
}

export interface BudgetEntryRequest {
  label: string;
  amount: JavaBigDecimal;
  category?: string;
  entryDate?: JavaLocalDate;
}

export interface UserDTO {
  id: JavaLong;
  name: string;
  roles: Role[];
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: JavaLong;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface TripRequest {
  destination: string;
  numDays: number;
  budgetTotal: JavaBigDecimal;
  currency?: string;
  notes?: string;
  startDate?: JavaLocalDate;
  
  lat: number; 
  lng: number;
  placeId: string; 

  originName?: string;
  originLat?: number;
  originLng?: number;
}

export interface DestinationCostDTO {
  destinationName: string;
  category: string;
  costUsd: JavaBigDecimal;
  costLocal?: JavaBigDecimal;
  localCurrency?: string;
  contributionCount?: number;
  source?: string;
}

export interface UserContributionRequest {
  destinationName: string;
  category: string;
  costUsd: JavaBigDecimal;
}

export interface ActivityOrderUpdate {
  id: JavaLong;
  startTime?: string;
}

export interface ReorderRequest {
  activities: ActivityOrderUpdate[];
}

export interface ActivityUpdateRequest {
  title?: string;
  description?: string;
  startTime?: string;
  estimatedCost?: JavaBigDecimal;
  lat?: number;
  lng?: number;
}

export interface DailyWeatherDTO {
  date: string;
  tempMax?: number;
  tempMin?: number;
  precipitation?: number;
  weatherCode?: number;
  condition?: string;
  icon?: string;
  recommendation?: string;
  isRainy?: boolean;
  windSpeed?: number;
}

export interface OpenMeteoDailyData {
  time?: string[];
  temperatureMax?: number[];
  temperatureMin?: number[];
  precipitationSum?: number[];
  weatherCode?: number[];
  windSpeedMax?: number[];
}

export interface OpenMeteoHourlyData {
  time?: string[];
  temperature?: number[];
  humidity?: number[];
  precipitationProbability?: number[];
}

export interface OpenMeteoResponse {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  daily?: OpenMeteoDailyData;
  hourly?: OpenMeteoHourlyData;
}

export interface GeminiRequestPart {
  text: string;
}

export interface GeminiRequestContent {
  parts: GeminiRequestPart[];
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

export interface GeminiRequest {
  contents: GeminiRequestContent[];
  generationConfig?: GeminiGenerationConfig;
}

export interface GeminiResponsePart {
  text?: string;
}

export interface GeminiResponseContent {
  parts?: GeminiResponsePart[];
  role?: string;
}

export interface GeminiCandidate {
  content?: GeminiResponseContent;
  finishReason?: string;
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export interface TravelActivityItem {
  time?: string;
  activity?: string;
  lat?: number;
  lng?: number;
  estimatedCost?: JavaLong;
  reason?: string;
}

export interface TravelDailyWeather {
  temp?: number;
  condition?: string;
  icon?: string;
  humidity?: number;
  rainChance?: number;
}

export interface TravelDayItinerary {
  day?: number;
  date?: string;
  activities?: TravelActivityItem[];
  weather?: TravelDailyWeather;
}

export interface TravelDestinationInfo {
  placeId?: string;
  fullName?: string;
  address?: string;
  lat?: number;
  lng?: number;
  photos?: string[];
}

export interface TravelWeatherSummary {
  avgTemp?: number;
  minTemp?: number;
  maxTemp?: number;
  condition?: string;
  humidity?: number;
  recommendation?: string;
}

export interface TravelItinerary {
  destination?: string;
  totalDays?: number;
  itinerary?: TravelDayItinerary[];
  destinationInfo?: TravelDestinationInfo;
  weatherSummary?: TravelWeatherSummary;
}

export interface UserPrinciple {
  user: User;
  username: string;
  password: string;
  roles: GrantedAuthority[];
}

export interface GrantedAuthority {
  authority: string;
}

export interface JwtResponse {
  id: JavaLong;
  token: string;
  type: string;
  username: string;
  name: string;
  authorities: GrantedAuthority[];
}

export interface ApiMessageResponse {
  message: string;
}

export interface CurrentUserResponse {
  userId: JavaLong;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface ClaimTripsResponse {
  claimed: number;
  message: string;
}

export interface ToggleShareRequest {
  isPublic: boolean;
}

export interface ToggleShareResponse {
  isPublic: boolean;
  shareToken?: string;
  message: string;
}

export interface PlaceSearchResult {
  place_id?: string | number;
  display_name?: string;
  lat?: string;
  lon?: string;
  [key: string]: unknown;
}
