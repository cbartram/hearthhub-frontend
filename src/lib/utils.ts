import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {BASE_URL} from "@/constants.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CreateUserRequest {
  discord_id: string,
  discord_username: string,
  discord_email: string,
  avatar_id: string
}

export async function createServer() {

}


/**
 * Creates a new user in Cognito. If the user already exists it will be returned instead.
 * @param req CreateUserRequest the user object to create.
 */
export async function createCognitoUser(req: CreateUserRequest) {
  try {
    const response = await fetch(`${BASE_URL}/prod/api/v1/cognito/create-user`, {
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
