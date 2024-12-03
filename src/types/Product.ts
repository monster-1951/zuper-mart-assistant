import { VectorDoc } from "@datastax/astra-db-ts";

export interface SingleProduct extends VectorDoc {
    name: string;
    url: string;
    price: string;
    currency: string;
    availability: string;
    description: string;
    brand: string;
    breadcrumbs: string;
    images: string;
    avg_rating: string;
    reviews_count: string;
    pack_size: string;
    ingredients: string;
    storage_details: string;
    nutrition: string;
    $vectorize?:string
}

export interface SingleMessage{
    role:"user"|"assistant",
    content:string,
    refusal?:any
}

export interface UserMessage{
    role:"user"|"assistant",
    content:string,
    refusal?:any
}

export interface RequestFormat{
    Conversation_history:SingleMessage[],
    Prompt:UserMessage
}

  