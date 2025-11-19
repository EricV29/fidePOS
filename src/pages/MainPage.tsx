import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    function handleResize() {
      const large = window.innerWidth >= 1024;

      setIsLargeScreen(large);

      if (!large) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isLargeScreen) return;
    setIsOpen((prev) => !prev);
  };

  /*
  const [msgReply, setMsgReply] = useState("");
  const [msgReplyPrivate, setMsgReplyPrivate] = useState("");

  useEffect(() => {
    // GLOBAL LISTENER REPLY
    window.electronAPI.onMessageReply((data) => {
      setMsgReply(data);
    });

    // GLOBAL LISTENER PRIVATE
    window.electronAPI.onMessageReplyPrivate((data) => {
      setMsgReplyPrivate(data);
    });
  }, []);

  const sendMessage = () => {
    window.electronAPI.sendMessage("Hello from Main!");
  };

  const sendMessagePrivate = () => {
    window.electronAPI.sendMessagePrivate("Hello from Main Private!");
  };
*/

  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px]">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <main className="h-full min-h-0 w-full min-w-0 p-[20px] rounded-[30px] bg-[#ffffff] border border-[gba(179, 179, 179, 40)] flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
}
