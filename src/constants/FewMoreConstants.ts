import { SingleMessage } from "@/types/Product";
import { ProductName, Products } from "./ProductNames";

export const Generate_6_Random_Numbers = () => {
  const array: number[] = [];
  for (let i = 0; i < 6; i++) {
    const random_number = Math.floor(Math.random() * 20);
    array[array.length] = random_number;
  }
  return array;
};

const RandomProduct = (Products:ProductName[]) => {
  const random_number = Math.floor(Math.random()*333);
  const Product_Name =  Products[random_number].name;
  return Product_Name
};

export const FinalFaq = (randomNumbers: number[], faqs: SingleMessage[]) => {
  const finalFaq = [];
  for (let i = 0; i < randomNumbers.length; i++) {
    finalFaq[finalFaq.length] = faqs[randomNumbers[i]];
  }
  return finalFaq;
};

export const faqs: SingleMessage[] = [
    {
      role: "user",
      content: `What is the price of ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Is ${RandomProduct(Products)} currently in stock?`,
    },
    {
      role: "user",
      content: `Can you tell me more about the ingredients in ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `What is the average rating of ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `How many servings are in ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Is ${RandomProduct(Products)} available in a different size or pack?`,
    },
    {
      role: "user",
      content: `Can you recommend a similar product to ${RandomProduct(Products)} if it’s out of stock?`,
    },
    {
      role: "user",
      content: `Where can I find ${RandomProduct(Products)} in the store?`,
    },
    {
      role: "user",
      content: `How should I store ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Does ${RandomProduct(Products)} need to be kept refrigerated or frozen?`,
    },
    {
      role: "user",
      content: `What is the recommended serving size for ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Does ${RandomProduct(Products)} contain any allergens?`,
    },
    {
      role: "user",
      content: `What are the nutritional details of ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Is ${RandomProduct(Products)} suitable for vegetarians or vegans?`,
    },
    {
      role: "user",
      content: `Which brand manufactures ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Where is ${RandomProduct(Products)} produced?`,
    },
    {
      role: "user",
      content: `Are there any discounts or promotions on ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `Can I buy ${RandomProduct(Products)} as part of a bundle or multi-buy offer?`,
    },
    {
      role: "user",
      content: `Can you suggest recipes or ideas for using ${RandomProduct(Products)}?`,
    },
    {
      role: "user",
      content: `What’s the shelf life of ${RandomProduct(Products)} after opening?`,
    },
];

export const example: SingleMessage[] = [
    {
      role: "user",
      content: "Can I freeze the Tesco Sweet And Sour Chicken?",
    },
    {
      role: "assistant",
      content:
        "Yes, you can freeze the Tesco Sweet And Sour Chicken. It is suitable for home freezing, but it's recommended to freeze it as soon as possible after purchase and always by the 'use by' date shown. Just make sure to follow the preparation guidelines and defrost thoroughly for a minimum of 12 hours in the fridge before consuming.",
      refusal: null,
    },
    {
      role: "user",
      content: "What happens if I don’t use it within 24 hours after defrosting?",
    },
    {
      role: "assistant",
      content:
        "If you don't use the Tesco Sweet And Sour Chicken within 24 hours after defrosting, it is recommended not to refreeze it. Make sure to keep it refrigerated and consume it within the specified timeframe to maintain its quality and freshness.",
      refusal: null,
    },
    {
      role: "user",
      content: "Can I freeze the Tesco Sweet And Sour Chicken?",
    },
    {
      role: "assistant",
      content:
        "Yes, you can freeze the Tesco Sweet And Sour Chicken. It is suitable for home freezing, but it's recommended to freeze it as soon as possible after purchase and always by the 'use by' date shown. Just make sure to follow the preparation guidelines and defrost thoroughly for a minimum of 12 hours in the fridge before consuming.",
      refusal: null,
    },
    {
      role: "user",
      content: "What happens if I don’t use it within 24 hours after defrosting?",
    },
    {
      role: "assistant",
      content:
        "If you don't use the Tesco Sweet And Sour Chicken within 24 hours after defrosting, it is recommended not to refreeze it. Make sure to keep it refrigerated and consume it within the specified timeframe to maintain its quality and freshness.",
      refusal: null,
    },
];