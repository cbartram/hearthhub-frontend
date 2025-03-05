import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {isProd, K8S_BASE_URL} from "@/lib/constants.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CreateUserRequest {
  discord_id: string,
  discord_username: string,
  discord_email: string,
  avatar_id: string
}

export function formatBytes(bytes: number): string {
  const KB = 1024
  const MB = 1024 * 1024; // 1 MB = 1024 * 1024 bytes
  const GB = 1024 * MB;   // 1 GB = 1024 MB
  const TB = 1024 * GB;   // 1 TB = 1024 GB

  if(bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes >= 1024 && bytes <= KB) {
    return `${bytes / 1024} KB`
  }

  if(`${(bytes / MB).toFixed(2)} MB` == "0.00 MB") {
    return "0.01 MB"
  }

  if (bytes < GB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  } else if (bytes < TB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  } else {
    return `${(bytes / TB).toFixed(2)} TB`;
  }
}

export const discordRedirect = () => {
  if(isProd()) {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1330916460343857184&response_type=code&redirect_uri=https%3A%2F%2Fhearthhub.duckdns.org%2Fdiscord%2Foauth&scope=identify+email"
  } else {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1330916460343857184&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fdiscord%2Foauth&scope=email+identify"
  }
}

export const formatTimestamp = (timestamp: string): string => {
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hours = timestamp.slice(8, 10);
  const minutes = timestamp.slice(10, 12);

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Creates a new user in Cognito. If the user already exists it will be returned instead.
 * @param req CreateUserRequest the user object to create.
 */
export async function createCognitoUser(req: CreateUserRequest) {
  try {
    const response = await fetch(`${K8S_BASE_URL}/api/v1/cognito/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    });

    const data = await response.json();
    if (response.status !== 200) {
      console.error(`Unexpected response code while creating user: ${response.status}`)
      console.error(data)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception thrown while making http request to create user:', error);
    return null;
  }
}
