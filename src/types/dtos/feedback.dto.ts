export interface FeedbackUserResponseDto {
  id: string;
  name: string;
  email: string;
}

export interface FeedbackImageDto {
  id: number;
  url: string;
}

export interface FeedbackResponseDto {
  id: string;
  description: string;
  createdAt: string;
  user: FeedbackUserResponseDto | null;
  images: FeedbackImageDto[];
  seen: boolean;
}
