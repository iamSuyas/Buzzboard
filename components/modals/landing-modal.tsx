"use client"

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";

const LandingModal = () => {
    const {onOpen}=useModal();
    return ( 
        <div className="w-full h-full flex flex-col">
            <p className="text-2xl font-semibold font-sans text-indigo-500 pl-8 pt-4 justify-self-start absolute">BuzzBoard</p>
            <div className="my-auto self-center">
                <div className="text-5xl font-sans font-bold">Where <span className="text-indigo-500">Ideas</span> Meet <span className="text-indigo-500">Conversations</span>!</div>
                <p className="mx-auto text-center w-1/2 font-light text-sm mt-3">Click the <span className="text-indigo-500 font-semibold">button</span> below to <span className="text-indigo-500 font-semibold">create</span> a new server or <span className="text-indigo-500 font-semibold">join</span> a server by pasting the<span className="text-indigo-500 font-semibold"> invite link</span> in the <span className="text-indigo-500 font-semibold">URL ba</span>r!</p>
                <div className="text-center my-5"><Button onClick={()=>onOpen('createServer')} variant="primary">Get Started &gt;&gt;&gt;</Button></div>
            </div>
        </div>
     );
}
 
export default LandingModal;