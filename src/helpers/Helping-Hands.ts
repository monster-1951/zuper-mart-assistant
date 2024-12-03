import { Collection, Db } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { main_prompt, system_prompt } from "@/constants/WeNeverChange";
import { SingleMessage, SingleProduct } from "@/types/Product";

const createEmbedding = async (input: string, openai: OpenAI) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
    encoding_format: "float",
  });
  return embedding;
};

const performSemanticSearch = async (
  db: Collection<SingleProduct>,
  embedding: OpenAI.Embeddings.CreateEmbeddingResponse & {
    _request_id?: string | null;
  }
) => {
  const responseDocs = db.find(
    {},
    {
      sort: { $vector: embedding.data[0].embedding },
      limit: 10,
      includeSimilarity: true,
      projection: { $vectorize: 1 },
    }
  );
  const documents = await responseDocs.toArray();
  return documents;
};

const formContext = (documents: SingleProduct[]) => {
  const docsMap = documents?.map((doc) => {
    return {
      Name_of_the_product: doc.name,
      Price_of_the_product: doc.price,
      Currency: doc.currency,
      Availability_of_the_product: doc.availability,
      Description_of_the_product: doc.$vectorize,
      Hierarchical_categorization_of_the_product: doc.breadcrumbs,
      Brand_of_the_product: doc.brand,
      Package_size_or_weight: doc.pack_size,
      List_of_ingredients_in_this_product: doc.ingredients,
      Avg_customer_rating: doc.avg_rating,
      Number_of_customer_reviews: doc.reviews_count,
      Storage_instruction: doc.storage_details,
      Nutritional_information_in_keyValue_format: doc.nutrition,
    };
  });
  return JSON.stringify(docsMap);
};

const get_prompt = (
  context: string,
  conversation_history: SingleMessage[],
  query: string
) => {
  const prompt = `${main_prompt}

    Context from documents:
    ${context}

    Previous conversation:
    ${conversation_history}

    Human: ${query}

    Assistant:`;

  return prompt;
};

const generateResponse = async (
  openai: OpenAI,
  query: string,
  context: string,
  conversation_history: SingleMessage[]
) => {
  const prompt = get_prompt(context, conversation_history, query);
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: system_prompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    fullResponse += content;
  }
  return fullResponse;
};


let count = 0;

let docContext: string[] = [];

export const Rag_query = async (
  LatestUserQuery: string,
  db: Db,
  openai: OpenAI,
  ASTRA_DB_COLLECTION: string,
  conversation_history: SingleMessage[]
): Promise<string> => {
  // let docContext: string[] = [];
  console.log(LatestUserQuery);

  const embedding = await createEmbedding(LatestUserQuery, openai);

  try {
    const ZuperGPT = db.collection<SingleProduct>(ASTRA_DB_COLLECTION || "");

    const documents = await performSemanticSearch(ZuperGPT, embedding);

    if (count > 2) {
      docContext.length = 0;
      count = 0;
    }
    console.log(count,"Before pushing")
    docContext.push(formContext(documents));
    count++;
    console.log(count,"after pushing")
    // console.log(docContext);
    // const contextualized_prompt = await contextualize_query(openai,LatestUserQuery,conversation_history)
    const response = await generateResponse(
      openai,
      LatestUserQuery,
      docContext[0],
      conversation_history
    );
    return response
  } catch (error) {
    console.log("Error querying db...", error);
    docContext = [];
    return "The model failed"
  }
};

