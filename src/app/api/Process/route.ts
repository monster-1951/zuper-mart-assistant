import { Rag_query } from "@/helpers/Helping-Hands";
import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { SingleMessage } from "@/types/Product";
const {
  ASTRA_DB__COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
  ASTRA_DB_NAMESPACE,
} = process.env;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT || "", {
  keyspace: ASTRA_DB_NAMESPACE,
});
export async function POST(request: Request) {
  const { Conversation_history, LatestUserQuery } = await request.json();
  console.log(Conversation_history);
  console.log(LatestUserQuery);
  const Responsee = await Rag_query(
    LatestUserQuery,
    db,
    openai,
    ASTRA_DB__COLLECTION || "",
    Conversation_history
  );
  return Response.json({content:Responsee,role:"assistant",refusal:null})
  // return Response.json(LatestUserQuery);
}
