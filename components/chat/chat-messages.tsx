"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";
import { ChatItem } from "./chat-item";
import {format} from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import CryptoJS from "crypto-js";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
const DATE_FORMAT="d MMM yyyy, HH:mm"
interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const decryptMessage = (ciphertext: string, secretKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey=`chat:${chatId}:messages`;
  const updateKey=`chat:${chatId}:messages:update`;
  const chatRef=useRef<ElementRef<"div">>(null);
  const bottomRef=useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
useChatSocket({queryKey, addKey, updateKey});
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading message....
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => {
              const decryptedContent = secretKey
                ? decryptMessage(message.content, secretKey)
                : message.content;

              return (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  content={decryptedContent}
                  member={message.member}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  currentMember={member}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
