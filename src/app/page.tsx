"use client";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { SiGoogleassistant } from "react-icons/si";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { RequestFormat, SingleMessage } from "@/types/Product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HeroImage from "@/images/2.webp";
import { faqs, FinalFaq, Generate_6_Random_Numbers } from "@/constants/FewMoreConstants";

// VIP will be sent to backend from the frontend. It's structure is special and needs to be handled with care.
const VIP: RequestFormat = {
  Conversation_history: [],
  Prompt: { role: "user", content: "" },
};

const randomNumbers = Generate_6_Random_Numbers();

const FinalFaqs = FinalFaq(randomNumbers, faqs);

const LoadingText = "Please Wait";

export default function Home() {


  const [Chat, setChat] = useState<SingleMessage[]>([]);
  const [Loading, setLoading] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const SendMessageToUI = (UserMessage: string) => {
    setChat((prevMessages: SingleMessage[]): SingleMessage[] => [
      ...prevMessages,
      { role: "user", content: UserMessage },
      { role: "assistant", content: LoadingText },
    ]);
  };

  const GetResponse = async (History: SingleMessage[], LatestQuery: string) => {
    // Creating a new VIP
    const NewViP: RequestFormat = {
      Conversation_history: [
        ...History,
        { role: "user", content: LatestQuery },
      ],
      Prompt: { role: "user", content: "" },
    };
    console.log("NewVIP befor sending", NewViP);
    await axios
      .post("/api/Process", {
        Conversation_history: History,
        LatestUserQuery: LatestQuery,
      })
      .then(async (res) => {
        setLoading(true);
        NewViP.Conversation_history = [
          ...NewViP.Conversation_history,
          res.data,
        ];
        console.log("NewVIP after sending", NewViP);
        VIP.Conversation_history = NewViP.Conversation_history;
        VIP.Prompt = NewViP.Prompt;
        console.log("VIP after sending request", VIP);
        setChat(NewViP.Conversation_history);
      })
      .catch(() => {
        return { data: { success: false } };
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleClick = async () => {
    setLoading(true);
    const UserInput = inputRef.current?.value;
    VIP.Prompt.content = UserInput || "";
    if (UserInput) SendMessageToUI(UserInput);
    setInputValue("");
    await GetResponse(VIP.Conversation_history, VIP.Prompt.content);
    console.log("clicked");
  };

  const FaqClick = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    setLoading(true);
    const Faq = event.currentTarget.innerText;
    VIP.Prompt.content = Faq || "";
    console.log(Faq);
    SendMessageToUI(Faq);
    await GetResponse(VIP.Conversation_history, VIP.Prompt.content);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [Chat]);

  // **************************************************

  return (
    <div className=" sm:w-[60%] md:w-[50%] xl:w-[40%] mx-auto shadow-2xl rounded-xl min-h-screen">
      <h2 className="font-bold text-center p-2 sticky top-0 z-10 text-2xl xl:3xl main-head rounded-t-xl">
        🛍️ Zuper Mart Assistant 🛒
      </h2>
      <div
        id="messages "
        className="xl:h-screen md:h-screen lg:h-screen sm:h-screen h-screen overflow-y-auto inbox space-y-2 "
        ref={chatBoxRef}
      >
        <div className="space-y-2 flex flex-col ">
          <Image
            alt="Image"
            src={HeroImage}
            height={1000}
            width={1000}
            priority={false}
            className="mx-auto rounded-xl w-[80%]"
          />
          <div className="text-center text-xl ">Ask me anything....</div>
          <div className="grid grid-flow-row grid-cols-2 space-y-2">
            {FinalFaqs.map((query: SingleMessage, index) => {
              return (
                <Button
                  className="border text-left p-3 w-[90%] mx-auto rounded-xl font-semibold h-fit text-wrap bg-transparent hover:bg-transparent"
                  onClick={FaqClick}
                  key={index}
                >
                  {query?.content}
                </Button>
              );
            })}
          </div>
        </div>
        {Chat.map((message, index) => {
          if (message.role == "user")
            return (
              <div key={index} className="w-full p-2 flex justify-end">
                <div className="shadow-xl max-w-[80%] w-fit text-wrap text-right rounded-xl  p-2 flex user-message justify-between user">
                  <p className="w-full text-left"> {message.content}</p>
                  <FaUser className=" rounded-xl ml-2 mt-1  " />
                </div>
              </div>
            );
          else if (message.role == "assistant")
            return (
              <div key={index} className="w-full p-2 flex h-fit">
                <div className="max-w-[80%] w-fit  rounded-xl  p-5 flex text-wrap overflow-x-auto assistant-message shadow-xl assistant">
                  <SiGoogleassistant className=" rounded-xl min-w-fit mr-2 mt-1 " />
                  <ReactMarkdown
                    className={"flex-col"}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            );
        })}
      </div>
      <div className="flex rounded-xl sticky bottom-0 z-10 ">
        <Input
          className="message-input placeholder:italic border-none rounded-r-none rounded-t-"
          ref={inputRef}
          onChange={handleChange}
          value={InputValue}
          placeholder="Ask anything...."
        />
        <Button
          onClick={handleClick}
          className="z-20 bg-inherit submit-button rounded-l-none rounded-t-none"
          disabled={Loading}
        >
          <FaArrowUpLong />
        </Button>
      </div>
    </div>
  );
}
